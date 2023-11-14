import express from "express";
let indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/", function (_req, res, _next) {
  res.json({ cool: "hello" });
});

export default indexRouter;
