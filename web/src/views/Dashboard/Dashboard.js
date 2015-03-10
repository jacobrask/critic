"use strict";

var constants = require("../../constants");
var React = require("../../deps/react");
var RequestMixin = require("../mixins/RequestMixin");
var ReviewActions = require("../../actions/ReviewActions");
var DOM = React.DOM;
var ReviewLists = React.createFactory(require("./ReviewLists"));

var PureRenderMixin = React.addons.PureRenderMixin;


var Dashboard = React.createClass({

  displayName: "Dashboard",

  mixins: [
    PureRenderMixin,
    RequestMixin,
  ],

  propTypes: {
    reviewStates: React.PropTypes.array.isRequired,
  },

  componentDidMount: function() {
    this.refresh();
  },

  componentWillReceiveProps: function() {
    this.refresh();
  },


  // Called by `this.refresh`, defined in RequestMixin.
  request: function() {
    return ReviewActions.fetchAll(
      { state: this.props.reviewStates },
      [
        constants.ReviewIncludes.BRANCHES,
        constants.ReviewIncludes.REPOSITORIES
      ]
    );
  },


  render: function() {
    return DOM.div({ className: "Dashboard" },
      ReviewLists({
        loadState: this.state.loadState,
        states: this.props.reviewStates,
      })
    );
  }

});


module.exports = Dashboard;
