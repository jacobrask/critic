"use strict";

jest.dontMock("../Listenable");
jest.dontMock("../../../utils/EventEmitter");

var Listenable = require("../Listenable");


describe("Listenable", function() {

  var listenable, listener, listener2;
  beforeEach(function() {
    listenable = Object.assign({}, Listenable);
    listener = jest.genMockFn();
    listener2 = jest.genMockFn();
  });

  it("registers listeners", function() {
    listenable.listen(listener);
    listenable.didChange();
    expect(listener).toBeCalled();
  });

  it("unregisters listeners", function() {
    listenable.listen(listener);
    listenable.listen(listener2);
    listenable.unlisten(listener);
    listenable.didChange();
    expect(listener).not.toBeCalled();
    expect(listener2).toBeCalled();
  });

});
