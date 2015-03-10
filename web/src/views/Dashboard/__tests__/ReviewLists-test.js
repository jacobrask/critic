"use strict";

jest.dontMock("../ReviewLists");
jest.dontMock("../../mixins/createStoreMixin");

var React = require("../../../deps/react");
var TU = React.addons.TestUtils;
var constants = require("../../../constants");

var LoadState = constants.LoadState;


describe("ReviewLists component", function() {

  var OPEN_REVIEWS = [ {
      id: 2,
      branch: 5,
      state: "open"
    }, {
      id: 4,
      branch: 7,
      state: "open"
  } ];
  var DROPPED_REVIEWS = [ {
      id: 97,
      branch: 4,
      state: "dropped"
  } ];
  var CLOSED_REVIEWS = [ {
      id: 99,
      branch: 1,
      state: "closed"
  } ];


  describe("from stores", function() {

    var BranchStore, ReviewLists, ReviewStore;
    beforeEach(function() {
      BranchStore = require("../../../stores/BranchStore");
      ReviewStore = require("../../../stores/ReviewStore");
      ReviewStore.getAllByState
        .mockReturnValue(OPEN_REVIEWS);
      ReviewLists = React.createFactory(require("../ReviewLists"));
    });

    it("gets reviews", function() {
      TU.renderIntoDocument(ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open" ]
      }));
      expect(ReviewStore.getAllByState)
        .toBeCalledWith("open");
    });

    it("gets branches", function() {
      TU.renderIntoDocument(ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open" ]
      }));
      expect(BranchStore.getById)
        .toBeCalledWith(5);
    });

  });


  describe("adds to component state", function() {

    var ReviewLists, ReviewStore;
    beforeEach(function() {
      ReviewStore = require("../../../stores/ReviewStore");
      ReviewStore.getAllByState
        .mockImplementation(function(state) {
          switch (state) {
            case "open": return OPEN_REVIEWS;
            case "dropped": return DROPPED_REVIEWS;
            case "closed": return CLOSED_REVIEWS;
          }
        });
      ReviewLists = React.createFactory(require("../ReviewLists"));
    });

    it("reviews with matching review state", function() {
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open" ]
        })
      );
      expect(listsComponent.state.reviews.open)
        .toEqual(OPEN_REVIEWS);
      expect(listsComponent.state.reviews.closed)
        .toBeUndefined();
    });

    it("populates state with reviews of suitable states", function() {
      var listsComponent = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open", "closed" ]
        })
      );
      expect(listsComponent.state.reviews.open)
        .toEqual(OPEN_REVIEWS);
      expect(listsComponent.state.reviews.closed)
        .toEqual(CLOSED_REVIEWS);
    });

  });


  describe("rendering", function() {

    var BranchStore, ReviewList, ReviewLists, ReviewStore;
    beforeEach(function() {
      BranchStore = require("../../../stores/BranchStore");
      BranchStore.getById
        .mockReturnValue({ id: 5, name: "foo" });
      ReviewStore = require("../../../stores/ReviewStore");
      ReviewStore.getAllByState
        .mockImplementation(function(state) {
          switch (state) {
            case "open": return OPEN_REVIEWS;
            case "dropped": return DROPPED_REVIEWS;
            case "closed": return CLOSED_REVIEWS;
          }
        });
      ReviewList = require("../ReviewList");
      TU.mockComponent(ReviewList);
      ReviewLists = React.createFactory(require("../ReviewLists"));
    });

    it("renders list components", function() {
      var lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open" ]
        })
      );
      expect(TU.scryRenderedComponentsWithType(lists, ReviewList).length)
        .toBe(1);
      lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open", "closed" ]
        })
      );
      expect(TU.scryRenderedComponentsWithType(lists, ReviewList).length)
        .toBe(2);
    });

    it("passes reviews to lists", function() {
      var lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "open" ]
        })
      );
      var list = TU.findRenderedComponentWithType(lists, ReviewList);
      expect(list.props.reviews[0].id)
        .toBe(OPEN_REVIEWS[0].id);
    });

    it("passes branch names to lists", function() {
      var lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.COMPLETE,
          states: [ "closed" ]
        })
      );
      var list = TU.findRenderedComponentWithType(lists, ReviewList);
      var firstClosedReviewId = CLOSED_REVIEWS[0].branch;
      expect(list.props.branchNames[firstClosedReviewId])
        .toBe("foo");
    });

  });


  describe("load state", function() {

    var LoadIndicator, ReviewLists;
    beforeEach(function() {
      LoadIndicator = require("../../shared/LoadIndicator");
      TU.mockComponent(LoadIndicator);
      ReviewLists = React.createFactory(require("../ReviewLists"));
    });

    it("renders loading indicator", function() {
      var lists = TU.renderIntoDocument(
        ReviewLists({
          loadState: LoadState.LOADING,
          states: [ "open" ]
        })
      );
      expect(TU.scryRenderedComponentsWithType(lists, LoadIndicator).length)
        .toBe(1);
    });

  });


});
