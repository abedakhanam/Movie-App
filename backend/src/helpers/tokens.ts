import { sign } from "jsonwebtoken";

const generateToken = (payload: object, expired: string) => {
  return sign(payload, process.env.SECRET_TOKEN as string, {
    expiresIn: expired,
  });
};

export default generateToken;
