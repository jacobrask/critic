"use strict";

jest.dontMock("../RepositoryStore");


describe("RepositoryStore", function() {

  var MOCK_REPOS = [
    {
      id: 1,
      name: "critic"
    }, {
      id: 2,
      name: "chosen"
    }, {
      id: 55,
      name: "foo-bar-baz"
    }
  ];

  var add, RepositoryStore;
  beforeEach(function() {
    var Dispatcher = require("../../Dispatcher");
    // Hijack the callback added in RepositoryStore
    Dispatcher.register = function(callback) {
      add = callback.bind(null, "RECEIVE_REPOSITORIES");
    };
    RepositoryStore = require("../RepositoryStore");
  });

  it("can be accessed by id", function() {
    expect(RepositoryStore.getById(10))
      .toBeUndefined();
    expect(RepositoryStore.getById(2))
      .toBeUndefined();
    add({ repositories: MOCK_REPOS });
    expect(RepositoryStore.getById(1))
      .toEqual(MOCK_REPOS[0]);
  });

  it("throws on invalid id", function() {
    expect(function() { RepositoryStore.getById(); })
      .toThrow();
    expect(function() { RepositoryStore.getById(-10); })
      .toThrow();
    expect(function() { RepositoryStore.getById(0); })
      .toThrow();
    expect(function() { RepositoryStore.getById("critic"); })
      .toThrow();
  });

  it("can be accessed by short-name", function() {
    expect(RepositoryStore.getByName("critic"))
      .toBeUndefined();
    add({ repositories: MOCK_REPOS });
    expect(RepositoryStore.getByName("critic"))
      .toEqual(MOCK_REPOS[0]);
    expect(RepositoryStore.getByName("chosen"))
      .toEqual(MOCK_REPOS[1]);
  });

  it("throws on invalid short-name", function() {
    expect(function() { RepositoryStore.getByName(); })
      .toThrow();
    expect(function() { RepositoryStore.getByName(1); })
      .toThrow();
  });

});
