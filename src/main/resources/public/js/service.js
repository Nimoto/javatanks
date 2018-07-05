class Service {

    static tanks() {
        if (!Service.tanks) {
            Service.tanks = [];
        }
    }

    static controller(data) {
      Service.tanks();
      switch (data["action"]) {
        case "AUTH":
            $(".incomingMessage").html("");
            if (data["status"] == "success") {
                username = $("#login").val();
                $(".login-wrapper").hide();
                $(".game-field").show();
            } else {
                $(".incomingMessage").html(data["message"]);
            }
            break;
        case "GAMESTATUS":
            if (username != data["username"]) {
                if (!Service.tanks[data["username"]]) {
                    addNewTank(data["username"]);
                    Service.tanks[data["username"]].x = data["x"];
                    Service.tanks[data["username"]].y = data["y"];
                }
                var dx = - Service.tanks[data["username"]].x + data["x"];
                if (dx != 0) {
                    dx = dx / Math.abs(dx);
                }
                var dy = - Service.tanks[data["username"]].y + data["y"];
                if (dy != 0) {
                    dy = dy / Math.abs(dy);
                }
                Service.tanks[data["username"]].move(dx, dy);
            }
            break;
        case "NEWUSER":
            Service.addNewUserInTable(data["username"]);
            Service.addNewTank(data["username"]);
            break;
        default:
            console.log("unknown situation");
      }
    }

    static addNewUserInTable(username) {
        $(".game-user-list ul").append(
              "<li class=\"mdl-list__item\">" +
                "<span class=\"mdl-list__item-primary-content\">" +
                    "<i class=\"material-icons mdl-list__item-icon\">person</i>" +
                    username +
                "</span>" +
              "</li>"
        );
    }

    static addNewTank(username) {
        Service.tanks[username] = new Tank(username);
        Service.tanks[username].draw();
    }

    static keyPress(username, keyCode) {
        Service.tanks();
        switch (keyCode) {
            case 37:
                Service.tanks[username].move(-1, 0);
                break;
            case 39:
                Service.tanks[username].move(1, 0);
                break;
            case 40:
                Service.tanks[username].move(0, 1);
                break;
            case 38:
                Service.tanks[username].move(0, -1);
                break;
            case 17:
                break;
        }
        var responce = {};
        responce.action = "GAMESTATUS";
        responce.username = username;
        responce.x = Service.tanks[username].x;
        responce.y = Service.tanks[username].y;
        return responce;
    }
}