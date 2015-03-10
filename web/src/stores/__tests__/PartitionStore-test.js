"use strict";

jest.dontMock("../PartitionStore");


describe("PartitionStore", function() {

  // Return an object(s) with the `id` property matching given argument
  var mirrorId = function(id) {
    if (Array.isArray(id)) {
      return id.map(function(i) { return { id: i }; });
    }
    return { id: id };
  };

  var MOCK_REVIEW = {
    id: 1,
    partitions: [
      { commits: [ 1, 3, 5 ], rebase: 20 }
    ]
  };

  beforeEach(function() {
    var ReviewStore = require("../ReviewStore");
    ReviewStore.getById.mockReturnValue(MOCK_REVIEW);
  });


  describe("get partitions", function() {

    var MOCK_REBASE = {
      id: 20,
      type: "move",
      "new_upstream": 2,
      creator: 3
    };

    var PartitionStore;
    beforeEach(function() {
      var CommitStore = require("../CommitStore");
      CommitStore.getByIds.mockImplementation(mirrorId);
      CommitStore.getById.mockImplementation(mirrorId);
      var UserStore = require("../UserStore");
      UserStore.getById.mockImplementation(mirrorId);

      // Add mock rebase
      var Dispatcher = require("../../Dispatcher");
      Dispatcher.register = function(callback) {
        callback("RECEIVE_REBASES", { rebases: [ MOCK_REBASE ] });
      };
      PartitionStore = require("../PartitionStore");
    });

    it("gets commits", function() {
      var partition = PartitionStore.get(1)[0];
      expect(partition.commits)
        .toEqual([ { id: 1 }, { id: 3 }, { id: 5 } ]);
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
      var partition = PartitionStore.get(1)[0];
      expect(partition.rebase).toEqual({
        id: 20,
        type: "move",
        upstream: { id: 2 },
        creator: { id: 3 }
      });
    });

  });

  it("gets commit count", function() {
    var PartitionStore = require("../PartitionStore");
    expect(PartitionStore.getCommitCount(1)).toBe(3);

  });

});
