class Shout {

    constructor(tank) {
        this.username = tank.username;
        this.x = tank.shoutPosition.x;
        this.y = tank.shoutPosition.y;
        this.direction = tank.shoutDirection;
        this.context = this.context();
    }

    context() {
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

    move(directionX, directionY) {
        this.erase();
        this.x = this.x + this.dx() * directionX;
        this.y = this.y + this.dy() * directionY;
        this.draw();
    }

    draw() {
        this.context.fillRect(this.x, this.y, (this.dx() - 2), (this.dy() - 2));
        this.context.stroke();
    }

    erase() {
        this.context.clearRect(this.x, this.y, (this.dx() - 2), (this.dy() - 2));
        this.context.stroke();
    }
}