"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;
var Review = React.createFactory(require("./Review"));
var SectionBox = React.createFactory(require("../shared/SectionBox"));
var SectionHeader = React.createFactory(require("../shared/SectionHeader"));

var PureRenderMixin = React.addons.PureRenderMixin;


var ReviewList = React.createClass({

  displayName: "ReviewList",

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    branchNames: React.PropTypes.array.isRequired,
    label: React.PropTypes.string.isRequired,
    repoNames: React.PropTypes.array.isRequired,
    reviews: React.PropTypes.array.isRequired
  },


  render: function() {
    var branchNames = this.props.branchNames;
    var repoNames = this.props.repoNames;

    // Reviews are returned from the server sorted by ID ascending.
    // We sort rather than just reverse it to be sure.
    var reviews = this.props.reviews.sort(function(a, b) {
      return b.id - a.id;
    }).map(function(review) {
      return Review({
        branchName: branchNames[review.branch],
        key: review.id,
        repoName: repoNames[review.repository],
        review: review
      });
    });

    return DOM.section({ className: "DashboardReviewList" },
      SectionHeader(null, this.props.label),
      SectionBox(null, DOM.ol(null, reviews))
    );
  }

});


module.exports = ReviewList;
