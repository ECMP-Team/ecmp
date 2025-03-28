import { read, utils } from "xlsx";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { MAX_FILE_SIZE } from "../config/config.js";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates and standardizes an email address
 * @param {string} email - Email to validate
 * @returns {{ isValid: boolean, email: string|null, reason?: string }}
 */
function validateEmail(email) {
  if (!email) {
    return { isValid: false, email: null, reason: "Email is empty" };
  }

  const cleanEmail = email.toString().trim().toLowerCase();

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return {
      isValid: false,
      email: cleanEmail,
      reason: "Invalid email format",
    };
  }

  return { isValid: true, email: cleanEmail };
}

/**
 * Validates file size
 * @param {string} filePath - Path to the file
 * @throws {Error} If file is too large or doesn't exist
 */
function validateFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  const stats = fs.statSync(filePath);
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }
}

/**
 * Standardizes header names to camelCase
 * @param {string} header - Header name to standardize
 * @returns {string} Standardized header name
 */
function standardizeHeader(header) {
  return header
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Validates headers and finds email column
 * @param {string[]} headers - Array of headers
 * @returns {{ isValid: boolean, emailColumnIndex: number, reason?: string }}
 */
function validateHeaders(headers) {
  if (!headers || headers.length === 0) {
    return { isValid: false, emailColumnIndex: -1, reason: "No headers found" };
  }

  const emailColumnIndex = headers.findIndex((header) =>
    header.toLowerCase().includes("email")
  );

  if (emailColumnIndex === -1) {
    return {
      isValid: false,
      emailColumnIndex: -1,
      reason: "No email column found",
    };
  }

  return { isValid: true, emailColumnIndex };
}

/**
 * Processes data and returns structured output
 * @param {Array} rows - Raw data rows
 * @param {Array} headers - Header row
 * @returns {Object} Structured and validated data
 */
function processData(rows, headers) {
  const headerValidation = validateHeaders(headers);
  if (!headerValidation.isValid) {
    throw new Error(headerValidation.reason);
  }

  const standardizedHeaders = headers.map(standardizeHeader);
  const emailColumnIndex = headerValidation.emailColumnIndex;

  const result = {
    metadata: {
      totalRows: rows.length,
      validEmails: 0,
      invalidEmails: 0,
      duplicatesRemoved: 0,
    },
    data: [],
    errors: [],
  };

  const seenEmails = new Set();

  rows.forEach((row, rowIndex) => {
    const emailValidation = validateEmail(row[emailColumnIndex]);
    const rowData = {};
    let hasNonEmptyValues = false;

    // Build row data with standardized headers
    standardizedHeaders.forEach((header, colIndex) => {
      const value = row[colIndex] || null;
      rowData[header] = value;
      if (value !== null && value !== "") {
        hasNonEmptyValues = true;
      }
    });

    // Skip completely empty rows
    if (!hasNonEmptyValues) {
      result.errors.push({
        row: rowIndex + 2, // +2 for 1-based indexing and header row
        reason: "Empty row",
      });
      return;
    }

    if (!emailValidation.isValid) {
      result.metadata.invalidEmails++;
      result.errors.push({
        row: rowIndex + 2,
        email: emailValidation.email,
        reason: emailValidation.reason,
      });
      return;
    }

    // Check for duplicates
    if (seenEmails.has(emailValidation.email)) {
      result.metadata.duplicatesRemoved++;
      result.errors.push({
        row: rowIndex + 2,
        email: emailValidation.email,
        reason: "Duplicate email",
      });
      return;
    }

    seenEmails.add(emailValidation.email);
    result.metadata.validEmails++;
    result.data.push(rowData);
  });

  return result;
}

/**
 * Parses Excel file to structured JSON
 * @param {string} filePath - Path to Excel file
 * @returns {Object} Structured and validated data
 */
function parseExcel(filePath) {
  validateFileSize(filePath);

  const workbook = read(filePath, { type: "file" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = utils.sheet_to_json(firstSheet, {
    header: 1,
    blankrows: false,
    raw: false,
  });

  if (rawData.length < 2) {
    // At least headers and one data row
    throw new Error("File must contain headers and at least one data row");
  }

  const [headers, ...rows] = rawData;
  return processData(rows, headers);
}

/**
 * Parses CSV file to structured JSON
 * @param {string} filePath - Path to CSV file
 * @returns {Object} Structured and validated data
 */
function parseCSV(filePath) {
  validateFileSize(filePath);

  const fileContent = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, ""); // Remove BOM if present

  const rawData = parse(fileContent, {
    skip_empty_lines: true,
    trim: true,
  });

  if (rawData.length < 2) {
    throw new Error("File must contain headers and at least one data row");
  }

  const [headers, ...rows] = rawData;
  return processData(rows, headers);
}

/**
 * Parses Excel or CSV file to structured JSON with validation
 * @param {string} filePath - Path to file
 * @returns {Object} Structured and validated data
 * @throws {Error} If file type is not supported or file is invalid
 */
export function parseFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".xlsx":
    case ".xls":
      return parseExcel(filePath);
    case ".csv":
      return parseCSV(filePath);
    default:
      throw new Error(
        "Unsupported file type. Please provide an Excel (.xlsx, .xls) or CSV file."
      );
  }
}

// Test function with detailed logging
async function testWithRealData(filePath) {
  try {
    console.log("\n📁 Processing file:", filePath);
    console.log("----------------------------------------");

    const result = parseFile(filePath);

    console.log("\n📊 Summary:");
    console.log("----------------------------------------");
    console.log(`Total rows processed: ${result.metadata.totalRows}`);
    console.log(`Valid emails found: ${result.metadata.validEmails}`);
    console.log(`Invalid emails found: ${result.metadata.invalidEmails}`);
    console.log(`Duplicates removed: ${result.metadata.duplicatesRemoved}`);

    console.log("\n✅ Sample of Valid Entries:");
    console.log("----------------------------------------");
    const sampleSize = Math.min(3, result.data.length);
    result.data.slice(0, sampleSize).forEach((entry, index) => {
      console.log(`\nEntry ${index + 1}:`);
      Object.entries(entry).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    });

    if (result.errors.length > 0) {
      console.log("\n⚠️ Errors Found:");
      console.log("----------------------------------------");
      const errorsByType = result.errors.reduce((acc, error) => {
        const type = error.reason;
        if (!acc[type]) acc[type] = [];
        acc[type].push(error);
        return acc;
      }, {});

      Object.entries(errorsByType).forEach(([type, errors]) => {
        console.log(`\n${type} (${errors.length} occurrences):`);
        const sampleErrors = errors.slice(0, 3);
        sampleErrors.forEach((error) => {
          console.log(
            `  Row ${error.row}${error.email ? ": " + error.email : ""}`
          );
        });
        if (errors.length > 3) {
          console.log(`  ... and ${errors.length - 3} more`);
        }
      });
    }

    return result;
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    throw error;
  }
}

// Example usage:
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const realDataPath = path.resolve(__dirname, "../mock/realdata.xlsx");
  testWithRealData(realDataPath)
    .then((result) => {
      console.log("\n✨ Processing completed successfully!");
    })
    .catch((error) => {
      console.error("\n❌ Processing failed:", error.message);
      process.exit(1);
    });
}
