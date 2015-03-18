"use strict";

/**
 * Indicates an Network usage error.
 *
 * @constructor
 * @extends Error
 *
 * @param {string} message
 * @param {string=} error
 */
var NetworkError = function(message, error) {
  this.message = message;
  if (error != null) this.error = error;
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, this.constructor);
  }
};

NetworkError.prototype = Object.create(Error.prototype, {
  constructor: NetworkError,
});


/**
 * Longer error description.
 *
 * @type {string?}
 */
NetworkError.prototype.error = null;


/**
 * Short error description.
 *
 * @type {string}
 */
NetworkError.prototype.message = null;


/**
 * @type {string}
 */
NetworkError.prototype.name = "NetworkError";


module.exports = NetworkError;
