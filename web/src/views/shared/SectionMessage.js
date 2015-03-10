"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var SectionMessage = React.createClass({

  mixins: [
    PureRenderMixin
  ],


  render: function() {
    var props = Object.assign({ className: "SectionMessage" }, this.props);
    return DOM.p(props);
  }

});


module.exports = SectionMessage;
