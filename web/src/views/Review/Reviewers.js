"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var Reviewers = React.createClass({

  displayName: "ReviewReviewers",

  propTypes: {
    users: React.PropTypes.array
  },


  render: function() {
    var users = this.props.users;
    // Don't display anything until all reviewers are loaded
    if (users == null || users.length === 0 ||
        users.filter(Boolean).length < users.length) return DOM.div(null);
    users = users.map(function(user, idx) {
      return DOM.li({ className: "ReviewReviewers-User", key: idx },
        user.fullname + (idx < users.length - 1 ? ", " : "")
      );
    });
    return DOM.div({ className: "ReviewReviewers" },
      DOM.b(null, "Reviewers"),
      DOM.ul(null, users)
    );
  }

});

module.exports = Reviewers;
