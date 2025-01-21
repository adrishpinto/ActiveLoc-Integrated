import { Router } from "express";
import fs from "fs";
import { Parser } from "xml2js";
import multer from "multer";
import { cache } from "../index.js";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = Router();
const parser = new Parser({
  explicitArray: false,
  mergeAttrs: true,
  explicitRoot: false,
  normalizeTags: true,
});

router.post("/xliff-text", upload.single("xliffFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const xmlFilePath = req.file.path;

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  if (fileExtension !== ".xml" && fileExtension !== ".xliff") {
    return res
      .status(400)
      .send("Invalid file type. Only .xml and .xliff files are allowed.");
  }

  fs.readFile(xmlFilePath, "utf-8", (err, xmlString) => {
    if (err) {
      console.error("Error reading the XML file:", err);
      return res.status(500).send("Error reading the XML file");
    }

    parser.parseString(xmlString, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return res.status(500).send("Error parsing XML");
      }

      // handling for one unit or many
      const units = Array.isArray(result.file.unit)
        ? result.file.unit
        : [result.file.unit];
      const sourceTexts = [];
      const targetTexts = [];

      units.forEach((unit) => {
        const sourceText = unit.segment.source;
        const targetText = unit.segment.target;

        sourceTexts.push(sourceText);
        targetTexts.push(targetText);
      });

      res.json({
        source: sourceTexts,
        target: targetTexts,
      });

      const sourceContent = sourceTexts.join("\n");
      const targetContent = targetTexts.join("\n");

      cache.set("sourceContent", sourceContent);
      cache.set("targetContent", targetContent);
      const filePath = "./xliff2text/output.txt";

      fs.unlink(xmlFilePath, (err) => {
        if (err) console.error("Error deleting the uploaded file:", err);
      });
    });
  });
});

router.get("/xliff-download-src", (req, res) => {
  const source = cache.get("sourceContent");

  if (!source) {
    return res.status(404).send("No source content found.");
  }

  console.log("Source Content:", source);

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sourceContent.txt"
  );
  res.setHeader("Content-Type", "text/plain");

  res.send(source);
});

router.get("/xliff-download-tgt", (req, res) => {
  const target = cache.get("targetContent");

  if (!target) {
    return res.status(404).send("No source content found.");
  }

  console.log("Target Content:", target);

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=targetContent.txt"
  );
  res.setHeader("Content-Type", "text/plain");

  res.send(target);
});

export default router;
