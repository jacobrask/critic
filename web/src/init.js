"use strict";

// The React user interface library.
// See http://facebook.github.io/react
var React = require("./deps/react");

// A client side router for React.
// See https://github.com/rackt/react-router
var Router = require("./deps/react-router");

// Specifies which React component (view) to render for which URL path.
var routes = require("./routes");


// Called from `index.html`
var render = function(container) {
  Router.run(routes, Router.HistoryLocation, function (AppRouter) {
    AppRouter = React.createFactory(AppRouter);
    React.render(AppRouter(), container);
  });
};


module.exports = render;
