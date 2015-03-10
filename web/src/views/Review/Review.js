"use strict";

var CommitActions = require("../../actions/CommitActions");
var CommitStore = require("../../stores/CommitStore");
var constants = require("../../constants");
var React = require("../../deps/react");
var RequestMixin = require("../mixins/RequestMixin");
var ReviewActions = require("../../actions/ReviewActions");

var DOM = React.DOM;
var Main = React.createFactory(require("./Main"));

var PureRenderMixin = React.addons.PureRenderMixin;


var Review = React.createClass({

  displayName: "Review",

  mixins: [
    PureRenderMixin,
    RequestMixin,
  ],

  propTypes: {
    reviewId: React.PropTypes.number.isRequired,
  },

  componentDidMount: function() {
    this.refresh();
  },


  request: function() {
    var reviewId = this.props.reviewId;
    return ReviewActions.fetchById(reviewId, [ constants.ReviewIncludes.ALL ])
      .then(function(review) {
        // Last commit was added to store in ReviewAction.
        var lastPartition = review.partitions[review.partitions.length - 1];
        var lastCommits = lastPartition.commits;
        var lastCommitId = lastCommits[lastCommits.length - 1];
        var originId = CommitStore.getById(lastCommitId).parents[0];

        // Request the parent of the first commit in the review branch.
        var origin = CommitStore.getById(originId);
        if (origin) return { commits: [ origin ] };
        return CommitActions.fetchById(originId, review.repository);
      });
  },


  render: function() {
    return DOM.div({ className: "Review" },
      Main({
        loadState: this.state.loadState,
        reviewId: this.props.reviewId
      })
    );
  }

});


module.exports = Review;
