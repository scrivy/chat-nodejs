window.onload = function() {

  var socket = io.connect('')
    , field = document.getElementById("field")
    , sendButton = document.getElementById("send")
    , content = document.getElementById("content")
    , name
    , password;

  // chat session setup stuff
  var connectButton = document.getElementById("connect")
    , setupchatpopupDIV = $('#setup')
    , nameDIV = $('#name')
    , passwordDIV = $('#password');

  connectButton.onclick = connecttoserver = function() {
    setupchatpopupDIV.modal('hide');
  };

  setupchatpopupDIV
    .modal({
      closable: false,
      onHide: function(){
        name = nameDIV.val();
        password = CryptoJS.SHA256(passwordDIV.val()).toString();
      }
    })
    .modal('show')
  ;

  socket.on('message', function (data) {
    if(data) {
      console.log('recieved - ' + data);

      try {
        var message = JSON.parse(CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8));

        var html = '<b>' + message.username + ': </b>';
        html += message.message + '<br />';

        $('#content').append(html);

        content.scrollTop = content.scrollHeight;
      } catch(err) {
        console.log('Error decrypting, wrong key probably - ' + err);
      }
    }
  });

  var peoplecount,
    peoplecountid=document.getElementById("peoplecount");
  socket.on('people', function(data) {
    peoplecount = data.count;

    peoplecountid.innerHTML = peoplecount;
  });

  sendButton.onclick = sendMessage = function() {
    var message = {
      message: field.value,
      username: name
    };
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(message), password);
    console.log('sending - ' + encrypted.toString());
    socket.emit('send', encrypted.toString());
    field.value = "";
  };

  $(document).ready(function() {
    passwordDIV.keyup(function(e) {
      if(e.keyCode == 13) {
        connecttoserver();
      }
    });

    $("#field").keyup(function(e) {
      if(e.keyCode == 13) {
        sendMessage();
      }
    });
  });
}