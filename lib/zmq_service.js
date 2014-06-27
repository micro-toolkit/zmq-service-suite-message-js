(function() {
  var zmq = require('zmq'),
      errors = require('../../core/lib/errors'),
      Logger = require('logger-facade-nodejs'),
      uuid = require('uuid'),
      _ = require('lodash'),
      Message = require('../../core/lib/message');

  var ZMQService = function(configuration){

    var log = Logger.getLogger('ZMQService');

    var defaults = {
      broker: 'tcp://127.0.0.1:5560',
      heartbeat: 1000,
      sid: null
    };

    var config = _.defaults(configuration, defaults);

    var identity = config.sid + "#" + uuid.v1();
    var socket = zmq.socket('dealer');
    var heartbeatIntervalObj;
    var socketClose = false;

    var onError = function(error){
      // reply with error
      log.error("Received zmq error => %s", error.stack);
    };

    var reply = function(message){
      message.type = Message.Type.REP;

      log.info("Reply to: %s with status: %s", message.identity, message.status);
      log.debug(message.toString());

      socket.send(message.toFrames());
    };

    var replyError = function(errorCode, message){
      var error = errors[errorCode.toString()];

      message.status = error.code;
      message.payload = error.body;

      reply(message);
    };

    var sendRequest = function(message){
      message.identity = identity;

      log.info("Sending %s to %s:%s",
        message.identity, message.address.sid, message.address.verb);
      log.debug(message.toString());

      socket.send(message.toFrames());
    };

    var onMessage = function(){
      var frames = _.toArray(arguments);
      var msg = Message.parse(frames);

      log.info("Received %s from: %s to: %s:%s",
        msg.type, msg.identity, msg.address.sid, msg.address.verb);

      log.debug(msg.toString());

      if(msg.type === Message.Type.REP) {
        log.info("Reply received from %s:%s with status %s",
          msg.address.sid, msg.address.verb, msg.status);

        // if is down message
        socketClose = (msg.address.sid === "SMI" && msg.address.verb === "DOWN");

        return;
      }

      var verb = this[msg.address.verb];
      var isValidAction = msg.address.sid === config.sid && verb != null;
      if(!isValidAction){
        // reply with error
        log.error("Invalid address => %j", msg.address);
        replyError(404, msg);
        return;
      }

      log.debug("Message routed to %s...", msg.address.verb);

      try {
        // TODO: replace sync execution by eventfull
        // check this http://stackoverflow.com/questions/7310521/node-js-best-practice-exception-handling
        msg.payload = verb(msg.payload, msg);
        // reply with success message
        msg.status = 200;
        reply(msg);
      }
      catch(error){
        // log.error("blow log");
        replyError(500, msg);
      }
    };

    // public methods

    this.run = function(){
      socket.identity = identity;
      socket.linger = 0;
      socket.on('message', onMessage.bind(this));
      socket.on('error', onError.bind(this));
      socket.connect(config.broker);

      log.info('%s connected to %s', identity, config.broker);

      // send announcement message
      var msg = new Message("SMI", "UP");
      msg.payload = config.sid;
      sendRequest(msg);

      // register heartbeat send
      heartbeatIntervalObj = setInterval(function() {
        var msg = new Message("SMI", "HEARTBEAT");
        msg.payload = config.sid;
        sendRequest(msg);
      }, config.heartbeat);
    };

    this.stop = function(){
      log.info('%s disconnecting from %s', identity, config.broker);

      // clear interval
      clearInterval(heartbeatIntervalObj);

      var msg = new Message("SMI", "DOWN");
      msg.payload = config.sid;
      sendRequest(msg);

      // wait for message reply
      var stoping = function() {

        if(socketClose){
          log.info('%s disconnected from %s', identity, config.broker);
          socket.close();
        }
        else {
          setTimeout(stoping, 500);
        }
      };
      stoping();
    };
  };

  module.exports = ZMQService;
}());
