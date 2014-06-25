(function() {

  var Logger = function(){

    this.level = this.DEBUG_LEVEL;


    var isLevelActive = function(logLevel) {
      return this.level <= logLevel;
    }.bind(this);

    // TODO: implement log restriction based on level
    this.isTrace = function(){
      return isLevelActive(this.TRACE_LEVEL);
    };

    this.isDebug = function(){
      return isLevelActive(this.DEBUG_LEVEL);
    };

    this.isInfo = function(){
      return isLevelActive(this.INFO_LEVEL);
    };

    this.isWarn = function(){
      return isLevelActive(this.WARN_LEVEL);
    };

    this.isError = function(){
      return isLevelActive(this.ERROR_LEVEL);
    };

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

  Logger.prototype.TRACE_LEVEL = 0;
  Logger.prototype.DEBUG_LEVEL = 1;
  Logger.prototype.INFO_LEVEL = 2;
  Logger.prototype.WARN_LEVEL = 3;
  Logger.prototype.ERROR_LEVEL = 4;

  var log = new Logger();

  module.exports = log;
}());
