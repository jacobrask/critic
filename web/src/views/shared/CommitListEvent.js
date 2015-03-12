"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var CommitListEvent = React.createClass({

  displayName: "CommitListEvent",

  mixins: [
    PureRenderMixin,
  ],


  render: function() {
    return DOM.div(Object.assign({
        className: "CommitListEvent"
      },
      this.props
    ));
  }

});

module.exports = CommitListEvent;
