"use client";
import React, { useEffect, useRef, useState } from "react";
import { draggableItems } from "../config/draggableItems";
import { DraggableItem } from "../components/DraggableItem";
import { Canvas } from "../components/Canvas";
import { StyleManagerUI } from "../components/StyleManagerUI";
import { Editor } from "./Editor";
import { useSelectedElement } from "../hooks/useSelectedElement";

export default function Home() {
  const { onSelectElement, selectedElement } = useSelectedElement();
  const editorRef = useRef<Editor>();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      editorRef.current = new Editor({
        onSelectElement: onSelectElement,
      });
      hasInitialized.current = true;
    }
  }, [onSelectElement, selectedElement]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSave = () => {
    if (editorRef.current) {
      const iframe = document.querySelector("#canvas") as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        const cleanHtml = editorRef.current.getHtml();
        console.log(cleanHtml);
        // Here you can handle the clean HTML (e.g., save to a file, send to server, etc.)
      }
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Sidebar - Components */}
      <div className="w-64 p-4 border-r bg-white">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        <div className="space-y-2">
          {draggableItems.map((item) => (
            <DraggableItem key={item.id} id={item.id} name={item.name} />
          ))}
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 p-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Export Clean HTML
        </button>
      </div>

      {/* Main Content - Canvas */}
      <div className="flex-1 p-4 bg-gray-50">
        <Canvas onDragOver={handleDragOver} onDrop={handleDrop} />
      </div>

      {/* Right Sidebar - Style Manager */}
      <div className="w-80 border-l bg-white">
        {editorRef.current && (
          <StyleManagerUI styleManager={editorRef.current.styleManager} />
        )}
      </div>
    </main>
  );
}
