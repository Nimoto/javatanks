class Socket {
    static init() {
        this.socket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/chat/");

        this.socket.onopen = function() {
          console.log("Connection open.");
        };

        this.socket.onclose = function(event) {
          if (event.wasClean) {
            console.log('Clear close');
          } else {
            console.log('Dirty close'); // например, "убит" процесс сервера
          }
          console.log('Code: ' + event.code + ' why: ' + event.reason);
        };

        this.socket.onmessage = function(event) {
          var incomingMessage = JSON.parse(event.data);
          Service.controller(incomingMessage);
        };

        this.socket.onerror = function(error) {
          console.log("Error " + error.message);
        };
    }

    static sendData(message) {
        this.socket.send(message);
    }
}