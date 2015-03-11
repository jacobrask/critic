"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var SectionMessage = React.createClass({

  displayName: "SectionMessage",

  mixins: [
    React.addons.PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({ className: "SectionMessage" }, this.props);
    return DOM.div(props);
  }

});


module.exports = SectionMessage;
