"use strict";

jest.dontMock("../CommitStore");


describe("CommitStore", function() {

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

  var add, CommitStore;
  beforeEach(function() {
    var Dispatcher = require("../../Dispatcher");
    // Hijack the callback added in CommitStore
    Dispatcher.register = function(callback) {
      add = callback.bind(null, "RECEIVE_COMMITS");
    };
    CommitStore = require("../CommitStore");
  });

  it("can be accessed by id", function() {
    expect(CommitStore.getById(10))
      .toBeUndefined();
    expect(CommitStore.getById(2))
      .toBeUndefined();
    add({ commits: MOCK_COMMITS });
    expect(CommitStore.getById(1))
      .toEqual(MOCK_COMMITS[0]);
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
    expect(CommitStore.getByIds([ 1, 2 ]))
      .toBeUndefined();
    expect(CommitStore.getByIds([ 1, 1000 ]))
      .toBeUndefined();
    add({ commits: MOCK_COMMITS });
    expect(CommitStore.getByIds([ 1, 2 ]))
      .toEqual(MOCK_COMMITS.slice(0, 2));
    expect(CommitStore.getByIds([ 1, 2, 3, 4 ]))
      .toEqual(MOCK_COMMITS);
    expect(CommitStore.getByIds([ 1, 1000 ]))
      .toBeUndefined();
  });

  it("can be accessed by sha-1", function() {
    expect(CommitStore.getBySHA1("abcd1234"))
      .toBeUndefined();
    expect(CommitStore.getBySHA1("3283b892f000bacda693d305e72b4329f16a2b8f"))
      .toBeUndefined();
    add({ commits: MOCK_COMMITS });
    expect(CommitStore.getBySHA1("3283b892f000bacda693d305e72b4329f16a2b8f"))
      .toEqual(MOCK_COMMITS[0]);
    expect(CommitStore.getBySHA1("3283b892f000b"))
      .toEqual(MOCK_COMMITS[0]);
    expect(CommitStore.getBySHA1("3283b892f"))
      .toEqual(MOCK_COMMITS[0]);
  });

  it("throws on invalid sha-1", function() {
    expect(function() { CommitStore.getBySHA1(); })
      .toThrow();
    expect(function() { CommitStore.getBySHA1(1); })
      .toThrow();
    expect(function() { CommitStore.getBySHA1(""); })
      .toThrow();
    expect(function() { CommitStore.getBySHA1("abcd"); })
      .toThrow();
  });

});
