window.onload = function() {

    var messages = [];
    var socket = io.connect('http://pssst.herokuapp.com');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    password = prompt("you're a weasel");

    socket.on('message', function (data) {
        if(data.message) {
            console.log('recieved - ' + data.message);
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';

                var decrypted = CryptoJS.AES.decrypt(messages[i].message, password);
                html += decrypted.toString(CryptoJS.enc.Utf8) + '<br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.onclick = sendMessage = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var encrypted = CryptoJS.AES.encrypt(field.value, password);
            console.log('sending - ' + encrypted.toString());
            socket.emit('send', { message: encrypted.toString(), username: name.value });
            field.value = "";
        }
    };

    $(document).ready(function() {
      $("#field").keyup(function(e) {
        if(e.keyCode == 13) {
          sendMessage();
        }
      });
    });
}