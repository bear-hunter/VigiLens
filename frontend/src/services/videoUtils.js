// frontend/src/services/videoUtils.js

/**
 * Generates a thumbnail from a video file.
 * @param {File} file The video file.
 * @returns {Promise<string>} A promise that resolves with a data URL of the thumbnail.
 */
export const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    // When the video metadata is loaded, we can get its dimensions
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    // When the video can play through, seek to a specific time (e.g., 1 second in)
    video.oncanplay = () => {
      video.currentTime = 1;
    };

    // When the video has sought to the correct time, draw the frame on the canvas
    video.onseeked = () => {
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(video.src);
        // Resolve the promise with the image data as a URL
        resolve(canvas.toDataURL());
      } else {
        reject(new Error("Canvas context is not available."));
      }
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Error loading video file for thumbnail generation."));
    };
  });
};
