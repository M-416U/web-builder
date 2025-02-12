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
        body {
          margin: 0;
          min-height: 100vh;
          background: #fff;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .drop-target {
          border: 2px dashed #4a90e2 !important;
          background-color: rgba(74, 144, 226, 0.1) !important;
        }
        
        .drop-container {
          min-height: 100vh;
          padding: 20px;
          background: #fff;
        }
        
        .selected-element {
          outline: 2px solid #4a90e2 !important;
          outline-offset: 2px !important;
          position: relative;
        }
        
        .selected-element::after {
          content: attr(data-id);
          position: absolute;
          top: -20px;
          left: 0;
          background: #4a90e2;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          pointer-events: none;
          z-index: 1000;
        }
      `;
      iframe.contentDocument.head.appendChild(style);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="w-full bg-white border rounded-lg shadow-sm"
      style={{ height: 'calc(100vh - 2rem)' }}
      id="canvas"
      onDragOver={onDragOver}
      onDrop={onDrop}
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
