"use strict";

jest.dontMock("../../Dispatcher");
jest.dontMock("../UserStore");

var USERS = require("./USERS").users;


describe("UserStore", function() {

  var Dispatcher, UserStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    UserStore = require("../UserStore");
  });

  var add = function(users) {
    Dispatcher.dispatch("RECEIVE_USERS", {
      users: users
    });
  };

  it("can be accessed by id", function() {
    expect(UserStore.getById(USERS[1].id))
      .toBeUndefined();
    add(USERS);
    expect(UserStore.getById(USERS[1].id))
      .toEqual(USERS[1]);
    expect(UserStore.getById(Number.MAX_SAFE_INTEGER))
      .toBeUndefined();
  });

  it("throws on invalid id", function() {
    expect(function() { UserStore.getById(); })
      .toThrow();
    expect(function() { UserStore.getById(-10); })
      .toThrow();
    expect(function() { UserStore.getById(0); })
      .toThrow();
    expect(function() { UserStore.getById("name"); })
      .toThrow();
  });

});
