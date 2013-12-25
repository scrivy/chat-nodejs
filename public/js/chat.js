(function($){

  var socket = io.connect('');

  // Lobby Model
  // ----------

  var LobbyModel = Backbone.Model.extend({
    defaults: function() {
      return {
        name: 'nameless',
        key: 'keyless',
        peoplecount: 1
      };
    }
  });

  var LobbyView = Backbone.View.extend({
    el: $('#content'),

    initialize: function() {
      _.bindAll(this, 'sendmessage');

      var that = this;

      // chat session setup stuff
      document.getElementById("connect").onclick = this.connecttoserver;

      $('#setup')
        .modal({
          closable: false,
          onHide: function(){
            that.name = $('#name').val();
            that.key = CryptoJS.SHA256($('#password').val()).toString();
          }
        })
        .modal('show')
      ;

      // send message setup stuff
      document.getElementById("send").onclick = this.sendmessage;

      socket.on('message', function(data) {
        if (data) {
          console.log('received - ' + data);

          try {
            var message = JSON.parse(CryptoJS.AES.decrypt(data, that.key).toString(CryptoJS.enc.Utf8))
              , contentDIV = $('#content');

            var html = '<b>' + message.username + ': </b>';
            html += message.message + '<br />';

            contentDIV.append(html);

            contentDIV[0].scrollTop = contentDIV[0].scrollHeight;
          } catch(err) {
            console.log('Error decrypting, probably wrong key - ' + err);
          }
        }
      });

      socket.on('people', function(data) {
        this.peoplecount = data.count;

        document.getElementById("peoplecount").innerHTML = this.peoplecount;
      });

      $('#password')
        .keyup(function(e) {
          if(e.keyCode == 13) {
            that.connecttoserver();
          }
        })
      ;

      $("#field")
        .keyup(function(e) {
          if(e.keyCode == 13) {
            that.sendmessage();
          }
        })
      ;

    },

    connecttoserver: function() {
      $('#setup').modal('hide');
    },

    sendmessage: function() {
      var message = {
        message: $('#field').val(),
        username: this.name
      };
      var encrypted = CryptoJS.AES.encrypt(JSON.stringify(message), this.key).toString();
      console.log('sending - ' + encrypted);
      socket.emit('send', encrypted);
      $('#field').val('');
    }

  });

  // creating the lobby
  var App = new LobbyView({
    model: LobbyModel
  });

})(jQuery);