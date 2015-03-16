"use strict";

var BRANCHES = require("./BRANCHES").branches;


describe("BranchStore", function() {

  var Dispatcher, BranchStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    BranchStore = require("../BranchStore");
  });

  var add = function(branches) {
    Dispatcher.dispatch("RECEIVE_BRANCHES", {
      branches: branches
    });
  };

  it("can be accessed by id", function() {
    expect(BranchStore.getById(BRANCHES[1].id))
      .toBeUndefined();
    add(BRANCHES);
    expect(BranchStore.getById(BRANCHES[1].id))
      .toEqual(BRANCHES[1]);
    expect(BranchStore.getById(Number.MAX_SAFE_INTEGER))
      .toBeUndefined();
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
    add(BRANCHES);
    expect(BranchStore.getByName(BRANCHES[2].name, BRANCHES[2].repository))
      .toEqual(BRANCHES[2]);
    expect(BranchStore.getByName(BRANCHES[2].name, BRANCHES[2].repository + 1))
      .toBeUndefined();
    expect(BranchStore.getByName("no_such_branch", Number.MAX_SAFE_INTEGER))
      .toBeUndefined();
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
