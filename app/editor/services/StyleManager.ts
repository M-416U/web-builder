import { StyleRule } from "@/types";

export class StyleManager {
  private styleElement: HTMLStyleElement;
  private styles: Map<string, StyleRule[]>;
  private activeMediaQuery: string = "";
  private selectedElement: HTMLElement | null = null;
  private subscribers: Set<(element: HTMLElement | null) => void> = new Set();
  private styleRules: Map<string, Map<string, string>> = new Map();

  constructor(iframe: HTMLIFrameElement) {
    this.styles = new Map();
    this.styleElement = this.createStyleElement(iframe);
  }

  private createStyleElement(iframe: HTMLIFrameElement): HTMLStyleElement {
    const style = iframe.contentDocument!.createElement("style");
    style.id = "editor-styles";
    iframe.contentDocument!.head.appendChild(style);
    return style;
  }

  // Style Management Methods
  public applyStyleToSelected(rule: StyleRule): void {
    if (!this.selectedElement) return;
    const elementId = this.selectedElement.getAttribute("data-id");
    if (!elementId) return;

    // Get or create the style map for this element
    let elementStyles = this.styleRules.get(elementId);
    if (!elementStyles) {
      elementStyles = new Map();
      this.styleRules.set(elementId, elementStyles);
    }

    // Update the styles
    Object.entries(rule.properties).forEach(([property, value]) => {
      elementStyles!.set(property, value);
    });

    this.updateStyleSheet();
  }
  private updateStyleSheet(): void {
    const cssRules: string[] = [];

    // Generate CSS rules from the styleRules map
    this.styleRules.forEach((styles, elementId) => {
      if (styles.size > 0) {
        const properties = Array.from(styles.entries())
          .map(([prop, value]) => `${prop}: ${value};`)
          .join(" ");
        cssRules.push(`[data-id="${elementId}"] { ${properties} }`);
      }
    });

    // Update the style element content
    this.styleElement.textContent = cssRules.join("\n");
  }

  // public removeStyleFromSelected(propertyToRemove: string): void {
  //   if (!this.selectedElement) return;

  //   const elementId = this.selectedElement.getAttribute("data-id");
  //   if (!elementId) return;

  //   const currentStyles = this.styles.get(elementId) || [];
  //   const updatedStyles = currentStyles
  //     .map((style) => ({
  //       ...style,
  //       properties: Object.fromEntries(
  //         Object.entries(style.properties).filter(
  //           ([prop]) => prop !== propertyToRemove
  //         )
  //       ),
  //     }))
  //     .filter((style) => Object.keys(style.properties).length > 0);

  //   if (updatedStyles.length === 0) {
  //     this.styles.delete(elementId);
  //   } else {
  //     this.styles.set(elementId, updatedStyles);
  //   }

  //   this.updateStyles();
  // }

  public addStyle(elementId: string, rules: StyleRule[]): void {
    this.styles.set(elementId, rules);
    this.updateStyleSheet();
  }

  public removeStyle(property: string): void {
    const elementId = this.selectedElement?.getAttribute("data-id");
    const styles = this.styleRules.get(elementId!);
    if (styles) {
      styles.delete(property);
      this.updateStyleSheet();
    }
  }

  // Element Selection Methods
  public setSelectedElement(element: HTMLElement | null): void {
    if (this.selectedElement === element) return;
    this.selectedElement = element;
    this.notifySubscribers(element);
  }

  public getSelectedElement(): HTMLElement | null {
    return this.selectedElement;
  }

  public onSelectedElementChange(
    callback: (element: HTMLElement | null) => void
  ): () => void {
    this.subscribers.add(callback);
    callback(this.selectedElement);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(element: HTMLElement | null): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(element);
      } catch (error) {
        console.error("Error in style manager subscriber:", error);
      }
    });
  }

  // Style Export Methods
  // public exportCleanHtml(rootElement: HTMLElement): string {
  //   const clone = rootElement.cloneNode(true) as HTMLElement;
  //   this.removeDevAttributes(clone);
  //   this.applyInlineStyles(clone);
  //   return clone.outerHTML;
  // }

  // private removeDevAttributes(element: HTMLElement): void {
  //   const attrs = element.attributes;
  //   for (let i = attrs.length - 1; i >= 0; i--) {
  //     const attr = attrs[i];
  //     if (attr.name.startsWith("data-")) {
  //       element.removeAttribute(attr.name);
  //     }
  //   }

  //   // Remove dev-related classes
  //   element.classList.remove(
  //     "drop-target",
  //     "drop-container",
  //     "selected-element"
  //   );

  //   // Process children
  //   Array.from(element.children).forEach((child) => {
  //     if (child instanceof HTMLElement) {
  //       this.removeDevAttributes(child);
  //     }
  //   });
  // }

  // private applyInlineStyles(clone: HTMLElement): void {
  //   this.styles.forEach((rules, elementId) => {
  //     const element = clone.querySelector(`[data-id="${elementId}"]`);
  //     if (!element) return;

  //     const computedStyles: { [key: string]: string } = {};
  //     rules.forEach((rule) => {
  //       if (!rule.mediaQuery) {
  //         // Only apply non-media-query styles inline
  //         Object.assign(computedStyles, rule.properties);
  //       }
  //     });

  //     Object.entries(computedStyles).forEach(([prop, value]) => {
  //       (element as HTMLElement).style[prop as any] = value;
  //     });

  //     element.removeAttribute("data-id");
  //   });
  // }

  // Style Update Methods
  // public updateActiveMediaQueries(mediaQuery: string): void {
  //   this.activeMediaQuery = mediaQuery;
  //   this.updateStyles();
  // }

  // private updateStyles(): void {
  //   let cssText = "";

  //   this.styles.forEach((rules, elementId) => {
  //     rules.forEach((rule) => {
  //       const selector = rule.selector
  //         ? `[data-id="${elementId}"] ${rule.selector}`
  //         : `[data-id="${elementId}"]`;

  //       const cssProperties = Object.entries(rule.properties)
  //         .map(([prop, value]) => `${prop}: ${value};`)
  //         .join(" ");

  //       if (rule.mediaQuery) {
  //         cssText += `@media ${rule.mediaQuery} {\n`;
  //         cssText += `  ${selector} { ${cssProperties} }\n`;
  //         cssText += `}\n`;
  //       } else {
  //         cssText += `${selector} { ${cssProperties} }\n`;
  //       }
  //     });
  //   });

  //   if (this.styleSheet.textContent !== cssText) {
  //     this.styleSheet.textContent = cssText;
  //   }
  // }

  public getElementStyles(elementId: string): StyleRule[] {
    const styles = this.styleRules.get(elementId);
    if (!styles) return [];

    return [
      {
        selector: `[data-id="${elementId}"]`,
        properties: Object.fromEntries(styles),
      },
    ];
  }
}
