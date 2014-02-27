// initialize websocket
var socket = io.connect('');

// declare views
var NavibarView = Backbone.View.extend({
  events: {
    'click    a.item.mainview' : 'changeview'
  },

  initialize: function() {
    _.bindAll(this, 'changeview');
  },

  changeview: function(e) {
    this.$el.children('.menu').children().removeClass('active');
    this.$el.children('.sub').hide();

    // select the a node
    var anode;
    if (e.target.tagName === 'I') {
      anode = e.target.parentNode;
    } else {
      anode = e.target;
    }

    $(anode).addClass('active');

    var view;
    for (view in mainviews)
      mainviews[view].hide();

    mainviews[anode.dataset.id].show();
    this.$el.children('.'+anode.dataset.id).show();
  }
});

var MainViewTemplate = Backbone.View.extend({
  hide: function() {
    this.el.style.display = 'none';
  },

  show: function() {
    this.el.style.display = '';
  }
});

var LobbyView = MainViewTemplate.extend({
  events: {
    "click    #send"          : "sendmessage",
    "keypress #field"    : "sendmessageonenter"
  },

  initialize: function() {
    _.bindAll(this, 'sendmessage', 'show', 'hide');

    var that = this;

    // prefill name if available
    if (this.model.get('name'))
      $('#name').val(this.model.get('name'));

    // chat session setup stuff
    $('#setup')
      .modal({
        closable: false,
        onApprove: function(){
          that.model.set('name', $('#name').val());
          that.key = CryptoJS.SHA256($('#password').val()).toString();

          // save name to localstorage
          localStorage.setItem('lobbymodel', JSON.stringify(that.model.toJSON()));
        }
      })
      .modal('show')
    ;

    // send message setup stuff
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
  },

  sendmessage: function() {
    var message = {
      message: $('#field').val(),
      username: this.model.get('name')
    };
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(message), this.key).toString();
    console.log('sending - ' + encrypted);
    socket.emit('send', encrypted);
    $('#field').val('');
  },

  sendmessageonenter: function(e) {
    if (e.keyCode == 13)
      this.sendmessage();
  }

});

var FriendsView = MainViewTemplate.extend({
  initialize: function() {
    _.bindAll(this, 'show', 'hide');
  }
});

// check if the user has visited before and load views/models
var mainviews = {};
(function() {
  if (!localStorage) throw 'web storage required';

// setup lobby view
  var lobbymodel;
  if (lobbymodel = localStorage.getItem('lobbymodel')) {
    lobbymodel = new Backbone.Model(JSON.parse(lobbymodel));
  } else {
    lobbymodel = new Backbone.Model();
  }

  mainviews.lobby = new LobbyView({
    el: document.getElementById('lobby'),
    model: lobbymodel
  });

// setup friends view
  var friendsmodel;
  if (friendsmodel = localStorage.getItem('friendsmodel')) {
    friendsmodel = new Backbone.Model(JSON.parse(friendsmodel));
  } else {
    friendsmodel = new Backbone.Model();
  }

  mainviews.friends = new FriendsView({
    el: document.getElementById('friends'),
    model: friendsmodel
  });
})();

// initialize navibar
var navibarview = new NavibarView({
  el: document.getElementById('navibar'),
  model: new Backbone.Model()
});