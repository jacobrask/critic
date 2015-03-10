"use strict";

var constants = require("../constants");
var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");

var ReviewStates = constants.ReviewStates;


/**
 * Manages data for reviews in the client.
 *
 * @mixes {Listenable}
 */
var ReviewStore = exports;

Object.assign(ReviewStore, Listenable);


/**
 * Reviews currently in store, updated any time a new review is received by
 * any request. Stored in a sparse array, referenced by their numeric ids.
 */
var reviews = [];


/**
 * Get a single review by its numeric id.
 *
 * @param {number} reviewId
 *
 * @return {Object}
 */
ReviewStore.getById = function(reviewId) {
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new TypeError("Invalid review id");
  }
  return reviews[reviewId];
};


/**
 * Get all reviews currently in store. The `reviews` array has holes, but we
 * use filter which skips the holes.
 *
 * @return {Array}
 */
ReviewStore.getAll = function() {
  return reviews.filter(Boolean);
};


/**
 * Get all reviews with the given state.
 *
 * @param {string} state
 *
 * @return {Array}
 */
ReviewStore.getAllByState = function(state) {
  if (!ReviewStates.has(state)) {
    throw new Error("Invalid review state");
  }
  return ReviewStore.getAll().filter(function(review) {
    return review.state === state;
  });
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_REVIEWS":
      payload.reviews.forEach(function(review) {
        reviews[review.id] = review;
      });
      ReviewStore.didChange();
      break;

    default:
      break;

  }

});
