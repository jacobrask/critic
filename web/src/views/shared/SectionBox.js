"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var SectionBox = React.createClass({

  mixins: [
    PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({ className: "SectionBox" }, this.props);
    return DOM.div(props);
  }

});


module.exports = SectionBox;
