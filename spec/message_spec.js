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
});
