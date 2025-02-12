"use client";

import { StyleManager } from "../editor/services/StyleManager";
import { STYLE_CATEGORIES } from "../config/stylesCategories";
import { StyleCategory } from "./StyleManager/StyleCategory";
import { useStyles } from "../hooks/useStyles";

interface StyleManagerUIProps {
  styleManager: StyleManager;
}

export function StyleManagerUI({ styleManager }: StyleManagerUIProps) {
  const { selectedElement, styles, handleApplyStyle, handleRemoveStyle } =
    useStyles(styleManager);

  return (
    <>
      {/* <SelectionOverlay selectedElement={selectedElement} /> */}

      <div className="style-manager p-4 space-y-6">
        {!selectedElement ? (
          <p className="text-gray-500">No element selected</p>
        ) : (
          STYLE_CATEGORIES.map((category) => (
            <StyleCategory
              key={category.name}
              category={category}
              styles={styles}
              onApplyStyle={handleApplyStyle}
              onRemoveStyle={handleRemoveStyle}
            />
          ))
        )}
      </div>
    </>
  );
}
