// src/components/review/VideoPlayer.js
import React, { forwardRef } from "react";
import ReactPlayer from "react-player";
import { Box } from "@mui/material";

const VideoPlayer = forwardRef(({ url, onPlay, onPause, onSeek }, ref) => {
  return (
    <Box
      className="player-wrapper"
      sx={{
        position: "relative",
        paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
      }}
    >
      <ReactPlayer
        ref={ref}
        className="react-player"
        url={url}
        width="100%"
        height="100%"
        controls={true}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
});

export default VideoPlayer;
