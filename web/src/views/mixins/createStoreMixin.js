"use strict";

var addListeners = function(stores) {
  stores.forEach(function(store) {
    store.listen(this.updateStoreState);
  }, this);
};

var removeListeners = function(stores) {
  stores.forEach(function(store) {
    store.unlisten(this.updateStoreState);
  }, this);
};


/**
 * Component mixin to listen into stores.
 *
 * Implements the `updateStoreState` method.
 *
 * The component mixing in this should implement the `getStateFromStores`
 * method, returning an object. `getStateFromStores` is invoked any time one
 * of the given stores is changed.
 *
 * @param {...Object} stores
 *
 * @return {Object} - mixin
 */
var createStoreMixin = function() {
  var stores = Array.prototype.slice.call(arguments);

  return {

    componentWillMount: function() {
      addListeners.call(this, stores);
    },

    componentWillUnmount: function() {
      removeListeners.call(this, stores);
    },

    componentWillReceiveProps: function(newProps) {
      this.updateStoreState(newProps);
    },

    getInitialState: function() {
      return this.getStateFromStores(this.props);
    },

    updateStoreState: function(props) {
      if (this.isMounted()) {
        this.setState(this.getStateFromStores(props || this.props));
      }
    }

  };

};

module.exports = createStoreMixin;
