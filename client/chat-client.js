'use strict';

// declare views
var NavibarView = Backbone.View.extend({
  events: {
    'click    a.item.mainview' : 'changeview'
  },

  initialize: function() {
    _.bindAll(this, 'changeview');

    this.model.set('activetab', 'lobby');

    window.onresize = mainviews[this.model.get('activetab')].onresize;
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

    var viewmodel = mainviews[anode.dataset.id];
    window.onresize = viewmodel.onresize;

    $(anode).addClass('active');
    this.model.set('activetab', anode.dataset.id);

    var view;
    for (view in mainviews)
      mainviews[view].hide();

    this.$el.children('.'+anode.dataset.id).show();

    viewmodel
      .show()
      .onresize();
  }
});

var MainViewTemplate = Backbone.View.extend({
  hide: function() {
    this.el.style.display = 'none';
    return this;
  },

  show: function() {
    this.el.style.display = '';
    return this;
  },

  onresize: function() {
    this.el.style.height = (window.innerHeight - navibarview.el.clientHeight).toString() + 'px';
  }
});

var LobbyView = MainViewTemplate.extend({
  events: {
    "click    #send"          : "sendmessage",
    "keypress #field"    : "sendmessageonenter"
  },

  initialize: function() {
    _.bindAll(this, 'sendmessage', 'show', 'hide', 'onresize', 'receivemessage');

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

          // save name to localstorage
          localStorage.setItem('lobbymodel', JSON.stringify(that.model.toJSON()));
        }
      })
      .modal('show')
    ;

    // cache stuff for onresize
    this.$inputs = this.$el.find('.ui, .action, .input');
    this.$navibar = $('#navibar');

    // send message setup stuff
    this.$messages = this.$el.find('.content');

    // make sure onresize in called to set the height of the messages
    this.onresize();
  },

  clientcount: function(count) {
    document.getElementById("peoplecount").innerHTML = count;
  },

  receivemessage: function(data) {
    if (!data) return;
    
    try {
      var message = JSON.parse(data);

      var html = '<b>' + message.username + ': </b>';
      html += message.message + '<br />';

      this.$messages.append(html);

      this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
    } catch(err) {
      console.log('Error decrypting, probably wrong key - ' + err);
    }
  },

  sendmessage: function() {
    var message = {
      message: $('#field').val(),
      username: this.model.get('name')
    };
    message = JSON.stringify(message);
    socket.send(JSON.stringify({ action: 'lobbymessage', data: message }));
    $('#field').val('');
  },

  sendmessageonenter: function(e) {
    if (e.keyCode == 13)
      this.sendmessage();
  },

  // override resize method
  onresize: function() {
    this.$messages.height((window.innerHeight - this.$navibar.height() - this.$inputs.height() - 55).toString() + 'px');
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

// initialize websocket
var socket = require('engine.io-client')('');

// setup function to handle messages
socket.onopen = function() {
  socket.onmessage = function(message) {
    console.log(message);

    try {
      message = JSON.parse(message);
      if (typeof message.action !== 'string' || typeof message.data !== 'string') {
        throw new Error('malformed web socket message');
      }
    } catch (err) {
      console.log(err.toString());
      return;
    };

    switch(message.action) {
      case 'lobbymessage':
        mainviews.lobby.receivemessage(message.data);
        break;
      case 'clientcount':
        mainviews.lobby.clientcount(message.data);
        break;
    };
  };
};

socket.onclose = function() {
  console.log('closing socket');
};