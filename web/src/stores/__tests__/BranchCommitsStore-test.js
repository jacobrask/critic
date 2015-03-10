"use strict";

jest.dontMock("../BranchCommitsStore");


describe("BranchCommitsStore", function() {

  var MOCK_COMMITS = [
    {
      id: 1,
      sha1: "3283b892f000bacda693d305e72b4329f16a2b8f"
    }, {
      id: 2,
      sha1: "d946cefa86d42fc4d6a60d8d5edd7b91b80774e8"
    }, {
      id: 3,
      state: "9498cc4cabf241a6c9a33b603c0df8d634db5116"
    }, {
      id: 4,
      state: "40a56c9dca50baa3c51b7e8dc5d31079b9f6b193"
    }
  ];

  var add, BranchCommitsStore;
  beforeEach(function() {
    var CommitStore = require("../CommitStore");
    CommitStore.getByIds.mockReturnValue(MOCK_COMMITS);

    var Dispatcher = require("../../Dispatcher");
    // Hijack the callback added in BranchCommitsStore
    Dispatcher.register = function(callback) {
      add = callback.bind(null, "RECEIVE_BRANCHCOMMITS");
    };
    BranchCommitsStore = require("../BranchCommitsStore");
  });


  it("can be accessed by id", function() {
    expect(BranchCommitsStore.getById(1))
      .toBeNull();
    add({ branch: 1, commits: MOCK_COMMITS });
    expect(BranchCommitsStore.getById(10))
      .toBeNull();
    expect(BranchCommitsStore.getById(1))
      .toEqual(MOCK_COMMITS);
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
