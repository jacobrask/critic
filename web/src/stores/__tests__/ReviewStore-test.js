"use strict";

jest.dontMock("../ReviewStore");


describe("ReviewStore", function() {

  var MOCK_REVIEWS = [
    {
      id: 2,
      state: "open"
    }, {
      id: 4,
      state: "open"
    }, {
      id: 97,
      state: "dropped"
    }, {
      id: 99,
      state: "closed"
    }
  ];

  var add, ReviewStore;
  beforeEach(function() {
    var Dispatcher = require("../../Dispatcher");
    // Hijack the callback added in ReviewStore
    Dispatcher.register = function(callback) {
      add = callback.bind(null, "RECEIVE_REVIEWS");
    };
    ReviewStore = require("../ReviewStore");
  });


  it("can be accessed by id", function() {
    expect(ReviewStore.getById(10))
      .toBeUndefined();
    expect(ReviewStore.getById(2))
      .toBeUndefined();
    add({ reviews: MOCK_REVIEWS });
    expect(ReviewStore.getById(2))
      .toEqual(MOCK_REVIEWS[0]);
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
    add({ reviews: MOCK_REVIEWS });
    expect(ReviewStore.getAll())
      .toEqual(MOCK_REVIEWS);
  });

  it("can return reviews filtered by state", function() {
    expect(ReviewStore.getAllByState("open").length)
      .toBe(0);
    add({ reviews: MOCK_REVIEWS });
    expect(ReviewStore.getAllByState("open"))
      .toEqual(MOCK_REVIEWS.slice(0, 2));
    expect(ReviewStore.getAllByState("closed"))
      .toEqual([ MOCK_REVIEWS[3] ]);
  });

  it("throws on invalid state", function() {
    expect(function() { ReviewStore.getAllByState("foo"); })
      .toThrow();
    expect(function() { ReviewStore.getAllByState(); })
      .toThrow();
  });

});
