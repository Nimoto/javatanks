if (!window.WebSocket) {
	document.body.innerHTML = 'No Websockets, no love, no true';
}

var socket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/chat/");
var username;

socket.onopen = function() {
  console.log("Connection open.");
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log('Clear close');
  } else {
    console.log('Dirty close'); // например, "убит" процесс сервера
  }
  console.log('Code: ' + event.code + ' why: ' + event.reason);
};

socket.onmessage = function(event) {
  var incomingMessage = JSON.parse(event.data);
  Service.controller(incomingMessage);
};

socket.onerror = function(error) {
  console.log("Error " + error.message);
};

function sendData(message) {
   socket.send(message);
}

$(document).ready(function(){
    $("form").on("submit", function() {
        var responce = {};
        var form = $(this).serializeArray();
        form.forEach(function(item, i, arr) {
            responce[item["name"]] = item["value"];
        });
        sendData(JSON.stringify(responce));
        return false;
    });

    $("body").on("keypress", function (event){
        sendData(JSON.stringify(Service.keyPress(username, event.keyCode)));
    });
});