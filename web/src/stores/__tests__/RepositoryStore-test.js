"use strict";

jest.dontMock("../../Dispatcher");
jest.dontMock("../RepositoryStore");

var REPOS = require("./REPOSITORIES").repositories;

describe("RepositoryStore", function() {

  var Dispatcher, RepositoryStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    RepositoryStore = require("../RepositoryStore");
  });

  var add = function(repositories) {
    Dispatcher.dispatch("RECEIVE_REPOSITORIES", {
      repositories: repositories
    });
  };

  it("can be accessed by id", function() {
    expect(RepositoryStore.getById(REPOS[1].id))
      .toBeUndefined();
    add(REPOS);
    expect(RepositoryStore.getById(REPOS[1].id))
      .toEqual(REPOS[1]);
    expect(RepositoryStore.getById(Number.MAX_SAFE_INTEGER))
      .toBeUndefined();
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
    expect(RepositoryStore.getByName(REPOS[0].name))
      .toBeUndefined();
    add(REPOS);
    expect(RepositoryStore.getByName(REPOS[2].name))
      .toEqual(REPOS[2]);
    expect(RepositoryStore.getByName("aldfjklajdflkjasdlkfj33flasdjbjk"))
      .toBeUndefined();
  });

  it("throws on invalid short-name", function() {
    expect(function() { RepositoryStore.getByName(); })
      .toThrow();
    expect(function() { RepositoryStore.getByName(1); })
      .toThrow();
  });

});
