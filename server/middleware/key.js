import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const JWT_KEY = process.env.JWT_KEY;

if (!JWT_KEY) {
  console.error("Error: JWT_KEY is not defined in the environment variables.");
  process.exit(1);
}

const token = jwt.sign({}, JWT_KEY, { expiresIn: "1h" });

console.log("Bearer", token);
