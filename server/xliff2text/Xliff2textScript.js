import { Router } from "express";
import fs from "fs";
import { Parser } from "xml2js";
import multer from "multer";

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

      const units = result.file.unit;
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

      fs.unlink(xmlFilePath, (err) => {
        if (err) console.error("Error deleting the uploaded file:", err);
      });
    });
  });
});

export default router;
