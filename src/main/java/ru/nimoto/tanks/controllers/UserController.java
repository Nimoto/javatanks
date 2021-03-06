package ru.nimoto.tanks.controllers;

import org.eclipse.jetty.websocket.api.Session;
import ru.nimoto.tanks.models.Tank;
import ru.nimoto.tanks.models.User;

import java.util.HashMap;

public class UserController {

    private static HashMap<String, User> users = new HashMap<>();

    public static boolean setUser(Session session, String userName) {
        if (!userName.isEmpty() && !users.containsKey(userName)) {
            User user = new User(userName);
            user.setSession(session);
            users.put(userName, user);
            return true;
        }
        return false;
    }

    public static User getUser(String userName) {
        //TODO проверка на существование
        return users.get(userName);
    }

    public static HashMap<String, User> getUsers() {
        return users;
    }

    public static void deleteUser(String userName) {
        users.remove(userName);
    }

    public static int hurtUser(String userName) {
        if (users.get(userName) != null) {
            users.get(userName).getTank().descrementLifes();
            return users.get(userName).getTank().getLifes();
        }
        return 0;
    }

    public static int scoreUser(String userName) {
        if (users.get(userName) != null) {
            users.get(userName).getTank().incrementScore();
            return users.get(userName).getTank().getScore();
        }
        return 0;
    }

    public static void addTank(String userName, Tank tank) {
        if (users.get(userName) != null) {
            users.get(userName).setTank(tank);
        }
    }
}
