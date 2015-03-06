"use strict";

var EventEmitter = require("../../utils/EventEmitter");

/**
 * Mixin with methods for listening to and triggering changes on a store.
 *
 * Uses methods from `EventEmitter` without mixing them in, because stores
 * don't need to be regular event emitters.
 *
 * @mixin
 */
var Listenable = exports;


/**
 * Trigger a change event.
 *
 * @return {undefined}
 */
Listenable.didChange = function() {
  EventEmitter.prototype.emit.call(this, "change");
};


/**
 * Listen to changes.
 *
 * @param {function} listener
 *
 * @return {undefined}
 */
Listenable.listen = function(listener) {
  EventEmitter.prototype.on.call(this, "change", listener);
};


/**
 * Remove change listener.
 *
 * @param {function} listener
 *
 * @return {undefined}
 */
Listenable.unlisten = function(listener) {
  EventEmitter.prototype.off.call(this, "change", listener);
};
