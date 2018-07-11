package ru.nimoto.tanks.models;

import org.eclipse.jetty.websocket.api.Session;

public class User {
    private int lifes = 5;
    private int score = 0;
    private final String userName;
    private Session session;

    public User(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return userName;
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

    public Session getSession() {
        return  session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
