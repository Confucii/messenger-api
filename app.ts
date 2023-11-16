import express, { Express } from "express";
import { errorHandler } from "./middlewares/errors";
require("express-async-errors");
import userRouter from "./routes/userRouter";
import messageRouter from "./routes/messageRouter";
import chatRouter from "./routes/chatRouter";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let app: Express = express();

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoDB) await mongoose.connect(mongoDB);
}

connectDB()
  .then(() => {
    console.log("Successful database connection");
  })
  .catch((err) => console.log(err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("dist_front"));

app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.use("/chats", chatRouter);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
