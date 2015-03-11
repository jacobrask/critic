"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var LoadIndicator = React.createClass({

  displayName: "LoadIndicator",

  mixins: [
    React.addons.PureRenderMixin
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
