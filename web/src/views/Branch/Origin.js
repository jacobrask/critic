"use strict";

var React = require("../../deps/react");

var CommitLink = React.createFactory(require("../shared/CommitLink"));
var CommitListEvent = React.createFactory(
  require("../shared/CommitListEvent")
);


var Origin = React.createClass({

  displayName: "BranchOrigin",

  propTypes: {
    commit: React.PropTypes.object
  },


  render: function() {
    var link = "…";
    if (this.props.commit != null) {
      link = CommitLink({
        repoName: this.props.repoName,
        sha1: this.props.commit.sha1,
      });
    }
    return CommitListEvent(null,
      "Branch based on ",
      link
    );
  }

});

module.exports = Origin;
