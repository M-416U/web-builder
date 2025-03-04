"use client";

import { useState } from "react";
import { StyleManager } from "../editor/services/StyleManager";
import { STYLE_CATEGORIES } from "../config/stylesCategories";
import { StyleCategory } from "./StyleManager/StyleCategory";
import { useStyles } from "../hooks/useStyles";

interface StyleManagerUIProps {
  styleManager: StyleManager | undefined;
}

export function StyleManagerUI({ styleManager }: StyleManagerUIProps) {
  const { selectedElement, styles, handleApplyStyle, handleRemoveStyle } =
    useStyles(styleManager);
  const [activeCategory, setActiveCategory] = useState(
    STYLE_CATEGORIES[0]?.name
  );

  return (
    <div className="w-[380px] max-h-full overflow-hidden bg-white border-l border-gray-200 flex flex-col rounded-lg shadow-2xl">
      {!selectedElement ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <i className="material-icons text-gray-400 text-6xl mb-4 hover:text-gray-600 transition-colors duration-300">
              touch_app
            </i>
            <p className="text-gray-500 font-semibold text-base">
              Select an element to edit its styles
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800">
              Style Editor
            </h2>
            <div className="text-sm text-gray-500 mt-1">
              <span>{selectedElement.tagName.toLowerCase()}</span>
              {selectedElement.id && <span>#{selectedElement.id}</span>}
            </div>
          </div>

          <div className="flex flex-1">
            {/* Sidebar navigation */}
            <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
              {STYLE_CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition transform duration-200 ease-in-out hover:scale-110 ${
                    activeCategory === category.name
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                  title={category.name}
                >
                  <i className="material-icons text-lg">{category.icon}</i>
                </button>
              ))}
            </div>
            {/* Style properties panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {STYLE_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className={
                    activeCategory === category.name
                      ? "block transition-opacity duration-300"
                      : "hidden"
                  }
                >
                  <StyleCategory
                    category={category}
                    styles={styles}
                    onApplyStyle={handleApplyStyle}
                    onRemoveStyle={handleRemoveStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
