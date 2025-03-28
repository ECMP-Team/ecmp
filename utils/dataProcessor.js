import { Logger } from "./logger.js";
import { validateEmail, validateHeaders } from "./validators.js";

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
 * Processes data and returns structured output with integrated logging
 * @param {Array} rows - Raw data rows
 * @param {Array} headers - Header row
 * @returns {Object} Structured and validated data
 */
export function processData(rows, headers) {
  Logger.section("Starting Data Processing");
  Logger.info(`Processing ${rows.length} rows of data`);

  const headerValidation = validateHeaders(headers);
  if (!headerValidation.isValid) {
    Logger.error(headerValidation.reason);
    throw new Error(headerValidation.reason);
  }

  Logger.success("Headers validated successfully");
  Logger.info(
    `Found email column at position: ${headerValidation.emailColumnIndex + 1}`
  );

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
  let currentBatch = 0;
  const batchSize = 100;

  Logger.section("Processing Rows");

  rows.forEach((row, rowIndex) => {
    // Log progress in batches
    if (rowIndex % batchSize === 0) {
      currentBatch++;
      Logger.info(
        `Processing batch ${currentBatch} (rows ${rowIndex + 1}-${Math.min(
          rowIndex + batchSize,
          rows.length
        )})`
      );
    }

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

    // Handle empty rows
    if (!hasNonEmptyValues) {
      result.errors.push({
        row: rowIndex + 2,
        reason: "Empty row",
      });
      return;
    }

    // Handle invalid emails
    if (!emailValidation.isValid) {
      result.metadata.invalidEmails++;
      result.errors.push({
        row: rowIndex + 2,
        email: emailValidation.email,
        reason: emailValidation.reason,
      });
      return;
    }

    // Handle duplicates
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

  logResults(result);
  return result;
}

/* ----------------------------------------------------------------------------- */
/**
 * Logs the processing results
 * @param {Object} result - The processing results
 */
function logResults(result) {
  // Log final results
  Logger.section("Processing Results");
  Logger.success(`Total rows processed: ${result.metadata.totalRows}`);
  Logger.info(`Valid emails found: ${result.metadata.validEmails}`);
  Logger.warning(`Invalid emails found: ${result.metadata.invalidEmails}`);
  Logger.warning(`Duplicates removed: ${result.metadata.duplicatesRemoved}`);

  // Log sample of valid entries
  if (result.data.length > 0) {
    Logger.section("Sample Valid Entries");
    const sampleSize = Math.min(3, result.data.length);
    result.data.slice(0, sampleSize).forEach((entry, index) => {
      console.log(`\nEntry ${index + 1}:`);
      Object.entries(entry).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    });
  }

  // Log errors by type
  if (result.errors.length > 0) {
    Logger.section("Error Summary");
    const errorsByType = result.errors.reduce((acc, error) => {
      const type = error.reason;
      if (!acc[type]) acc[type] = [];
      acc[type].push(error);
      return acc;
    }, {});

    Object.entries(errorsByType).forEach(([type, errors]) => {
      Logger.warning(`${type} (${errors.length} occurrences):`);
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
}

/**
 * Converts processed lead data into individual email objects
 * @param {Array} processedData - The processed data from the Excel/CSV file
 * @param {Object} template - Email template with subject, text, html (can contain placeholders)
 * @returns {Array} Array of email objects ready to be sent individually
 */
export function createIndividualEmails(processedData, template) {
  Logger.section("Creating Individual Emails");
  
  if (!processedData || !processedData.data || processedData.data.length === 0) {
    Logger.warning("No valid data to create emails from");
    return [];
  }
  
  if (!template || (!template.subject || (!template.text && !template.html))) {
    Logger.error("Invalid template provided");
    throw new Error("Template must include subject and either text or html content");
  }
  
  Logger.info(`Creating ${processedData.data.length} individual emails`);
  
  const emails = processedData.data.map(lead => {
    // Find the email field in the lead data
    const emailField = Object.keys(lead).find(key => 
      key.toLowerCase().includes('email')
    );
    
    if (!emailField || !lead[emailField]) {
      Logger.warning(`Skipping lead with missing email: ${JSON.stringify(lead)}`);
      return null;
    }
    
    // Replace placeholders in the template
    let subject = template.subject;
    let text = template.text || '';
    let html = template.html || '';
    
    // Replace all placeholders like {{fieldName}} with actual values
    Object.keys(lead).forEach(field => {
      const placeholder = new RegExp(`{{\\s*${field}\\s*}}`, 'g');
      const value = lead[field] || '';
      
      subject = subject.replace(placeholder, value);
      if (text) text = text.replace(placeholder, value);
      if (html) html = html.replace(placeholder, value);
    });
    
    return {
      recipient: lead[emailField],
      subject,
      text,
      html
    };
  }).filter(Boolean); // Remove null entries
  
  Logger.success(`Created ${emails.length} individual emails`);
  return emails;
}
