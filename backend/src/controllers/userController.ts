import { User } from "../config/database";
import { Request, Response } from "express";
import userSchema, { validateUsername } from "../helpers/userValidation";
import bcrypt from "bcryptjs";
import generateToken from "../helpers/tokens";

const register = async (req: Request, res: Response) => {
  let { firstName, lastName, email, password } = req.body;

  //validation
  const validation = userSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  if (!validation.success) {
    //validation for user inputs
    return res.status(400).json({
      errors: validation.error.format(),
    });
  }

  let tempUsername = firstName + lastName;
  let newUsername = await validateUsername(tempUsername);

  try {
    //hash
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    //check if a user with same email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "user already exists" });
    // console.log(existingUser);

    const user = await User.create({
      firstName,
      lastName,
      username: newUsername,
      email,
      password: hashPassword,
    });
    console.log(user);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    // console.error("Error during user registration:", error);
    res.status(500).json({ error: "User registration failed" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "all fields required" });
  }

  try {
    //fetching from db
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Incorrect email address" });

    //compare pass
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "invalid credentials" });

    const token = generateToken({ id: user.userID.toString() }, "30d");
    res.send({
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      token: token,
      email: user.email,
      createAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Loging error" });
  }
};

// const logout = async (req: Request, res: Response) => {
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//   });
//   return res.status(200).json({ message: "User logges out successfully" });
// };

export { register, login};
