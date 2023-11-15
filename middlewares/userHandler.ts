import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
}

export default async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let decodedToken;
  let token = cookieExtractor(req);

  if (token) {
    decodedToken = jwt.verify(
      token,
      process.env.SECRET as string
    ) as JwtPayload;
  }

  if (!decodedToken) {
    return res
      .status(401)
      .clearCookie("token")
      .clearCookie("auth")
      .json({ error: "Token invalid" });
  }

  let user = await User.findById(decodedToken.id);
  if (user) {
    req.user = decodedToken.id;
  } else {
    res.status(401).clearCookie("token").clearCookie("auth").end();
  }

  next();
}
