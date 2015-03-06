"use strict";

var Dispatcher = require("../Dispatcher");


var ServerAPI = exports;


/**
 * Indicates a server-side API error.
 *
 * @constructor
 * @extends Error
 *
 * @param {Object} props
 */
var APIError = function(props) {
  Object.assign(this, props);
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, this.constructor);
  }
};
APIError.prototype = Object.create(Error.prototype, {
  constructor: APIError
});


/**
 * Construct a query string of an object of param/values.
 *
 * @param {Object} params - If a value is an array, it will be `join()`ed.
 *
 * @return {string}
 */
var toQueryString = function(params) {
  return Object.keys(params).filter(function(key) {
    return !!params[key];
  }).map(function(key) {
    var vals = params[key];
    if (!Array.isArray(vals)) vals = [vals];
    return key + "=" + vals.join();
  }).join("&");
};


/**
 * Execute a GET request.
 *
 * @param {string} path
 *
 * @return {Promise}
 */
var exec = function(path) {
  return new Promise(function(resolve, reject) {
    fetch(Config.API_ROOT + path, {
        headers: { "Accept": "application/vnd.api+json" }
      })
      .catch(function(err) {
        Dispatcher.dispatch("NETWORK_ERROR", err);
        throw err;
      })
      .then(function(resp) {
        if (resp.status < 200 || resp.status >= 300) {
          return resp.json().then(function(msg) {
            throw new APIError({
              status: resp.status,
              statusText: resp.statusText,
              url: resp.url,
              title: msg.error.title,
              message: msg.error.message
            });
          });
        } else {
          return resp.json();
        }
      })
      .catch(reject)
      .then(resolve);
  });
};


/**
 * Fetch one or more resources. See valid API endpoints at
 * https://critic-review.org/api/v1
 *
 * @param {string} path
 * @param {Object} [options]
 *
 * @return {Promise}
 */
ServerAPI.get = function(path, options) {
  var query = "/";
  // Clone
  options = Object.assign({}, options);
  if (options) {
    if (options.ids) {
      query += options.ids.join();
      delete options.ids;
    }
    query += "?" + toQueryString(options);
  }
  return exec(path + query);
};
