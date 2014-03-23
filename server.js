'use strict';

var express = require('express')
  , engine = require('engine.io')
  , http = require('http');

var app = express()
  , port = process.env.chatport || 5000;
  , http.createServer(app).listen(port);
  , server = engine.attach(http);

console.log('Listening on port ' + port);

// express stuff
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.get("/", function(req, res) {
  res.render("index");
});

app.use(express.static(__dirname + '/public'));

server.on('connection', function (socket) {
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });

  socket.on('disconnect', function() {
    console.log(updatepeople(-1) + ' people connected');
  });

  var updatepeople = function(offset) {
    if (!offset)
      offset = 0;

    var people = {};

    people.count = Object.keys(io.connected).length + offset;

    io.sockets.emit('people', people);

    return people.count;
  };

  console.log(updatepeople() + ' people connected');
});
