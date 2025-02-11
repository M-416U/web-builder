"use client";
import React, { useEffect, useRef } from "react";
import { draggableItems } from "./config/draggableItems";
import { DraggableItem } from "./components/DraggableItem";
import { Canvas } from "./components/Canvas";
import { Editor } from "./lib/Editor";

export default function Home() {
  const editorRef = useRef<Editor>();
  const hasInitialized = useRef(false); // sentinel flag

  useEffect(() => {
    if (!hasInitialized.current) {
      editorRef.current = new Editor();
      console.log(editorRef.current);
      hasInitialized.current = true;
    }
  }, []);
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen p-8">
      <div className="flex gap-4">
        {draggableItems.map((item) => (
          <DraggableItem key={item.id} id={item.id} name={item.name} />
        ))}
      </div>
      <Canvas onDragOver={handleDragOver} onDrop={handleDrop} />
    </main>
  );
}
