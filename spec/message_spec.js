describe('Message', function() {
  var Message = require('../lib/message');
  var msgpack = require('msgpack-js');

  var address = {
    sid: "service-id",
    sversion: "service-version",
    verb: "verb"
  };
  var headers = {
    "X-REQ-ID": "request-id",
    "X-RUNTIME": 800
  };

  describe('#parse', function(){
    it('returns a fullfilled message', function(){
      var payload = "data";
      var frames = [
        "identity",
        "ZSS:0.0",
        "REP",
        msgpack.encode(address),
        msgpack.encode(headers),
        200,
        msgpack.encode(payload)
      ];

      var actual = Message.parse(frames);

      expect(actual).toBeDefined();
      expect(actual.identity).toEqual(frames[0]);
      expect(actual.protocol).toEqual(frames[1]);
      expect(actual.type).toEqual(frames[2]);
      expect(actual.address).toEqual(address);
      expect(actual.headers).toEqual(headers);
      expect(actual.status).toEqual(frames[5]);
      expect(actual.payload).toEqual(payload);
    });
  });

  describe('#ctor', function(){
    it('returns a fullfilled message', function(){
      var payload = "data";

      var actual = new Message(address.sid, address.sversion, address.verb,
        payload, headers, 200);

      expect(actual).toBeDefined();
      expect(actual.identity).toBeDefined();
      expect(actual.protocol).toEqual("ZSS:0.0");
      expect(actual.type).toEqual("REQ");
      expect(actual.address).toEqual(address);
      expect(actual.headers).toEqual(headers);
      expect(actual.status).toEqual(200);
      expect(actual.payload).toEqual(payload);
    });
  });

  describe("#toString", function(){
    it('return formated string', function(){
      var frames = [
        "identity",
        "ZSS:0.0",
        "REP",
        msgpack.encode(address),
        msgpack.encode(headers),
        200,
        msgpack.encode("payload")
      ];

      var formated = Message.parse(frames).toString();
      var expected = '********\nFRAME 0: identity\n';
      expected += 'FRAME 1: ZSS:0.0\n';
      expected += 'FRAME 2: REP\n';
      expected += 'FRAME 3: {"sid":"service-id","sversion":"service-version","verb":"verb"}\n';
      expected += 'FRAME 4: {"X-REQ-ID":"request-id","X-RUNTIME":800}\n';
      expected += 'FRAME 5: 200\n';
      expected += 'FRAME 6: "payload"\n********';
      expect(formated).toEqual(expected);
    });
  });

  describe('#toFrames', function(){
    it('returns the message frames', function(){
      var frames = [
        "identity",
        "ZSS:0.0",
        "REP",
        msgpack.encode(address),
        msgpack.encode(headers),
        200,
        msgpack.encode("payload")
      ];

      var actual = Message.parse(frames).toFrames();

      expect(actual).toBeDefined();
      expect(actual[0]).toEqual(frames[0]);
      expect(actual[1]).toEqual(frames[1]);
      expect(actual[2]).toEqual(frames[2]);
      expect(msgpack.decode(actual[3])).toEqual(msgpack.decode(frames[3]));
      expect(msgpack.decode(actual[4])).toEqual(msgpack.decode(frames[4]));
      expect(actual[5]).toEqual(frames[5]);
      expect(msgpack.decode(actual[6])).toEqual(msgpack.decode(frames[6]));
    });
  });
});
