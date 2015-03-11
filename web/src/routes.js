"use strict";

var React = require("./deps/react");
var Router = require("./deps/react-router");

// Components are usually wrapped in createFactory, but in this case it
// happens when handling a route in `init.js`.
var App = require("./views/App");
var Branch = require("./views/Branch/RouteHandler");
var Commit = require("./views/Commit/RouteHandler");
var Dashboard = require("./views/Dashboard/RouteHandler");
var Review = require("./views/Review/RouteHandler");

var Redirect = React.createFactory(Router.Redirect);
var Route = React.createFactory(Router.Route);


/**
 * Specifiy which React component (view) to render for which URL.
 *
 * @see https://github.com/rackt/react-router/blob/v0.12.0/docs/guides/overview.md#with-react-router
 * @see https://github.com/rackt/react-router/blob/v0.12.0/docs/api/components/Route.md
 */
var routes = (
  Route({
      name: "app",
      handler: App,
      path: "/"
    },

    // We could make this redirect configurable by the administrator.
    Redirect({
        from: "/",
        to: "dashboard"
    }),

    Route({
        name: "branch",
        handler: Branch,
        path: ":repoName/branch/*"
    }),

    Route({
        name: "commit",
        handler: Commit,
        path: ":repoName/commit/:sha1"
    }),

    Route({
        name: "dashboard",
        handler: Dashboard,
        path: "dashboard"
    }),

    Route({
        name: "review",
        handler: Review,
        path: "r/:reviewId"
    })
  )
);


module.exports = routes;
