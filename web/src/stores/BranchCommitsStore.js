"use strict";

var BranchStore = require("./BranchStore");
var CommitStore = require("./CommitStore");
var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");


/**
 * Manages commits associated with a particular branch.
 *
 * When a branch is first pushed to a repository, all commits reachable only
 * from the branch are are associated with it. After that, as the branch is
 * updated, all new commits are also associated with the branch.
 *
 * If the branch is a review branch that has been rebased, these commits will
 * match the actual state of the git branch, and not the commits that are
 * listed as part of the review.
 *
 * @mixes {Listenable}
 */
var BranchCommitsStore = exports;

Object.assign(BranchCommitsStore, Listenable);


/**
 * Branches currently in store.
 *
 * Internally a branch is just an array of commit ids, and the actual commits
 * are retreived from the CommitStore.
 */
var branches = [];


/**
 * Get commits for a branch identified by its numeric id.
 *
 * @param {number} branchId
 *
 * @return {Object?}
 */
BranchCommitsStore.getById = function(branchId) {
  if (!Number.isInteger(branchId) || branchId <= 0) {
    throw new TypeError("Invalid branch id");
  }
  var commits = branches[branchId];
  if (commits == null) return;
  return CommitStore.getByIds(commits);
};


/**
 * Get commits for a branch identified by its name and repository id.
 *
 * @param {string} branchName
 * @param {number} repoId
 *
 * @return {Object?}
 */
BranchCommitsStore.getByName = function(branchName, repoId) {
  var branch = BranchStore.getByName(branchName, repoId);
  var commits = branches[branch.id];
  if (commits == null) return;
  return CommitStore.getByIds(commits);
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_BRANCHCOMMITS":
      branches[payload.branch] = payload.commits;
      BranchCommitsStore.didChange();
      break;

    case "RECEIVE_COMMITS":
      BranchCommitsStore.didChange();
      break;

    default:
      break;

  }

});
