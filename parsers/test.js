import { parseFile } from "../utils/excelParser.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testParser() {
  try {
    // Path to sample file
    const sampleFile = path.resolve(__dirname, "../mock/sample.xlsx");

    console.log("\n🔍 Testing Excel Parser");
    console.log("----------------------------------------");
    console.log("Processing file:", sampleFile);

    // Parse the file
    const parseResult = await parseFile(sampleFile);

    // Extract valid data
    const result = parseResult.data;

    // Log results
    console.log("\n✅ Processing Complete");
    console.log("----------------------------------------");
    console.log("Total rows processed:", parseResult.metadata.totalRows);
    console.log("Valid entries:", result.length);

    // Display sample of results
    if (result.length > 0) {
      console.log("\n📋 Sample Data");
      console.log("----------------------------------------");
      const sample = result.slice(0, 3);
      console.log(JSON.stringify(sample, null, 2));
    }

    // Return the results
    return result;
  } catch (error) {
    console.error("\n❌ Test Failed:", error.message);
    throw error;
  }
}

// Run the test
testParser()
  .then((result) => {
    console.log('\n💾 Results stored in "result" variable');
    console.log(result)


  })
  .catch((error) => {
    console.error("Test execution failed:", error.message);
    process.exit(1);
  });
