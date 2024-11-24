const videoElement = document.getElementById("video");
const startButton = document.getElementById("startButton");
const reportButton = document.getElementById("reportButton");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

let sexy_count = 0;
let porn_count = 0;

const sexyCountElement = document.getElementById("sexy_count");
const pornCountElement = document.getElementById("porn_count");
const infodiv = document.getElementById("info");

sexyCountElement.innerHTML = sexy_count;
pornCountElement.innerHTML = porn_count;

let model;

// async function setupVideo() {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     videoElement.srcObject = stream;
//     videoElement.play();
//   } catch (error) {
//     console.error("Error accessing webcam:", error);
//   }
// }

async function setupVideo() {
  try {
    const constraints = {
      video: {
        facingMode: { exact: "environment" }, // Try to get the back camera
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (error) {
    console.warn(
      "Back camera not available, switching to front camera:",
      error
    );
    try {
      const fallbackConstraints = {
        video: {
          facingMode: "user", // Fall back to the front camera
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(
        fallbackConstraints
      );
      videoElement.srcObject = stream;
      videoElement.play();
    } catch (fallbackError) {
      console.error("Error accessing any camera:", fallbackError);
    }
  }
}

async function loadModel() {
  model = await nsfwjs.load("./public/models/mobilenet_v2/model.json");
}

async function analyzeFrame() {
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  const predictions = await model.classify(canvas);

  infodiv.innerHTML = predictions
    .map(
      (prediction) =>
        `${prediction.className} : ${(prediction.probability * 100).toFixed(
          2
        )}%`
    )
    .join("<br/>");

  predictions.forEach((prediction) => {
    if (prediction.className === "Sexy" && prediction.probability >= 0.5) {
      sexy_count++;
      sexyCountElement.innerHTML = sexy_count;
    }
    if (prediction.className === "Porn" && prediction.probability >= 0.25) {
      porn_count++;
      pornCountElement.innerHTML = porn_count;
    }
  });
}

startButton.addEventListener("click", async () => {
  await loadModel();
  setupVideo();
  setInterval(analyzeFrame, 1000); // Analyze frame every second
});

reportButton.addEventListener("click", () => {
  alert("Thank you for your report. We will review the content.");
  // Implement server-side logic to handle the report
});
