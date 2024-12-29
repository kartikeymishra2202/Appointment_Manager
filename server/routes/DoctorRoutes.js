import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET_ = process.env.JWT_SECRET;
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";
import DoctorModel from "../models/Doctor.js";

const doctorRoutes = Router();

doctorRoutes.post("/signup", async function (req, res) {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const availableSlots = req.body.availableSlots;
  //-------ZOD-Validation-----
  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    name: z.string().min(3).max(100),
    password: z.string().min(5).max(30),
  });

  const parsedDataWithSuccess = requireBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    res.status(401).json({
      message: "Incorrect Format",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 5);

  try {
    await DoctorModel.create({
      email: email,
      name: name,
      password: hashPassword,
      availableSlots: availableSlots,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.errmsg,
    });
  }

  return res.status(201).json({
    message: "You are signed in",
  });
});

doctorRoutes.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await DoctorModel.findOne({
    email: email,
  });
  if (!user) return res.status(401).json({ message: "user does not found" });
  const UserPassword = user.password;
  if (!UserPassword) {
    throw new Error("UserPassword is not defined");
  }

  const passwordMatch = await bcrypt.compare(password, UserPassword);
  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id,
        role: "doctor",
      },
      JWT_SECRET_,
      { expiresIn: "8h" }
    );

    //---------------------------------------------------------------------------------------------

    return res.status(201).json({
      message: "token generated successfully",
      token: token,
    });
  } else {
    return res.status(401).json({
      message: "Password is Incorrect",
    });
  }
});

doctorRoutes.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    message: "Logout Successfully",
  });
});

doctorRoutes.get("/list", async (req, res) => {
  const doctors = await DoctorModel.find();
  res.status(200).json({
    doctors: doctors,
  });
});

export default doctorRoutes;
