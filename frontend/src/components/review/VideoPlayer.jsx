// frontend/src/components/review/VideoPlayer.jsx
import React from "react";

// This is the simplest possible video player component.
const VideoPlayer = ({ url }) => {
  if (!url) {
    return <p>Loading video...</p>;
  }

  // Adding a timestamp to the URL is a "cache-busting" technique.
  // It forces the browser to re-request the file every single time.
  const cacheBustedUrl = `${url}?t=${new Date().getTime()}`;

  return (
    <div>
      <video
        key={cacheBustedUrl} // Use the new URL as the key
        controls
        width="100%"
        autoPlay
        muted
        playsInline // Important for mobile browsers and some policies
        crossOrigin="anonymous" // Helps with certain CORS scenarios
      >
        <source src={cacheBustedUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
