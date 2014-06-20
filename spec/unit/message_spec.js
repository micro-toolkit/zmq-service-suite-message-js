describe('Message', function() {
  var Message = require('../../lib/message');
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
        "RID",
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
      expect(actual.rid).toEqual(frames[3]);
      expect(actual.address).toEqual(address);
      expect(actual.headers).toEqual(headers);
      expect(actual.status).toEqual(frames[6]);
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
        "RID",
        msgpack.encode(address),
        msgpack.encode(headers),
        200,
        msgpack.encode("payload")
      ];

      var formated = Message.parse(frames).toString();
      var expected = '********\nFRAME 0: identity\n';
      expected += 'FRAME 1: ZSS:0.0\n';
      expected += 'FRAME 2: REP\n';
      expected += 'FRAME 3: RID\n';
      expected += 'FRAME 4: {"sid":"service-id","sversion":"service-version","verb":"verb"}\n';
      expected += 'FRAME 5: {"X-REQ-ID":"request-id","X-RUNTIME":800}\n';
      expected += 'FRAME 6: 200\n';
      expected += 'FRAME 7: "payload"\n********';
      expect(formated).toEqual(expected);
    });
  });

  describe('#toFrames', function(){
    it('returns the message frames', function(){
      var frames = [
        "identity",
        "ZSS:0.0",
        "REP",
        "RID",
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
      expect(actual[3]).toEqual(frames[3]);
      expect(msgpack.decode(actual[4])).toEqual(msgpack.decode(frames[4]));
      expect(msgpack.decode(actual[5])).toEqual(msgpack.decode(frames[5]));
      expect(actual[6]).toEqual(frames[6]);
      expect(msgpack.decode(actual[7])).toEqual(msgpack.decode(frames[7]));
    });
  });
});
