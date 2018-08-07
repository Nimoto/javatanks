class Tank {

    constructor(username, position = false) {
        this.position = position == false ? {x: 300, y: 300} : position;
        this.username = username;
        this.scheme = this.tankUp();
        this.direction = {x: 0, y: -1};
        this.shoutDirection = {x: 0, y: -1};
        this.shoutPosition = this.shoutUp();
        this.isNew = true;
    }

    static context() {
        var context = document.getElementById("game-field").getContext("2d");
        context.fillStyle = "#fff";
        context.scale(1, 1)
        return context;
    }

    dx() {
        return 10;
    }

    dy() {
        return 10;
    }

    setIsNew (value) {
        this.isNew = value;
    }

    static changeStatus(tank) {
        window.setTimeout(function() {
            tank.isNew = false;
        }, 3000);
    }

    checkStatus() {
        return this.isNew;
    }

    draw() {
        var context = Tank.context();

        var x, y;
        var dx = this.dx(), dy = this.dy();
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                x = parseInt(this.position.x) + i * dx;
                y = parseInt(this.position.y) + j * dy;
                if (this.scheme[i][j] == 1) {
                  context.fillRect(x, y, (dx - 2), (dy - 2));
                  context.stroke();
                }
            }
        }
    }

    erase() {
        var context = Tank.context();

        var x, y;
        var dx = this.dx(), dy = this.dy();
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                x = parseInt(this.position.x) + i * dx;
                y = parseInt(this.position.y) + j * dy;
                if (this.scheme[i][j] == 1) {
                  context.clearRect(x, y, (dx - 2), (dy - 2));
                  context.stroke();
                }
            }
        }
    }

    move(direction, position, isDraw = true) {
        if (isDraw == true) {
            this.erase();
        }
        switch (direction.x + ", " + direction.y) {
            case "0, 1" :
                this.scheme = this.tankDown();
                this.shoutPosition = this.shoutDown();
                break;
            case "0, -1" :
                this.scheme = this.tankUp();
                this.shoutPosition = this.shoutUp();
                break;
            case "1, 0" :
                this.scheme = this.tankRight();
                this.shoutPosition = this.shoutRight();
                break;
            case "-1, 0" :
                this.scheme = this.tankLeft();
                this.shoutPosition = this.shoutLeft();
                break;
        }
        this.direction = {x: direction.x, y: direction.y};
        if ((direction.x + direction.y) != 0) {
            this.shoutDirection = {x: direction.x, y: direction.y};
        }
        this.position.x = (position == false ? this.position.x + this.dx() * direction.x : position.x);
        this.position.y = (position == false ? this.position.y + this.dy() * direction.y : position.y);
        if (isDraw == true) {
            this.draw();
        }
    }

    tankLeft() {
        return [[0,1,0],[1,1,1],[1,0,1], [0,1,0]];
    }

    shoutLeft() {
        return {
                    x: (this.position.x - this.dx() * 2),
                    y: (this.position.y + this.dy() * 1)
               };
    }

    tankRight() {
        return [[1,0,1],[1,1,1],[0,1,0], [2,1,0]];
    }

    shoutRight() {
        return {x: (this.position.x + this.dx() * 4), y: (this.position.y + this.dy())};
    }

    tankDown() {
        return [[1,1,0],[0,1,1],[1,1,0], [1,2,0]];
    }

    shoutDown() {
        return {x: (this.position.x + this.dx()), y: (this.position.y + this.dy() * 4)};
    }

    tankUp() {
        return [[0,1,1],[1,1,0],[0,1,1], [1,0,0]];
    }

    shoutUp() {
        return {x: (this.position.x + this.dx() * 1), y: (this.position.y - this.dy() * 2)};
    }
}