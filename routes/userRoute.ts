import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", async (req: Request, res: Response): Promise<Response> => {
  try {
    const password: string = req.body.password;
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User already exists", success: false });
    }

    const user = new User(req.body);
    await user.save();

    return res
      .status(200)
      .send({ message: "User registered successfully", success: true });
  } catch (error) {
    const err = error as Error;
    return res.status(500).send({ message: err.message, success: false });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User does not exist", success: false });
    }

    const passwordsMatched = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (passwordsMatched) {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY as string, {
        expiresIn: "1d",
      });
      return res.status(200).send({
        message: "User logged in successfully",
        success: true,
        data: token,
      });
    } else {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    }
  } catch (error) {
    const err = error as Error;
    return res.status(500).send({ message: err.message, success: false });
  }
});

router.post(
  "/get-user-data",
  authMiddleware,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await User.findById(req.body.userId).select("-password");
      if (!user) {
        return res.status(404).send({ message: "User not found", success: false });
      }
      return res.status(200).send({
        message: "User data fetched successfully",
        success: true,
        data: user,
      });
    } catch (error) {
      const err = error as Error;
      return res.status(500).send({ message: err.message, success: false });
    }
  }
);

export default router;
