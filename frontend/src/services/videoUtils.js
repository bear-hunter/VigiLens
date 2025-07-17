/**
 * Generates a thumbnail from a video file.
 * @param {File} videoFile - The video file.
 * @param {number} time - The time in seconds to capture the frame from (e.g., 1).
 * @returns {Promise<string>} A promise that resolves with the thumbnail as a data URL.
 */
export const generateVideoThumbnail = (videoFile, time = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    video.crossOrigin = 'anonymous'; // Important for some browsers

    // When the video metadata is loaded, we can get its dimensions
    video.onloadedmetadata = () => {
      video.currentTime = time;
    };
    
    // When the video has seeked to the desired time
    video.onseeked = () => {
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a data URL and resolve the promise
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    // If there's an error loading the video
    video.onerror = (err) => {
      reject(err);
    };

    // Load the video file
    video.src = URL.createObjectURL(videoFile);
  });
};