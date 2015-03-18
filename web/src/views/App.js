"use strict";

var React = require("../deps/react");
var Router = require("../deps/react-router");

var DOM = React.DOM;
var RouteHandler = React.createFactory(Router.RouteHandler);
var NotificationsBar = React.createFactory(
  require("./notifications/NotificationsBar")
);
var TopBar = React.createFactory(require("./TopBar"));


/**
 * The main application component. The results of the `render` method will be
 * the container of the entire Critic application.
 *
 * @constructor
 */
var App = React.createClass({

  displayName: "App",

  mixins: [ Router.State ],


  render: function() {
    return DOM.div({ className: "App" },
      TopBar(),
      NotificationsBar(),
      RouteHandler()
    );
  }

});


module.exports = App;
