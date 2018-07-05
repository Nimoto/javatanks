package ru.nimoto.tanks.util;

import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import org.json.JSONArray;
import org.json.JSONObject;
//TODO почему не работает импорт? Переиндексация?
import ru.nimoto.tanks.controllers.UserController;
import ru.nimoto.tanks.models.*;

import java.io.*;
import java.util.*;
import java.util.concurrent.*;


enum Command {
    GAMESTATUS,
    AUTH
}

@WebSocket
public class SimpleWebSocket {

    // Store sessions if you want to, for example, broadcast a message to all users
    private static final Queue<Session> sessions = new ConcurrentLinkedQueue<>();

    @OnWebSocketConnect
    public void connected(Session session) throws IOException {
        sessions.add(session);
    }

    @OnWebSocketClose
    public void closed(Session session, int statusCode, String reason) {
        sessions.remove(session);
        UserController.deleteUser(session);
    }

    @OnWebSocketMessage
    public void message(Session session, String message) throws IOException {
        System.out.println(message);
        HashMap<String, Object> data = (HashMap<String, Object>) new JSONObject(message).toMap();
        if (data.containsKey("action")) {
            Command action = Command.valueOf(data.get("action").toString());
            HashMap<String, String> responce = new HashMap<>();
            switch (action) {
                case AUTH:
                    responce.put("action", "AUTH");
                    if (UserController.setUser(session, data.get("username").toString())) {
                        responce.put("status", "success");
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
                    break;
                case GAMESTATUS:
                    sessions.stream().filter(Session::isOpen).forEach(sess -> {
                        try {
                            sess.getRemote().sendString(message);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
                    break;
            }
        }
    }
}