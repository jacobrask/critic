"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var SiteNav = React.createClass({

  displayName: "SiteNav",

  render: function() {
    return DOM.nav({ className: "TopBar-SiteNav" })
  }

});


module.exports = SiteNav;
