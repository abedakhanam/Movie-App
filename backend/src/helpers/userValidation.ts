import { z } from "zod";
import { User } from "../config/database";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Example usage:
// const validation = userSchema.safeParse(userData);

export const validateUsername = async (username: string) => {
  let a = false;
  do {
    let check = await User.findOne({ where: { username } });
    if (check) {
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};

export default userSchema;
