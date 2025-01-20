import fs from "fs/promises";
import path from "path";

export default async function generateXliff(src, tgt) {
  try {
    const sourceFilePath = path.resolve("./", "source.txt");
    const targetFilePath = path.resolve("./", "target.txt");
    const outputFilePath = path.resolve("./", "output.xliff");

    const sourceContent = src;
    const targetContent = tgt;

    function processContent(content) {
      const exceptions = [
        "Dr.",
        "Mr.",
        "Mrs.",
        "Ms.",
        "Prof.",
        "Sr.",
        "Jr.",
        "Rs.",
        "St.",
        "i.e.",
        "e.g.",
        "etc.",
        "Vol.",
        "vs.",
        "Inc.",
        "Ltd.",
      ];

      const lines = content.split("\n");

      const processedLines = lines.flatMap((line) => {
        if (!line.trim()) return [];

        const positions = [];

        for (let i = 0; i < line.length; i++) {
          if (
            // checking for ". "
            line[i] === "." &&
            (i === line.length - 1 || line[i + 1] === " ")
          ) {
            if (line[i + 1] === "." || (i > 0 && line[i - 1] === ".")) {
              continue;
            }
            // check exception ignore ". " if found
            let isException = false;
            for (const exception of exceptions) {
              const startIndex = i - exception.length + 1;
              if (startIndex >= 0) {
                const possibleException = line.slice(startIndex, i + 1);
                if (possibleException === exception) {
                  isException = true;
                  break;
                }
              }
            }

            if (!isException) {
              positions.push(i);
            }
          } else if (
            (line[i] === "?" || line[i] === "!") &&
            (i === line.length - 1 || line[i + 1] === " ")
          ) {
            positions.push(i);
          }
        }

        if (positions.length === 0) return [line.trim()];

        const sentences = [];
        let startPos = 0;

        positions.forEach((pos) => {
          const sentence = line.slice(startPos, pos + 1).trim();
          if (sentence) sentences.push(sentence);
          startPos = pos + 1;
        });

        const remaining = line.slice(startPos).trim();
        if (remaining) sentences.push(remaining);

        return sentences;
      });

      return processedLines;
    }

    const sourceLines = processContent(sourceContent);
    const targetLines = processContent(targetContent);

    // heaader for xliff file
    let xliffContent = `<?xml version="1.0" encoding="UTF-8"?>\n<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en" trgLang="fr">\n  <file id="xliff_translate" >\n `;

    const maxLength = Math.max(sourceLines.length, targetLines.length);

    for (let index = 0; index < maxLength; index++) {
      const sourceLine = sourceLines[index] || "";
      const targetLine = targetLines[index] || "";
      // each line format to this
      xliffContent += `      <unit id="${index + 1}">\n`;
      xliffContent += `        <segment>\n`;
      xliffContent += `          <source>${sourceLine}</source>\n`;
      xliffContent += `          <target>${targetLine}</target>\n`;
      xliffContent += `        </segment>\n`;
      xliffContent += `      </unit>\n`;
    }

    xliffContent += `      </file>\n</xliff>`;

    await fs.writeFile(outputFilePath, xliffContent, "utf-8");
    console.log(`success`);
    return outputFilePath;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
