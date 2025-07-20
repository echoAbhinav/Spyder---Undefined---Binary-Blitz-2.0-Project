const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

// Configuration
const API_KEY = process.env.VT_API_KEY;
const VT_API_URL = "https://www.virustotal.com/api/v3/files";
const VT_API_URL2 = "https://www.virustotal.com/api/v3/analyses";
const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB - VirusTotal's free tier limit
const MAX_RETRIES = 60; // Maximum number of retries (5 minutes with 5-second intervals)
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Validates the API key and file before processing
 * @param {string} filePath - Path to the file to be scanned
 * @returns {Object} - Validation result
 */
function validateInputs(filePath) {
  const errors = [];

  // Check API key
  if (!API_KEY) {
    errors.push("VirusTotal API key is missing. Please set VT_API_KEY in your .env file");
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    errors.push(`File not found: ${filePath}`);
  } else {
    // Check file size
    const fileStats = fs.statSync(filePath);
    if (fileStats.size > MAX_FILE_SIZE) {
      errors.push(`File size (${Math.round(fileStats.size / 1024 / 1024)}MB) exceeds the 32MB limit for free VirusTotal API`);
    }
    if (fileStats.size === 0) {
      errors.push(`File is empty: ${filePath}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Creates a delay for the specified number of milliseconds
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats scan results for better readability
 * @param {Object} scanData - Raw scan data from VirusTotal
 * @returns {Object} - Formatted scan results
 */
function formatScanResults(scanData) {
  const stats = scanData.data.attributes.stats;
  const results = scanData.data.attributes.results || {};
  
  const detections = [];
  const cleanEngines = [];
  
  // Process individual engine results
  Object.entries(results).forEach(([engine, result]) => {
    if (result.category === 'malicious') {
      detections.push({
        engine: engine,
        result: result.result,
        version: result.version,
        update: result.update
      });
    } else if (result.category === 'undetected') {
      cleanEngines.push(engine);
    }
  });

  return {
    summary: {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      undetected: stats.undetected || 0,
      harmless: stats.harmless || 0,
      timeout: stats.timeout || 0,
      confirmed_timeout: stats['confirmed-timeout'] || 0,
      failure: stats.failure || 0,
      type_unsupported: stats['type-unsupported'] || 0
    },
    detections: detections,
    cleanEngines: cleanEngines.length,
    totalEngines: Object.keys(results).length,
    scanId: scanData.data.id,
    scanDate: scanData.data.attributes.date
  };
}

/**
 * Uploads and scans a file using VirusTotal API
 * @param {string} filePath - Path to the file to be scanned
 * @returns {Object} - Scan results or error information
 */
async function uploadAndScanFile(filePath) {
  try {
    // Validate inputs
    const validation = validateInputs(filePath);
    if (!validation.isValid) {
      console.error("Validation errors:");
      validation.errors.forEach(error => console.error(`- ${error}`));
      return {
        success: false,
        errors: validation.errors
      };
    }

    const fileName = filePath.split('/').pop();
    console.log(`Starting scan for file: ${fileName}`);
    console.log(`File size: ${Math.round(fs.statSync(filePath).size / 1024)}KB`);

    // Create form data for file upload
    const fileStream = fs.createReadStream(filePath);
    const form = new FormData();
    form.append("file", fileStream);

    console.log("Uploading file to VirusTotal...");
    
    // Step 1: Upload file to VirusTotal
    const uploadResponse = await fetch(VT_API_URL, {
      method: 'POST',
      headers: {
        "x-apikey": API_KEY,
        ...form.getHeaders(),
      },
      body: form,
      signal: AbortSignal.timeout(60000) // 60 second timeout for upload
    });

    if (!uploadResponse.ok) {
      console.error("Upload failed:", uploadResponse.status, uploadResponse.statusText);
      return {
        success: false,
        error: `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
      };
    }

    const uploadData = await uploadResponse.json();

    // Validate upload response
    if (!uploadData?.data?.id) {
      console.error("Invalid upload response from VirusTotal");
      return {
        success: false,
        error: "Invalid upload response from VirusTotal"
      };
    }

    const fileId = uploadData.data.id;
    console.log(`File uploaded successfully. Analysis ID: ${fileId}`);

    // Step 2: Poll for scan results
    console.log("Waiting for scan to complete...");
    let scanReportResponse;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        scanReportResponse = await fetch(`${VT_API_URL2}/${fileId}`, {
          method: 'GET',
          headers: {
            "x-apikey": API_KEY,
          },
          signal: AbortSignal.timeout(30000) // 30 second timeout for status checks
        });

        if (!scanReportResponse.ok) {
          throw new Error(`Status check failed: ${scanReportResponse.status} ${scanReportResponse.statusText}`);
        }

        const scanReportData = await scanReportResponse.json();
        const scanStatus = scanReportData.data.attributes.status;
        console.log(`Scan status: ${scanStatus} (attempt ${retries + 1}/${MAX_RETRIES})`);

        if (scanStatus === "completed") {
          console.log("✅ Scan completed successfully!");
          
          // Format and return results
          const formattedResults = formatScanResults(scanReportData);
          
          console.log("\n📊 SCAN SUMMARY:");
          console.log(`🔴 Malicious detections: ${formattedResults.summary.malicious}`);
          console.log(`🟡 Suspicious detections: ${formattedResults.summary.suspicious}`);
          console.log(`🟢 Clean engines: ${formattedResults.cleanEngines}`);
          console.log(`📈 Total engines: ${formattedResults.totalEngines}`);
          
          if (formattedResults.detections.length > 0) {
            console.log("\n🚨 DETECTIONS:");
            formattedResults.detections.forEach(detection => {
              console.log(`- ${detection.engine}: ${detection.result}`);
            });
          }

          return {
            success: true,
            data: formattedResults,
            rawData: scanReportData
          };
        }

        if (scanStatus === "queued") {
          console.log("⏳ Scan queued, waiting...");
        } else if (scanStatus === "failed") {
          console.error("❌ Scan failed on VirusTotal");
          return {
            success: false,
            error: "Scan failed on VirusTotal"
          };
        }

        retries++;
        
        if (retries < MAX_RETRIES) {
          await delay(RETRY_DELAY);
        }

      } catch (statusError) {
        console.error(`Error checking scan status (attempt ${retries + 1}):`, statusError.message);
        retries++;
        
        if (retries < MAX_RETRIES) {
          await delay(RETRY_DELAY);
        }
      }
    }

    // If we reach here, max retries were exceeded
    console.error(`⏰ Scan timeout: Maximum retries (${MAX_RETRIES}) reached. The scan may still be in progress.`);
    console.log(`You can check the scan status later using analysis ID: ${fileId}`);
    
    return {
      success: false,
      error: "Scan timeout - maximum retries reached",
      analysisId: fileId
    };

  } catch (error) {
    console.error("❌ Error during file upload or scan:");
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: "Request timeout - the operation took too long"
      };
    } else if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: "Network error - check your internet connection"
      };
    } else if (error.code === 'ENOENT') {
      return {
        success: false,
        error: "File not found"
      };
    }

    return {
      success: false,
      error: error.message || "Unknown error occurred"
    };
  }
}

/**
 * Scans a file and optionally saves results to JSON
 * @param {string} filePath - Path to file to scan
 * @param {string} outputPath - Optional path to save JSON results
 */
async function scanFileWithOutput(filePath, outputPath = null) {
  const result = await uploadAndScanFile(filePath);
  
  if (result.success && outputPath) {
    try {
      const jsonOutput = JSON.stringify(result.rawData, null, 2);
      fs.writeFileSync(outputPath, jsonOutput, "utf-8");
      console.log(`📄 Detailed scan report saved to: ${outputPath}`);
    } catch (writeError) {
      console.error(`Failed to save report to ${outputPath}:`, writeError.message);
    }
  }
  
  return result;
}

// Export functions
module.exports = {
  uploadAndScanFile,
  scanFileWithOutput
};

// Example usage (uncomment to test):
// (async () => {
//   const result = await scanFileWithOutput("./test-file.txt", "./scan_report.json");
//   if (result.success) {
//     console.log("Scan completed successfully!");
//   } else {
//     console.error("Scan failed:", result.error);
//   }
// })();