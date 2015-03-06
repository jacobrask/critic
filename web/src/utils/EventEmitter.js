"use strict";

/**
 * Listen to and emit events on an object.
 * You can easily inherit from this without caring about its constructor.
 *
 *     var MyEmitter = function() { };
 *     MyEmitter.prototype = Object.create(EventEmitter.prototype);
 *
 * @constructor
 */
var EventEmitter = function() {};

/**
 * Created when adding first event, to avoid the need of a constructor.
 * @type {Object}
 */
EventEmitter.prototype.events = null;


/**
 * Start listening to events of `type`.
 *
 * @param {string} type
 * @param {function} listener
 *
 * @return {EventEmitter}
 */

EventEmitter.prototype.addEventListener = function(type, listener) {
  if (!this.events) {
    Object.defineProperty(this, "events", { value: Object.create(null) });
  }
  if (!this.events[type]) {
    this.events[type] = new Set();
  }
  this.events[type].add(listener);
  return this;
};


/**
 * @method
 * @alias EventEmitter#addEventListener
 */
EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;


/**
 * Stop listening to events of `type`.
 *
 * @param {string} type
 * @param {function=} [listener=] If not specified, remove all `type` events.
 *
 * @return {EventEmitter} self
 */
EventEmitter.prototype.removeEventListener = function(type, listener) {
  if (!this.events || !this.events[type]) return this;
  if (!listener) this.events[type].clear();
  else this.events[type].delete(listener);
  return this;
};


/**
 * @method
 * @alias EventEmitter#removeEventListener
 */
EventEmitter.prototype.off = EventEmitter.prototype.removeEventListener;


/**
 * Invoke all events for the given event. A listener is not guaranteed to be
 * invoked if a previous listener threw an uncaught exception.
 *
 * @param {string|Event} evt Passed through to listener.
 * @param {...*} [args] Extra arguments for listener if `evt` is a string.
 *
 * @return {EventEmitter}
 */
EventEmitter.prototype.dispatchEvent = function (evt, args) {
  if (!this.events || !evt) return this;
  var type = typeof evt === "string" ? evt : evt.type;
  if (!this.events[type]) return this;
  if (type === evt) {
    args = Array.prototype.slice.call(arguments, 1);
  } else {
    args = [ evt ];
  }
  var context = this;
  this.events[type].forEach(function(listener) {
    if (typeof listener === "function") {
      listener.apply(context, args);
    }
  });
  return this;
};


/**
 * @method
 * @alias EventEmitter#dispatchEvent
 */
EventEmitter.prototype.emit = EventEmitter.prototype.dispatchEvent;


module.exports = EventEmitter;
