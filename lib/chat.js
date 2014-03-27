'use strict';



var self = module.exports = {
  wsresponse: function(message) {
    if (validwsactions.indexOf(message.action) !== -1) {
      wsactions[message.action](message.data);
    }
  }
};


var wsactions = {
  lobbymessage: function(message) {


  }





}



var validwsactions = Object.keys(websocketactions); 
