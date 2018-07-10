var tanks = [];
var shouts = [];
var username;

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
        case "MOVEMENT":
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
        case "SHOUT":
            Service.addShout(data["username"]);
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

    static pointInTank(point, tank) {
        if (
            point.x >= tank.x &&
            point.x <= (tank.x + 30) &&
            point.y >= tank.y &&
            point.y <= (tank.y + 30)
        ) {
            return tank.username;
        }
        return false;
    }

    static isTanksIntersection(tank) {
        var points = [
            {x: tank.x,      y: tank.y},
            {x: tank.x + 30, y: tank.y},
            {x: tank.x + 30, y: tank.y + 30},
            {x: tank.x,      y: tank.y + 30}
        ];
        var flag = true;
        for (var key in tanks) {
            var item = tanks[key];
            if (item.username != tank.username) {
                points.forEach(function(point, i, arr) {
                    if (Service.pointInTank(point, item) == item.username && flag == true) {
                        flag = false;
                    }
                });
            }
        }
        return flag;
    }

    static addShout(username) {
        var tank = tanks[username];
        var shout = new Shout(tank);
        var responce = {};
        responce.action = "SHOUT";
        responce.username = shout.username;
        Socket.sendData(JSON.stringify(responce));
        shout.interval = window.setInterval(function() {
            shout.move(shout.direction.x, shout.direction.y);
            for (var key in tanks) {
                if (Service.pointInTank({x: shout.x, y: shout.y}, tanks[key])) {
                    shout.erase();
                    clearInterval(shout.interval);
                    var responce = {};
                    responce.action = "HURT";
                    responce.username = shout.username;
                    responce.victim = key;
                    Socket.sendData(JSON.stringify(responce));
                } else if {
                    (
                        shout.x <= 0 ||
                        shout.x >= $(".game-field").width() ||
                        shout.y <= 0 ||
                        shout.y >= $(".game-field").height()
                    )
                ) {
                    shout.erase();
                    clearInterval(shout.interval);
                }
            }
        }, 10);
    }

    static keyPress(username, keyCode) {

        var dx = 0, dy = 0;
        if (tanks[username]) {
            switch (keyCode) {
                case 37:
                    if (tanks[username].x > 0) {
                        dx = -1;
                        dy = 0;
                    }
                    break;
                case 39:
                    if (tanks[username].x < ($(".game-field").width() - 30)) {
                        dx = 1;
                        dy = 0;
                    }
                    break;
                case 40:
                    if (tanks[username].y < ($(".game-field").height() - 30)) {
                        dx = 0;
                        dy = 1;
                    }
                    break;
                case 38:
                    if (tanks[username].y > 0) {
                        dx = 0;
                        dy = -1;
                    }
                    break;
                case 17:
                    Service.addShout(username);
                    break;
            }

            var tank = new Tank(username);
            tank.x = tanks[username].x;
            tank.y = tanks[username].y;
            tank.move(dx, dy, false);
            if (Service.isTanksIntersection(tank) == true) {
                tanks[username].move(dx, dy);
                //TODO избавиться от магического числа
                $("body").scrollLeft(tanks[username].x - 300);
                $("body").scrollTop(tanks[username].y - 300);
                var responce = {};
                responce.action = "MOVEMENT";
                responce.username = username;
                responce.x = tanks[username].x;
                responce.y = tanks[username].y;
                Socket.sendData(JSON.stringify(responce));
            }
        }
    }
}