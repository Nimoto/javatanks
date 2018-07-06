var tanks = [];

class Service {

    static controller(data) {
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
                if (!tanks[data["username"]]) {
                    Service.addNewTank(data["username"]);
                    tanks[data["username"]].x = data["x"];
                    tanks[data["username"]].y = data["y"];
                }
                var dx = - tanks[data["username"]].x + data["x"];
                if (dx != 0) {
                    dx = dx / Math.abs(dx);
                }
                var dy = - tanks[data["username"]].y + data["y"];
                if (dy != 0) {
                    dy = dy / Math.abs(dy);
                }
                tanks[data["username"]].move(dx, dy);
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
        tanks[username] = new Tank(username);
        tanks[username].draw();
    }

    static keyPress(username, keyCode) {
        switch (keyCode) {
            case 37:
                tanks[username].move(-1, 0);
                break;
            case 39:
                tanks[username].move(1, 0);
                break;
            case 40:
                tanks[username].move(0, 1);
                break;
            case 38:
                tanks[username].move(0, -1);
                break;
            case 17:
                break;
        }
        //TODO избавиться от магического числа
        $("body").scrollLeft(tanks[username].x - 300);
        $("body").scrollTop(tanks[username].y - 300);
        var responce = {};
        responce.action = "GAMESTATUS";
        responce.username = username;
        responce.x = tanks[username].x;
        responce.y = tanks[username].y;
        return responce;
    }
}