var Express = require("express");
var app = Express();
var port = process.env.chatport || 3700;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.use(Express.favicon());
app.use(Express.logger('dev'));
app.use(Express.bodyParser());
app.use(Express.methodOverride());
app.get("/", function(req, res) {
  res.render("index");
});

app.use(Express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
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