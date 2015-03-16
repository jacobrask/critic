"use strict";

var COMMITS = require("./COMMITS").commits;

// Treat first half as commits for branch 1, and the rest as branch 2
var COMMITS_1 = COMMITS.slice(0, COMMITS.length / 2);
var COMMITS_2 = COMMITS.slice(COMMITS.length / 2, COMMITS.length);


describe("BranchCommitsStore", function() {

  var Dispatcher, BranchCommitsStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    BranchCommitsStore = require("../BranchCommitsStore");
  });

  var add = function(commits) {
    Dispatcher.dispatch("RECEIVE_COMMITS", {
      commits: COMMITS
    });
    Dispatcher.dispatch("RECEIVE_BRANCHCOMMITS", {
      branch: 1,
      commits: COMMITS_1.map(function(c) { return c.id; })
    });
    Dispatcher.dispatch("RECEIVE_BRANCHCOMMITS", {
      branch: 2,
      commits: COMMITS_2.map(function(c) { return c.id; })
    });
  };

  it("can be accessed by id", function() {
    expect(BranchCommitsStore.getById(1))
      .toBeUndefined();
    add(COMMITS);
    expect(BranchCommitsStore.getById(1))
      .toEqual(COMMITS_1);
    expect(BranchCommitsStore.getById(2))
      .toEqual(COMMITS_2);
    expect(BranchCommitsStore.getById(Number.MAX_SAFE_INTEGER))
      .toBeUndefined();
  });

  it("throws on invalid id", function() {
    expect(function() { BranchCommitsStore.getById(); })
      .toThrow();
    expect(function() { BranchCommitsStore.getById(-10); })
      .toThrow();
    expect(function() { BranchCommitsStore.getById(0); })
      .toThrow();
    expect(function() { BranchCommitsStore.getById("name"); })
      .toThrow();
  });

});
