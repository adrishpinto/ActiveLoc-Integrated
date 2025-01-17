import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import verifyCookie from "../middleware/cookie.js";
import verifyToken from "../middleware/userCreationToken.js";
dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: email,
        group: user.group,
        access_level: user.access_level,
        name: user.first_name,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

router.get("/check-google-email", verifyCookie, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/google-user", verifyCookie, async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }
    await GoogleUser.create({ email, password });

    res.status(200).json({ message: "Google user saved in DB" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get("/cookie-data", verifyCookie, (req, res) => {
  try {
    const email = req.email;
    const group = req.group;
    const name = req.name;
    res.json({ email: email, group: group, name: name });
  } catch (error) {
    req.json({ error: error });
  }
});
export default router;
