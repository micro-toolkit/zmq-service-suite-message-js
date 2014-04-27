(function() {
  var util = require('util');
  var msgpack = require('msgpack-js');
  var uuid = require('uuid');
  var PROTOCOL_VERSION = 'ZSS:0.0';

  var Message = function(sid, sversion, verb, payload, headers, status){
    var self = this;

    self.identity = "id#" + uuid.v1();
    self.protocol = PROTOCOL_VERSION;
    self.type = "REQ";
    self.address = {
      sid: sid,
      sversion: sversion,
      verb: verb
    };
    self.headers = headers;
    self.status = status;
    self.payload = payload;

    self.toString = function(){
      var message = "********\nFRAME 0: %s\nFRAME 1: %s\nFRAME 2: %s\nFRAME 3: %j\nFRAME 4: %j\nFRAME 5: %s\nFRAME 6: %j\n********";
      return util.format(message, self.identity, self.protocol, self.type, self.address, self.headers, self.status, self.payload);
    };
  };

  Message.Type = {
    REQ: "REQ",
    REP: "REP"
  };

  Message.parse = function(frames){
    var msg = new Message();
    msg.identity = frames[0];
    msg.protocol = frames[1];
    msg.type = frames[2];
    msg.address = msgpack.decode(frames[3]);
    msg.headers = msgpack.decode(frames[4]);
    msg.status = frames[5];
    msg.payload = msgpack.decode(frames[6]);
    return msg;
  };

  module.exports = Message;
}());
