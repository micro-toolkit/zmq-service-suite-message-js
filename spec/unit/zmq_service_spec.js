describe("ZMQService", function(){
  var ZMQService = require('../../lib/zmq_service');
  var zmq = require('zmq');
  var uuid = require('uuid');
  var _ = require('lodash');
  var msgpack = require('msgpack-js');
  var Message = require('../../lib/message');
  var log = require('../../lib/logger');

  var config = { sid: 'test-zmq', broker: "tcp://127.0.0.1:5561", heartbeat: 10000 };

  var IDENTITY_FRAME = 0,
      PROTOCOL_FRAME = 1,
      TYPE_FRAME     = 2,
      RID_FRAME      = 3,
      ADDRESS_FRAME  = 4,
      HEADERS_FRAME  = 5,
      STATUS_FRAME   = 6,
      PAYLOAD_FRAME  = 7;

  beforeEach(function(){
    spyOn(uuid, 'v1').andReturn("uuid");
    spyOn(log, 'trace').andReturn(Function.apply());
    spyOn(log, 'debug').andReturn(Function.apply());
    spyOn(log, 'info').andReturn(Function.apply());
    spyOn(log, 'warn').andReturn(Function.apply());
    spyOn(log, 'error').andReturn(Function.apply());
  });

  describe("#run", function(){

    describe('connects the zmq socket', function(){
      it('invoking socket connect', function(done) {
        spyOn(zmq, 'socket').andReturn({
          send: Function.apply(),
          on: Function.apply(),
          connect: function(uri) {
            done();
          }
        });

        new ZMQService(config).run();
      });

      it('with linger options set to 0', function(done) {
        spyOn(zmq, 'socket').andReturn({
          send: Function.apply(),
          on: Function.apply(),
          connect: function(uri) {
            expect(this.linger).toEqual(0);
            done();
          }
        });

        new ZMQService(config).run();
      });

      it('with setted identity', function(done) {
        spyOn(zmq, 'socket').andReturn({
          send: Function.apply(),
          on: Function.apply(),
          connect: function(uri) {
            expect(this.identity).toEqual("test-zmq#uuid");
            done();
          }
        });

        new ZMQService(config).run();
      });

      it('to the broker instance', function(done) {
        spyOn(zmq, 'socket').andReturn({
          send: Function.apply(),
          on: Function.apply(),
          connect: function(uri) {
            expect(uri).toEqual("tcp://127.0.0.1:5561");
            done();
          }
        });

        new ZMQService(config).run();
      });

    });

    describe('register callback', function(){

      it('on "message"', function(done) {
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          send: Function.apply(),
          on: function(type) {
            if (type === 'message') {
              done();
            }
          }
        });

        new ZMQService(config).run();
      });

      it('on "error"', function(done) {
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          send: Function.apply(),
          on: function(type) {
            if (type === 'error') {
              done();
            }
          }
        });

        new ZMQService(config).run();
      });
    });

    describe("send announcement message to broker", function(){

      it("with service identity filled",function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            expect(frames[IDENTITY_FRAME]).toEqual("test-zmq#uuid");
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with correct SMI address", function(done){
        var address = {
          sid: "SMI",
          sversion: "*",
          verb: "UP"
        };

        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            expect(msgpack.decode(frames[ADDRESS_FRAME])).toEqual(address);
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with type request", function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            expect(frames[TYPE_FRAME]).toEqual(Message.Type.REQ);
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with generated request id", function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            expect(frames[RID_FRAME]).toEqual("uuid");
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with null payload", function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            expect(msgpack.decode(frames[PAYLOAD_FRAME])).toBeFalsy();
            done();
          }
        });

        new ZMQService(config).run();
      });
    });

    describe("send async heartbeat messages", function(){
      var isHeartbeat = function(frames){
        var to = msgpack.decode(frames[ADDRESS_FRAME]);
        var address = {
          sid: "SMI",
          sversion: "*",
          verb: "HEARTBEAT"
        };

        return to.sid === address.sid && to.verb === address.verb;
      };

      beforeEach(function(){
        config.heartbeat = 100;
      });

      afterEach(function(){
        // reset to previous state
        config.heartbeat = 10000;
      });

      it('on intervale basis', function(done){
        var times = 0;

        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            // discard announcement message
            if (!isHeartbeat(frames)){
              return;
            }
            ++times;

            if(times === 2){
              done();
            }
          }
        });

        new ZMQService(config).run();
      });

      it("with service identity filled",function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            // discard announcement message
            if (!isHeartbeat(frames)){
              return;
            }

            expect(frames[IDENTITY_FRAME]).toEqual("test-zmq#uuid");
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with correct SMI address", function(done){
        var address = {
          sid: "SMI",
          sversion: "*",
          verb: "HEARTBEAT"
        };

        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            // discard announcement message
            if (!isHeartbeat(frames)){
              return;
            }

            expect(msgpack.decode(frames[ADDRESS_FRAME])).toEqual(address);
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with type request", function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            // discard announcement message
            if (!isHeartbeat(frames)){
              return;
            }

            expect(frames[TYPE_FRAME]).toEqual(Message.Type.REQ);
            done();
          }
        });

        new ZMQService(config).run();
      });

      it("with generated request id", function(done){
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          on: Function.apply(),
          send: function(frames) {
            // discard announcement message
            if (!isHeartbeat(frames)){
              return;
            }

            expect(frames[RID_FRAME]).toEqual("uuid");
            done();
          }
        });

        new ZMQService(config).run();
      });

    });
  });

  describe("#stop", function(){
    var isDownMessage = function(frames){
      var to = msgpack.decode(frames[ADDRESS_FRAME]);
      var address = {
        sid: "SMI",
        sversion: "*",
        verb: "DOWN"
      };

      return to.sid === address.sid && to.verb === address.verb;
    };

    it('close the zmq socket', function(done) {
      var onMessage;
      spyOn(zmq, 'socket').andReturn({
        send: function(frames){
          if (isDownMessage(frames)) {
            var msg = new Message("SMI", "DOWN");
            msg.status = 200;
            msg.type = Message.Type.REP;
            onMessage.apply(null, msg.toFrames());
          }
        },
        on: function(type, callback) {
          if (type === 'message') {
            onMessage = callback;
          }
        },
        connect: Function.apply(),
        close: function() {
          done();
        }
      });

      var target = new ZMQService(config);
      target.run();

      target.stop();
    });

    it('sends down message to broker', function(done) {
      var address = {
        sid: "SMI",
        sversion: "*",
        verb: "DOWN"
      };

      spyOn(zmq, 'socket').andReturn({
        send: function(frames){
          if(isDownMessage(frames)){
            expect(msgpack.decode(frames[ADDRESS_FRAME])).toEqual(address);
            done();
          }
        },
        on: Function.apply(),
        connect: Function.apply(),
        close: Function.apply()
      });

      var target = new ZMQService(config);
      target.run();

      target.stop();
    });

    it('send down message before closing socket', function(done) {
      var downSended = false;
      var onMessage;
      spyOn(zmq, 'socket').andReturn({
        send: function(frames){
          if (isDownMessage(frames)) {
            downSended = true;
            var msg = new Message("SMI", "DOWN");
            msg.status = 200;
            msg.type = Message.Type.REP;
            onMessage.apply(null, msg.toFrames());
          }
        },
        on: function(type, callback) {
          if (type === 'message') {
            onMessage = callback;
          }
        },
        connect: Function.apply(),
        close: function(){
          expect(downSended).toBeTruthy();
          done();
        }
      });

      var target = new ZMQService(config);
      target.run();

      target.stop();
    });
  });

  describe("#onMessage", function(){
    var address, frames, expectedMsg;

    beforeEach(function(){

      address = {
        sid: "test-zmq",
        sversion: "*",
        verb: "ping"
      };

      frames = [
        "identity",
        "ZSS:0.0",
        "REQ",
        "RID",
        msgpack.encode(address),
        msgpack.encode({}),
        null,
        msgpack.encode("data")
      ];

      expectedMsg = Message.parse(frames);
    });

    it('executes service verb with payload and message', function(done) {
      spyOn(zmq, 'socket').andReturn({
        connect: Function.apply(),
        send: Function.apply(),
        on: function(type, callback) {
          if (type === 'message') {
            callback.apply(null, frames);
          }
        }
      });
      var target = new ZMQService(config);
      target.ping = function(payload, message){
        expect(payload).toEqual(expectedMsg.payload);
        expect(message).toBeDefined();
        expect(message.identity).toEqual(expectedMsg.identity);
        expect(message.protocol).toEqual(expectedMsg.protocol);
        expect(message.type).toEqual(expectedMsg.type);
        expect(message.address).toEqual(expectedMsg.address);
        expect(message.headers).toEqual(expectedMsg.headers);
        expect(message.status).toEqual(expectedMsg.status);
        expect(message.payload).toEqual(expectedMsg.payload);
        done();
      };
      target.run();
    });

    it('logs reply information', function(){

      spyOn(zmq, 'socket').andReturn({
        send: Function.apply(),
        on: function(type, callback) {
          if (type === 'message') {
            var msg = new Message("SMI", "DOWN");
            msg.status = 200;
            msg.type = Message.Type.REP;
            callback.apply(null, msg.toFrames());
          }
        },
        connect: Function.apply(),
        close: Function.apply()
      });

      var target = new ZMQService(config);
      target.run();

      expect(log.info).toHaveBeenCalledWith("Reply received from %s:%s with status %s",
        "SMI", "DOWN", 200);
    });

    describe("with error on execution", function(){

      it('returns an error message for invalid sid', function(done) {
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          send: function(frames){
            if(frames[TYPE_FRAME] === Message.Type.REP) {
              expect(frames[STATUS_FRAME]).toEqual(404);
              done();
            }
          },
          on: function(type, callback) {
            if (type === 'message') {
              address.sid = "other-sid";
              frames[ADDRESS_FRAME] = msgpack.encode(address);
              callback.apply(null, frames);
            }
          }
        });
        var target = new ZMQService(config);
        target.run();
      });

      it('returns an error message for invalid verb', function(done) {
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          send: function(frames){
            if(frames[TYPE_FRAME] === Message.Type.REP) {
              expect(frames[STATUS_FRAME]).toEqual(404);
              done();
            }
          },
          on: function(type, callback) {
            if (type === 'message') {
              address.verb = "missing";
              frames[ADDRESS_FRAME] = msgpack.encode(address);
              callback.apply(null, frames);
            }
          }
        });
        var target = new ZMQService(config);
        target.run();
      });

      it('returns an error message on service exception', function(done) {
        spyOn(zmq, 'socket').andReturn({
          connect: Function.apply(),
          send: function(frames){
            if(frames[TYPE_FRAME] === Message.Type.REP) {
              expect(frames[STATUS_FRAME]).toEqual(500);
              done();
            }
          },
          on: function(type, callback) {
            if (type === 'message') {
              callback.apply(null, frames);
            }
          }
        });
        var target = new ZMQService(config);
        target.ping = function(){
          throw new Error("blow up");
        };
        target.run();
      });

      describe("logs an error", function(){

        it('on zmq error', function() {

          var error = new Error("BLOWS UP!");

          spyOn(zmq, 'socket').andReturn({
            connect: Function.apply(),
            send: Function.apply(),
            on: function(type, callback) {
              if (type === 'error') {
                callback(error);
              }
            }
          });

          var target = new ZMQService(config);
          target.run();

          expect(log.error).toHaveBeenCalledWith("Received zmq error => %s", error.stack);
        });

      });
    });

    describe("with successfull execution", function(){
      var socketMock;

      beforeEach(function(){
        socketMock = {
          connect: Function.apply(),
          on: function(type, callback) {
            if (type === 'message') {
              callback.apply(null, frames);
            }
          }
        };
      });

      it('returns status code 200 on successfull service execution', function(done) {
        socketMock.send = function(frames) {
          if(frames[TYPE_FRAME] === Message.Type.REP) {
            expect(frames[STATUS_FRAME]).toEqual(200);
            done();
          }
        };
        spyOn(zmq, 'socket').andReturn(socketMock);

        var target = new ZMQService(config);
        target.ping = function(payload, message){
          return "PONG";
        };

        target.run();
      });

      it('returns payload on successfull service execution', function(done) {
        socketMock.send = function(frames) {
          if(frames[TYPE_FRAME] === Message.Type.REP) {
            expect(msgpack.decode(frames[PAYLOAD_FRAME])).toEqual("PONG");
            done();
          }
        };
        spyOn(zmq, 'socket').andReturn(socketMock);

        var target = new ZMQService(config);
        target.ping = function(payload, message){
          return "PONG";
        };

        target.run();
      });

    });

  });
});
