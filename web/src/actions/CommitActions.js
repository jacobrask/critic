"use strict";

var Dispatcher = require("../Dispatcher");
var ServerAPI = require("../services/ServerAPI");

var CommitActions = exports;


var getCommits = function(opts) {
  return ServerAPI.get("commits", opts)
    .then(function(resp) {
      Dispatcher.dispatch("RECEIVE_COMMITS", {
        commits: resp.commits || [ resp ]
      });
      return resp;
    })
    .catch(function(err) {
      Dispatcher.dispatch("RECEIVE_COMMITS_ERROR", { error: err });
      throw err;
    });
};


/**
 * Fetch a commit identified by its numeric id and repository numeric id
 * or short-name.
 *
 * @param {number} commitId
 * @param {number|string} repo
 *
 * @return {Promise}
 */
CommitActions.fetchById = function(commitId, repo) {
  if (!Number.isInteger(commitId) || commitId <= 0) {
    throw new TypeError("Invalid commit id");
  }
  if (typeof repo !== "string" && !(Number.isInteger(repo) && repo > 0)) {
    throw new TypeError("Invalid repository name/id");
  }
  return getCommits({ ids: [ commitId ], repository: repo });
};


/**
 * Fetch a commit identified by its SHA-1 hash and repository numeric id
 * or short-name.
 *
 * @param {string} sha1
 * @param {number|string} repo
 *
 * @return {Promise}
 */
CommitActions.fetchBySHA1 = function(sha1, repo) {
  if (typeof sha1 !== "string") {
    throw new TypeError("Invalid commit SHA-1");
  }
  if (typeof repo !== "string" && !(Number.isInteger(repo) && repo > 0)) {
    throw new TypeError("Invalid repository name/id");
  }
  return getCommits({ sha1: sha1, repository: repo });
};
