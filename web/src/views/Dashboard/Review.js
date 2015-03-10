"use strict";

var React = require("../../deps/react");
var Router = require("../../deps/react-router");

var DOM = React.DOM;
var Link = React.createFactory(Router.Link);

var PureRenderMixin = React.addons.PureRenderMixin;


var Review = React.createClass({

  displayName: "DashboardReview",

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    branchName: React.PropTypes.string,
    repoName: React.PropTypes.string,
    review: React.PropTypes.object,
  },


  render: function() {
    var review = this.props.review;

    return DOM.li({ className: "DashboardReview" },
      Link({
          to: "review",
          params: { reviewId: review.id },
          className: "DashboardReview-Review"
        },
        DOM.span({ className: "DashboardReview-Id" }, "r/" + review.id),
        DOM.span({ className: "DashboardReview-Summary" }, review.summary)
      ),
      Link({
          className: "DashboardReview-Branch",
          to: "branch",
          params: {
            repoName: this.props.repoName,
            splat: this.props.branchName,
          }
        },
        DOM.samp(null, this.props.branchName)
      )
    );
  }

});


module.exports = Review;
