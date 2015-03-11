"use strict";

var CommitActions = require("../../actions/CommitActions");
var CommitStore = require("../../stores/CommitStore");
var constants = require("../../constants");
var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var RepositoryActions = require("../../actions/RepositoryActions");
var RepositoryStore = require("../../stores/RepositoryStore");
var RequestMixin = require("../mixins/RequestMixin");

var DOM = React.DOM;
var LoadIndicator = React.createFactory(require("../shared/LoadIndicator"));
var Meta = React.createFactory(require("./Meta"));


var Commit = React.createClass({

  displayName: "Commit",

  mixins: [
    createStoreMixin(CommitStore, RepositoryStore),
    RequestMixin,
  ],

  componentWillMount: function() {
    this.refresh();
  },


  request: function() {
    return Promise.all([
      CommitActions.fetchBySHA1(
        this.props.sha1,
        this.props.repoName
      ),
      RepositoryActions.fetchByName(
        this.props.repoName
      )
    ]);
  },


  getStateFromStores: function() {
    var commit;
    var repo = RepositoryStore.getByName(
      this.props.repoName
    );
    if (repo != null) {
      commit = CommitStore.getBySHA1(
        this.props.sha1,
        repo.id
      );
    }
    return {
      commit: commit,
      repo: repo
    };
  },


  render: function() {
    if (this.state.loadState <= constants.LoadState.LOADING) {
      return LoadIndicator();
    }
    return DOM.section({ className: "Commit" },
      Meta({
        commit: this.state.commit,
        repo: this.state.repo
      })
    );
  }

});


module.exports = Commit;
