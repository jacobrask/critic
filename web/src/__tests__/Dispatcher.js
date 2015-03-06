"use strict";

jest.dontMock("../Dispatcher");

describe("Dispatcher", function() {

  it("dispatches actions", function() {
    var Dispatcher = require("../Dispatcher");
    var callback = jest.genMockFunction();
    var callback2 = jest.genMockFunction();
    Dispatcher.register(callback);
    Dispatcher.register(callback2);
    Dispatcher.dispatch("FOO", { foo: "bar" });
    expect(callback).toBeCalledWith("FOO", { foo: "bar" });
    expect(callback2).toBeCalledWith("FOO", { foo: "bar" });
  });

});
