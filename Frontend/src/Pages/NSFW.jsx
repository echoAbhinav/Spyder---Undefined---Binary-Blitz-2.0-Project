import React from "react";

const NSFW = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <iframe
        src="https://nsfw-detector-01y2.onrender.com/video.html" // URL to be displayed in the iframe
        width="1200" // Width of the iframe
        height="700" // Height of the iframe
        title="Example Iframe" // Title for accessibility
        frameBorder="0" // Optional: removes the iframe border
        allow="camera; microphone; fullscreen"
      />
    </div>
  );
};

export default NSFW;
