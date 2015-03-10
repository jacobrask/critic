"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var Dashboard = React.createFactory(require("./Dashboard"));


var DashboardRouteHandler = React.createClass({

  displayName: "DashboardRouteHandler",

  mixins: [ Router.State ],

  getDefaultProps: function() {
    return {
      defaultStates: [ "open" ]
    };
  },


  getReviewStatesFromQuery: function() {
    var query = this.getQuery().state;
    return query ? query.split(",") : this.props.defaultStates;
  },


  render: function() {
    return Dashboard({
      reviewStates: this.getReviewStatesFromQuery()
    });
  }

});


module.exports = DashboardRouteHandler;
