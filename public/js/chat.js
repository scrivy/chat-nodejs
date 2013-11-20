window.onload = function() {

  var socket = io.connect(''),
    field = document.getElementById("field"),
    sendButton = document.getElementById("send"),
    content = document.getElementById("content");
  name = prompt('name?');
  password = CryptoJS.SHA256(prompt("password?")).toString();

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
    $("#field").keyup(function(e) {
      if(e.keyCode == 13) {
        sendMessage();
      }
    });
  });
}