window.onload = function() {

    var messages = [];
    var socket = io.connect('https://www.psst.in');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    name = prompt('name?');
    password = CryptoJS.SHA256(prompt("password?")).toString();

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
        var encrypted = CryptoJS.AES.encrypt(field.value, password);
        console.log('sending - ' + encrypted.toString());
        socket.emit('send', { message: encrypted.toString(), username: name });
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
