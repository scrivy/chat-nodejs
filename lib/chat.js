'use strict';


var server;

var broadcast = function(message) {
  var clients = Object.keys(server.clients);

  clients.forEach(function(client) {
    server.clients[client].send(JSON.stringify(message));
  });
};

var self = module.exports = {
  init: function(servertocache) {
    server = servertocache;
    return server;
  },

  lobbymessage: function(text) {
    var message = {
      action: 'lobbymessage',
      data: text
    };

    broadcast(message);
  },

  sendclientcount: function() {
    var message = {
      action: 'clientcount',
      data: server.clientsCount.toString()
    };

    broadcast(message);
  }




};







