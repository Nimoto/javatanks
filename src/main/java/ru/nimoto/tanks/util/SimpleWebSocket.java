package ru.nimoto.tanks.util;

import com.google.gson.Gson;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.JSONObject;
import ru.nimoto.tanks.controllers.TankController;
import ru.nimoto.tanks.controllers.UserController;
import ru.nimoto.tanks.models.Tank;

import java.io.IOException;
import java.util.HashMap;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;


enum Command {
    MOVEMENT,
    NEW_TANK,
    SHOUT,
    HURT,
    AUTH
}

@WebSocket
public class SimpleWebSocket {

    // Store sessions if you want to, for example, broadcast a message to all users
    private static final Queue<Session> sessions = new ConcurrentLinkedQueue<>();
    private String userName;

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
            System.out.println(data);
            return;
        }
        Command action = Command.valueOf(data.get("action").toString());
        HashMap<String, String> responce = new HashMap<>();
        Tank tank;
        Gson gson = new Gson();
        switch (action) {
            case AUTH:
                responce.put("action", "AUTH");
                if (UserController.setUser(session, data.get("username").toString())) {
                    userName = data.get("username").toString();
                    responce.put("status", "success");
                    String jsonTanks = gson.toJson(TankController.getTanks());
                    responce.put("tanks", jsonTanks);
                } else {
                    responce.put("status", "fail");
                    //TODO MessageBundle
                    responce.put("message", "Try another login");
                }
                session.getRemote().sendString(String.valueOf(new JSONObject(responce)));
                responce.clear();
                break;
            case NEW_TANK:
                tank = TankController.addNewTank(data.get("username").toString());
                TankController.setStartPosition(tank);
                UserController.addTank(data.get("username").toString(), tank);
                responce.put("action", "NEW_TANK");
                responce.put("x", String.valueOf(tank.getPosition().getX()));
                responce.put("y", String.valueOf(tank.getPosition().getY()));
                responce.put("dx", String.valueOf(tank.getDx()));
                responce.put("dy", String.valueOf(tank.getDy()));
                responce.put("username", data.get("username").toString());
                sessions.stream().filter(Session::isOpen).forEach(sess -> {
                    try {
                        //TODO change message, need to send info about new tank only
                        sess.getRemote().sendString(String.valueOf(new JSONObject(responce)));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
                responce.clear();
                break;
            case MOVEMENT:
                int dx = (int)data.get("dx");
                int dy = (int)data.get("dy");
                if (TankController.isMoving(data.get("username").toString(), dx, dy)) {
                    String jsonTank = gson.toJson(TankController.getTank(data.get("username").toString()));
                    responce.put("action", "MOVEMENT");
                    responce.put("tank", jsonTank);
                    sessions.stream().filter(Session::isOpen).forEach(sess -> {
                        try {
                            sess.getRemote().sendString(String.valueOf(new JSONObject(responce)));
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
                }
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
                    UserController.getUser(data.get("username").toString())
                            .getSession().getRemote().sendString(String.valueOf(new JSONObject(responce)));
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