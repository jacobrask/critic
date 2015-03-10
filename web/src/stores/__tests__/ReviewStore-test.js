"use strict";

jest.dontMock("../../Dispatcher");
jest.dontMock("../ReviewStore");

var OPEN_REVIEWS = require("./OPEN_REVIEWS").reviews;
var CLOSED_REVIEWS = require("./CLOSED_REVIEWS").reviews;


describe("ReviewStore", function() {

  var Dispatcher, ReviewStore;
  beforeEach(function() {
    Dispatcher = require("../../Dispatcher");
    ReviewStore = require("../ReviewStore");
  });

  var add = function(reviews) {
    Dispatcher.dispatch("RECEIVE_REVIEWS", {
      reviews: reviews
    });
  };

  it("can be accessed by id", function() {
    expect(ReviewStore.getById(10))
      .toBeUndefined();
    expect(ReviewStore.getById(OPEN_REVIEWS[0].id))
      .toBeUndefined();
    add(OPEN_REVIEWS);
    expect(ReviewStore.getById(OPEN_REVIEWS[0].id))
      .toEqual(OPEN_REVIEWS[0]);
  });

  it("throws on invalid id", function() {
    expect(function() { ReviewStore.getById(); })
      .toThrow();
    expect(function() { ReviewStore.getById(-10); })
      .toThrow();
    expect(function() { ReviewStore.getById(0); })
      .toThrow();
    expect(function() { ReviewStore.getById("name"); })
      .toThrow();
  });

  it("can return all reviews", function() {
    expect(ReviewStore.getAll().length).toBe(0);
    add(OPEN_REVIEWS);
    expect(ReviewStore.getAll())
      .toEqual(OPEN_REVIEWS);
  });

  it("can return reviews filtered by state", function() {
    expect(ReviewStore.getAllByState("open"))
      .toEqual([]);
    add(OPEN_REVIEWS);
    expect(ReviewStore.getAllByState("open"))
      .toEqual(OPEN_REVIEWS);
    expect(ReviewStore.getAllByState("closed"))
      .toEqual([]);
    add(CLOSED_REVIEWS);
    expect(ReviewStore.getAllByState("closed"))
      .toEqual(CLOSED_REVIEWS);
  });

  it("throws on invalid state", function() {
    expect(function() { ReviewStore.getAllByState("foo"); })
      .toThrow();
    expect(function() { ReviewStore.getAllByState(); })
      .toThrow();
  });

});
