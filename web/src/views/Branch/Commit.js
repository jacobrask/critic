"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var CommitByline = React.createFactory(require("../shared/CommitByline"));
var CommitLink = React.createFactory(require("../shared/CommitLink"));
var DOM = React.DOM;
var Link = React.createFactory(Router.Link);


var Commit = React.createClass({

  displayName: "BranchCommit",

  propTypes: {
    commit: React.PropTypes.object.isRequired,
    repoName: React.PropTypes.string.isRequired
  },


  render: function() {
    // Timestamp is seconds since epoch, Date takes milliseconds.

    return DOM.li({ className: "BranchCommit" },
      DOM.div({ className: "BranchCommit-Main" },
        Link({
            className: "BranchCommit-Summary",
            to: "commit",
            params: {
              repoName: this.props.repoName,
              sha1: this.props.commit.sha1,
            }
          },
          this.props.commit.summary
        ),
        CommitByline({
          user: this.props.commit.author
        })
      ),
      DOM.div({ className: "BranchCommit-Stats" },
        CommitLink({
          repoName: this.props.repoName,
          sha1: this.props.commit.sha1,
        })
      )
    );
  }

});

module.exports = Commit;
