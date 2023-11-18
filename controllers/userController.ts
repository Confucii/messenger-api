import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkAuth from "../middlewares/userHandler";
import escapeStringRegexp from "escape-string-regexp";

export const register = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const userExists = await User.findOne({ username: req.body.username });
  if (!userExists) {
    if (req.body.password < 8) {
      return res
        .status(401)
        .json({ error: "Password is shorter than 8 characters" });
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: password,
      displayName: req.body.displayName,
    });
    await newUser.save();
    return res.status(200).json({ message: "Registered successfully" });
  } else {
    return res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: "Incorrect username" });
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET as string, {
    expiresIn: "1h",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      //secure: true,
    })
    .cookie("auth", user.username, {
      maxAge: 60 * 60 * 1000,
      // secure: true
    })
    .end();
};

export const logout = async (_req: Request, res: Response) => {
  return res.status(200).clearCookie("token").clearCookie("auth").end();
};

export const getUser = async (req: Request, res: Response) => {
  const $regex = escapeStringRegexp(req.params.displayname);
  const user = await User.find(
    { displayName: { $regex, $options: "i" } },
    "displayName status"
  );

  if (user === null) {
    return res.status(404).end();
  }

  return res.status(200).json(user);
};

export const updateUser = [
  checkAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user);

    if (user === null) {
      return res.status(404).end();
    }

    if (
      req.body.oldPassword &&
      req.body.newPassword &&
      req.body.newPasswordConfirm
    ) {
      if (req.body.newPassword < 8) {
        return res
          .status(401)
          .json({ error: "Password is shorter than 8 characters" });
      }
      const match = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!match) {
        res.status(400).json({ message: "Current password does not match" });
      } else if (req.body.newPassword !== req.body.newPasswordConfirm) {
        res.status(400).json({ message: "New password does not match" });
      } else {
        req.body.password = await bcrypt.hash(req.body.newPassword, 10);
      }
    } else if (
      req.body.oldPassword ||
      req.body.newPassword ||
      req.body.newPasswordConfirm
    ) {
      return res
        .status(400)
        .json({ message: "All input fields should be filled in" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        ...(req.body.password && { password: req.body.password }),
        ...(req.body.displayName && { displayName: req.body.displayName }),
        ...(req.body.status && { status: req.body.status }),
      },
      { runValidators: true, new: true }
    );
    return res.status(200).json({
      displayName: updatedUser?.displayName,
      status: updatedUser?.status,
    });
  },
];
