"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var DOM = React.DOM;
var Link = React.createFactory(Router.Link);
var SiteNav = React.createFactory(require("./SiteNav"));


// A static version with the same markup is prerendered in `index.html`, and
// then replaced with this component. Styles are also defined in `index.html`.
var TopBar = React.createClass({

  displayName: "TopBar",

  render: function() {
    return DOM.header({ className: "TopBar" },
      Link({ to: "dashboard", className: "TopBar-Logo" }, "Critic"),
      SiteNav()
    );
  }

});


module.exports = TopBar;
