"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var Owners = React.createClass({

  displayName: "ReviewOwners",

  propTypes: {
    users: React.PropTypes.array
  },


  render: function() {
    var users = this.props.users;
    if (users == null) return DOM.div(null);
    users = users.reduce(function(all, user) {
      if (user != null) all.push(user);
      return all;
    }, []).map(function(user, idx) {
      return DOM.span({ className: "ReviewOwners-User", key: idx },
        user.fullname
      );
    });
    if (users.length === 0) return DOM.div(null);
    return DOM.div({ className: "ReviewOwners" },
      // TODO: Add actual opening date to API
      "Opened on " + new Date().toLocaleDateString() + " by ",
      users
    );
  }

});

module.exports = Owners;
