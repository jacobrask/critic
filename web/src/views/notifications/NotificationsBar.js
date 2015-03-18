"use strict";

var createStoreMixin = require("../mixins/createStoreMixin");
var GlobalErrorStore = require("../../stores/GlobalErrorStore");
var React = require("../../deps/react");

var DOM = React.DOM;
var GlobalError = React.createFactory(require("./GlobalError"));


var NotificationsBar = React.createClass({

  displayName: "NotificationsBar",

  mixins: [
    createStoreMixin(GlobalErrorStore),
    React.addons.PureRenderMixin,
  ],

  getStateFromStores: function() {
    return {
      errors: GlobalErrorStore.getAll()
    };
  },


  render: function() {
    if (this.state.errors.length === 0) return DOM.div();
    return DOM.div({ className: "NotificationsBar" },
      GlobalError({ error: this.state.errors[0] })
    );
  }

});


module.exports = NotificationsBar;
