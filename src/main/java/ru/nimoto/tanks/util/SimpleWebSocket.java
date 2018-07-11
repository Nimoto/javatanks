package ru.nimoto.tanks.util;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;
import ru.nimoto.tanks.controllers.UserController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;


enum Command {
    MOVEMENT,
    SHOUT,
    HURT,
    AUTH
}

@WebSocket
public class SimpleWebSocket {

    private String userName;

    // Store sessions if you want to, for example, broadcast a message to all users
    private static final Queue<Session> sessions = new ConcurrentLinkedQueue<>();

    @OnWebSocketConnect
    public void connected(Session session) throws IOException {
        sessions.add(session);
    }

    @OnWebSocketClose
    public void closed(Session session, int statusCode, String reason) {
        sessions.remove(session);
        if (!userName.isEmpty()) {
            UserController.deleteUser(userName);
        }
    }

    @OnWebSocketMessage
    public void message(Session session, String message) throws IOException {
        System.out.println(message);
        HashMap<String, Object> data = (HashMap<String, Object>) new JSONObject(message).toMap();
        if (!data.containsKey("action")) {
            return;
        }
        Command action = Command.valueOf(data.get("action").toString());
        HashMap<String, String> responce = new HashMap<>();
        switch (action) {
            case AUTH:
                responce.put("action", "AUTH");
                if (UserController.setUser(session, data.get("username").toString())) {
                    userName = data.get("username").toString();
                    responce.put("status", "success");
                    responce.put("score", "0");
                    responce.put("lifes", "5");
                    //TODO: удалить после внедрения сортировки по score
                    HashMap<String, String> broadcastResponce = new HashMap<>();
                    broadcastResponce.put("action", "NEWUSER");
                    broadcastResponce.put("username", data.get("username").toString());
                    sessions.stream().filter(Session::isOpen).forEach(sess -> {
                        try {
                            sess.getRemote().sendString(String.valueOf(new JSONObject(broadcastResponce)));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
                } else {
                    responce.put("status", "fail");
                    //TODO MessageBundle
                    responce.put("message", "Try another login");
                }
                session.getRemote().sendString(String.valueOf(new JSONObject(responce)));
                responce.clear();
                break;
            case MOVEMENT:
                sessions.stream().filter(Session::isOpen).forEach(sess -> {
                    try {
                        sess.getRemote().sendString(message);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
                break;
            case SHOUT:
                sessions.stream().filter(Session::isOpen).forEach(sess -> {
                    try {
                        sess.getRemote().sendString(message);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
                break;
            case HURT:
                int victimLifes = UserController.hurtUser(data.get("victim").toString());
                int userScores = UserController.scoreUser(data.get("username").toString());
                if (victimLifes == 0) {
                    responce.put("action", "KILL");
                    responce.put("username", data.get("victim").toString());
                    sessions.stream().filter(Session::isOpen).forEach(sess -> {
                        try {
                            sess.getRemote().sendString(String.valueOf(new JSONObject(responce)));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
                    responce.clear();

                    responce.put("action", "SCORE");
                    responce.put("score", String.valueOf(userScores));
                    responce.clear();
                } else {
                    responce.put("action", "HURT_YOU");
                    responce.put("lifes", String.valueOf(victimLifes));

                    UserController.getUser(data.get("victim").toString())
                            .getSession().getRemote().sendString(String.valueOf(new JSONObject(responce)));
                }
                responce.clear();
                break;
        }
    }
}