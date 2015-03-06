/**
 * CommonJS module runtime
 *
 * This is a limited subset of some CommonJS module functionality.
 * See https://nodejs.org/docs/latest/api/modules.html
 *
 * This tool has three major use cases:
 *
 *  1. Organize our own code in a sensible manner, avoiding global variables.
 *  2. Lets us run tests of non-browser specific code in Node.js, including
 *     mocking `require`d modules.
 *  3. Third party libraries can be wrapped in a `define`. Since many libraries
 *     meant to be consumed either in Node or in the browser, they often expose
 *     themselves as a CommonJS module if they find `require` or `modules`.
 *
 *
 *     define("./my_module", function(require, exports, module) {
 *       var a = require("./my_other_module");
 *       exports.foo = "FOO";
 *     });
 *
 *
 * Like with Node modules, module identifiers are file system paths, and
 * `require` is relative to the module's path. If the module at
 * `./foo/bar/mod` requires `../../baz`, the `./baz` module will be returned.
 *
 * Any files included in our build are automatically wrapped in a `define`
 * invocation, which exposes the `require`, `exports` and `module` variables.
 */

(function() {
"use strict";


/**
 * Registered modules.
 */
var modules = {};


/**
 * @param {string} path
 * @param {string} current
 * @param {string} absolute
 *
 * @return {*}
 */
function require(path, current, absolute) {
  var resolved = resolve(path);
  if (resolved == null) {
    throw new Error("'"+absolute+"' could not be resolved from '"+current+"'.");
  }
  var module = modules[resolved];

  // If this is the first require of module, invoke the factory function
  if (!("exports" in module) && typeof module.factory === "function") {
    module.factory(relativeRequire(resolved), module.exports = {}, module);
    delete module.factory;
  }
  return module.exports;
}


/**
 * Register module at `path`.
 *
 * The factory function recieves three arguments: `require`, `exports` and
 * `module`. To expose properties, add them to the `exports` object. To expose
 * a custom object, assign the `exports` property on the module `object`.
 *
 * The factory function is invoked when the module is first required by
 * another module.
 *
 * @param {string} path
 * @param {function} factory
 */
function define(path, factory) {
  if (typeof path !== "string" || path === "") {
    throw new TypeError("Invalid path '"+path+"'");
  }
  if (typeof factory !== "function") {
    throw new TypeError("Invalid module definition for '"+path+"'");
  }
  modules[path] = {
    factory: factory
  };
}


/**
 * Resolve `path`.
 *
 * For example, would resolves `foo` to the first of `foo.js`, `./foo.js`,
 * `foo/index.js` and `./foo/index.js`.
 *
 * @param {string} path
 * @return {string?}
 */
function resolve(path) {
  if (path[0] === "/") {
    path = path.slice(1);
  }

  var paths = [
    path + ".js",
    "./" + path + ".js",
    path + "/index.js",
    "./" + path + "/index.js"
  ];

  for (var i = 0, l = paths.length, path; i < l; i++) {
    path = paths[i];
    if (modules.hasOwnProperty(path)) {
      return path;
    }
  }
}


/**
 * Normalize `path` relative to the current path.
 *
 * @param {string} current
 * @param {string} path
 * @return {string}
 */
function normalize(current, path) {
  if (path[0] !== ".") {
    return current + "/" + path;
  }
  var segs = [];
  current = current.split("/");
  path = path.split("/");

  for (var i = 0, len = path.length; i < len; ++i) {
    if (path[i] === "..") {
      current.pop();
    } else if (path[i] !== "." && path[i] !== "") {
      segs.push(path[i]);
    }
  }

  return current.concat(segs).join("/");
}


/**
 * Return a require function relative to the `current` path.
 *
 * @param {string} current
 * @return {function}
 */
function relativeRequire(current) {
  var root = normalize(current, "..");
  return function(path) {
    var resolved = path;
    if (path[0] !== "/") resolved = normalize(root, path);
    return require(resolved, current, path);
  };
}

window.require = require;
window.define = define;

window.global = window;

})();
