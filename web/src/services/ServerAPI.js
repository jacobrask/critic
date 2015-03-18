"use strict";

var APIError = require("../errors/APIError");
var NetworkError = require("../errors/NetworkError");


var ServerAPI = exports;


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
    if (!Array.isArray(vals)) vals = [ vals ];
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
  var ACCEPT_HEADER = "application/vnd.api+json";
  var url = Config.API_ROOT + path;
  return new Promise(function(resolve, reject) {
    fetch(url, {
        headers: { "Accept": ACCEPT_HEADER }
      })
      .catch(function(err) {
        throw new NetworkError(err.message);
      })
      .then(function(resp) {
        if (resp.headers.get("Content-Type") !== ACCEPT_HEADER) {
          throw new APIError("Invalid response type", resp.status);
        }
        if (resp.status >= 400) {
          return resp.json().then(function(msg) {
            throw new APIError(
              msg.error.title, resp.status, msg.error.message
            );
          });
        }
        return resp.json();
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
