"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;

var PureRenderMixin = React.addons.PureRenderMixin;


var Review = React.createClass({

  displayName: "DashboardReview",

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    branchName: React.PropTypes.string,
    review: React.PropTypes.object
  },


  render: function() {
    var review = this.props.review;

    return DOM.li({ className: "DashboardReview" },
      DOM.div({
          className: "DashboardReview-Review"
        },
        DOM.span({ className: "DashboardReview-Id" }, "r/" + review.id),
        DOM.span({ className: "DashboardReview-Summary" }, review.summary)
      ),
      DOM.samp({ className: "DashboardReview-Branch" }, this.props.branchName)
    );
  }

});


module.exports = Review;
