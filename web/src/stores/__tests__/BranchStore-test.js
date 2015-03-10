"use strict";

jest.dontMock("../BranchStore");


describe("BranchStore", function() {

  var MOCK_BRANCHES = [
    {
      id: 2,
      name: "r/bird",
      repository: 2
    }, {
      id: 99,
      name: "def",
      repository: 1
    }
  ];


  var Dispatcher, add, BranchStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    // Hijack the callback added in BranchStore
    Dispatcher.register = function(callback) {
      add = callback.bind(null, "RECEIVE_BRANCHES");
    };
    BranchStore = require("../BranchStore");
  });


  it("can be accessed by id", function() {
    add({ branches: MOCK_BRANCHES });
    expect(BranchStore.getById(10))
      .toBeUndefined();
    expect(BranchStore.getById(99))
      .toEqual(MOCK_BRANCHES[1]);
  });

  it("throws on invalid id", function() {
    expect(function() { BranchStore.getById(); })
      .toThrow();
    expect(function() { BranchStore.getById(-10); })
      .toThrow();
    expect(function() { BranchStore.getById(0); })
      .toThrow();
    expect(function() { BranchStore.getById("name"); })
      .toThrow();
  });

  it("can be accessed by name", function() {
    add({ branches: MOCK_BRANCHES });
    expect(BranchStore.getByName("no_such_branch", 2))
      .toBeUndefined();
    expect(BranchStore.getByName("r/bird", 1))
      .toBeUndefined();
    expect(BranchStore.getByName("r/bird", 2))
      .toEqual(MOCK_BRANCHES[0]);
  });

  it("throws on invalid name", function() {
    expect(function() { BranchStore.getByName("foo"); })
      .toThrow();
    expect(function() { BranchStore.getByName(2, 2); })
      .toThrow();
    expect(function() { BranchStore.getByName("foo", -1); })
      .toThrow();
    expect(function() { BranchStore.getByName("foo", "bar"); })
      .toThrow();
  });

});
