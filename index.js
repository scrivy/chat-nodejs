'use strict';

var express = require('express')
  , Primus = require('primus')
  , http = require('http')
  , chat = require('./lib/chat');

var port = process.env.chatport || 5000
  , app = express()
  , server = http.createServer(app);

server.listen(port);

var primus = new Primus(server, { transformer: 'engine.io' });
chat.init(primus);

console.log('Listening on port ' + port);

// express stuff
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.use(express.logger('dev'));
app.get("/", function(req, res) {
  res.render("index");
});

app.use(express.static(__dirname + '/public'));

primus.on('connection', function (spark) {
  console.log('socket opened');

  chat.sendclientcount();

  spark.on('data', function (message) {
    console.log('socket message - ' + message.action);

    if (!message.action || !message.data) {
      console.log('malformed socket message, disregarding');
      return;
    }

    switch (message.action) {
      case 'lobbymessage':
        chat.lobbymessage(message.data);
        break;


      default:
        console.log('socket message received, did not match an action');
        break;
    };


  });
});

primus.on('disconnection', function(spark) {
  console.log('socket closed');
  chat.sendclientcount();
});
