"use strict";

var constants = require("../constants");
var Dispatcher = require("../Dispatcher");
var ServerAPI = require("../services/ServerAPI");

var ReviewStates = constants.ReviewStates;

var ReviewActions = exports;


var getReviews = function(opts) {
  return ServerAPI.get("reviews", opts)
    .then(function(resp) {
      // Intercept `linked` resources as specified by `opts.include`
      Object.keys(resp.linked).forEach(function(type) {
        var payload = {};
        payload[type] = resp.linked[type];
        if (payload[type].length === 0) return;
        Dispatcher.dispatch("RECEIVE_" + type.toUpperCase(), payload);
      });
      Dispatcher.dispatch("RECEIVE_REVIEWS", {
        reviews: resp.reviews || [ resp ]
      });
      return resp;
    })
    .catch(function(err) {
      Dispatcher.dispatch("RECEIVE_REVIEWS_ERROR", { error: err });
      throw err;
    });
};


/**
 * Fetch a single review by its numeric id.
 *
 * @param {number} reviewId
 * @param {Array} [include] - Extra resources to include with the response.
 *
 * @return {Promise}
 */
ReviewActions.fetchById = function(reviewId, include) {
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new TypeError("Invalid review id");
  }
  return getReviews({
    ids: [ reviewId ],
    include: include
  });
};


/**
 * Request to fetch all reviews matching an optional filter.
 *
 * @param {Object} [filter]
 * @param {number|string} [filter.repository]
 * @param {string} [filter.state]
 * @param {Array} [include] - Extra resources to include.
 *
 * @return {Promise}
 */
ReviewActions.fetchAll = function(filter, include) {
  if (filter != null) {
    if (filter.repository != null &&
        !(Number.isInteger(filter.repository) && filter.repository > 0)) {
      throw new TypeError("Invalid repository id");
    }
    if (filter.state != null) {
      if (!Array.isArray(filter.state) ||
          !filter.state.every(ReviewStates.has, ReviewStates)) {
        throw new TypeError("Invalid review state");
      }
    }
  }
  return getReviews({
    include: include,
    repository: filter && filter.repository,
    state: filter && filter.state
  });
};
