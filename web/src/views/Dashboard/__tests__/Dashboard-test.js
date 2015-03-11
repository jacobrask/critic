"use strict";

jest.dontMock("../Dashboard");
jest.dontMock("../../mixins/RequestMixin");

var constants = require("../../../constants");


describe("Dashboard component", function() {

  var Dashboard, React, ReviewActions, TU;
  beforeEach(function() {
    React = require("../../../deps/react");
    TU = React.addons.TestUtils;
    ReviewActions = require("../../../actions/ReviewActions");
    ReviewActions.fetchAll.mockReturnValue(new Promise(function() {}));
    Dashboard = React.createFactory(require("../Dashboard"));
  });


  it("requests to fetch reviews", function() {
    TU.renderIntoDocument(
      Dashboard({ reviewStates: [ "open" ] })
    );
    expect(ReviewActions.fetchAll)
      .toBeCalledWith(
        { state: [ "open" ] },
        [
          constants.ReviewIncludes.BRANCHES,
          constants.ReviewIncludes.REPOSITORIES
        ]
      );
  });

});
