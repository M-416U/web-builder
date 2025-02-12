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

export class Editor {
  private canvas: HTMLElement | null = null;
  private state: ElementStructure[] = [];
  private dragDropHandler!: DragDropHandler;
  private deviceManager!: DeviceManager;
  private styleManager!: StyleManager;

  constructor(initialState?: ElementStructure[]) {
    if (!this.initializeCanvas()) return;

    const iframe = document.getElementById("canvas") as HTMLIFrameElement;
    this.styleManager = new StyleManager(iframe);
    this.deviceManager = new DeviceManager(iframe, this.styleManager);

    this.dragDropHandler = new DragDropHandler(
      this.canvas as HTMLElement,
      this.findDraggableItem.bind(this),
      this.renderElement.bind(this)
    );

    if (initialState) {
      this.state = initialState;
      this.renderElement(initialState[0], this.canvas as HTMLElement);
    }

    this.dragDropHandler.setupEventListeners();
  }

  private initializeCanvas(): boolean {
    this.canvas = document.getElementById("canvas");
    if (!this.canvas || this.canvas.tagName !== "IFRAME") {
      console.error("canvas not found or not an iframe");
      this.canvas = null;
      return false;
    }
    const iframe = this.canvas as HTMLIFrameElement;
    this.canvas = iframe.contentDocument?.body || null;
    this.canvas?.classList.add("drop-container");
    return true;
  }

  private setupElementBehavior(el: HTMLElement, data: ElementStructure): void {
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

  private calculateNewWidth(width: number): number {
    const canvasWidth = this.canvas?.clientWidth || 0;
    return Math.min(width, canvasWidth);
  }

  private updateElementSize(
    element: HTMLElement,
    data: ElementStructure,
    size: ElementSize
  ): void {
    element.style.width = `${size.width}px`;
    element.style.height = `${size.height}px`;

    if (data.attributes) {
      data.attributes.style = `width:${size.width}px; height:${size.height}px; padding: 5px; margin: 5px; border: 1px dashed gray;`;
    }
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
    return this.canvas?.innerHTML || "";
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
}
