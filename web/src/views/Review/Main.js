"use strict";

var constants = require("../../constants");
var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var ReviewStore = require("../../stores/ReviewStore");

var CommitLog = React.createFactory(require("./CommitLog"));
var DOM = React.DOM;
var SectionBox = React.createFactory(require("../shared/SectionBox"));
var SectionMessage = React.createFactory(require("../shared/SectionMessage"));

var LoadState = constants.LoadState;


var ReviewMain = React.createClass({

  displayName: "ReviewMain",

  mixins: [
    createStoreMixin(ReviewStore),
    React.addons.PureRenderMixin
  ],

  propTypes: {
    loadState: React.PropTypes.number.isRequired,
    reviewId: React.PropTypes.number.isRequired
  },


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
        this.props.loadState === LoadState.LOADING &&
          SectionMessage(null, "Loading review...")
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
            loadState: this.props.loadState,
            review: this.state.review,
        })
      )
    );
  }

});


module.exports = ReviewMain;
