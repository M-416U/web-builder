"use client";
import React, { useEffect, useRef, useState } from "react";
import { draggableItems } from "../config/draggableItems";
import { DraggableItem } from "../components/DraggableItem";
import { Canvas } from "../components/Canvas";
import { Editor } from "./Editor";
import { useSelectedElement } from "../hooks/useSelectedElement";
import { StyleManagerUI } from "../components/StyleManagerUI";

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
        const css = editorRef.current.getCss();
        const jsonObject = editorRef.current.getJsObject();

        console.log(jsonObject);
        downloadFiles(cleanHtml, css);
      }
    }
  };

  const downloadFiles = (html: string, css: string) => {
    // Create HTML file
    const htmlBlob = new Blob([html], { type: "text/html" });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement("a");
    htmlLink.href = htmlUrl;
    htmlLink.download = "exported-page.html";

    // Create CSS file
    const cssBlob = new Blob([css], { type: "text/css" });
    const cssUrl = URL.createObjectURL(cssBlob);
    const cssLink = document.createElement("a");
    cssLink.href = cssUrl;
    cssLink.download = "styles.css";

    // Trigger downloads
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);

    document.body.appendChild(cssLink);
    cssLink.click();
    document.body.removeChild(cssLink);

    // Clean up
    URL.revokeObjectURL(htmlUrl);
    URL.revokeObjectURL(cssUrl);
  };

  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      {/* Header with app name and preview button */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Brandello</h1>
        <div className="flex space-x-2">
          <button
            // onClick={() => editorRef.current?.previewHTML()}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Preview
          </button>
          <button
            onClick={() => handleSave()}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <StyleManagerUI styleManager={editorRef?.current?.styleManager} />


        {/* Main Content - Canvas */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <Canvas onDragOver={handleDragOver} onDrop={handleDrop} />
        </div>
        {/* Left Sidebar - Basic Elements & Components */}
        <div className="w-64 border-r bg-white overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-4">
              Basic Elements
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {draggableItems.slice(0, 4).map((item) => (
                <DraggableItem key={item.id} id={item.id} name={item.name} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
