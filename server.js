'use strict';

var express = require('express')
  , engine = require('engine.io')
  , http = require('http');

var port = process.env.chatport || 5000
  , app = express();
var httpserver = http.createServer(app);

httpserver.listen(port);

var server = engine.attach(httpserver);

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
  socket.on('message', function (data) {
//    io.sockets.emit('message', data);
  });

  socket.on('close', function() {
//    console.log(updatepeople(-1) + ' people connected');
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

