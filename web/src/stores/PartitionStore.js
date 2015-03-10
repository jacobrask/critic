"use strict";

var CommitStore = require("./CommitStore");
var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");
var ReviewStore = require("./ReviewStore");
var UserStore = require("./UserStore");


/**
 * Manages review partitions and rebase commits.
 *
 * The history of a branch (such as a review branch) that has potentially
 * been rebased one or more times during its existence, is represented as a
 * linked list of "partitions" where each partition represents a connected
 * set of commits.
 *
 * @mixes {Listenable}
 */
var PartitionStore = exports;

Object.assign(PartitionStore, Listenable);


/**
 * Rebases currently in store, updated any time a new rebase is received by
 * any request. Stored in a sparse array, referenced by their numeric ids.
 */
var rebases = [];


// Helper function to get full rebase data.
var getRebase = function(id) {
  var source = rebases[id];
  if (source == null) return null;

  var upstream;
  if (source.type === "move") {
    upstream = CommitStore.getById(source.new_upstream);
    if (upstream == null) return null;
  }

  var creator = UserStore.getById(source.creator);
  if (creator == null) return null;

  return {
    creator: creator,
    id: source.id,
    type: source.type,
    upstream: upstream,
  };
};


/**
 * Get all partitions in a review, including expanded data for rebases
 * and commits.
 *
 * @param {number} reviewId
 *
 * @return {Array?} - null if any review, commit or user data is missing.
 */
PartitionStore.get = function(reviewId) {
  var review = ReviewStore.getById(reviewId);
  if (review == null) return null;

  var partitions = [];
  for (var i = 0, commits, partition, rebase;
      i < review.partitions.length;
      i++) {
    partition = review.partitions[i];
    commits = CommitStore.getByIds(partition.commits);
    if (commits == null) return null;
    if (partition.rebase) {
      rebase = partition.rebase && getRebase(partition.rebase);
      if (rebase == null) return null;
    } else {
      rebase = null;
    }
    partitions.push({
      commits: commits,
      rebase: rebase
    });
  }
  return partitions;
};


/**
 * @param {number} reviewId
 *
 * @return {number?}
 */
PartitionStore.getCommitCount = function(reviewId) {
  var review = ReviewStore.getById(reviewId);
  if (review == null) return null;

  return review.partitions.reduce(function(len, partition) {
    return len + partition.commits.length;
  }, 0);
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_REBASES":
      payload.rebases.forEach(function(rebase) {
        rebases[rebase.id] = rebase;
      });
      PartitionStore.didChange();
      break;

    case "RECEIVE_COMMITS":
    case "RECEIVE_USERS":
    case "RECEIVE_REVIEWS":
      PartitionStore.didChange();
      break;

  }

});
