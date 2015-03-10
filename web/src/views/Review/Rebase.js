"use strict";

var React = require("../../deps/react");
var DOM = React.DOM;


var Rebase = React.createClass({

  displayName: "ReviewRebase",

  propTypes: {
    rebase: React.PropTypes.object.isRequired
  },


  render: function() {
    var rebase = this.props.rebase;
    var msg;
    if (rebase.type === "move") {
      var sha1 = rebase.upstream.sha1.slice(0, 8);
      msg = DOM.span(null,
        "Branch rebased onto ",
        DOM.samp({ className: "ReviewRebase-Upstream" }, sha1)
      );
    } else {
      msg = DOM.span(null, "History rewritten");
    }
    return DOM.div({ className: "ReviewRebase" },
      msg,
      " by ", rebase.creator.fullname
    );
  }

});

module.exports = Rebase;
