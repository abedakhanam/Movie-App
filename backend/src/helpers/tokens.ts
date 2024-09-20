import { sign } from "jsonwebtoken";

const generateToken = (payload: object, expired: string) => {
  return sign(payload, "d6d2e2a78e3d741e58e1b547f199626ff4624685" as string, {
    expiresIn: expired,
  });
};

export default generateToken;
