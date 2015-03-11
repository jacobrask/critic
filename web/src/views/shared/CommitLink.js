"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var DOM = React.DOM;
var Link = React.createFactory(Router.Link);

var PureRenderMixin = React.addons.PureRenderMixin;


var CommitLink = React.createClass({

  displayName: "CommitLink",

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    children: function(props, name, component) {
      if (props.children != null) {
        return new Error("No children allowed to `" + component + "`.");
      }
    },
    length: React.PropTypes.number,
    repoName: React.PropTypes.string.isRequired,
    sha1: React.PropTypes.string.isRequired,
  },


  render: function() {
    var props = Object.assign({
        className: "CommitLink",
        to: "commit",
        params: {
          repoName: this.props.repoName,
          sha1: this.props.sha1,
        }
      },
      this.props
    );
    var sha1 = this.props.sha1;
    if (this.props.length != null) {
      sha1 = sha1.slice(0, this.props.length);
    }
    return Link(props,
      DOM.samp({ className: "CommitLink-SHA1" }, sha1)
    );
  }

});


module.exports = CommitLink;
