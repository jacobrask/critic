"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var Commit = React.createClass({

  displayName: "BranchCommit",

  propTypes: {
    commit: React.PropTypes.object.isRequired,
    repoName: React.PropTypes.string
  },


  render: function() {
    // Timestamp is seconds since epoch, Date takes milliseconds.
    var date = new Date(this.props.commit.author.timestamp * 1000);

    return DOM.li({ className: "BranchCommit" },
      DOM.div({ className: "BranchCommit-Main" },
        DOM.div({
            className: "BranchCommit-Summary",
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
        DOM.samp({ className: "BranchCommit-SHA1" },
          this.props.commit.sha1
        )
      )
    );
  }

});

module.exports = Commit;
