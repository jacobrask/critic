"use strict";

var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var ReviewStore = require("../../stores/ReviewStore");

var CommitLog = React.createFactory(require("./CommitLog"));
var DOM = React.DOM;
var LoadIndicator = React.createFactory(require("../shared/LoadIndicator"));
var SectionBox = React.createFactory(require("../shared/SectionBox"));

var PureRenderMixin = React.addons.PureRenderMixin;


var ReviewMain = React.createClass({

  displayName: "ReviewMain",

  propTypes: {
    loadState: React.PropTypes.number.isRequired,
    reviewId: React.PropTypes.number.isRequired
  },

  mixins: [
    createStoreMixin(ReviewStore),
    PureRenderMixin
  ],


  getStateFromStores: function(props) {
    var review = ReviewStore.getById(props.reviewId);
    return {
      review: review
    };
  },


  render: function() {
    var review = this.state.review;
    if (review == null) {
      return DOM.section({ className: "ReviewMain" },
        LoadIndicator()
      );
    }

    var description;
    if (review.description) {
      description = DOM.div({
          className: "ReviewMain-Description"
        },
        review.description
      );
    }

    return DOM.section({ className: "ReviewMain" },
      DOM.div({ className: "ReviewMain-Header" },
        DOM.div({ className: "ReviewMain-Header-Id" },
          "r/" + this.props.reviewId),
        DOM.h2({ className: "ReviewMain-Header-Heading" },
          review.summary)
      ),
      description,
      SectionBox(null,
        CommitLog({
            review: this.state.review,
            loadState: this.props.loadState
        })
      )
    );
  }

});


module.exports = ReviewMain;
