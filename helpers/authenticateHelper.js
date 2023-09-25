const asyncHandler = require("express-async-handler");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.loginHandler = asyncHandler(async (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: "none",
        // secure: true,
      })
      .json({
        // add Secure
        userId: `auth=${user._id}; Max-Age=${60 * 60}; SameSite=None;`,
      });
  })(req, res, next);
});

exports.jwtHandler = asyncHandler(async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, jwt_payload) => {
    if (err || !jwt_payload) {
      return res
        .status(401)
        .clearCookie("token")
        .json({
          // add Secure
          auth: `auth=false; Max-Age=${0}; SameSite=None;`,
        });
    }
    req.user = jwt_payload;
    next();
  })(req, res, next);
});
