"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var LoadIndicator = React.createClass({

  mixins: [
    PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({
        className: "LoadIndicator"
      },
      this.props
    );
    return DOM.p(props, "Loading...");
  }

});


module.exports = LoadIndicator;
