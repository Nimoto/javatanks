package ru.nimoto.tanks.models;

public class Tank {

    private int lifes = 5;
    private int score = 0;
    private Coordinates position;
    private Coordinates direction;
    private int dx;
    private int dy;
    private String username;

    public Tank(String username) {
        this.username = username;
        this.position = new Coordinates(300, 300);
        this.dx = 10;
        this.dy = 10;
        this.direction = new Coordinates(0, -1);
    }

    public void move(Coordinates direction) {
        int x = this.getPosition().getX() + this.dx * direction.getX();
        int y = this.getPosition().getY() + this.dy * direction.getY();
        this.getPosition().setX(x);
        this.getPosition().setY(y);
        System.out.println(this.getPosition().getX() + " " + this.getPosition().getY());
    }

    public int getLifes() {
        return lifes;
    }

    public void setLifes(int lifes) {
        this.lifes = lifes;
    }

    public void descrementLifes() {
        this.lifes --;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void incrementScore() {
        this.score ++;
    }

    public int getDx() {
        return dx;
    }

    public void setDx(int dx) {
        this.dx = dx;
    }

    public int getDy() {
        return dy;
    }

    public void setDy(int dy) {
        this.dy = dy;
    }

    public void setPosition(Coordinates position) {
        this.position = position;
    }

    public Coordinates getPosition() {
        return position;
    }

    public void setDirection(Coordinates direction) {
        this.direction = direction;
    }

    public Coordinates getDirection() {
        return direction;
    }
}
