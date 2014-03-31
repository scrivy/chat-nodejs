'use strict';

var assert = require('chai').assert
  , chat = require('../lib/chat.js')
  , engine = require('engine.io')
  , http = require('http')
  , ws = require('ws');

var httpserver = http.createServer();
httpserver.listen(9999);

var server = engine.attach(httpserver);

describe('chat', function() {
  describe('#init()', function() {
    it('should cache an engineio server and return the server reference', function() {
      assert(chat.init(server) instanceof engine.Server, 'cached server is an instance of engine.Server');
    });
  });

  describe('#lobbymessage', function() {
    it('should send a message to all websocket clients', function() {
      
    });
  });
});
