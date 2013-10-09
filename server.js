var Express = require("express");
var app = Express();
var port = process.env.PORT || 3700;

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

io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});