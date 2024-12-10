const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { authCookieName } = require("../app-config");


module.exports = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser(authCookieName));
    app.use(express.static(path.resolve(__basedir, "static")));
};
