"use strict";

var BranchStore = require("../../stores/BranchStore");
var constants = require("../../constants");
var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var ReviewStore = require("../../stores/ReviewStore");

var DOM = React.DOM;
var ReviewList = React.createFactory(require("./ReviewList"));
var SectionMessage = React.createFactory(require("../shared/SectionMessage"));
var LoadIndicator = React.createFactory(require("../shared/LoadIndicator"));

var LoadState = constants.LoadState;
var PureRenderMixin = React.addons.PureRenderMixin;


var ReviewLists = React.createClass({

  displayName: "ReviewLists",

  mixins: [
    createStoreMixin(BranchStore, ReviewStore),
    PureRenderMixin
  ],

  propTypes: {
    loadState: React.PropTypes.number.isRequired,
    states: React.PropTypes.array.isRequired
  },


  getStateFromStores: function(nextProps) {
    var reviews = nextProps.states.reduce(function(acc, state) {
      var reviewsByState = ReviewStore.getAllByState(state);
      if (reviewsByState != null) acc[state] = reviewsByState;
      return acc;
    }, {});

    var allReviews = Object.keys(reviews).reduce(function(acc, state) {
      acc = acc.concat(reviews[state]);
      return acc;
    }, []);

    // Maps review ids to corresponding branch names for easy access.
    var branchNames = allReviews.reduce(function(acc, review) {
      var branch = BranchStore.getById(review.branch);
      if (branch != null) acc[review.branch] = branch.name;
      return acc;
    }, []);

    return {
      branchNames: branchNames,
      reviews: reviews
    };
  },


  render: function() {
    var labels = {
      closed: "Closed reviews",
      dropped: "Dropped reviews",
      open: "Open reviews"
    };
    var branchNames = this.state.branchNames;
    var reviews = this.state.reviews;
    var lists = Object.keys(reviews).reduce(function(all, state) {
      if (reviews[state] && reviews[state].length > 0) {
        all.push(ReviewList({
          branchNames: branchNames,
          key: state,
          label: labels[state],
          reviews: reviews[state]
        }));
      }
      return all;
    }, []);

    if (lists.length === 0) {
      switch (this.props.loadState) {
        case LoadState.LOADING:
          lists = LoadIndicator();
          break;
        case LoadState.COMPLETE:
          lists = SectionMessage(null, "No reviews :(");
          break;
      }
    }
    return DOM.main(null, lists);
  }

});


module.exports = ReviewLists;
