"use strict";

var BranchActions = require("./BranchActions");
var constants = require("../constants");
var Dispatcher = require("../Dispatcher");
var ServerAPI = require("../services/ServerAPI");

var BranchCommitsActions = exports;


var getBranchCommits = function(branchId) {
  return ServerAPI.get("branches/" + branchId + "/commits")
    .then(function(resp) {
      Dispatcher.dispatch("RECEIVE_COMMITS", {
        commits: resp.commits
      });
      Dispatcher.dispatch("RECEIVE_BRANCHCOMMITS", {
        branch: branchId,
        commits: resp.commits.map(function(commit) { return commit.id; })
      });
      return resp;
    }).catch(function(err) {
      Dispatcher.dispatch("RECEIVE_BRANCHCOMMITS_ERROR", { error: err });
      throw err;
    });
};


/**
 * Fetch all commits associated with a branch, identified by its numeric id.
 *
 * @param {number} branchId
 *
 * @return {Promise}
 */
BranchCommitsActions.fetchById = function(branchId) {
  if (!Number.isInteger(branchId) || branchId <= 0) {
    throw new TypeError("Invalid branch id");
  }
  return getBranchCommits(branchId);
};


/**
 * Fetch all commits associated with a branch, identified by its name and
 * repository id or short-name. First triggers a request to get the branch id
 * from its name, and then uses the response to fetch the commits.
 *
 * @param {string} branchName
 * @param {number|string} repo
 *
 * @return {Promise}
 */
BranchCommitsActions.fetchByName = function(branchName, repo) {
  if (typeof branchName !== "string") {
    throw new TypeError("Invalid branch name " + branchName);
  }
  if (typeof repo !== "string" && !(Number.isInteger(repo) && repo > 0)) {
    throw new TypeError("Invalid repository id or short-name");
  }
  return BranchActions.fetchByName(
      branchName, repo, [ constants.BranchIncludes.REPOSITORIES ]
    ).then(function(branch) {
      if (!Number.isInteger(branch.id)) {
        throw new Error("Missing id property in response");
      }
      return getBranchCommits(branch.id);
    });
};
