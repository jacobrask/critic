"use strict";

var BranchStore = require("../../stores/BranchStore");
var constants = require("../../constants");
var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var RepositoryStore = require("../../stores/RepositoryStore");
var ReviewStore = require("../../stores/ReviewStore");

var DOM = React.DOM;
var ReviewList = React.createFactory(require("./ReviewList"));
var SectionMessage = React.createFactory(require("../shared/SectionMessage"));


var ReviewLists = React.createClass({

  displayName: "ReviewLists",

  mixins: [
    createStoreMixin(BranchStore, RepositoryStore, ReviewStore),
    React.addons.PureRenderMixin
  ],

  propTypes: {
    loadState: React.PropTypes.number.isRequired,
    states: React.PropTypes.array.isRequired
  },


  getStateFromStores: function(nextProps) {
    if (nextProps.loadState === constants.LoadState.ERROR) {
      return { error: ReviewStore.getError() };
    }
    var itemsByState = nextProps.states.reduce(function(all, state) {
      var reviews = ReviewStore.getAllByState(state);
      if (reviews == null) {
        all[state] = [];
      } else {
        all[state] = reviews.map(function(review) {
          return {
            branch: BranchStore.getById(review.branch),
            repository: RepositoryStore.getById(review.repository),
            review: review,
          };
        });
      }
      return all;
    }, {});

    return {
      itemsByState: itemsByState
    };
  },


  render: function() {
    var labels = {
      closed: "Closed reviews",
      dropped: "Dropped reviews",
      open: "Open reviews",
    };
    var items = this.state.itemsByState || {};
    var lists = Object.keys(items).reduce(function(all, state) {
      if (items[state].length > 0) {
        all.push(ReviewList({
          items: items[state],
          key: state,
          label: labels[state],
        }));
      }
      return all;
    }, []);

    if (lists.length === 0) {
      switch (this.props.loadState) {
        case constants.LoadState.ERROR:
          lists = SectionMessage(null, "Failed to load reviews ;-(");
          break;
        case constants.LoadState.LOADING:
          lists = SectionMessage(null, "Loading reviews...");
          break;
        case constants.LoadState.COMPLETE:
          lists = SectionMessage(null, "No reviews :(");
          break;
        default:
          break;
      }
    }
    return DOM.main(null, lists);
  }

});


module.exports = ReviewLists;
