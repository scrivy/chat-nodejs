'use strict';

var express = require('express')
  , engine = require('engine.io')
  , http = require('http')
  , chat = require('./lib/chat');

var port = process.env.chatport || 5000
  , app = express();
var httpserver = http.createServer(app);

httpserver.listen(port);

var server = engine.attach(httpserver);
chat.init(server);

console.log('Listening on port ' + port);

// express stuff
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.use(express.logger('dev'));
app.get("/", function(req, res) {
  res.render("index");
});

app.use(express.static(__dirname + '/public'));

server.on('connection', function (socket) {
  console.log('socket opened');

  chat.sendclientcount();

  socket.on('message', function (message) {
    console.log('socket message - ' + message);

    try {
      message = JSON.parse(message);
      if (typeof message.action !== 'string' || !message.data) {
        throw new Error('malformed web socket message');
      }
    } catch (err) {
      console.log(err.toString());
      return;
    };

    switch (message.action) {
      case 'lobbymessage':
        chat.lobbymessage(message.data);
        break;


      default:
        console.log('socket message received, did not match an action');
        break;
    };


  });

  socket.on('close', function() {
    console.log('socket closed');
    chat.sendclientcount();
  });
});
