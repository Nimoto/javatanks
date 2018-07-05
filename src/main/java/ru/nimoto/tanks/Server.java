package ru.nimoto.tanks;

import ru.nimoto.tanks.controllers.IndexController;
import ru.nimoto.tanks.util.Filters;
import ru.nimoto.tanks.util.Path;
import ru.nimoto.tanks.util.SimpleWebSocket;
import ru.nimoto.tanks.util.ViewUtil;

import static spark.Spark.*;

public class Server {
    public static void main(String[] args) {
        port(8080);

        staticFiles.location("/public");
        staticFiles.expireTime(600L);

        webSocket("/chat/", SimpleWebSocket.class);

        before("*", Filters.addTrailingSlashes);
        before("*", Filters.handleLocaleChange);

        get(Path.Web.INDEX, IndexController.serveIndexPage);
        get("*", ViewUtil.notFound);

        after("*", Filters.addGzipHeader);

        init();
    }
}
