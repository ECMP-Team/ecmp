import fs from "fs";
import { MAX_FILE_SIZE } from "../config/config.js";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates and standardizes an email address
 * @param {string} email - Email to validate
 * @returns {{ isValid: boolean, email: string|null, reason?: string }}
 */
export function validateEmail(email) {
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
export function validateFileSize(filePath) {
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
 * Validates headers and finds email column
 * @param {string[]} headers - Array of headers
 * @returns {{ isValid: boolean, emailColumnIndex: number, reason?: string }}
 */
export function validateHeaders(headers) {
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
