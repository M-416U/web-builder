import { useCallback, useEffect, useState } from "react";
import { StyleManager } from "../editor/services/StyleManager";
import { STYLE_CATEGORIES } from "../config/stylesCategories";

export function useStyles(styleManager: StyleManager) {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  );
  const [styles, setStyles] = useState<{ [key: string]: string }>({});

  const updateStyles = useCallback(() => {
    if (!selectedElement) {
      setStyles({});
      return;
    }

    const elementId = selectedElement.getAttribute("data-id");
    if (!elementId) return;

    const elementStyles = styleManager.getElementStyles(elementId);
    const computedStyles = elementStyles.reduce((acc, rule) => {
      if (!rule.mediaQuery) {
        return { ...acc, ...rule.properties };
      }
      return acc;
    }, {});

    setStyles(computedStyles);
  }, [selectedElement, styleManager]);

  useEffect(() => {
    const element = styleManager.getSelectedElement();
    if (element) {
      setSelectedElement(element);
    }

    const unsubscribe = styleManager.onSelectedElementChange((element) => {
      setSelectedElement(element);
    });

    return () => unsubscribe();
  }, [styleManager]);

  useEffect(() => {
    updateStyles();
  }, [selectedElement, updateStyles]);

  const handleApplyStyle = useCallback(
    (property: string, value: string) => {
      if (!selectedElement) return;

      let finalValue = value;
      if (/^[0-9]+$/.test(value)) {
        const prop = STYLE_CATEGORIES.flatMap((cat) => cat.properties).find(
          (p) => p.name === property
        );

        if (prop?.unit) {
          finalValue = `${value}${prop.unit}`;
        }
      }

      styleManager.applyStyleToSelected({
        selector: "",
        properties: { [property]: finalValue },
      });

      updateStyles();
    },
    [selectedElement, styleManager, updateStyles]
  );

  const handleRemoveStyle = useCallback(
    (property: string) => {
      if (!selectedElement) return;
      styleManager.removeStyle(property);
      updateStyles();
    },
    [selectedElement, styleManager, updateStyles]
  );

  return {
    selectedElement,
    styles,
    handleApplyStyle,
    handleRemoveStyle,
    setSelectedElement,
  };
}
