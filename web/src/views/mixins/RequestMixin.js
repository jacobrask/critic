"use strict";

var constants = require("../../constants");
var Dispatcher = require("../../Dispatcher");

var LoadState = constants.LoadState;


/**
 * For the first 1 second, users still feel like any change of state is clearly
 * connected to their previous action (such as navigating to a page). This
 * means that the UI is not exactly in a "loading" state, but rather in an
 * intermediate state of delay.
 *
 * After 1 second, the user gets impatient and there should be an indication
 * that we're loading some content.
 *
 * @see http://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/
 *
 * @constant
 */
var INDICATOR_WAIT = 1000;


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

    setTimeout(function() {
      // If we didn't complete, set to loading.
      if (this.isMounted() && this.state.loadState === LoadState.INITIAL) {
        this.setState({ loadState: LoadState.LOADING });
      }
    }.bind(this), INDICATOR_WAIT);

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

    // Catches network/receive errors. Final handler for these errors,
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
