import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Logger } from "./logger.js";
import { parseExcel, parseCSV } from "../parsers/fileParser.js";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Parses Excel or CSV file to structured JSON with validation and logging
 * @param {string} filePath - Path to file
 * @returns {Object} Structured and validated data
 * @throws {Error} If file type is not supported or file is invalid
 */
export function parseFile(filePath) {
  Logger.section("Starting File Processing");
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".xlsx":
    case ".xls":
      return parseExcel(filePath);
    case ".csv":
      return parseCSV(filePath);
    default:
      Logger.error(
        "Unsupported file type. Please provide an Excel (.xlsx, .xls) or CSV file."
      );
      throw new Error(
        "Unsupported file type. Please provide an Excel (.xlsx, .xls) or CSV file."
      );
  }
}

// Example usage:
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const realDataPath = path.resolve(__dirname, "../mock/realdata.xlsx");
  parseFile(realDataPath)
    .then((result) => {
      Logger.section("Final Status");
      Logger.success("Processing completed successfully!");
    })
    .catch((error) => {
      Logger.section("Final Status");
      Logger.error(`Processing failed: ${error.message}`);
      process.exit(1);
    });
}
