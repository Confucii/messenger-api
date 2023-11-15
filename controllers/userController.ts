import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
const bcrypt = require("bcrypt");

export const register = async (req: Request, res: Response) => {
  const userExists = await User.findOne({ username: req.body.username });
  if (!userExists) {
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: password,
      displayName: req.body.displayName,
    });
    await newUser.save();
    res.status(200).json({ message: "Registered successfully" });
  } else {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req: Request, res: Response) => {};

export const logout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie("token", { sameSite: "none" /* secure: true */ })
    .json({
      logout: true,
      // Add Secure
      auth: `auth=false; Max-Age=${0}; SameSite=None;`,
    });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user);

  if (user === null) {
    const err = new Error("User not found");
    return next(err);
  }

  res.status(200).json(user);
};

export const updateUser = [
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user);

    if (user === null) {
      const err = new Error("User not found");
      return next(err);
    }

    if (
      req.body.oldPassword &&
      req.body.newPassword &&
      req.body.newPasswordConfirm
    ) {
      const match = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!match) {
        res.status(400).json({ message: "Current password does not match" });
      } else if (req.body.newPassword !== req.body.newPasswordConfirm) {
        res.status(400).json({ message: "Passwords do not match" });
      } else {
        req.body.password = await bcrypt.hash(req.body.newPassword, 10);
      }
    } else if (
      req.body.oldPassword ||
      req.body.newPassword ||
      req.body.newPasswordConfirm
    ) {
      res.status(400).json({ message: "All input fields should be filled in" });
    }
    await User.findByIdAndUpdate(
      req.user,
      {
        ...(req.body.password && { password: req.body.password }),
        ...(req.body.displayName && { displayName: req.body.displayName }),
        ...(req.body.status && { status: req.body.status }),
      },
      {}
    );
    res.status(200).send();
  },
];
