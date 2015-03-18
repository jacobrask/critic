"use strict";

var React = require("../../deps/react");

var DOM = React.DOM;


var GlobalError = React.createClass({

  displayName: "GlobalError",

  mixins: [
    React.addons.PureRenderMixin,
  ],

  propTypes: {
    error: React.PropTypes.object
  },


  render: function() {
    var err = this.props.error;
    return DOM.div({ className: "GlobalError" },
      DOM.b(null, err.name, ": "),
      err.message
    );
  }

});


module.exports = GlobalError;
