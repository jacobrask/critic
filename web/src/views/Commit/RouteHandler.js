"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var Commit = React.createFactory(require("./Commit"));


var RouteHandler = React.createClass({

  displayName: "CommitRouteHandler",

  mixins: [
    Router.State,
  ],


  render: function() {
    return Commit({
      sha1: this.getParams().sha1,
      repoName: this.getParams().repoName
    });
  }

});


module.exports = RouteHandler;
