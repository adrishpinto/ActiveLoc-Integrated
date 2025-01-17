import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { cache } from "../index.js";
import { BlobServiceClient } from "@azure/storage-blob";
import verifyCookie from "../middleware/cookie.js";

dotenv.config();
const router = express.Router();

const API_ENDPOINT = process.env.API_ENDPOINT;
const API_KEY = process.env.API_KEY;

const sourceUrl = process.env.SRC_URL;
const targetUrl = process.env.DST_URL;

// Blob storage config]
const CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "source";
const BLOB_NAME = "filefd6dbd50-d3df-11ef-b369-d5dba4e36f36t.txt";

// delay download, note try to change this to status check and then delete.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/translate", verifyCookie, async (req, res) => {
  const { language } = req.body;

  cache.set("language", language);

  if (!sourceUrl || !targetUrl || !language) {
    return res
      .status(400)
      .send({ error: "sourceUrl, targetUrl, and language are required." });
  }

  const requestBody = {
    inputs: [
      {
        source: {
          sourceUrl,
          filter: {
            prefix: cache.get("blobName"),
          },
        },
        targets: [
          {
            targetUrl,
            language,
          },
        ],
      },
    ],
  };

  try {
    // Perform the translation request first
    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    res.status(200).send(response.data);

    await delay(60000);

    const DELETE_BLOB = cache.get("blobName");
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(CONNECTION_STRING);
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(DELETE_BLOB);

    await blockBlobClient.delete();
    console.log(`Blob ${BLOB_NAME} deleted successfully.`);
  } catch (error) {
    console.error("Error during translation or blob deletion:", error.message);
    res
      .status(500)
      .send({ error: "Failed to complete the translation or blob deletion." });
  }
});

export default router;
