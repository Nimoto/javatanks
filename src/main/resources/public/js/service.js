var tanks = [];
var shouts = [];
var currentUsername;

class Service {

    static controller(data) {
      console.log(data);
      switch (data["action"]) {
        case "AUTH":
            $(".incomingMessage").html("");
            if (data["status"] == "success") {
                tanks = JSON.parse(data["tanks"]);
                console.log(tanks);
                $(".lifes").attr("data-badge", data["lifes"]);
                $(".score").attr("data-badge", data["score"]);
                currentUsername = $("#login").val();
                for (var key in tanks) {
                    Service.addTank(key, tanks[key]["x"], tanks[key]["y"]);
                }
                Service.addNewTank(currentUsername, true);
                $(".login-wrapper").hide();
                $(".game-field").show();
            } else {
                $(".incomingMessage").html(data["message"]);
            }
            break;
        case "TANK":
            Service.addTank(data["username"], data["x"], data["y"]);
            break;
        case "MOVEMENT":
            if (currentUsername != data["username"]) {
                if (!tanks[data["username"]]) {
                    Service.addTank(data["username"], data["x"], data["y"]);
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
        case "NEW_TANK":
            if (data["username"] != currentUsername) {
                Service.addNewTank(data["username"], false, data["x"], data["y"]);
            }
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

    static addNewTank(username, isCurrent = false, startX = false, startY = false) {
        if (startX != false && startY != false) {
            tanks[username] = new Tank(username, startX, startY);
        } else {
            tanks[username] = new Tank(username);
        }
        if (isCurrent) {
            var x = 50, y = 50;
            while (!Service.isTanksIntersection(tanks[username]) && x < $(".game-field").width() - 50) {
                y += tanks[username].dy();
                if (y >= $(".game-field").height() - 50) {
                    y = 50;
                    x += tanks[username].dx();
                }
                tanks[username].x = x;
                tanks[username].y = y;
            }
            var responce = tanks[username];
            responce.action = "NEW_TANK";
            Socket.sendData(JSON.stringify(responce));
        }

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
        console.log("1");
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
                console.log("2");
                shout.move(shout.direction.x, shout.direction.y);
                for (var key in tanks) {
                    if (!tanks[key].checkStatus() && Service.pointInTank({x: shout.x, y: shout.y}, tanks[key])) {
                        shout.erase();
                        clearInterval(shout.interval);
                        if (key == currentUsername) {
                            var responce = {};
                            responce.action = "HURT";
                            console.log("3");
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

            var tank = new Tank(username, tanks[username].x, tanks[username].y);
            tank.move(dx, dy, false);
            if (Service.isTanksIntersection(tank) == true) {
                tanks[username].move(dx, dy);
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