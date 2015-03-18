"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var BranchLink = React.createFactory(require("../shared/BranchLink"));
var DOM = React.DOM;
var Link = React.createFactory(Router.Link);


var Review = React.createClass({

  displayName: "DashboardReview",

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    branchName: React.PropTypes.string.isRequired,
    repoName: React.PropTypes.string.isRequired,
    review: React.PropTypes.object.isRequired,
  },


  render: function() {
    var review = this.props.review;

    return DOM.li({ className: "DashboardReview" },
      Link({
          className: "DashboardReview-Review",
          params: { reviewId: review.id },
          to: "review",
        },
        DOM.span({ className: "DashboardReview-Id" }, "r/" + review.id),
        DOM.span({ className: "DashboardReview-Summary" }, review.summary)
      ),
      BranchLink({
          repoName: this.props.repoName,
          branchName: this.props.branchName,
      })
    );
  }

});


module.exports = Review;
