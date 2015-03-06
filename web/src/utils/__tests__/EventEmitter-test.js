"use strict";

jest.dontMock("../EventEmitter");
var EventEmitter = require("../EventEmitter");

describe("EventEmitter#on", function() {

  var em, listener;
  beforeEach(function() {
    em = new EventEmitter();
    listener = jest.genMockFn();
  });

  it("registers listeners", function() {
    em.on("hello", listener);
    em.emit("hello");
    expect(listener).toBeCalled();
  });

  it("does not register duplicate listeners", function() {
    em.on("hello", listener);
    em.on("hello", listener);
    em.emit("hello");
    expect(listener.mock.calls.length).toBe(1);
    em.emit("hello");
    expect(listener.mock.calls.length).toBe(2);
  });

});


describe("EventEmitter#off", function() {

  var em, listener, listener2;
  beforeEach(function() {
    em = new EventEmitter();
    listener = jest.genMockFn();
    listener2 = jest.genMockFn();
  });

  it("removes a single listener", function() {
    em.on("hello", listener);
    em.on("hello", listener2);
    em.off("hello", listener);
    em.emit("hello");
    expect(listener).not.toBeCalled();
    expect(listener2).toBeCalled();
  });

  it("removes many listeners", function() {
    em.on("hello", listener);
    em.on("hello", listener2);
    em.off("hello");
    em.emit("hello");
    expect(listener).not.toBeCalled();
    expect(listener2).not.toBeCalled();
  });

});


describe("EventEmitter#emit", function() {

  var em, listener;
  beforeEach(function() {
    em = new EventEmitter();
    listener = jest.genMockFn();
  });

  it("emits events with extra arguments", function() {
    em.on("hello", listener);
    em.emit("hello", 1, 2);
    expect(listener).toBeCalledWith(1, 2);
  });

});


describe("EventEmitter inheritance", function() {

  var listener;
  beforeEach(function() {
    listener = jest.genMockFn();
  });

  it("Object.create", function() {
    var em = Object.create(EventEmitter.prototype);
    em.on("hello", listener);
    em.emit("hello");
    expect(listener).toBeCalled();
  });

  it("Set prototype", function() {
    var em = function() {};
    Object.setPrototypeOf(em, EventEmitter.prototype);
    em.on("hello", listener);
    em.emit("hello");
    expect(listener).toBeCalled();
  });


});
