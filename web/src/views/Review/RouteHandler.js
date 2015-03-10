"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var Review = React.createFactory(require("./Review"));


var ReviewRouteHandler = React.createClass({

  displayName: "ReviewRouteHandler",

  mixins: [ Router.State ],


  render: function() {
    var reviewId = parseInt(this.getParams().reviewId);
    return Review({ reviewId: reviewId });
  }

});


module.exports = ReviewRouteHandler;
