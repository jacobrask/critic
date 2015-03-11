"use strict";

var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var ReviewStore = require("../../stores/ReviewStore");
var UserStore = require("../../stores/UserStore");

var DOM = React.DOM;
var Owners = React.createFactory(require("./Owners"));
var Reviewers = React.createFactory(require("./Reviewers"));


var ReviewSidebar = React.createClass({

  displayName: "ReviewSidebar",

  propTypes: {
    reviewId: React.PropTypes.number.isRequired,
  },

  mixins: [
    createStoreMixin(ReviewStore, UserStore),
  ],


  getStateFromStores: function() {
    var review = ReviewStore.getById(this.props.reviewId);
    var owners, reviewers;
    if (review != null) {
      owners = review.owners.map(UserStore.getById);
      reviewers = review.reviewers.map(UserStore.getById);
    }

    return {
      owners: owners,
      reviewers: reviewers,
    };
  },


  render: function() {
    return DOM.aside({ className: "ReviewSidebar" },
      Owners({ users: this.state.owners }),
      Reviewers({ users: this.state.reviewers })
    );
  }

});


module.exports = ReviewSidebar;
