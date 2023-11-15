import express, { Express } from "express";
import { errorHandler } from "./middlewares/errors";
import userRouter from "./routes/userRouter";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let app: Express = express();

require("express-async-errors");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoDB) await mongoose.connect(mongoDB);
}

connectDB()
  .then(() => {
    console.log("success");
  })
  .catch((err) => console.log(err));

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
