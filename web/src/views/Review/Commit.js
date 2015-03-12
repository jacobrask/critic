"use strict";

var React = require("../../deps/react");

var CommitByline = React.createFactory(require("../shared/CommitByline"));
var CommitLink = React.createFactory(require("../shared/CommitLink"));
var DOM = React.DOM;


var RE_FOLLOWUP = /(fixup|squash)!\s+(.*)/;


var Commit = React.createClass({

  displayName: "ReviewCommit",

  propTypes: {
    commit: React.PropTypes.object.isRequired,
    repoName: React.PropTypes.string.isRequired
  },


  render: function() {
    var followup, match;
    if (match = this.props.commit.message.match(RE_FOLLOWUP)) {
      followup = DOM.p({ className: "ReviewCommit-Followup" }, match.pop());
    }

    return DOM.li({ className: "ReviewCommit" },
      DOM.div({ className: "ReviewCommit-Main" },
        DOM.div({
            className: "ReviewCommit-Summary",
          },
          this.props.commit.summary
        ),
        followup,
        CommitByline({
          user: this.props.commit.author
        })
      ),
      DOM.div({ className: "ReviewCommit-Stats" },
        CommitLink({
          length: 8,
          repoName: this.props.repoName,
          sha1: this.props.commit.sha1,
        })
      )
    );
  }

});

module.exports = Commit;
