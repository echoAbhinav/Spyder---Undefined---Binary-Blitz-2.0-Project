const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const app = express();
// import { uploadAndScanFile } from "./fileScan";
const uploadAndScanFile = require("./fileScan");
const geminiResp = require("./geminiResp");
const geminiResp2 = require("./geminiResp2");

// uploadAndScanFile("./prompt.txt");

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, "fileToScan" + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/geminiChat", async (req, res) => {
  const { q } = req.body;

  geminiResp(q)
    .then((response) => {
      //   console.log("Gemini Response:", response);
      return res.json({ answer: response });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).json({ error: "Failed to generate response" });
    });
});

app.post("/scanFile", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  console.log("Uploaded file:", req.file);

  const resp = await uploadAndScanFile(req.file.path);
  geminiResp2(resp)
    .then((response) => {
      //   console.log("Gemini Response:", response);
      return res.json({ answer: response });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).json({ error: "Failed to generate response" });
    });
  console.log(resp);
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
