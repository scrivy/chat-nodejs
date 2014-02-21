var socket = io.connect('');

var LobbyView = Backbone.View.extend({
  events: {
    "click    #send"          : "sendmessage",
    "keypress input#field"    : "sendmessageonenter"
  },

  initialize: function() {
    _.bindAll(this, 'sendmessage');

    var that = this;

    // chat session setup stuff
    $('#setup')
      .modal({
        closable: false,
        onApprove: function(){
          that.model.set({
            name: $('#name').val(),
            key: CryptoJS.SHA256($('#password').val()).toString()
          });
        }
      })
      .modal('show')
    ;

    // send message setup stuff
    socket.on('message', function(data) {
      if (data) {
        console.log('received - ' + data);

        try {
          var message = JSON.parse(CryptoJS.AES.decrypt(data, that.model.get('key')).toString(CryptoJS.enc.Utf8))
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
  },

  sendmessage: function() {
    var message = {
      message: $('#field').val(),
      username: this.model.get('name')
    };
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(message), this.model.get('key')).toString();
    console.log('sending - ' + encrypted);
    socket.emit('send', encrypted);
    $('#field').val('');
  },

  sendmessageonenter: function(e) {
    if (e.keyCode == 13)
      this.sendmessage();
  }

});

var app = new LobbyView({
  el: document.getElementById('lobby'),
  model: new Backbone.Model()
});