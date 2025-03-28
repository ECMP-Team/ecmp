import { utils, writeFile } from "xlsx";

// Sample data with various test cases
const data = [
  // Headers
  ["email", "name", "status", "notes"],
  // Valid entries
  ["test1@example.com", "John Doe", "active", "Valid email"],
  ["test2@example.com", "Jane Smith", "inactive", "Valid email 2"],
  // Invalid entries
  ["invalid.email", "Bad Email", "active", "Invalid format"],
  ["", "Empty Email", "active", "Missing email"],
  ["test1@example.com", "Duplicate", "active", "Duplicate email"],
  // Empty row
  ["", "", "", ""],
  // Mixed case email
  ["Test3@Example.COM", "Mixed Case", "active", "Will be standardized"],
];

// Create workbook
const wb = utils.book_new();
const ws = utils.aoa_to_sheet(data);

// Add worksheet to workbook
utils.book_append_sheet(wb, ws, "Test Data");

// Write to file
writeFile(wb, "mock/sample.xlsx");
console.log("Sample Excel file created successfully!");
