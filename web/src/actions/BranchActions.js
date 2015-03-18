"use strict";

var Dispatcher = require("../Dispatcher");
var ServerAPI = require("../services/ServerAPI");

var BranchActions = exports;


var getBranches = function(opts) {
  return ServerAPI.get("branches", opts)
    .then(function(resp) {
      // Intercept `linked` resources as specified by `opts.include`
      Object.keys(resp.linked).forEach(function(type) {
        var payload = {};
        payload[type] = resp.linked[type];
        if (payload[type].length === 0) return;
        Dispatcher.dispatch("RECEIVE_" + type.toUpperCase(), payload);
      });
      Dispatcher.dispatch("RECEIVE_BRANCHES", {
        branches: resp.branches || [ resp ]
      });
      return resp;
    })
    .catch(function(err) {
      Dispatcher.dispatch("RECEIVE_BRANCHES_ERROR", { error: err });
      throw err;
    });
};


/**
 * Request to fetch a single branch from the server, identified by its numeric
 * id.
 *
 * @param {number} branchId
 * @param {Array} [include] - Extra resources to include with the response.
 *
 * @return {Promise}
 */
BranchActions.fetchById = function(branchId, include) {
  if (!Number.isInteger(branchId) || branchId <= 0) {
    throw new TypeError("Invalid branch id");
  }
  return getBranches({
    ids: [ branchId ],
    include: include
  });
};


/**
 * Fetch a single branch identified by its name and repository numeric id or
 * short-name.
 *
 * @param {number} branchName
 * @param {number|string} repo
 * @param {Array} [include] - Extra resources to include with the response.
 *
 * @return {Promise}
 */
BranchActions.fetchByName = function(branchName, repo, include) {
  if (typeof branchName !== "string") {
    throw new TypeError("Invalid branch name");
  }
  if (typeof repo !== "string" && !(Number.isInteger(repo) && repo > 0)) {
    throw new TypeError("Invalid repository id or short-name");
  }
  return getBranches({
    name: branchName,
    repository: repo,
    include: include
  });
};
