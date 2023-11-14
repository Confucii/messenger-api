import express, { Express, Request, Response, NextFunction } from "express";
import { errorHandler } from "./middlewares/errors";
import dotenv from "dotenv";
dotenv.config();
import indexRouter from "./routes/defaultRouter";
import usersRouter from "./routes/users";

let createError = require("http-errors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let app: Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
