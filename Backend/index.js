const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const app = express();
const { uploadAndScanFile } = require("./fileScan");
const geminiResp = require("./geminiResp");
const geminiResp2 = require("./geminiResp2");

// uploadAndScanFile("./prompt.txt");

// Basic security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Configure CORS - more permissive for development
app.use(cors({
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, "fileToScan" + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// Handle preflight requests
app.options('*', cors());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/geminiChat", async (req, res) => {
  try {
    const { q } = req.body;
    if (!q) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const response = await geminiResp(q);
    console.log("Gemini Response:", response);
    
    // Ensure the response has the expected structure
    if (!response || !response.answer) {
      throw new Error("Invalid response structure from Gemini");
    }

    return res.json(response);
  } catch (error) {
    console.error("Error in /geminiChat:", error);
    return res.status(500).json({ 
      error: "Failed to generate response",
      message: error.message 
    });
  }
});

app.post("/scanFile", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    const scanResult = await uploadAndScanFile(req.file.path);
    console.log("Scan result:", scanResult);

    const response = await geminiResp2(scanResult);
    console.log("Gemini Response:", response);

    // Ensure the response has the expected structure
    if (!response || !response.ai_output) {
      throw new Error("Invalid response structure from Gemini");
    }

    return res.json({ 
      answer: {
        ai_output: response.ai_output,
        server_cmd: response.server_cmd || "none"
      }
    });
  } catch (error) {
    console.error("Error in /scanFile:", error);
    return res.status(500).json({ 
      error: "Failed to process file",
      message: error.message 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  
  // Handle specific types of errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: "File Upload Error",
      message: err.message
    });
  }
  
  if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: "Invalid JSON",
      message: "The request body contains invalid JSON"
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    error: err.status === 400 ? "Bad Request" : "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
