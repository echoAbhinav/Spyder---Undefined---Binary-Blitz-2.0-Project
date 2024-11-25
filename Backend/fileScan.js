// const fs = require("fs");
// const axios = require("axios");
// const FormData = require("form-data");

// // Replace with your VirusTotal API key
// const API_KEY =
//   "6d150389c3837ec6466cd508124b1a9080bef6273d190f5dcde53ee6699bce28";
// const VT_API_URL = "https://www.virustotal.com/api/v3/files";
// const VT_API_URL2 = "https://www.virustotal.com/api/v3/analyses";

// // Function to upload and scan the file
// async function uploadAndScanFile(filePath) {
//   // Check if file exists
//   if (!fs.existsSync(filePath)) {
//     console.error(`File not found: ${filePath}`);
//     return;
//   }

//   const fileStream = fs.createReadStream(filePath);
//   const form = new FormData();
//   form.append("file", fileStream);

//   try {
//     // Step 1: Upload file to VirusTotal
//     console.log("Uploading file to VirusTotal...");
//     const uploadResponse = await axios.post(VT_API_URL, form, {
//       headers: {
//         "x-apikey": API_KEY,
//         ...form.getHeaders(),
//       },
//     });

//     // Check if upload was successful
//     if (uploadResponse && uploadResponse.data && uploadResponse.data.data) {
//       const fileId = uploadResponse.data.data.id;
//       console.log(`File uploaded successfully. File ID: ${fileId}`);

//       // Step 2: Check the scan result
//       const scanReportResponse = await axios.get(`${VT_API_URL2}/${fileId}`, {
//         headers: {
//           "x-apikey": API_KEY,
//         },
//       });

//       //   const scanReportJson = JSON.stringify(scanReportResponse.data, null, 2); // Pretty print with 2 spaces indentation
//       //   const outputFilePath = "./scan_report.json"; // Path to save the JSON file

//       //   // Write the JSON data to the file
//       //   fs.writeFileSync(outputFilePath, scanReportJson, "utf-8");
//       //   console.log(`Scan report saved to: ${outputFilePath}`);

//       // Output the scan report (if successful)
//       console.log(
//         "Scan Report:",
//         scanReportResponse.data.data.attributes.stats
//       );

//       return scanReportResponse.data;
//     } else {
//       console.error("Failed to upload file or receive valid response.");
//       return "Failed to upload file";
//     }
//   } catch (error) {
//     // Log full error response for better debugging
//     console.error(
//       "Error occurred during file upload or scan:",
//       error.response ? error.response.data : error.message
//     );
//     return "Error occurred during file upload or scan";
//   }
// }

// // Specify the path to the file you want to upload and scan
// // const filePath = "./file.bat"; // Replace with your file path

// module.exports = uploadAndScanFile;
// // uploadAndScanFile(filePath);

const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const API_KEY = process.env.VT_API_KEY;
const VT_API_URL = "https://www.virustotal.com/api/v3/files";
const VT_API_URL2 = "https://www.virustotal.com/api/v3/analyses";

async function uploadAndScanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const form = new FormData();
  form.append("file", fileStream);

  try {
    console.log("Uploading file to VirusTotal...");
    const uploadResponse = await axios.post(VT_API_URL, form, {
      headers: {
        "x-apikey": API_KEY,
        ...form.getHeaders(),
      },
    });

    if (uploadResponse && uploadResponse.data && uploadResponse.data.data) {
      const fileId = uploadResponse.data.data.id;
      console.log(`File uploaded successfully. File ID: ${fileId}`);

      // Poll for the scan result
      let scanReportResponse;
      let retries = 0;

      while (retries < 3000) {
        scanReportResponse = await axios.get(`${VT_API_URL2}/${fileId}`, {
          headers: {
            "x-apikey": API_KEY,
          },
        });

        const scanStatus = scanReportResponse.data.data.attributes.status;

        if (scanStatus === "completed") {
          console.log("Scan completed.");
          console.log(
            "Scan Report:",
            scanReportResponse.data.data.attributes.results
          );

          return scanReportResponse.data;

          // Save the expanded scan report data to a JSON file
          //   const scanReportJson = JSON.stringify(
          //     scanReportResponse.data,
          //     null,
          //     2
          //   ); // Pretty print with 2 spaces indentation
          //   const outputFilePath = "./scan_report.json"; // Path to save the JSON file

          //   // Write the JSON data to the file
          //   fs.writeFileSync(outputFilePath, scanReportJson, "utf-8");
          //   console.log(`Scan report saved to: ${outputFilePath}`);

          break;
        }

        console.log("Scan in progress...");
        retries++;
        if (retries < 3000) {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
        } else {
          console.log("Max retries reached. Scan may not be finished yet.");
        }
      }
    } else {
      console.error("Failed to upload file or receive valid response.");
      return "Failed to upload file or receive valid response";
    }
  } catch (error) {
    console.error(
      "Error occurred during file upload or scan:",
      error.response ? error.response.data : error.message
    );
    return "Error occurred during file upload or scan";
  }
}

// Specify the path to the file you want to upload and scan
// const filePath = "./file.bat"; // Replace with your file path
module.exports = uploadAndScanFile;
