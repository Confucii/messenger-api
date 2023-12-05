import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkAuth from "../middlewares/userHandler";
import escapeStringRegexp from "escape-string-regexp";
import { isValidObjectId } from "mongoose";

export const register = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const userExists = await User.findOne({ username: req.body.username });
  if (!userExists) {
    let password = req.body.password;
    if (password.length >= 8) {
      password = await bcrypt.hash(req.body.password, 10);
    }
    const newUser = new User({
      username: req.body.username,
      password: password,
      displayName: req.body.displayName,
    });
    const err = newUser.validateSync();
    if (err) throw err;
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        error: {
          errors: { confirmPassword: { message: "Passwords do not match" } },
        },
      });
    }
    await newUser.save();
    return res.status(200).json({ message: "Registered successfully" });
  } else {
    return res.status(400).json({
      error: {
        errors: { username: { message: "Username is taken" } },
      },
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({
      error: {
        errors: { login: { message: "Username or password is incorrect" } },
      },
    });
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).json({
      error: {
        errors: { login: { message: "Username or password is incorrect" } },
      },
    });
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
    .cookie("auth", user.id, {
      maxAge: 60 * 60 * 1000,
      // secure: true
    })
    .end();
};

export const logout = async (_req: Request, res: Response) => {
  return res.status(200).clearCookie("token").clearCookie("auth").end();
};

export const getUser = async (req: Request, res: Response) => {
  const $regex = escapeStringRegexp(req.params.userData);
  const user = await User.find(
    {
      $or: [
        { displayName: { $regex, $options: "i" } },
        { username: { $regex, $options: "i" } },
      ],
    },
    "displayName status"
  );

  if (user.length > 0) {
    return res.status(200).json(user);
  }

  if (isValidObjectId(req.params.userData)) {
    const userById = await User.findById(
      req.params.userData,
      "displayName status"
    );

    if (userById) {
      return res
        .status(200)
        .json({ displayName: userById.displayName, status: userById.status });
    }
  }

  return res.status(404).json({ message: "No search results" });
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
      const match = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!match) {
        return res.status(400).json({
          error: {
            errors: {
              currentPassword: {
                message: "Password is incorrect",
              },
            },
          },
        });
      } else if (req.body.newPassword < 8) {
        return res.status(400).json({
          error: {
            errors: {
              newPassword: {
                message: "New password is shorter than 8 characters",
              },
            },
          },
        });
      } else if (req.body.newPassword !== req.body.newPasswordConfirm) {
        return res.status(400).json({
          error: {
            errors: {
              newPassword: {
                message: "Passwords do not match",
              },
            },
          },
        });
      } else {
        req.body.password = await bcrypt.hash(req.body.newPassword, 10);
      }
    } else if (
      req.body.oldPassword ||
      req.body.newPassword ||
      req.body.newPasswordConfirm
    ) {
      return res.status(400).json({
        error: {
          errors: {
            passwords: {
              message: "All input fields should be filled",
            },
          },
        },
      });
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
