"use strict";

jest.dontMock("../../Dispatcher");
jest.dontMock("../CommitStore");

var COMMITS = require("./COMMITS").commits;

describe("CommitStore", function() {

  var getIds = function(xs) { return xs.map(function(x) { return x.id; }); };

  var Dispatcher, CommitStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    CommitStore = require("../CommitStore");
  });

  var add = function(commits) {
    Dispatcher.dispatch("RECEIVE_COMMITS", {
      commits: commits
    });
  };

  it("can be accessed by id", function() {
    expect(CommitStore.getById(Number.MAX_SAFE_INTEGER))
      .toBeUndefined();
    expect(CommitStore.getById(COMMITS[0].id))
      .toBeUndefined();
    add(COMMITS);
    expect(CommitStore.getById(COMMITS[0].id))
      .toEqual(COMMITS[0]);
  });

  it("throws on invalid id", function() {
    expect(function() { CommitStore.getById(); })
      .toThrow();
    expect(function() { CommitStore.getById(-10); })
      .toThrow();
    expect(function() { CommitStore.getById(0); })
      .toThrow();
    expect(function() { CommitStore.getById("name"); })
      .toThrow();
  });

  it("can be accessed by array of ids", function() {
    expect(CommitStore.getByIds([ COMMITS[0].id, COMMITS[1].id ]))
      .toBeUndefined();
    add(COMMITS);
    expect(CommitStore.getByIds([ COMMITS[0].id ]))
      .toEqual([ COMMITS[0] ]);
    expect(CommitStore.getByIds(getIds(COMMITS)))
      .toEqual(COMMITS);
  });

  it("returns undefined if any commit is missing in array of ids", function() {
    add(COMMITS);
    expect(CommitStore.getByIds([ COMMITS[0].id, Number.MAX_SAFE_INTEGER ]))
      .toBeUndefined();
  });

  it("can be accessed by sha-1", function() {
    expect(CommitStore.getBySHA1(COMMITS[0].sha1))
      .toBeUndefined();
    add(COMMITS);
    expect(CommitStore.getBySHA1(COMMITS[0].sha1))
      .toEqual(COMMITS[0]);
    expect(CommitStore.getBySHA1(COMMITS[1].sha1.slice(0, 12)))
      .toEqual(COMMITS[1]);
    expect(CommitStore.getBySHA1(COMMITS[2].sha1.slice(0, 8)))
      .toEqual(COMMITS[2]);
  });

  it("throws on invalid sha-1", function() {
    expect(function() { CommitStore.getBySHA1(); })
      .toThrow();
    expect(function() { CommitStore.getBySHA1(1); })
      .toThrow();
    expect(function() { CommitStore.getBySHA1(""); })
      .toThrow();
    expect(function() { CommitStore.getBySHA1(COMMITS[2].sha1.slice(0, 7)); })
      .toThrow();
  });

});
