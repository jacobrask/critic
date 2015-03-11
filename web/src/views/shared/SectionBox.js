"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var SectionBox = React.createClass({

  displayName: "SectionBox",

  mixins: [
    React.addons.PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({ className: "SectionBox" }, this.props);
    return DOM.div(props);
  }

});


module.exports = SectionBox;
