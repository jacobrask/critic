"use strict";

var Dispatcher = require("../Dispatcher");
var Listenable = require("./mixins/Listenable");
var NetworkError = require("../errors/NetworkError");


/**
 * Handles global errors relating to the entire page/site, such as a broken
 * network connection.
 *
 * This is in contrast to minor problems such as a missing item, which are
 * handled in respective stores and locally in the components.
 *
 * @mixes {Listenable}
 */
var ErrorStore = exports;

Object.assign(ErrorStore, Listenable);


/**
 * Counter for assigning unique numeric ids to errors added to the store.
 */
var errorCounter = 0;


/**
 * Errors currently in store, stored in a sparse array, referenced by their
 * numeric ids.
 */
var errors = [];


/**
 * Get all errors currently in store.
 *
 * @return {Array}
 */
ErrorStore.getAll = function() {
  return errors.filter(Boolean);
};


// Register callback with the dispatcher, invoked for every dispatch.
Dispatcher.register(function(type, payload) {

  if (payload.error != null && payload.error instanceof NetworkError) {
    errors[errorCounter++] = payload.error;
    ErrorStore.didChange();
  }

});
