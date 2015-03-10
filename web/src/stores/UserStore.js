"use strict";

var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");


/**
 * Manages data for users in the client.
 *
 * @mixes {Listenable}
 */
var UserStore = exports;

Object.assign(UserStore, Listenable);


/**
 * Users currently in store, updated any time a new users is received by
 * any request. Stored in a sparse array, referenced by their numeric ids.
 */
var users = [];


/**
 * Get a single user identified by its unique numeric id.
 *
 * @param {number} userId
 *
 * @return {Object?}
 */
UserStore.getById = function(userId) {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new TypeError("InvaluserId user userId");
  }
  return users[userId];
};


/**
 * Get all users currently in store. The `users` array has holes, but we
 * use filter which skips the holes.
 *
 * @return {Array}
 */
UserStore.getAll = function() {
  return users.filter(Boolean);
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  switch (type) {

    case "RECEIVE_USERS":
      payload.users.forEach(function(user) {
        users[user.id] = user;
      });
      UserStore.didChange();
      break;

    default:
      break;

  }

});
