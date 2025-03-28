import { read, utils } from "xlsx";
import { parse } from "csv-parse/sync";
import fs from "fs";
import { Logger } from "../utils/logger.js";
import { validateFileSize } from "../utils/validators.js";
import { processData } from "../utils/dataProcessor.js";

/**
 * Parses Excel file to structured JSON with integrated logging
 */
export function parseExcel(filePath) {
  Logger.section("Processing Excel File");
  Logger.info(`Reading file: ${filePath}`);

  validateFileSize(filePath);
  Logger.success("File size validation passed");

  const workbook = read(filePath, { type: "file" });
  Logger.info(
    `Found ${workbook.SheetNames.length} sheets, using first sheet: ${workbook.SheetNames[0]}`
  );

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = utils.sheet_to_json(firstSheet, {
    header: 1,
    blankrows: false,
    raw: false,
  });

  if (rawData.length < 2) {
    Logger.error("File must contain headers and at least one data row");
    throw new Error("File must contain headers and at least one data row");
  }

  const [headers, ...rows] = rawData;
  return processData(rows, headers);
}

/**
 * Parses CSV file to structured JSON with integrated logging
 */
export function parseCSV(filePath) {
  Logger.section("Processing CSV File");
  Logger.info(`Reading file: ${filePath}`);

  validateFileSize(filePath);
  Logger.success("File size validation passed");

  const fileContent = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  Logger.info("File content loaded, parsing CSV data");

  const rawData = parse(fileContent, {
    skip_empty_lines: true,
    trim: true,
  });

  if (rawData.length < 2) {
    Logger.error("File must contain headers and at least one data row");
    throw new Error("File must contain headers and at least one data row");
  }

  const [headers, ...rows] = rawData;
  return processData(rows, headers);
}
