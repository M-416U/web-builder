"use client";
import React, { useEffect, useRef } from "react";
import { draggableItems } from "../config/draggableItems";
import { DraggableItem } from "../components/DraggableItem";
import { Canvas } from "../components/Canvas";
import { Editor } from "../lib/Editor";
import { landingPage, loginPage } from "../config/intial";

export default function Home() {
  const editorRef = useRef<Editor>();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      editorRef.current = new Editor([landingPage]);
      hasInitialized.current = true;
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      const obj = editorRef.current?.htmlToJSObject(loginPage);
      if (obj) {
        editorRef.current?.setState([obj]);
      } else {
        console.error("Failed to parse HTML to JSON");
      }
    }, 2 * 1000);
  }, []);
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen p-8">
      <div className="flex gap-4 flex-col">
        {draggableItems.map((item) => (
          <DraggableItem key={item.id} id={item.id} name={item.name} />
        ))}
        <button
          onClick={() => console.log(editorRef.current?.getHtml())}
          className="p-2 border rounded-md bg-slate-600 text-white"
        >
          Save
        </button>
      </div>
      <div className="flex-1">
        <Canvas onDragOver={handleDragOver} onDrop={handleDrop} />
      </div>
    </main>
  );
}
