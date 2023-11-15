import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: "Not found" });
  }

  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
};
