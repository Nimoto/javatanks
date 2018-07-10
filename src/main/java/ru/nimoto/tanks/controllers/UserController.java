package ru.nimoto.tanks.controllers;

import ru.nimoto.tanks.models.*;
import ru.nimoto.tanks.models.User;
import org.eclipse.jetty.websocket.api.Session;

import java.util.HashMap;
import java.util.HashSet;

public class UserController {

    private static HashMap<Session, User> users = new HashMap<>();
    private static HashSet<String> userNames = new HashSet<>();

    public static boolean setUser(Session session, String userName) {
        if (!userName.isEmpty() && userNames.contains(userName)) {
            User user = new User(userName);
            users.put(session, user);
            userNames.add(userName);
            return true;
        }
        return false;
    }

    public static User getUser(Session session) {
        //TODO проверка на существование
        return users.get(session);
    }

    public static HashMap<Session, User> getUsers() {
        return users;
    }

    public static void deleteUser(Session session) {
        users.remove(session);
    }

}
