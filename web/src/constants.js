"use strict";

var constants = exports;


constants.LoadState = {
  ERROR: -1,
  INITIAL: 0,
  LOADING: 1,
  COMPLETE: 2
};


/**
 * Available linked resources for requests to the /branches/ API endpoint.
 */
constants.BranchIncludes = {
  ALL: "commits,repositories",
  COMMITS: "commits",
  REPOSITORIES: "repositories"
};


/**
 * Available linked resources for requests to the /rebases/ API endpoint.
 */
constants.RebaseIncludes = {
  ALL: "commits,users",
  COMMITS: "commits",
  USERS: "users"
};


/**
 * Available linked resources for requests to the /reviews/ API endpoint.
 */
constants.ReviewIncludes = {
  ALL: "branches,commits,rebases,repositories,users",
  BRANCHES: "branches",
  COMMITS: "commits",
  REBASES: "rebases",
  REPOSITORIES: "repositories",
  USERS: "users"
};


/**
 * Available review states matching the states in the database and web API.
 */
constants.ReviewStates = new Set([ "closed", "dropped", "open" ]);
