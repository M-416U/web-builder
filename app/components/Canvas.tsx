import React, { useEffect, useRef } from "react";

interface CanvasProps {
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onDragOver, onDrop }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      const style = document.createElement("style");
      style.innerHTML = `
        .drop-target {
          border: 2px dashed #4a90e2 !important;
          background-color: rgba(122, 129, 138, 0.1);
        }
        .drop-container {
          min-height: 50px;
          padding: 10px;
          border: 1px solid #e0e0e0;
        }
      `;
      iframe.contentDocument.head.appendChild(style);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="w-full m-3 min-h-[500px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
      id="canvas"
      onDragOver={onDragOver}
      onDrop={onDrop}
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
