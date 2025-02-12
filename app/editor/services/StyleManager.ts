import { StyleRule } from "@/types";

export class StyleManager {
  private styleSheet: HTMLStyleElement;
  private styles: Map<string, StyleRule[]>;
  private activeMediaQuery: string = "";

  constructor(iframe: HTMLIFrameElement) {
    this.styles = new Map();
    this.styleSheet = this.createStyleSheet(iframe);
  }

  private createStyleSheet(iframe: HTMLIFrameElement): HTMLStyleElement {
    const styleSheet = iframe.contentDocument!.createElement("style");
    styleSheet.id = "editor-styles";
    iframe.contentDocument!.head.appendChild(styleSheet);
    return styleSheet;
  }

  public addStyle(elementId: string, rules: StyleRule[]): void {
    this.styles.set(elementId, rules);
    this.updateStyles();
  }

  public removeStyle(elementId: string): void {
    this.styles.delete(elementId);
    this.updateStyles();
  }

  public updateActiveMediaQueries(mediaQuery: string): void {
    this.activeMediaQuery = mediaQuery;
    this.updateStyles();
  }

  private updateStyles(): void {
    let cssText = "";

    this.styles.forEach((rules, elementId) => {
      rules.forEach((rule) => {
        const fullSelector = `#${elementId} ${rule.selector}`;
        const cssProperties = Object.entries(rule.properties)
          .map(([prop, value]) => `${prop}: ${value};`)
          .join(" ");

        if (rule.mediaQuery) {
          cssText += `${rule.mediaQuery} {\n`;
          cssText += `  ${fullSelector} { ${cssProperties} }\n`;
          cssText += `}\n`;
        } else {
          cssText += `${fullSelector} { ${cssProperties} }\n`;
        }
      });
    });

    this.styleSheet.textContent = cssText;
  }

  public getElementStyles(elementId: string): StyleRule[] {
    return this.styles.get(elementId) || [];
  }
}
