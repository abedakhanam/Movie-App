import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface userPayload {
  userID: string;
}

declare module "express-serve-static-core" {
  //inclusing user in request interface
  interface Request {
    user?: userPayload;
  }
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  // console.log(`authheader = ${authHeader}`);
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(`token = ${token}`);

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  if (!process.env.SECRET_TOKEN) {
    return res
      .status(500)
      .json({ message: "Internal server error: missing JWT secret" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "d6d2e2a78e3d741e58e1b547f199626ff4624685" as string
    ) as JwtPayload;
    req.user = {
      userID: decoded.userID as string,
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
