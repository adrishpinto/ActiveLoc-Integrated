import express from "express";
import generateXliff from "./xliffFunc.js";
import { cache } from "../index.js";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import verifyCookie from "../middleware/cookie.js";

const router = express.Router();

router.get("/xliff", verifyCookie, async (req, res) => {
  try {
    const email = req.email;  
    console.log("Request received for XLIFF conversion. Email:", email);
    
    const sourceFile = cache.get(`sourceFile_${email}`);
    const targetFile = cache.get(`targetFile_${email}`);
    const extension = cache.get(`extension_${email}`);
    console.log("Source File:", sourceFile ? "Present" : "Missing");
    console.log("Target File:", targetFile ? "Present" : "Missing");
    console.log("File extension:", extension);

    // Check if source and target files are missing
    if (!sourceFile) {
      console.error("Source file is missing.");
      return res.status(400).send("Source file is missing or empty");
    }

    if (!targetFile) {
      console.error("Target file is missing.");
      return res.status(400).send("Target file is missing or empty");
    }

    let source = "";
    let target = "";

    // Process TXT files
    if (extension === "txt") {
      console.log("Processing TXT files...");
      source = sourceFile ? sourceFile.toString("utf-8") : "";
      target = targetFile ? targetFile.toString("utf-8") : "";
    }

    // Process PDF files
    if (extension === "pdf") {
      console.log("Processing PDF files...");
      source = sourceFile ? (await pdf(sourceFile)).text : "";
      target = targetFile ? (await pdf(targetFile)).text : "";
    }

    // Process DOCX files
    if (extension === "docx") {
      console.log("Processing DOCX files...");
      source = sourceFile
        ? (await mammoth.extractRawText({ buffer: sourceFile })).value
        : "";
      target = targetFile
        ? (await mammoth.extractRawText({ buffer: targetFile })).value
        : "";
    }

    // Unsupported or empty content check
    if (!source || !target) {
      console.error("Unsupported file type or empty content. Source:", source, "Target:", target);
      return res.status(400).send("Unsupported file type or empty content");
    }

    // Call to generate XLIFF file
    console.log("Generating XLIFF file...");
    const outputFilePath = await generateXliff(source, target);

    if (!outputFilePath) {
      console.error("Error generating XLIFF file. Output file path is missing.");
      return res.status(500).send("Error generating XLIFF file");
    }

    // Send file for download
    console.log("Sending XLIFF file for download:", outputFilePath);
    res.setHeader("Content-Disposition", "attachment; filename=output.xliff");
    res.setHeader("Content-Type", "application/xml");

    res.sendFile(outputFilePath);
  } catch (error) {
    console.error("Error in /xliff endpoint:", error);
    res.status(500).send(error.message || "Error generating XLIFF file");
  }
});



router.get("/generate-xliff", async (req, res) => {
  try {
    // Call the `generateXliff` function
    const result = await generateXliff();
    res.status(200).json({
      message: "XLIFF file generated successfully",
      filePath: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
