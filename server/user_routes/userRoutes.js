import express, { Router } from "express";
import User from "../models/User.js";
import GoogleUser from "../models/GoogleUser.js";
import verifyCookie from "../middleware/cookie.js";
import verifyToken from "../middleware/userCreationToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
const router = Router();

//create base user
router.post("/create-user", verifyToken, async (req, res) => {
  try {
    const { password, email, first_name, last_name, group, form_filled } =
      req.body;

    if (!password || !email || !first_name || !last_name || !group) {
      return res.status(400).json({
        message:
          "Please provide email, password, first name, last name, and group",
      });
    }

    const newUser = await User.create({
      email,
      password,
      first_name,
      last_name,
      group,
      form_filled: form_filled || false,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while creating the user",
    });
  }
});

//update user
router.put("/edit-user/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const { password, first_name, last_name, group, form_filled } = req.body;

    const validGroups = ["Admin", "Sales", "Operations", "Customer", "Vendor"];

    if (!email || !first_name || !last_name || !group) {
      return res.status(400).json({
        message:
          "Please provide email, first name, last name, and group to update",
      });
    }

    if (!validGroups.includes(group)) {
      return res.status(400).json({
        message: `Invalid group. Allowed groups are: ${validGroups.join(", ")}`,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        password,
        first_name,
        last_name,
        group,
        form_filled: form_filled || false,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found with the provided email",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the user",
    });
  }
});

//form for customers
router.post("/update-user-form", verifyCookie, async (req, res) => {
  try {
    const {
      customer_code,
      customer_type,
      customer_id,
      company_name,
      form_filled,
    } = req.body;
    const email = req.email;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        customer_code: customer_code || undefined,
        customer_type: customer_type || undefined,
        customer_id: customer_id || undefined,
        company_name: company_name || undefined,
        form_filled: form_filled !== undefined ? form_filled : undefined,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the user",
    });
  }
});

//get one user
router.get("/user/:email?", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;

    let users;
    if (email) {
      users = await User.findOne({ email });
      if (!users) {
        return res.status(404).json({
          message: "User not found with the provided email",
        });
      }
    } else {
      users = await User.find();
    }

    res.status(200).json({
      message: email
        ? "User retrieved successfully"
        : "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving the users",
    });
  }
});

//get all users
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving the users",
    });
  }
});

export default router;
