import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface userPayload {
  userID: string;
}

declare module "express-serve-static-core" {
  //inclusing user in request interface
  interface Request {
    user: userPayload;
  }
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  console.log(`authheader = ${authHeader}`);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(`token = ${token}`);

  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const payload = user as userPayload; //type assertion
    req.user = payload;
    next();
  });
};
