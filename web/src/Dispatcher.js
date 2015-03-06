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
 */
Dispatcher.register = function(callback) {
  callbacks.push(callback);
};


/**
 * Dispatch a payload to all registered callbacks.
 *
 * @param {string} action
 * @param {Object} payload
 */
Dispatcher.dispatch = function(action, payload) {
  if (Config.DEBUG) {
    if (payload instanceof Error) {
      console.warn("%s: %O%s", action, payload, payload.stack);
    } else {
      console.debug(action, payload);
    }
  }
  callbacks.forEach(function(cb) {
    cb(action, payload);
  });
};
