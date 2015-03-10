"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var Branch = React.createFactory(require("./Branch"));


var BranchRouteHandler = React.createClass({

  displayName: "BranchRouteHandler",

  mixins: [
    Router.State
  ],


  render: function() {
    return Branch({
      // `splat` is a catchall after /branch, to match branch names with /'s
      branchName: this.getParams().splat,
      repoName: this.getParams().repoName
    });
  }

});


module.exports = BranchRouteHandler;
