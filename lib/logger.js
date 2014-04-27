(function() {
  var Logger = function(){ };

  Logger.prototype.trace = function(msg){
    console.trace(msg);
  };

  Logger.prototype.debug = function(msg){
    console.log(msg);
  };

  Logger.prototype.info = function(msg){
    console.info(msg);
  };

  Logger.prototype.warn = function(msg){
    console.warn(msg);
  };

  Logger.prototype.error = function(msg){
    console.error(msg);
  };

  var log = new Logger();

  module.exports = log;
}());
