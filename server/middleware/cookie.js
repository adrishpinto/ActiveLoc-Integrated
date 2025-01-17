import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

function verifyCookie(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.email = decoded.email;
    req.userId = decoded.userId;
    req.group = decoded.group;
    req.name = decoded.name;

    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

export default verifyCookie;
