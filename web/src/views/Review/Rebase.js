"use strict";

var React = require("../../deps/react");

var CommitLink = React.createFactory(require("../shared/CommitLink"));
var CommitListEvent = React.createFactory(
  require("../shared/CommitListEvent")
);
var DOM = React.DOM;


var Rebase = React.createClass({

  displayName: "ReviewRebase",

  propTypes: {
    rebase: React.PropTypes.object.isRequired,
    repoName: React.PropTypes.string.isRequired,
  },


  render: function() {
    var msg;
    if (this.props.rebase.type === "move") {
      msg = DOM.span(null,
        "Branch rebased onto ",
        CommitLink({
            length: 8,
            repoName: this.props.repoName,
            sha1: this.props.rebase.upstream.sha1,
        })
      );
    } else {
      msg = DOM.span(null, "History rewritten");
    }
    return CommitListEvent(null,
      msg,
      " by ", this.props.rebase.creator.fullname
    );
  }

});

module.exports = Rebase;
