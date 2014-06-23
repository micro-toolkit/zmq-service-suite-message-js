(function() {

  var Logger = function(){

    this.trace = function(){
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(console, args);
    };

    this.debug = function(){
      var args = Array.prototype.slice.call(arguments);
      console.log.apply(console, args);
    };

    this.info = function(){
      var args = Array.prototype.slice.call(arguments);
      console.info.apply(console, args);
    };

    this.warn = function(){
      var args = Array.prototype.slice.call(arguments);
      console.warn.apply(console, args);
    };

    this.error = function(){
      var args = Array.prototype.slice.call(arguments);
      console.error.apply(console, args);
    };

  };

  var log = new Logger();

  module.exports = log;
}());
