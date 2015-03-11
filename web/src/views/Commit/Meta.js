"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var Meta = React.createClass({

  displayName: "CommitMeta",

  propTypes: {
    commit: React.PropTypes.object.isRequired
  },


  render: function() {
    var fullMessage = this.props.commit.message.split("\n");
    var summary = fullMessage.shift();
    fullMessage = fullMessage.join("\n").trim();
    return DOM.div({ className: "CommitMeta" },
      DOM.div({ className: "CommitMeta-SHABlock" },
        DOM.span(null, "commit"),
        DOM.samp({ className: "CommitMeta-SHABlock-SHA" },
          this.props.commit.sha1)
      ),
      DOM.div({ className: "CommitMeta-Msg" },
        DOM.h2({ className: "CommitMeta-Msg-Summary" }, summary),
        DOM.pre({ className: "CommitMeta-Msg-Full" }, fullMessage)
      )
    );
  }

});


module.exports = Meta;
