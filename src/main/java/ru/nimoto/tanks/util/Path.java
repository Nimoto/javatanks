package ru.nimoto.tanks.util;

import lombok.Getter;

public class Path {

    // The @Getter methods are needed in order to access
    // the variables from Velocity Templates
    public static class Web {
        @Getter
        public static final String INDEX = "/index/";
    }

    public static class Template {
        public static final String INDEX = "/velocity/index/index.vm";
        public static final String NOT_FOUND = "/velocity/notFound.vm";
    }

}
