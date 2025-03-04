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
        cssRules.push(`#${elementId} { ${properties} }`);
      }
    });

    // Update the style element content
    this.styleElement.textContent = cssRules.join("\n");
  }

  public addStyle(elementId: string, rules: StyleRule[]): void {
    this.styles.set(elementId, rules);
    this.updateStyleSheet();
  }

  public removeStyle(property: string): void {
    const elementId = this.selectedElement?.getAttribute("id");
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

  public getElementStyles(elementId: string): StyleRule[] {
    const styles = this.styleRules.get(elementId);
    if (!styles) return [];

    return [
      {
        selector: `#${elementId}`,
        properties: Object.fromEntries(styles),
      },
    ];
  }
  // Add a new method to get all styles
  public getAllStyles(): string | null {
    return this.styleElement.textContent;
  }
}
