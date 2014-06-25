describe('Logger', function() {
  var log = require('../../lib/logger');

  afterEach(function(){
    // restore the default log level
    log.level = log.DEBUG_LEVEL;
  });

  describe('#isTrace', function(){

    it('returns true if log level is trace', function(){
      log.level = log.TRACE_LEVEL;
      expect(log.isTrace()).toBe(true);
    });

    it('returns false if log level is higher than debug', function(){
      log.level = log.ERROR_LEVEL;
      expect(log.isTrace()).toBe(false);
    });

  });

  describe('#trace', function(){

    it('outputs log into console.log', function(){
      spyOn(console, 'log');
      log.trace("LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith("LOG MESSAGE");
    });

    it('outputs log into console.log with args', function(){
      spyOn(console, 'log');
      log.trace("LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
    });

  });

  describe('#isDebug', function(){

    it('returns true if log level is lower than debug', function(){
      log.level = log.TRACE_LEVEL;
      expect(log.isDebug()).toBe(true);
    });

    it('returns true if log level is debug', function(){
      log.level = log.DEBUG_LEVEL;
      expect(log.isDebug()).toBe(true);
    });

    it('returns false if log level is higher than debug', function(){
      log.level = log.ERROR_LEVEL;
      expect(log.isDebug()).toBe(false);
    });

  });

  describe('#debug', function(){

    it('outputs log into console.log', function(){
      spyOn(console, 'log');
      log.debug("LOG MESSAGE");
      expect(console.log).toHaveBeenCalledWith("LOG MESSAGE");
    });

    it('outputs log into console.log with args', function(){
      spyOn(console, 'log');
      log.debug("LOG MESSAGE %s", 1);
      expect(console.log).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
    });

  });

  describe('#isInfo', function(){

    it('returns true if log level is lower than info', function(){
      log.level = log.TRACE_LEVEL;
      expect(log.isInfo()).toBe(true);
    });

    it('returns true if log level is info', function(){
      log.level = log.INFO_LEVEL;
      expect(log.isInfo()).toBe(true);
    });

    it('returns false if log level is higher than info', function(){
      log.level = log.ERROR_LEVEL;
      expect(log.isInfo()).toBe(false);
    });

  });

  describe('#info', function(){

    it('outputs log into console.log', function(){
      spyOn(console, 'info');
      log.info("LOG MESSAGE");
      expect(console.info).toHaveBeenCalledWith("LOG MESSAGE");
    });

    it('outputs log into console.log with args', function(){
      spyOn(console, 'info');
      log.info("LOG MESSAGE %s", 1);
      expect(console.info).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
    });

  });

  describe('#isWarn', function(){

    it('returns true if log level is lower than warn', function(){
      log.level = log.TRACE_LEVEL;
      expect(log.isWarn()).toBe(true);
    });

    it('returns true if log level is warn', function(){
      log.level = log.WARN_LEVEL;
      expect(log.isWarn()).toBe(true);
    });

    it('returns false if log level is higher than warn', function(){
      log.level = log.ERROR_LEVEL;
      expect(log.isWarn()).toBe(false);
    });

  });

  describe('#warn', function(){

    it('outputs log into console.log', function(){
      spyOn(console, 'warn');
      log.warn("LOG MESSAGE");
      expect(console.warn).toHaveBeenCalledWith("LOG MESSAGE");
    });

    it('outputs log into console.log with args', function(){
      spyOn(console, 'warn');
      log.warn("LOG MESSAGE %s", 1);
      expect(console.warn).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
    });

  });

  describe('#isError', function(){

    it('returns true if log level is lower than error', function(){
      log.level = log.TRACE_LEVEL;
      expect(log.isError()).toBe(true);
    });

    it('returns true if log level is error', function(){
      log.level = log.ERROR_LEVEL;
      expect(log.isError()).toBe(true);
    });

  });

  describe('#error', function(){

    it('outputs log into console.log', function(){
      spyOn(console, 'error');
      log.error("LOG MESSAGE");
      expect(console.error).toHaveBeenCalledWith("LOG MESSAGE");
    });

    it('outputs log into console.log with args', function(){
      spyOn(console, 'error');
      log.error("LOG MESSAGE %s", 1);
      expect(console.error).toHaveBeenCalledWith("LOG MESSAGE %s", 1);
    });

  });
});
