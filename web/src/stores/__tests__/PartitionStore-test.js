"use strict";

var REVIEW = require("./REVIEW_PARTITION");
var COMMITS = REVIEW.linked.commits;
var REBASES = REVIEW.linked.rebases;


var getById = function(xs, id) {
  for (var i = 0; i < xs.length; i++) {
    if (xs[i].id === id) return xs[i];
  }
};

describe("PartitionStore", function() {

  var Dispatcher, PartitionStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    PartitionStore = require("../PartitionStore");
  });

  var add = function(review) {
    Dispatcher.dispatch("RECEIVE_COMMITS", {
      commits: review.linked.commits
    });
    Dispatcher.dispatch("RECEIVE_USERS", {
      users: review.linked.users
    });
    Dispatcher.dispatch("RECEIVE_REVIEWS", {
      reviews: [ review ]
    });
    Dispatcher.dispatch("RECEIVE_REBASES", {
      rebases: review.linked.rebases
    });
  };

  it("gets commits", function() {
    expect(PartitionStore.get(REVIEW.id))
      .toBeUndefined();
    add(REVIEW);
    expect(PartitionStore.get(REVIEW.id).length)
      .toBe(4);
    var firstCommit = getById(COMMITS, REVIEW.partitions[0].commits[0]);
    expect(PartitionStore.get(REVIEW.id)[0].commits)
      .toContain(firstCommit);
  });

  it("throws on invalid id", function() {
    expect(function() { PartitionStore.get(); })
      .toThrow();
    expect(function() { PartitionStore.get(-10); })
      .toThrow();
    expect(function() { PartitionStore.get(0); })
      .toThrow();
    expect(function() { PartitionStore.get("foo"); })
      .toThrow();
  });

  it("gets rebases", function() {
    expect(PartitionStore.get(REVIEW.id))
      .toBeUndefined();
    add(REVIEW);
    var firstRebase = getById(REBASES, REVIEW.partitions[0].rebase);
    expect(PartitionStore.get(REVIEW.id)[0].rebase.id)
      .toEqual(firstRebase.id);
    expect(PartitionStore.get(REVIEW.id)[0].rebase.creator.id)
      .toEqual(firstRebase.creator);
  });

});
