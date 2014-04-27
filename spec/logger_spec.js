describe('Logger', function() {
  var log = require('../lib/logger');

  it('trace level outputs log into console.log', function(){
    spyOn(console, 'log');
    log.trace("LOG MESSAGE");
    expect(console.log).toHaveBeenCalledWith("LOG MESSAGE");
  });

  it('trace level outputs log into console.log with args', function(){
    spyOn(console, 'log');
    log.trace("LOG MESSAGE %s", 1);
    expect(console.log).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
  });

  it('debug level outputs log into console.log', function(){
    spyOn(console, 'log');
    log.debug("LOG MESSAGE");
    expect(console.log).toHaveBeenCalledWith("LOG MESSAGE");
  });

  it('debug level outputs log into console.log with args', function(){
    spyOn(console, 'log');
    log.debug("LOG MESSAGE %s", 1);
    expect(console.log).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
  });

  it('info level outputs log into console.info', function(){
    spyOn(console, 'info');
    log.info("LOG MESSAGE");
    expect(console.info).toHaveBeenCalledWith("LOG MESSAGE");
  });

  it('info level outputs log into console.info with args', function(){
    spyOn(console, 'info');
    log.info("LOG MESSAGE %s", 1);
    expect(console.info).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
  });

  it('warn level outputs log into console.warn', function(){
    spyOn(console, 'warn');
    log.warn("LOG MESSAGE");
    expect(console.warn).toHaveBeenCalledWith("LOG MESSAGE");
  });

  it('warn level outputs log into console.warn with args', function(){
    spyOn(console, 'warn');
    log.warn("LOG MESSAGE %s", 1);
    expect(console.warn).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
  });

  it('error level outputs log into console.error', function(){
    spyOn(console, 'error');
    log.error("LOG MESSAGE");
    expect(console.error).toHaveBeenCalledWith("LOG MESSAGE");
  });

  it('error level outputs log into console.error with args', function(){
    spyOn(console, 'error');
    log.error("LOG MESSAGE %s", 1);
    expect(console.error).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
  });
});
