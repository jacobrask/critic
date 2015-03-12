"use strict";

var BranchCommitsActions = require("../../actions/BranchCommitsActions");
var BranchCommitsStore = require("../../stores/BranchCommitsStore");
var BranchStore = require("../../stores/BranchStore");
var CommitActions = require("../../actions/CommitActions");
var CommitStore = require("../../stores/CommitStore");
var constants = require("../../constants");
var createStoreMixin = require("../mixins/createStoreMixin");
var React = require("../../deps/react");
var RepositoryStore = require("../../stores/RepositoryStore");
var RequestMixin = require("../mixins/RequestMixin");

var Commit = React.createFactory(require("./Commit"));
var DOM = React.DOM;
var LoadIndicator = React.createFactory(require("../shared/LoadIndicator"));
var Origin = React.createFactory(require("../Review/Origin"));
var SectionBox = React.createFactory(require("../shared/SectionBox"));


var Branch = React.createClass({

  displayName: "Branch",

  mixins: [
    createStoreMixin(BranchStore, BranchCommitsStore, RepositoryStore),
    RequestMixin,
  ],

  propTypes: {
    branchName: React.PropTypes.string.isRequired,
    repoName: React.PropTypes.string.isRequired,
  },


  componentWillMount: function() {
    this.refresh();
  },


  request: function() {
    var repo = this.props.repoName;
    return BranchCommitsActions.fetchByName(this.props.branchName, repo)
      .then(function(resp) {
        var lastCommits = resp.commits;
        var lastCommitId = lastCommits[lastCommits.length - 1].id;
        var originId = CommitStore.getById(lastCommitId).parents[0];
        var origin = CommitStore.getById(originId);
        if (origin) return { commits: [ origin ] };
        return CommitActions.fetchById(originId, repo);
      });
  },


  getStateFromStores: function() {
    var branch, commits, origin, repo;
    repo = RepositoryStore.getByName(this.props.repoName);
    if (repo != null) {
      branch = BranchStore.getByName(this.props.branchName, repo.id);
      if (branch != null) {
        commits = BranchCommitsStore.getById(branch.id, repo.id);
        if (commits != null && commits.length > 0) {
          var parentId = commits[commits.length - 1].parents[0];
          origin = CommitStore.getById(parentId);
        }
      }
    }

    return {
      commits: commits,
      origin: origin,
    };
  },


  render: function() {
    var commits;
    var repoName = this.state.repoName;
    if (this.state.loadState <= constants.LoadState.LOADING) {
      commits = LoadIndicator();
    } else {
      commits = DOM.div(null,
        this.state.commits.map(function(commit) {
          return Commit({
              key: commit.sha1,
              commit: commit,
              repoName: repoName
          });
        }).concat([
          Origin({
            key: "origin",
            commit: this.state.origin
          })
        ]
      ));
    }
    return DOM.section({ className: "Branch" },
      DOM.h2({ className: "Branch-Heading" },
        DOM.span({ className: "Branch-Heading-Repo" },
          this.props.repoName),
        DOM.span({ className: "Branch-Heading-Separator" }, "/"),
        DOM.span({ className: "Branch-Heading-Branch" },
          this.props.branchName)
      ),
      SectionBox(null, commits)
    );
  }

});


module.exports = Branch;
