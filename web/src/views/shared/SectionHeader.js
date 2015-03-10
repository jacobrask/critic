"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var SectionHeader = React.createClass({

  mixins: [
    PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({ className: "SectionHeader" }, this.props);
    return DOM.h2(props);
  }

});


module.exports = SectionHeader;
