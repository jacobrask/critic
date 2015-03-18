"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var DOM = React.DOM;
var Link = React.createFactory(Router.Link);

var PureRenderMixin = React.addons.PureRenderMixin;


var BranchLink = React.createClass({

  displayName: "BranchLink",

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    branchName: React.PropTypes.string.isRequired,
    children: function(props, name, component) {
      if (props.children != null) {
        return new Error("No children allowed to `" + component + "`.");
      }
    },
    repoName: React.PropTypes.string.isRequired,
  },


  render: function() {
    var props = Object.assign({
        className: "BranchLink",
        to: "branch",
        params: {
          repoName: this.props.repoName,
          splat: this.props.branchName,
        }
      },
      this.props
    );
    return Link(props, DOM.samp(null, this.props.branchName));
  }

});


module.exports = BranchLink;
