"use strict";

var React = require("../deps/react");
var Router = require("../deps/react-router");

var DOM = React.DOM;
var RouteHandler = React.createFactory(Router.RouteHandler);


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
    return DOM.div(null,
      RouteHandler()
    );
  }

});


module.exports = App;
