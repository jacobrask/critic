"use strict";

var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");


/**
 * Manages data for branches in the client.
 *
 * @mixes {Listenable}
 */
var BranchStore = exports;

Object.assign(BranchStore, Listenable);


/**
 * Branches currently in store, updated any time a new branch is received by
 * any request. Stored in a sparse array, referenced by their numeric ids.
 */
var branches = [];


/**
 * Get a single branch identified by its unique numeric id.
 *
 * @param {number} branchId
 *
 * @return {Object?}
 */
BranchStore.getById = function(branchId) {
  if (!Number.isInteger(branchId) || branchId <= 0) {
    throw new TypeError("Invalid branch id");
  }
  return branches[branchId];
};


/**
 * Get a single branch identified by its name and repository id.
 *
 * @param {string} branchName
 * @param {number} repoId
 *
 * @return {Object?}
 */
BranchStore.getByName = function(branchName, repoId) {
  if (typeof branchName !== "string") {
    throw new TypeError("Invalid branch name");
  }
  if (!Number.isInteger(repoId) || repoId <= 0) {
    throw new TypeError("Invalid repository id");
  }
  return branches.find(function(branch) {
    return branch != null && branch.repository === repoId &&
        branch.name === branchName;
  });
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_BRANCHES":
      payload.branches.forEach(function(branch) {
        branches[branch.id] = branch;
      });
      BranchStore.didChange();
      break;

    default:
      break;

  }

});
