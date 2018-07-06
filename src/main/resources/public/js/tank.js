class Tank {

    constructor(username) {
        this.x = 300;
        this.y = 300;
        this.username = username;
        this.scheme = this.tankUp();
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

    move(directionX, directionY) {
        this.erase();
        switch (directionX + ", " + directionY) {
            case "0, 1" :
                this.scheme = this.tankUp();
                break;
            case "0, -1" :
                this.scheme = this.tankDown();
                break;
            case "1, 0" :
                this.scheme = this.tankRight();
                break;
            case "-1, 0" :
                this.scheme = this.tankLeft();
                break;
        }
        var dx = this.dx(), dy = this.dy();
        this.x = this.x + dx * directionX;
        this.y = this.y + dy * directionY;
        this.draw();
    }

    die() {
    }

    tankLeft() {
        return [[0,1,0],[1,1,1],[1,0,1], [0,1,0]];
    }

    tankRight() {
        return [[1,0,1],[1,1,1],[0,1,0], [2,1,0]];
    }

    tankUp() {
        return [[1,1,0],[0,1,1],[1,1,0], [1,2,0]];
    }

    tankDown() {
        return [[0,1,1],[1,1,0],[0,1,1], [1,0,0]];
    }
}