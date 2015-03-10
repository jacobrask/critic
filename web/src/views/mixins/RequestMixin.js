"use strict";

var constants = require("../../constants");
var Dispatcher = require("../../Dispatcher");

var LoadState = constants.LoadState;


/**
 * Component mixin to handle requests for data.
 *
 * The component should implement the `request` method, which returns a
 * promise that the mixin uses to set the `loadState` accordingly.
 */
var RequestMixin = {

  getInitialState: function() {
    return {
      loadState: LoadState.INITIAL
    };
  },

  refresh: function() {
    if (typeof this.request !== "function") {
      throw new Error("Missing 'request' method");
    }

    this.setState({ loadState: LoadState.LOADING });

    // Any arguments to `refresh` are forwarded.
    var promise = this.request.apply(this, arguments);
    if (!(promise instanceof Promise)) {
      throw new TypeError("Expected 'request' to return a Promise");
    }

    // Called on network/receive success.
    var loadComplete = function(resp) {
      if (this.isMounted()) {
        this.setState({ loadState: LoadState.COMPLETE });
      }
      return resp;
    }.bind(this);

    // Catches on network/receive errors. Final handler for these errors,
    // does not re-throw.
    var loadError = function() {
      if (this.isMounted()) {
        this.setState({ loadState: LoadState.ERROR });
      }
    }.bind(this);

    // Catches errors thrown in component code executed due to state changes
    // in fetch callbacks.
    var renderError = function(err) {
      Dispatcher.dispatch("RENDER_ERROR", err);
    };

    return promise
      .then(loadComplete, loadError)
      .catch(renderError);
  }

};


module.exports = RequestMixin;
