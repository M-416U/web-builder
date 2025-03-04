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
    <div className="w-[350px] max-h-full overflow-auto bg-white border-l border-gray-200 flex flex-col">
      {!selectedElement ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-gray-400 text-5xl mb-4">
              <i className="material-icons">touch_app</i>
            </div>
            <p className="text-gray-500">
              Select an element to edit its styles
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              Style Editor
              <span className="ml-2 text-xs text-gray-500">
                {selectedElement.tagName.toLowerCase()}
                {selectedElement.id ? `#${selectedElement.id}` : ""}
              </span>
            </h2>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Style properties panel */}
            <div className="flex-1 overflow-y-auto p-4">
              {STYLE_CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className={
                    activeCategory === category.name ? "block" : "hidden"
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
            {/* Sidebar navigation */}
            <div className="w-14 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
              {STYLE_CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    activeCategory === category.name
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                  title={category.name}
                >
                  <i className="material-icons text-xs">{category.icon}</i>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
