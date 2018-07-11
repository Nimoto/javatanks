if (!window.WebSocket) {
	document.body.innerHTML = 'No Websockets, no love, no true';
}

$(document).ready(function(){
    Socket.init();
    $("form").on("submit", function() {
        var responce = {};
        var form = $(this).serializeArray();
        form.forEach(function(item, i, arr) {
            responce[item["name"]] = item["value"];
        });
        Socket.sendData(JSON.stringify(responce));
        return false;
    });

    $("body").on("keydown", function (event){
        Service.keyPress(event.keyCode);
    });
});