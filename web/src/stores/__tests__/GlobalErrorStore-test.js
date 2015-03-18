"use strict";


describe("GlobalErrorStore", function() {

  var Dispatcher, GlobalErrorStore, NetworkError;
  beforeEach(function() {
    NetworkError = require("../../errors/NetworkError");
    Dispatcher = require("../../Dispatcher");
    GlobalErrorStore = require("../GlobalErrorStore");
  });

  it("adds network errors", function() {
    expect(GlobalErrorStore.getAll())
      .toEqual([]);
    Dispatcher.dispatch("ACTION", { error: new NetworkError("foo") });
    expect(GlobalErrorStore.getAll())
      .toEqual([ new NetworkError("foo") ]);
  });


});
