document.addEventListener("DOMContentLoaded", () => {
  const imageUpload = document.getElementById("imageUpload");
  const imgElement = document.getElementById("img");
  const resultDiv = document.getElementById("result");

  let model;

  const loadModel = async () => {
    model = await nsfwjs.load("./public/models/mobilenet_v2/model.json"); // Load NSFWJS model once
    console.log("Model loaded");
  };

  const analyzeImage = async () => {
    if (imgElement.src) {
      const predictions = await model.classify(imgElement);
      console.log("Predictions: ", predictions);
      displayResults(predictions);
    }
  };

  const displayResults = (predictions) => {
    resultDiv.innerHTML = "";
    predictions.forEach((prediction) => {
      const p = document.createElement("p");
      p.innerText = `${prediction.className}: ${(
        prediction.probability * 100
      ).toFixed(2)}%`;
      resultDiv.appendChild(p);
    });
  };

  imageUpload.addEventListener("change", async (event) => {
    console.log("Analysing image");
    if (!model) await loadModel(); // Ensure the model is loaded

    const file = event.target.files[0];
    imgElement.src = URL.createObjectURL(file);
    imgElement.onload = async () => {
      await analyzeImage();
    };
  });
});
