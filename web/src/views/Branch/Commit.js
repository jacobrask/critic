"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var DOM = React.DOM;
var CommitLink = React.createFactory(require("../shared/CommitLink"));
var Link = React.createFactory(Router.Link);


var Commit = React.createClass({

  displayName: "BranchCommit",

  propTypes: {
    commit: React.PropTypes.object.isRequired,
    repoName: React.PropTypes.string.isRequired
  },


  render: function() {
    // Timestamp is seconds since epoch, Date takes milliseconds.
    var date = new Date(this.props.commit.author.timestamp * 1000);

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
        DOM.p({ className: "BranchCommit-Meta" },
          "by ",
          DOM.b({ className: "BranchCommit-Meta-Author" },
            this.props.commit.author.name
          ),
          " at ", DOM.time(null, date.toLocaleString())
        )
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
