const videoElement = document.getElementById("video");
const startButton = document.getElementById("startButton");
const reportButton = document.getElementById("reportButton");
const canvas = document.createElement("canvas");

const sexy_count = 0;
const porn_count = 0;

document.getElementById("sexy_count").innerHTML = sexy_count;
document.getElementById("porn_count").innerHTML = porn_count;

async function setupVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
  console.clear();
}

async function analyzeFrame() {
  const context = canvas.getContext("2d");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  const model = await nsfwjs.load("./public/models/mobilenet_v2/model.json");
  const predictions = await model.classify(canvas);
  const infodiv = document.getElementById("info");
  const warndiv = document.getElementById("warn");
  infodiv.innerHTML = "";

  console.log(predictions);

  predictions.forEach((prediction) => {
    infodiv.innerHTML += `${prediction.className} : ${prediction.probability} <br/>`;

    if (prediction.className === "Sexy" && prediction.probability * 100 >= 50) {
      sexy_count++;
      document.getElementById("sexy_count").innerHTML = sexy_count;
    }
    if (prediction.className === "Porn" && prediction.probability * 100 >= 25) {
      porn_count++;
      document.getElementById("porn_count").innerHTML = porn_count;
    }
  });

  //   predictions.forEach((prediction) => {
  //     const infodiv = document.getElementById("info");
  //     infodiv.innerHTML = `Porn: ${
  //       prediction.className === "Porn" ? prediction.probability : ""
  //     }`;
  //     console.log(prediction);
  //     if (prediction.className === "Porn" && prediction.probability * 100 >= 25) {
  //       console.log("Porn Detected");
  //     } else if (
  //       prediction.className === "Sexy" &&
  //       prediction.probability * 100 >= 50
  //     ) {
  //       console.log("Sexy Detected");
  //     }
  //     // if (prediction.className === "Porn" || prediction.className === "Hentai") {
  //     //   alert("Inappropriate content detected! Disconnecting...");
  //     //   videoElement.srcObject.getTracks().forEach((track) => track.stop());
  //     //   videoElement.srcObject = null;
  //     // }
  //   });
}

startButton.addEventListener("click", () => {
  setupVideo();
  setInterval(analyzeFrame, 1); // Analyze frame every 5 seconds
});

reportButton.addEventListener("click", () => {
  alert("Thank you for your report. We will review the content.");
  // Send report to the server (implement server-side logic)
});
