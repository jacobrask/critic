"use strict";

var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");


/**
 * Manages data for commits in the client.
 *
 * @mixes {Listenable}
 */
var CommitStore = exports;

Object.assign(CommitStore, Listenable);


/**
 * Commits currently in store, updated any time a new commit is received by
 * any request. Stored in a sparse array, referenced by their numeric ids.
 */
var commits = [];


/**
 * Get a single commit identified by its numeric id.
 *
 * @param {number} commitId
 *
 * @return {Object}
 */
CommitStore.getById = function(commitId) {
  if (!Number.isInteger(commitId) || commitId <= 0) {
    throw new TypeError("Invalid commit id");
  }
  return commits[commitId];
};


/**
 * Get multiple commits by an array of numeric ids. Returns null if
 * *any* of the given commit ids are missing from the store.
 *
 * @param {Array} commitIds
 *
 * @return {Array?}
 */
CommitStore.getByIds = function(commitIds) {
  if (!Array.isArray(commitIds)) {
    throw new TypeError("Invalid commit ids");
  }
  var matches = [];
  for (var i = 0, match; i < commitIds.length; i++) {
    match = CommitStore.getById(commitIds[i]);
    if (match == null) return null;
    matches.push(match);
  }
  return matches;
};


/**
 * Get a single commit identified by its SHA-1 hash. The hash should be at
 * least 8 characters long.
 *
 * @param {string} sha1
 *
 * @return {Object?}
 */
CommitStore.getBySHA1 = function(sha1) {
  if (typeof sha1 !== "string" || sha1.length < 8) {
    throw new TypeError("Invalid commit SHA-1");
  }
  return commits.find(function(commit) {
    return commit != null && commit.sha1.slice(0, sha1.length) === sha1;
  });
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_COMMITS":
      payload.commits.forEach(function(commit) {
        commits[commit.id] = commit;
      });
      CommitStore.didChange();
      break;

    default:
      break;

  }

});
