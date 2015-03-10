"use strict";

var React = require("../../deps/react");
var DOM = React.DOM;


var Origin = React.createClass({

  displayName: "ReviewOrigin",

  propTypes: {
    commit: React.PropTypes.object
  },


  render: function() {
    var sha1 = this.props.commit ? this.props.commit.sha1.slice(0, 8) : "…";
    return DOM.div({ className: "ReviewOrigin" },
      "Branch based on ",
      DOM.samp({ className: "ReviewOrigin-Upstream" }, sha1)
    );
  }

});

module.exports = Origin;
