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
chat.attach(server);

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
  socket.on('message', function (message) {
    console.log('socket message - ' + message);

    switch (message.action) {
      case 'lobbymessage':
        
        break;


      default:
        console.log('socket message received, did not match an action');
        break;
    };


  });

  socket.on('close', function() {
//    console.log(updatepeople(-1) + ' people connected');
  console.log('closed socket');
  });

/*  var updatepeople = function(offset) {
    if (!offset)
      offset = 0;

    var people = {};

    people.count = Object.keys(io.connected).length + offset;

    io.sockets.emit('people', people);

    return people.count;
  }; */

//  console.log(updatepeople() + ' people connected');
});
