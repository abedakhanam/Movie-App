import { sign } from "jsonwebtoken";

const generateToken = (payload: object, expired: string, token: string) => {
  return sign(payload, token, {
    expiresIn: expired,
  });
};

export default generateToken;
