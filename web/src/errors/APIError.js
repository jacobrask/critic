"use strict";

/**
 * Indicates an API usage error.
 *
 * @constructor
 * @extends Error
 *
 * @param {string} message
 * @param {number} code
 * @param {string=} error
 */
var APIError = function(message, code, error) {
  this.code = code;
  this.message = message;
  this.error = error;
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, this.constructor);
  }
};

APIError.prototype = Object.create(Error.prototype, {
  constructor: APIError,
});


/**
 * HTTP Status Code.
 * @type {number}
 */
APIError.prototype.code = null;


/**
 * Longer error description.
 *
 * @type {string?}
 */
APIError.prototype.error = null;


/**
 * Short error description.
 *
 * @type {string}
 */
APIError.prototype.message = null;


/**
 * @type {string}
 */
APIError.prototype.name = "APIError";


module.exports = APIError;
