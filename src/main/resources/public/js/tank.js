class Tank {

    constructor(username, x = 300, y = 300) {
        this.x = x;
        this.y = y;
        this.username = username;
        this.scheme = this.tankUp();
        this.direction = {x: 0, y: -1};
        this.shoutDirection = {x: 0, y: -1};
        this.shoutPosition = {x: 310, y: 290};
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
            console.log(this.isNew);
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
                x = parseInt(this.x) + i * dx;
                y = parseInt(this.y) + j * dy;
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
                x = parseInt(this.x) + i * dx;
                y = parseInt(this.y) + j * dy;
                if (this.scheme[i][j] == 1) {
                  context.clearRect(x, y, (dx - 2), (dy - 2));
                  context.stroke();
                }
            }
        }
    }

    shoot() {
    }

    move(directionX, directionY, isDraw = true) {
        if (isDraw == true) {
            this.erase();
        }
        switch (directionX + ", " + directionY) {
            case "0, 1" :
                this.scheme = this.tankDown();
                this.shoutPosition = {x: this.x + this.dx(), y: this.y + this.dy() * 4};
                this.shoutDirection = {x: directionX, y: directionY};
                break;
            case "0, -1" :
                this.scheme = this.tankUp();
                this.shoutPosition = {x: this.x + this.dx(), y: this.y - this.dy() * 2};
                this.shoutDirection = {x: directionX, y: directionY};
                break;
            case "1, 0" :
                this.scheme = this.tankRight();
                this.shoutPosition = {x: this.x + this.dx() * 4, y: this.y + this.dy()};
                this.shoutDirection = {x: directionX, y: directionY};
                break;
            case "-1, 0" :
                this.scheme = this.tankLeft();
                this.shoutPosition = {x: this.x - this.dx() * 2, y: this.y + this.dy()};
                this.shoutDirection = {x: directionX, y: directionY};
                break;
        }
        this.direction.x = directionX;
        this.direction.y = directionY;
        this.x = this.x + this.dx() * directionX;
        this.y = this.y + this.dy() * directionY;
        if (isDraw == true) {
            this.draw();
        }
    }

    die() {
    }

    tankLeft() {
        return [[0,1,0],[1,1,1],[1,0,1], [0,1,0]];
    }

    tankRight() {
        return [[1,0,1],[1,1,1],[0,1,0], [2,1,0]];
    }

    tankDown() {
        return [[1,1,0],[0,1,1],[1,1,0], [1,2,0]];
    }

    tankUp() {
        return [[0,1,1],[1,1,0],[0,1,1], [1,0,0]];
    }
}