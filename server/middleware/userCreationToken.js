import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

export default function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(token, JWT_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}


