"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var RE_FOLLOWUP = /(fixup|squash)!\s+(.*)/;

var Commit = React.createClass({

  displayName: "ReviewCommit",

  propTypes: {
    commit: React.PropTypes.object.isRequired,
    repoName: React.PropTypes.string
  },


  render: function() {
    // Timestamp is seconds since epoch, Date takes milliseconds.
    var date = new Date(this.props.commit.author.timestamp * 1000);

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
        DOM.p({ className: "ReviewCommit-Meta" },
          "by ",
          DOM.b({ className: "ReviewCommit-Meta-Author" },
            this.props.commit.author.name
          ),
          " at ", DOM.time(null, date.toLocaleString())
        )
      ),
      DOM.div({ className: "ReviewCommit-Stats" },
        DOM.samp({ className: "ReviewCommit-SHA1" },
          this.props.commit.sha1.slice(0, 8)
        )
      )
    );
  }

});

module.exports = Commit;
