"use strict";

var Dispatcher = require("../Dispatcher");
var ServerAPI = require("../services/ServerAPI");

var RepositoryActions = exports;


var getRepositories = function(opts) {
  return ServerAPI.get("repositories", opts)
    .then(function(resp) {
      Dispatcher.dispatch("RECEIVE_REPOSITORIES", {
        repositories: resp.repositories || [ resp ]
      });
      return resp;
    })
    .catch(function(err) {
      Dispatcher.dispatch("RECEIVE_REPOSITORIES_ERROR", err);
      throw err;
    });
};


/**
 * Fetch a single repository identified by its numeric id.
 *
 * @param {number} repoId
 *
 * @return {Promise}
 */
RepositoryActions.fetchById = function(repoId) {
  if (!Number.isInteger(repoId) || repoId <= 0) {
    throw new TypeError("Invalid repository id");
  }
  return getRepositories({ repository: repoId });
};


/**
 * Fetch a single repository identified by its short-name.
 *
 * @param {string} repoName
 *
 * @return {Promise}
 */
RepositoryActions.fetchByName = function(repoName) {
  if (typeof repoName !== "string") {
    throw new TypeError("Invalid repository name");
  }
  return getRepositories({ name: repoName });
};
