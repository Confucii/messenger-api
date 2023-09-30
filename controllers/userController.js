const { body, validationResult } = require("express-validator");
const authenticateHelper = require("../helpers/authenticateHelper");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

exports.register = [
  body("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Should be at least 5 characters long")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Should be at least 8 characters long")
    .escape(),
  body("displayName", "Display name should be at least 1 character long")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      userExists = await User.findOne({ username: req.body.username });
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
    }
  }),
];

exports.login = [
  body("username").escape(),
  body("password").escape(),
  (req, res, next) => {
    authenticateHelper.loginHandler(req, res, next);
  },
];

exports.logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("token", { sameSite: "none" /* secure: true */ })
    .json({
      logout: true,
      // Add Secure
      auth: `auth=false; Max-Age=${0}; SameSite=None;`,
    });
});

exports.getUser = [
  (req, res, next) => {
    authenticateHelper.jwtHandler(req, res, next);
  },

  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user);

    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json(user);
  }),
];

exports.updateUser = [
  (req, res, next) => {
    authenticateHelper.jwtHandler(req, res, next);
  },
  body("displayName").optional().trim().isLength({ min: 1 }).escape(),
  body("status").optional().trim().escape(),
  body("oldPassword")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Should be at least 8 characters long")
    .escape(),
  body("newPassword")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Should be at least 8 characters long")
    .escape(),
  body("newPasswordConfirm")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Should be at least 8 characters long")
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      const user = await User.findById(req.user);

      if (user === null) {
        const err = new Error("User not found");
        err.status = 404;
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
        res
          .status(400)
          .json({ message: "All input fields should be filled in" });
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
    }
  }),
];
