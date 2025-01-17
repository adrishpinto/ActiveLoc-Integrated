import { Router } from "express";
import multer from "multer";
import { BlobServiceClient } from "@azure/storage-blob";
import { v1 as uuidv1 } from "uuid";
import fs from "fs";
import { cache } from "../index.js";
import dotenv from "dotenv";
import verifyCookie from "../middleware/cookie.js";

dotenv.config();

const accountName = "translatefiles";
//source token

const sasToken = process.env.SRC_SAS_TOKEN;
const containerName = "source";
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);
const containerClient = blobServiceClient.getContainerClient(containerName);

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  verifyCookie,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    let blobName = "file" + uuidv1();

    if (fileExtension === "txt") {
      blobName += "t.txt";
      let extension = "extension";
      cache.set(extension, "txt");
    } else if (fileExtension === "pdf") {
      blobName += "p.pdf";
      let extension = "extension";
      cache.set(extension, "pdf");
    } else {
      blobName += "d.docx";
      let extension = "extension";
      cache.set(extension, "docx");
    }

    cache.set("blobName", blobName, 3600);
    console.log(blobName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      const uploadBlobResponse = await blockBlobClient.uploadFile(
        req.file.path
      );
      console.log(
        `Blob uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
      );

      const fileBuffer = fs.readFileSync(req.file.path);
      cache.set("sourceFile", fileBuffer, 3600);

      fs.unlinkSync(req.file.path);

      // const  = blockBlobClient.url;

      const blobUrl = cache.get("blobName");
      console.log("upload cache set to :", blobUrl);

      res.status(200).json({
        message: "File uploaded successfully.",
        blobName: blobUrl,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Error uploading file.");
    }
  }
);

export default router;
