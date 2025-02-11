import React, { useEffect, useRef } from "react";

interface CanvasProps {
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onDragOver, onDrop }) => {
  return (
    <div
      className="w-full max-w-[1100px] min-h-[500px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
      id="canvas"
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
};
