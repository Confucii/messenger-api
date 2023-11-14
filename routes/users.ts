import express from "express";
let usersRouter = express.Router();

/* GET users listing. */
usersRouter.get("/", function (_req, res, _next) {
  res.send("respond with a resource");
});

export default usersRouter;
