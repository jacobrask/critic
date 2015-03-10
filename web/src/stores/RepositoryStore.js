"use strict";

var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");


/**
 * Manages data for repositories in the client.
 *
 * @mixes {Listenable}
 */
var RepositoryStore = exports;

Object.assign(RepositoryStore, Listenable);


/**
 * Repositories currently in store.
 * Stored in a sparse array referenced by the repository unique numeric id.
 */
var repositories = [];


/**
 * Get a single repository identified by its unique numeric id.
 *
 * @param {number} repoId
 *
 * @return {Object?}
 */
RepositoryStore.getById = function(repoId) {
  if (!Number.isInteger(repoId) || repoId <= 0) {
    throw new TypeError("Invalid repository id");
  }
  return repositories[repoId];
};


/**
 * Get a single repository identified by its short-name.
 *
 * @param {string} repoName
 *
 * @return {Object?}
 */
RepositoryStore.getByName = function(repoName) {
  if (typeof repoName !== "string") {
    throw new TypeError("Invalid repository name");
  }
  return repositories.find(function(repository) {
    return repository != null && repository.name === repoName;
  });
};


Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_REPOSITORIES":
      payload.repositories.forEach(function(repository) {
        repositories[repository.id] = repository;
      });
      RepositoryStore.didChange();
      break;

    default:
      break;

  }

});
