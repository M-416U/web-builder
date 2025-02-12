import {
  DeviceConfig,
  DraggableItem,
  ElementSize,
  ElementStructure,
  StyleRule,
} from "@/types";
import { draggableItems } from "../config/draggableItems";
import { DragDropHandler } from "./handlers/DragDropHandler";
import { ElementBehaviors } from "./services/ElementBehaviors";
import { ElementRenderer } from "./services/ElementRenderer";
import { StyleManager } from "./services/StyleManager";
import { DeviceManager } from "./services/DeviceManager";
import { HTMLService } from "./services/HTMLService";
import { HighLighterService } from "./services/HighLighterService";

const DEFAULT_STYLES = `
  * {
    box-sizing: border-box;
  }
  // body {
  //   margin: 0;
  //   padding: 20px;
  //   min-height: 100vh;
  //   font-family: system-ui, -apple-system, sans-serif;
  // }
  .drop-target {
    outline: 2px dashed #4a90e2 !important;
    background-color: rgba(74, 144, 226, 0.1) !important;
  }
`;

export class Editor {
  private canvas: HTMLElement | null = null;
  private state: ElementStructure[] = [];
  private dragDropHandler!: DragDropHandler;
  private deviceManager!: DeviceManager;
  public styleManager!: StyleManager;
  private highlighterService!: HighLighterService;
  public selectedElement!: HTMLElement;
  private onSelectElement!: (el: HTMLElement) => void;

  constructor({
    initialState,
    onSelectElement,
  }: {
    initialState?: ElementStructure[];
    onSelectElement?: (el: HTMLElement) => void;
  }) {
    if (onSelectElement) {
      this.onSelectElement = onSelectElement;
    }
    if (!this.initializeCanvas()) return;
    this.initializeEditor(initialState);
  }

  private initializeEditor(initialState?: ElementStructure[]): void {
    const iframe = document.getElementById("canvas") as HTMLIFrameElement;
    if (!iframe) return;

    const setupEditor = () => {
      if (!iframe.contentDocument) return;

      this.setupManagers(iframe);
      this.setupHighlighter();
      this.setupDefaultStyles(iframe);

      if (initialState) {
        this.state = initialState;
        this.renderElement(initialState[0], this.canvas as HTMLElement);
      }
    };

    if (iframe.contentDocument?.readyState === "complete") {
      setupEditor();
    } else {
      iframe.addEventListener("load", setupEditor);
    }
  }

  private setupManagers(iframe: HTMLIFrameElement): void {
    this.styleManager = new StyleManager(iframe);
    this.deviceManager = new DeviceManager(iframe, this.styleManager);
    this.dragDropHandler = new DragDropHandler(
      this.canvas as HTMLElement,
      this.findDraggableItem.bind(this),
      this.renderElement.bind(this)
    );
    this.dragDropHandler.setupEventListeners();
  }

  private setupHighlighter(): void {
    const container = document.createElement("div");
    container.className =
      "fixed top-0 left-0 w-full h-full pointer-events-none";
    container.style.zIndex = "1000";
    document.body.appendChild(container);

    this.highlighterService = new HighLighterService({
      container,
      onSelect: (element) => {
        if (element) {
          this.selectElement(element);
        } else {
          this.styleManager.setSelectedElement(null);
        }
      },
    });
  }

  private setupDefaultStyles(iframe: HTMLIFrameElement): void {
    if (!iframe.contentDocument) return;

    const style = iframe.contentDocument.createElement("style");
    style.textContent = DEFAULT_STYLES;
    iframe.contentDocument.head.appendChild(style);
  }

  private initializeCanvas(): boolean {
    const iframe = document.getElementById("canvas") as HTMLIFrameElement;
    if (!iframe) {
      console.error("Canvas not found");
      return false;
    }

    if (iframe.contentDocument) {
      this.canvas = iframe.contentDocument.body;
      this.canvas.classList.add("drop-container");
      return true;
    }

    return false;
  }

  private setupElementBehavior(el: HTMLElement, data: ElementStructure): void {
    const elementId = this.generateElementId();
    el.setAttribute("data-id", elementId);

    const handleClick = (e: Event) => {
      e.stopPropagation();
      this.selectElement(el);
    };

    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", (e: DragEvent) => {
      e.stopPropagation();
      if (!e.dataTransfer) return;
      const elementId = el.getAttribute("data-id");
      if (elementId) {
        e.dataTransfer.setData("component-id", elementId);
      }
    });

    el.addEventListener("click", handleClick);
    el.setAttribute("data-draggable", "true");

    if (this.canvas && this.canvas.children.length === 1) {
      setTimeout(() => handleClick(new Event("click")), 0);
    }

    if (data.type === "p") {
      ElementBehaviors.setupTextEditing(el, data);
    }

    if (data.type !== "div") {
      ElementBehaviors.setupDragging(el, data);
    }

    if (data.type === "img") {
      ElementBehaviors.setupResizing(
        el,
        data,
        this.calculateNewWidth.bind(this),
        this.updateElementSize.bind(this)
      );
    }
  }

  private selectElement(el: HTMLElement): void {
    if (this.onSelectElement) {
      this.onSelectElement(el);
    }
    this.styleManager.setSelectedElement(el);
    this.highlighterService.selectElement(el);
  }

  private generateElementId(): string {
    return `el-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateNewWidth(width: number): number {
    return Math.min(width, this.canvas?.clientWidth || 0);
  }

  private updateElementSize(
    element: HTMLElement,
    data: ElementStructure,
    size: ElementSize
  ): void {
    const { width, height } = size;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    // if (data.attributes) {
    //   data.attributes.style = `width:${width}px; height:${height}px; padding: 5px; margin: 5px; border: 1px dashed gray;`;
    // }
  }

  public renderElement(
    data: ElementStructure,
    parent: HTMLElement
  ): HTMLElement {
    return ElementRenderer.renderElement(
      data,
      parent,
      this.setupElementBehavior.bind(this)
    );
  }

  private findDraggableItem(id: string): DraggableItem | undefined {
    return draggableItems.find((item) => item.id === id);
  }

  public setState(newState: ElementStructure[]): void {
    this.state = newState;
    this.clearCanvas();
    this.state.forEach((element) => {
      this.renderElement(element, this.canvas as HTMLElement);
    });
  }

  public clearCanvas(): void {
    if (this.canvas) {
      this.canvas.innerHTML = "";
    }
  }

  public getJsObject(): ElementStructure[] {
    return this.state;
  }

  public getHtml(): string {
    if (!this.canvas) return "";

    // Create a deep clone of the canvas
    const tempContainer = this.canvas.cloneNode(true) as HTMLElement;

    // Clean up building-specific attributes and classes
    const cleanupElement = (element: HTMLElement) => {
      // Remove editor-specific attributes
      element.removeAttribute("draggable");
      element.removeAttribute("data-draggable");
      element.removeAttribute("data-id");

      // Remove editor-specific classes
      if (element.classList.contains("drop-target")) {
        element.classList.remove("drop-target");
      }
      if (element.classList.contains("selected-element")) {
        element.classList.remove("selected-element");
      }

      // Clean up children recursively
      Array.from(element.children).forEach((child) => {
        cleanupElement(child as HTMLElement);
      });
    };

    cleanupElement(tempContainer);

    // Get computed styles and add them inline
    const addComputedStyles = (element: HTMLElement) => {
      const elementId = element.getAttribute("data-id");
      if (elementId) {
        const styles = this.styleManager.getElementStyles(elementId);
        styles.forEach((rule) => {
          Object.entries(rule.properties).forEach(([property, value]) => {
            element.style[property as any] = value;
          });
        });
      }

      // Process children recursively
      Array.from(element.children).forEach((child) => {
        addComputedStyles(child as HTMLElement);
      });
    };

    addComputedStyles(tempContainer);

    return tempContainer.innerHTML;
  }
  public htmlToJSObject(el: HTMLElement | string): ElementStructure {
    return HTMLService.htmlToJSObject(el);
  }
  public setDevice(deviceId: string): void {
    this.deviceManager.setDevice(deviceId);
  }

  public addStyles(elementId: string, styles: StyleRule[]): void {
    this.styleManager.addStyle(elementId, styles);
  }

  public getCurrentDevice(): DeviceConfig {
    return this.deviceManager.getCurrentDevice();
  }

  public destroy(): void {
    this.highlighterService.destroy();
    // Add any other cleanup needed
  }
}
