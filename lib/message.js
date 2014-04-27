(function() {
  var _ = require('lodash');
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
