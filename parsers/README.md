# File Parser Documentation

## Overview

The file parser module provides functionality to parse Excel (.xlsx, .xls) and CSV files into a structured JSON format with email validation and data cleaning.

## Features

- Excel and CSV file support
- File size validation
- Email validation
- Duplicate detection
- Header standardization
- Detailed error reporting
- Progress logging

## Installation

```bash
npm install xlsx csv-parse
```

## Usage

```javascript
import { parseFile } from "../utils/excelParser.js";

try {
  const result = await parseFile("path/to/your/file.xlsx");
  console.log("Valid data:", result.data);
} catch (error) {
  console.error("Error:", error.message);
}
```

## Input Requirements

### Supported File Types

- Excel (.xlsx, .xls)
- CSV (.csv)

### File Structure

- Must have headers in the first row
- Must contain an email column (case-insensitive)
- Must have at least one data row

### Size Limits

- Maximum file size is configured in `config.js`
- Default: 10MB

## Output Format

The parser returns an object with the following structure:

```javascript
{
  metadata: {
    totalRows: number,        // Total rows processed
    validEmails: number,      // Valid unique emails found
    invalidEmails: number,    // Invalid emails found
    duplicatesRemoved: number // Duplicate emails found
  },
  data: [
    // Array of valid rows with standardized headers
    {
      email: "example@domain.com",
      otherColumn1: "value1",
      otherColumn2: "value2"
    }
  ],
  errors: [
    // Details about invalid rows
    {
      row: 2,                 // 1-based row number
      email: "invalid@email", // Only for email-related errors
      reason: "Invalid email format"
    }
  ]
}
```

## Validation Rules

### Email Validation

- Must be non-empty
- Must match standard email format
- Must be unique (duplicates are removed)
- Format: username@domain.tld

### Header Processing

- Headers are standardized to camelCase
- Special characters are removed
- Email column must exist

### Data Cleaning

- Empty rows are removed
- Whitespace is trimmed
- Email addresses are converted to lowercase
- Null values are standardized

## Error Types

1. **File Errors**

   - "File does not exist"
   - "File size exceeds maximum limit"
   - "Unsupported file type"
   - "File must contain headers and at least one data row"

2. **Header Errors**

   - "No headers found"
   - "No email column found"

3. **Data Errors**
   - "Empty row"
   - "Invalid email format"
   - "Email is empty"
   - "Duplicate email"

## Progress Logging

The parser provides detailed progress logging:

```
📝 Processing Excel File
----------------------------------------
✅ File size validation passed
📝 Found 1 sheet(s), using first sheet: Sheet1
📝 Processing 100 rows of data
✅ Headers validated successfully
⚠️ Invalid emails found: 5
⚠️ Duplicates removed: 2
```

## Example Files

### Valid Excel/CSV Structure

```csv
email,name,status
john@example.com,John Doe,active
jane@example.com,Jane Smith,inactive
```

### Common Issues

```csv
# Missing email column
name,status
John Doe,active

# Invalid email format
email,name,status
not-an-email,John Doe,active

# Duplicate emails
email,name,status
john@example.com,John Doe,active
john@example.com,John Smith,active
```

## Error Handling

```javascript
try {
  const result = await parseFile("contacts.xlsx");

  // Check for processing errors
  if (result.errors.length > 0) {
    console.log("Issues found:");
    result.errors.forEach((error) => {
      console.log(`Row ${error.row}: ${error.reason}`);
    });
  }

  // Use valid data
  const validEmails = result.data.map((row) => row.email);
} catch (error) {
  // Handle critical errors
  console.error("Processing failed:", error.message);
}
```

## Best Practices

1. **File Preparation**

   - Ensure files have consistent headers
   - Clean data before processing
   - Keep file size under limits

2. **Error Handling**

   - Always check for errors in the result
   - Handle both critical errors and data issues
   - Log errors for debugging

3. **Performance**
   - Process files in batches
   - Monitor memory usage for large files
   - Consider streaming for very large files

## Contributing

Feel free to submit issues and enhancement requests!
