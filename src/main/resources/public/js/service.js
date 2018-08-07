var tanks = [];
var shouts = [];
var currentUsername;

class Service {

    static controller(data) {
      switch (data["action"]) {
        case "AUTH":
            $(".incomingMessage").html("");
            if (data["status"] == "success") {
                tanks = JSON.parse(data["tanks"]);
                currentUsername = $("#login").val();
                for (var key in tanks) {
                    Service.addTank(tanks[key]["username"], tanks[key]["position"]["x"], tanks[key]["position"]["y"]);
                }

                $(".login-wrapper").hide();
                $(".game-field").show();

                var responce = {};
                responce.action = "NEW_TANK";
                responce.username = currentUsername;
                Socket.sendData(JSON.stringify(responce));
            } else {
                $(".incomingMessage").html(data["message"]);
            }
            break;
        case "MOVEMENT":
            var tank = JSON.parse(data["tank"]);
            var username = tank["username"];
            tanks[username].move(tank["direction"]["x"], tank["direction"]["y"], tank["position"]["x"], tank["position"]["y"]);
            if (currentUsername == username) {
                $("body").scrollLeft(tanks[username]["x"] - 300);
                $("body").scrollTop(tanks[username]["y"] - 300);
            }
            break;
        case "NEW_TANK":
            Service.addNewTank(data["username"], data["x"], data["y"]);
            break;
        case "SHOUT":
            if (currentUsername != data["username"]) {
                Service.addShout(data["username"]);
            }
        case "HURT_YOU":
            $(".lifes").attr("data-badge", data["lifes"]);
            break;
        case "SCORE":
            $(".score").attr("data-badge", data["score"]);
            break;
        case "KILL":
            if (data["username"] == currentUsername) {
                $(".lifes").attr("data-badge", "0");
                alert("You die!");
            }
            tanks[data["username"]].erase();
            delete tanks[data["username"]];
        default:
            console.log("unknown situation");
      }
    }

    static addTank(username, x, y) {
        tanks[username] = new Tank(username, x, y);
        tanks[username].setIsNew(false);
        tanks[username].draw();
    }

    static addNewTank(username, startX, startY) {
        tanks[username] = new Tank(username, startX, startY);
        Tank.changeStatus(tanks[username]);
        tanks[username].draw();
        var flag = false;
        tanks[username].interval = window.setInterval(function() {
            if (tanks[username].checkStatus() == false) {
                clearInterval(tanks[username].interval);
                tanks[username].erase();
                tanks[username].draw();
            } else {
                if (flag) {
                    tanks[username].draw();
                } else {
                    tanks[username].erase();
                }
                flag = !flag;
            }
        }, 250);
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

    static addShout(username) {
        var tank = tanks[username];
        if (!tank.checkStatus()) {
            var shout = new Shout(tank);
            var responce = {};
            if (username == currentUsername) {
                responce.action = "SHOUT";
                responce.username = shout.username;
                Socket.sendData(JSON.stringify(responce));
            }
            shout.interval = window.setInterval(function() {
                shout.move(shout.direction.x, shout.direction.y);
                for (var key in tanks) {
                    if (!tanks[key].checkStatus() && Service.pointInTank({x: shout.x, y: shout.y}, tanks[key])) {
                        shout.erase();
                        clearInterval(shout.interval);
                        if (key == currentUsername) {
                            var responce = {};
                            responce.action = "HURT";
                            responce.username = shout.username;
                            responce.victim = key;
                            Socket.sendData(JSON.stringify(responce));
                        }
                    } else if (
                            shout.x <= 0 ||
                            shout.x >= $(".game-field").width() ||
                            shout.y <= 0 ||
                            shout.y >= $(".game-field").height()
                    ) {
                        shout.erase();
                        clearInterval(shout.interval);
                    }
                }
            }, 10);
        }
    }

    static keyPress(keyCode) {
        var username = currentUsername;
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

             var responce = {};
             responce.action = "MOVEMENT";
             responce.username = username;
             responce.dx = dx;
             responce.dy = dy;
             Socket.sendData(JSON.stringify(responce));
        }
    }
}