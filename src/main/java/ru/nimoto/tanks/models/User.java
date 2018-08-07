package ru.nimoto.tanks.models;

import org.eclipse.jetty.websocket.api.Session;

public class User {
    private int lifes = 5;
    private int score = 0;
    private final String userName;
    private Session session;
    private Tank tank;

    public User(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
    }

    public Session getSession() {
        return  session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public void setTank(Tank tank) {
        this.tank = tank;
    }

    public Tank getTank() {
        return this.tank;
    }
}
