"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var Dashboard = React.createFactory(require("./Dashboard"));


var DashboardRouteHandler = React.createClass({

  displayName: "DashboardRouteHandler",

  mixins: [ Router.State ],

  propTypes: {
    defaultStates: React.PropTypes.array,
  },

  getDefaultProps: function() {
    return {
      defaultStates: [ "open" ]
    };
  },


  render: function() {
    var query = this.getQuery().state;
    var states = query ? query.split(",") : this.props.defaultStates;
    return Dashboard({
      reviewStates: states,
    });
  }

});


module.exports = DashboardRouteHandler;
