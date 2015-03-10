"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var DOM = React.DOM;
var Link = React.createFactory(Router.Link);


var SiteNav = React.createClass({

  displayName: "SiteNav",

  render: function() {
    return DOM.nav({ className: "TopBar-SiteNav" },
      Link({ to: "dashboard" }, "Dashboard")
    );
  }

});


module.exports = SiteNav;
