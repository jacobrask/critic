"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var SectionHeader = React.createClass({

  displayName: "SectionHeader",

  mixins: [
    React.addons.PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({ className: "SectionHeader" }, this.props);
    return DOM.h2(props);
  }

});


module.exports = SectionHeader;
