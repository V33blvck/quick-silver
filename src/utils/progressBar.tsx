import React from "react";
import { safePercentage } from "./helpers";

interface ProgressBarProps {
  progress: number;
  height?: string;
  color?: string;
  backgroundColor?: string;
}

// Functional component
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = "10px",
  color,
  backgroundColor = "#e0e0e0",
}) => {
  // Clamp progress between 0 and 100
  //   const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: "10px",
        overflow: "hidden",
        height,
        width: "80%",
      }}
    >
      <div
        style={{
          width: `${safePercentage(progress)}%`,
          backgroundColor: color,
          height: "100%",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default ProgressBar;
