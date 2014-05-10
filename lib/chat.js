'use strict';

var primus;

var self = module.exports = {
  init: function(primustocache) {
    primus = primustocache;
    return;
  },

  lobbymessage: function(text) {
    var message = {
      action: 'lobbymessage',
      data: text
    };

    primus.write(message);
  },

  sendclientcount: function() {
    var message = {
      action: 'clientcount',
      data: primus.connected
    };

    primus.write(message);
  }




};







