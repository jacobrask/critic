"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;
var Review = React.createFactory(require("./Review"));
var SectionBox = React.createFactory(require("../shared/SectionBox"));
var SectionHeader = React.createFactory(require("../shared/SectionHeader"));


var ReviewList = React.createClass({

  displayName: "ReviewList",

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    items: React.PropTypes.array.isRequired,
    label: React.PropTypes.string.isRequired,
  },


  render: function() {
    // Reviews are returned from the server sorted by ID ascending.
    // We sort rather than just reverse it to be sure.
    var reviews = this.props.items.sort(function(a, b) {
      return b.review.id - a.review.id;
    }).map(function(item) {
      return Review({
        branchName: item.branch.name,
        key: item.review.id,
        repoName: item.repository.name,
        review: item.review
      });
    });

    return DOM.section({ className: "DashboardReviewList" },
      SectionHeader(null, this.props.label),
      SectionBox(null, DOM.ol(null, reviews))
    );
  }

});


module.exports = ReviewList;
