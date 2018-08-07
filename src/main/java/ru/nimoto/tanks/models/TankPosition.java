package ru.nimoto.tanks.models;

public class TankPosition {
    int x;
    int y;

    public TankPosition() {
        this.x = 50;
        this.y = 50;
    }

    public TankPosition(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
