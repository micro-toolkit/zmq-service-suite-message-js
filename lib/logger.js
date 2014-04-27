(function() {
  var util = require('util');

  var Logger = function(){
    var self = this;

    self.trace = function(){
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(console, args);
    };

    self.debug = function(){
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(console, args);
    };

    self.info = function(){
      var args = Array.prototype.slice.call(arguments);
      console.info.apply(console, args);
    };

    self.warn = function(){
      var args = Array.prototype.slice.call(arguments);
      console.warn.apply(console, args);
    };

    self.error = function(){
      var args = Array.prototype.slice.call(arguments);
      console.error.apply(console, args);
    };

  };

  var log = new Logger();

  module.exports = log;
}());
