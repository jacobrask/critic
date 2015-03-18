"use strict";

/*
 * The dispatcher is the central hub that manages all data flow. Stores
 * register a callback and when the dispatcher responds to an action all
 * callbacks are sent the data payload provided by the action.
 */
var Dispatcher = exports;


/**
 * All registered callbacks.
 */
var callbacks = [];


/**
 * Register a callback to be invoked every time an action is received.
 *
 * @param {function} callback
 *
 * @returns {Dispatcher}
 */
Dispatcher.register = function(callback) {
  callbacks.push(callback);
  return Dispatcher;
};


/**
 * Dispatch a payload to all registered callbacks.
 *
 * @param {string} action
 * @param {Object} payload
 *
 * @returns {Dispatcher}
 */
Dispatcher.dispatch = function(action, payload) {
  if (Config.DEBUG) {
    if (payload.error instanceof Error) {
      console.warn("%s: %O%s", action, payload.error, payload.error.stack);
    } else {
      console.debug("%s: %O", action, payload);
    }
  }
  callbacks.forEach(function(cb) {
    cb(action, payload);
  });
  return Dispatcher;
};
