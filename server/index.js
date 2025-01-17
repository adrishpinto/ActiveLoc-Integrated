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
// hosting put secure cookies

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const cache = new NodeCache();
cache.set("blobName", "file1c32dee0-d3d7-11ef-975b-b93bfa00f4f4t.txt");
cache.set("sourceFile", "empty");
cache.set("targetFile", "empty");
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

app.use("/api", userRouter);
app.use("/api", loginRouter);
app.use("/api", blobUploadRouter);
app.use("/api", blobDownloadRouter);
app.use("/api", translateDocRouter);
app.use("/api", xliffRouter);
