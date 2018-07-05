package ru.nimoto.tanks.util;

import org.apache.velocity.app.*;
import org.eclipse.jetty.http.*;
import spark.*;
import spark.template.velocity.*;
import java.util.*;

import static ru.nimoto.tanks.util.RequestUtil.getSessionCurrentUser;
import static ru.nimoto.tanks.util.RequestUtil.getSessionLocale;

public class ViewUtil {

    public static String render(Request request, Map<String, Object> model, String templatePath) {
        model.put("msg", new MessageBundle(getSessionLocale(request)));
        model.put("currentUser", getSessionCurrentUser(request));
        model.put("WebPath", Path.Web.class);
        System.out.println(templatePath);
        return strictVelocityEngine().render(new ModelAndView(model, templatePath));
    }

    public static Route notFound = (Request request, Response response) -> {
        if (!request.pathInfo().contains("chat")) {
            response.status(HttpStatus.NOT_FOUND_404);
            return render(request, new HashMap<>(), Path.Template.NOT_FOUND);
        }
        return null;
    };

    private static VelocityTemplateEngine strictVelocityEngine() {
        VelocityEngine configuredEngine = new VelocityEngine();
        configuredEngine.setProperty("runtime.references.strict", true);
        configuredEngine.setProperty("resource.loader", "class");
        configuredEngine.setProperty("class.resource.loader.class", "org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader");
        return new VelocityTemplateEngine(configuredEngine);
    }
}
