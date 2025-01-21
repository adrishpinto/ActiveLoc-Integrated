import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./user_routes/userRoutes.js";
import blobDownloadRouter from "./translate_routes/blobDownloadRouter.js";
import blobUploadRouter from "./translate_routes/blobUploadRouter.js";
import xliffRouter from "./translate_routes/xliffRouter.js";
import translateDocRouter from "./translate_routes/translateDocRouter.js";
import cors from "cors";
import loginRouter from "./user_routes/loginRoutes.js";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";
import xlifftext from './xliff2text/xliff2textFunc.js';
// hosting put secure cookies

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://active-loc.vercel.app"],
    credentials: true,
  })
);
const cache = new NodeCache();

export { cache };

const PORT = process.env.PORT;

const URI = process.env.URI;

app.use(express.json());

mongoose
  .connect(URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });

app.get("/", (req, res) => {
  res.send("Server works ");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use(cookieParser());
app.use("/api", xlifftext)
app.use("/api", userRouter);
app.use("/api", loginRouter);
app.use("/api", blobUploadRouter);
app.use("/api", blobDownloadRouter);
app.use("/api", translateDocRouter);
app.use("/api", xliffRouter);
