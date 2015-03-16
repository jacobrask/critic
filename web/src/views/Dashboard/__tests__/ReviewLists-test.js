"use strict";

jest.dontMock("../../mixins/createStoreMixin");
jest.dontMock("../ReviewLists");

// Lists of reviews including `linked` branches and repositories.
var OPEN = require("./OPEN_REVIEWS");
var CLOSED = require("./CLOSED_REVIEWS");

var constants = require("../../../constants");


describe("ReviewLists component", function() {

  var Dispatcher, React, ReviewLists, TU;
  beforeEach(function() {
    React = require("../../../deps/react");
    TU = React.addons.TestUtils;
    Dispatcher = require("../../../Dispatcher");
  });

  // Populate the stores that ReviewLists will access.
  var add = function(list) {
    Dispatcher.dispatch("RECEIVE_REPOSITORIES", {
      repositories: list.linked.repositories
    });
    Dispatcher.dispatch("RECEIVE_BRANCHES", {
      branches: list.linked.branches
    });
    Dispatcher.dispatch("RECEIVE_REVIEWS", {
      reviews: list.reviews
    });
  };


  describe("stores and state", function() {

    beforeEach(function() {
      ReviewLists = React.createFactory(require("../ReviewLists"));
    });


    it("gets only reviews with matching review state", function() {
      add(OPEN);
      add(CLOSED);
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "open" ]
        })
      );
      var open = listsComponent.state.itemsByState.open;
      expect(open.map(function(item) { return item.review; }))
        .toEqual(OPEN.reviews);
      expect(listsComponent.state.itemsByState.closed)
        .toBeUndefined();
    });


    it("gets reviews with matching review state", function() {
      add(CLOSED);
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "closed", "open" ]
        })
      );
      var closed = listsComponent.state.itemsByState.closed;
      expect(closed.map(function(item) { return item.review; }))
        .toEqual(CLOSED.reviews);
      expect(listsComponent.state.itemsByState.open)
        .toEqual([]);
    });


    it("gets branches for reviews", function() {
      add(OPEN);
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "closed", "open" ]
        })
      );
      var open = listsComponent.state.itemsByState.open;
      expect(open.map(function(item) { return item.branch; }))
        .toEqual(OPEN.linked.branches);
    });


    it("gets repositories for reviews", function() {
      add(OPEN);
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "closed", "open" ]
        })
      );
      var open = listsComponent.state.itemsByState.open;
      expect(open.map(function(item) { return item.repository; }))
        .toContain(OPEN.linked.repositories[0]);
    });


    it("updates component state when stores update", function() {
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "closed", "open" ]
        })
      );
      var closed = listsComponent.state.itemsByState.closed;
      var open = listsComponent.state.itemsByState.open;
      expect(closed)
        .toEqual([]);
      expect(open)
        .toEqual([]);

      add(OPEN);
      closed = listsComponent.state.itemsByState.closed;
      open = listsComponent.state.itemsByState.open;
      expect(closed)
        .toEqual([]);
      expect(open.map(function(item) { return item.review; }))
        .toEqual(OPEN.reviews);

    });

  });


  describe("rendering", function() {

    var ReviewList;
    beforeEach(function() {
      ReviewList = require("../ReviewList");
      TU.mockComponent(ReviewList);
      ReviewLists = React.createFactory(require("../ReviewLists"));
    });


    it("renders list components", function() {
      var lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "open" ]
        })
      );
      expect(TU.scryRenderedComponentsWithType(lists, ReviewList).length)
        .toBe(0);

      add(OPEN);
      expect(TU.scryRenderedComponentsWithType(lists, ReviewList).length)
        .toBe(1);

      lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: constants.LoadState.COMPLETE,
          states: [ "closed", "open" ]
        })
      );

      add(CLOSED);
      expect(TU.scryRenderedComponentsWithType(lists, ReviewList).length)
        .toBe(2);
    });

  });

});
