"use strict";

var BranchStore = require("../../stores/BranchStore");
var CommitStore = require("../../stores/CommitStore");
var constants = require("../../constants");
var createStoreMixin = require("../mixins/createStoreMixin");
var PartitionStore = require("../../stores/PartitionStore");
var React = require("../../deps/react");
var RepositoryStore = require("../../stores/RepositoryStore");

var Commit = React.createFactory(require("./Commit"));
var DOM = React.DOM;
var LoadIndicator = React.createFactory(require("../shared/LoadIndicator"));
var Origin = React.createFactory(require("./Origin"));
var Rebase = React.createFactory(require("./Rebase"));


var CommitList = React.createFactory(React.createClass({

  propTypes: {
    commits: React.PropTypes.array,
    repoName: React.PropTypes.string,
  },


  render: function() {
    var commits = this.props.commits.map(function(commit) {
      return Commit({
          key: commit.sha1,
          commit: commit,
          repoName: this.props.repoName,
      });
    }.bind(this));
    return DOM.ol({ className: "ReviewCommitLog-List" }, commits);
  }

}));


var LogInfo = React.createFactory(React.createClass({

  propTypes: {
    branchName: React.PropTypes.string,
    commitCount: React.PropTypes.number,
    repoName: React.PropTypes.string
  },


  render: function() {
    var branchLink;
    if (this.props.repoName != null && this.props.branchName != null) {
      branchLink = DOM.samp(null, this.props.branchName);
    } else {
      branchLink = DOM.samp(null, "…");
    }
    var commitCount = this.props.commitCount;
    return DOM.div({ className: "ReviewCommitLog-Info" },
      DOM.b(null, commitCount != null ? commitCount : "…"),
      " commit" + (commitCount != null && commitCount > 1 ? "s" : "") + " in ",
      branchLink
    );
  }

}));


var CommitLog = React.createClass({

  displayName: "ReviewCommitLog",

  propTypes: {
    loadState: React.PropTypes.number,
    review: React.PropTypes.object
  },

  mixins: [
    createStoreMixin(
      BranchStore, CommitStore, PartitionStore, RepositoryStore
    )
  ],


  getStateFromStores: function(props) {
    var review = props.review;
    if (review == null) return {};

    var branch = BranchStore.getById(review.branch);
    var commitCount = PartitionStore.getCommitCount(review.id);
    var partitions = PartitionStore.get(review.id);
    var origin;
    if (partitions != null) {
      var lastCommits = partitions[partitions.length - 1].commits;
      var parentId = lastCommits[lastCommits.length - 1].parents[0];
      origin = CommitStore.getById(parentId);
    }
    var repository = RepositoryStore.getById(review.repository);

    return {
      branchName: branch && branch.name,
      commitCount: commitCount,
      origin: origin,
      partitions: partitions,
      repoName: repository && repository.name,
    };
  },


  render: function() {
    var info = LogInfo({
      branchName: this.state.branchName,
      commitCount: this.state.commitCount,
      repoName: this.state.repoName,
    });


    // We might have some stale commit data in the store already, but it's
    // important that commit data is fresh before displaying it, so wait until
    // first load.
    var log;
    if (this.props.loadState <= constants.LoadState.LOADING) {
      log = LoadIndicator();
    } else {
      log = this.state.partitions.reduce(function(all, partition, idx) {
        all.push(CommitList({
            commits: partition.commits,
            key: idx,
            repoName: this.state.repoName,
        }));
        if (partition.rebase != null) {
          all.push(Rebase({
              key: partition.rebase.id,
              rebase: partition.rebase,
          }));
        }
        return all;
      }.bind(this), []);
      log.push(Origin({
          commit: this.state.origin,
          key: "origin",
      }));
    }

    return DOM.div({ className: "ReviewCommitLog" }, info, log);
  }

});


module.exports = CommitLog;
