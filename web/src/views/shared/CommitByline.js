"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var CommitByline = React.createClass({

  displayName: "CommitByline",

  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  mixins: [
    PureRenderMixin,
  ],


  render: function() {
    // Timestamp is seconds since epoch, Date takes milliseconds.
    var date = new Date(this.props.user.timestamp * 1000);
    var props = Object.assign({
        className: "CommitByline",
      },
      this.props
    );
    return DOM.p(props,
      "by ",
      DOM.b({ className: "CommitByline-Author" },
        this.props.user.name
      ),
      " at ",
      DOM.time({
          className: "CommitByline-Date",
          dateTime: date.toISOString(),
        },
        date.toLocaleString()
      )
    );
  }

});

module.exports = CommitByline;
