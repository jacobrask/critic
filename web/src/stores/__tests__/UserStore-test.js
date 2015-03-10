"use strict";

jest.dontMock("../UserStore");


describe("UserStore", function() {

  var MOCK_USERS = [
    {
      id: 2,
      name: "Jane Doe"
    }, {
      id: 99,
      name: "Jeff"
    }
  ];


  var add, UserStore;
  beforeEach(function() {
    var Dispatcher = require("../../Dispatcher");
    // Hijack the callback added in UserStore
    Dispatcher.register = function(callback) {
      add = callback.bind(null, "RECEIVE_USERS");
    };
    UserStore = require("../UserStore");
  });

  it("can be accessed by id", function() {
    add({ users: MOCK_USERS });
    expect(UserStore.getById(10))
      .toBeUndefined();
    expect(UserStore.getById(99))
      .toEqual(MOCK_USERS[1]);
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
