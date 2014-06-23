describe('Logger', function() {
  var log = require('../../lib/logger');

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
