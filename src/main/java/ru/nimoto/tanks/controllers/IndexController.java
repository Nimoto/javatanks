package ru.nimoto.tanks.controllers;

import org.eclipse.jetty.server.session.Session;
import ru.nimoto.tanks.util.Path;
import ru.nimoto.tanks.util.ViewUtil;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.HashMap;
import java.util.Map;

public class IndexController {

    static Session session;

    public static Route serveIndexPage = (Request request, Response response) -> {
        Map<String, Object> model = new HashMap<>();
        model.put("users", UserController.getUsers());
        return ViewUtil.render(request, model, Path.Template.INDEX);
    };
}
