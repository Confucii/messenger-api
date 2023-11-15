import express, { Express } from "express";
import { errorHandler } from "./middlewares/errors";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/userRouter";
import { connectDB } from "./utils/dbConnect";
let createError = require("http-errors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let app: Express = express();

require("express-async-errors");

connectDB().catch((err) => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

app.use("/users", userRouter);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
