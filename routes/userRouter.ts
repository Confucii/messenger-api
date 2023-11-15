import express from "express";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", userController.getUser);

userRouter.put("/", userController.updateUser);

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.post("/logout", userController.logout);

export default userRouter;
