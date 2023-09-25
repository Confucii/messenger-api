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
  body("displayName").trim().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      userExists = await User.findOne({ username: req.body.username });
      if (!userExists) {
        password = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          username: req.body.username,
          password: password,
          displayName: req.body.displayName,
        });
        newUser.save();
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

exports.logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("token", { sameSite: "none" /* secure: true */ })
    .json({
      logout: true,
      // Add Secure
      auth: `auth=false; Max-Age=${0}; SameSite=None;`,
    });
});
