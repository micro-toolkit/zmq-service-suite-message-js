describe('Logger', function() {
  var log = require('../lib/logger');
  var message = "LOG MESSAGE";

  it('trace level outputs log into console.trace', function(){
    spyOn(console, 'trace');
    log.trace(message);
    expect(console.trace).toHaveBeenCalledWith(message);
  });

  it('debug level outputs log into console.log', function(){
    spyOn(console, 'log');
    log.debug(message);
    expect(console.log).toHaveBeenCalledWith(message);
  });

  it('info level outputs log into console.info', function(){
    spyOn(console, 'info');
    log.info(message);
    expect(console.info).toHaveBeenCalledWith(message);
  });

  it('warn level outputs log into console.warn', function(){
    spyOn(console, 'warn');
    log.warn(message);
    expect(console.warn).toHaveBeenCalledWith(message);
  });

  it('error level outputs log into console.error', function(){
    spyOn(console, 'error');
    log.error(message);
    expect(console.error).toHaveBeenCalledWith(message);
  });
});
