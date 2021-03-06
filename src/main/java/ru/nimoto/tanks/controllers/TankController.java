package ru.nimoto.tanks.controllers;

import ru.nimoto.tanks.models.Tank;
import ru.nimoto.tanks.models.Coordinates;

import java.util.HashMap;
import java.util.Map;

public class TankController {

    private static HashMap<String, Tank> tanks = new HashMap<>();

    public static Tank addNewTank(String username) {
        Tank tank = new Tank(username);
        tanks.put(username, tank);
        return tank;
    }

    public static HashMap<String, Tank> getTanks() {
        return tanks;
    }

    public static void setStartPosition(Tank tank) {
        Coordinates tankPosition = new Coordinates();
        //TODO magic numbers
        while (TankController.isTanksIntersection(tank) && tankPosition.getX() < 1950) {
            tankPosition.setY(tankPosition.getY() + tank.getDy() * 3);
            if (tankPosition.getY() >= 1950) {
                tankPosition.setY(50);
                tankPosition.setX(tankPosition.getX() + tank.getDx() * 3);
            }
            tank.setPosition(tankPosition);
        }
    }

    private static boolean pointInTank(Coordinates point, Tank tank) {
        if (point.getX() >= tank.getPosition().getX() &&
                point.getX() <= (tank.getPosition().getX() + tank.getDx() * 3) &&
                point.getY() >= tank.getPosition().getY() &&
                point.getY() <= (tank.getPosition().getY() + tank.getDy() * 3)
        ) {
            return true;
        }
        return false;
    }

    private static boolean isTanksIntersection(Tank tank) {
        Coordinates[] points = new Coordinates[4];
        points[0] = new Coordinates(tank.getPosition().getX(), tank.getPosition().getY());
        points[1] = new Coordinates(tank.getPosition().getX() + tank.getDx() * 3, tank.getPosition().getY());
        points[2] = new Coordinates(tank.getPosition().getX() + tank.getDx() * 3, tank.getPosition().getY() + tank.getDy() * 3);
        points[3] = new Coordinates(tank.getPosition().getX(), tank.getPosition().getY() + tank.getDy() * 3);

        for (Map.Entry<String, Tank> enemyTank : TankController.tanks.entrySet()) {
            if (!enemyTank.getValue().equals(tank)) {
                for (int i = 0; i < points.length; i++) {
                    if (TankController.pointInTank(points[i], enemyTank.getValue())) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static boolean isMoving(String username, int directionX, int directionY) {
        System.out.println(directionX + " " + directionY);
        Tank tank = tanks.get(username);
        Coordinates oldPosition = new Coordinates(tank.getPosition().getX(), tank.getPosition().getY());
        Coordinates direction = new Coordinates(directionX, directionY);
        tank.move(direction);
        if (!TankController.isTanksIntersection(tanks.get(username))) {
            tank.setDirection(direction);
            return true;
        }
        tank.setPosition(oldPosition);
        return false;
    }

    public static Tank getTank(String username) {
        return tanks.get(username);
    }
}
