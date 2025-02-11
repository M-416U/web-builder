import { DraggableItem, ElementSize, ElementStructure } from "@/types";
import { draggableItems } from "../config/draggableItems";

export class Editor {
  private canvas: HTMLElement | null = null;
  private state: ElementStructure[] = [];

  constructor(initialState?: ElementStructure[]) {
    const canvasinitialized = this.initializeCanvas();
    if (!canvasinitialized) return;
    if (initialState) {
      this.state = initialState;
      this.renderElement(initialState[0], this.canvas as HTMLElement);
    }
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
    this.setupEventListeners();
    return true;
  }
  public setState(newState: ElementStructure[]): void {
    this.state = newState;
    this.clearCanvas();
    for (const element of this.state) {
      this.renderElement(element, this.canvas as HTMLElement);
    }
  }
  public clearCanvas() {
    if (this.canvas) {
      this.canvas.innerHTML = "";
    }
  }

  private setupEventListeners(): void {
    if (!this.canvas) return;

    document.querySelectorAll("[data-draggable]").forEach((comp) => {
      comp.addEventListener("dragstart", ((e: Event) => {
        const dragEvent = e as DragEvent;
        this.handleDragStart(dragEvent);
      }) as EventListener);
    });

    this.canvas.addEventListener("dragover", ((e: Event) => {
      const dragEvent = e as DragEvent;
      this.handleDragOver(dragEvent);
    }) as EventListener);

    this.canvas.addEventListener("drop", ((e: Event) => {
      const dragEvent = e as DragEvent;
      this.handleDrop(dragEvent);
    }) as EventListener);
  }

  private handleDragStart(event: DragEvent): void {
    if (!event.dataTransfer || !event.target) return;

    const target = event.target as HTMLElement;
    event.dataTransfer.setData(
      "component-id",
      target.getAttribute("data-id") || target.getAttribute("data-type") || ""
    );
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const componentId = event.dataTransfer.getData("component-id");
    const target = event.target as HTMLElement;
    const parentElement = target.closest(".col") || this.canvas;
    // Add type guard to ensure parentElement is HTMLElement
    if (!(parentElement instanceof HTMLElement)) return;

    const component = this.findDraggableItem(componentId);
    if (component) {
      const newElement = this.renderElement(component.structure, parentElement);
      this.state.push(this.htmlToJSObject(newElement));
    }
  }

  private findDraggableItem(id: string): DraggableItem | undefined {
    return draggableItems.find((item) => item.id === id);
  }

  public renderElement(
    data: ElementStructure,
    parent: HTMLElement
  ): HTMLElement {
    const el = document.createElement(data.type);

    if (data.attributes) {
      Object.entries(data.attributes).forEach(([key, value]) => {
        if (value !== undefined) {
          el.setAttribute(key, value);
        }
      });
    }

    if (data.content) {
      el.innerHTML = data.content;
    }

    this.setupElementBehavior(el, data);
    this.setupChildElements(el, data);

    parent.appendChild(el);
    return el;
  }

  private setupElementBehavior(el: HTMLElement, data: ElementStructure): void {
    if (data.type === "p") {
      this.setupTextEditing(el, data);
    }

    if (data.type !== "div") {
      this.setupDragging(el, data);
    }
    if (data.type === "img") {
      this.setupResizing(el, data);
    }

    if (data.type === "div" && data.attributes?.class?.includes("col")) {
      this.setupColumnBehavior(el);
    }
  }

  private setupTextEditing(el: HTMLElement, data: ElementStructure): void {
    el.setAttribute("contenteditable", "true");
    el.addEventListener("blur", () => {
      data.content = el.innerHTML;
    });
  }

  private setupDragging(el: HTMLElement, data: ElementStructure): void {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", (e: DragEvent) => {
      if (!e.dataTransfer) return;
      e.dataTransfer.setData("dragged-element-id", data.id);
    });
  }

  private setupResizing(el: HTMLElement, data: ElementStructure): void {
    el.style.resize = "horizontal";
    el.style.overflow = "hidden";
    el.style.cursor = "nwse-resize";
    el.style.userSelect = "none";

    el.addEventListener("mousedown", (event: MouseEvent) => {
      this.startResizing(event, el, data);
    });
  }

  private setupColumnBehavior(el: HTMLElement): void {
    el.ondrop = this.handleColumnDrop.bind(this);
    el.ondragover = this.handleDragOver.bind(this);
  }

  private setupChildElements(el: HTMLElement, data: ElementStructure): void {
    if (data.children) {
      data.children.forEach((child) => {
        this.renderElement(child, el);
      });
    }
  }

  private startResizing(
    event: MouseEvent,
    element: HTMLElement,
    data: ElementStructure
  ): void {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.clientWidth;
    const startHeight = element.clientHeight;

    const handleResize = (e: MouseEvent) => {
      const newWidth = this.calculateNewWidth(e.clientX - startX + startWidth);
      const newHeight = e.clientY - startY + startHeight;

      this.updateElementSize(element, data, {
        width: newWidth,
        height: newHeight,
      });
    };

    const stopResizing = () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResizing);
    };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResizing);
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

  private handleColumnDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const draggedElementId = event.dataTransfer.getData("dragged-element-id");
    const draggedItem = this.findDraggableItem(draggedElementId);

    if (!draggedItem) return;

    const target = event.target as HTMLElement;
    const parentElement = target.closest(".col") || this.canvas;

    // Add type guard to ensure parentElement is HTMLElement
    if (!(parentElement instanceof HTMLElement)) return;

    const beforeElement = this.getDropPosition(event, parentElement);
    const tempContainer = document.createElement("div");
    const newElement = this.renderElement(draggedItem.structure, tempContainer);

    if (beforeElement) {
      parentElement.insertBefore(newElement, beforeElement);
    } else {
      parentElement.appendChild(newElement);
    }
  }

  private getDropPosition(
    event: DragEvent,
    parent: HTMLElement
  ): HTMLElement | null {
    const children = Array.from(parent.children) as HTMLElement[];

    return (
      children.find((child) => {
        const rect = child.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      }) || null
    );
  }
  public parseHTMLFromString(htmlString: string): HTMLElement {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString.trim();

    return tempContainer;
  }
  public htmlToJSObject(element: HTMLElement | string): ElementStructure {
    if (typeof element === "string") {
      const doc = this.parseHTMLFromString(element);
      element = doc;
    }
    const obj: ElementStructure = {
      id: element.id,
      type: element.tagName.toLowerCase(),
      attributes: {},
      children: [],
    };

    for (const attr of Array.from(element.attributes)) {
      obj.attributes[attr.name] = attr.value;
    }
    // Handle text content
    if (
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === Node.TEXT_NODE
    ) {
      obj.content = element.textContent?.trim();
    }

    // Recursively process child elements
    for (const child of Array.from(element.children)) {
      obj?.children?.push(this.htmlToJSObject(child as HTMLElement));
    }

    return obj;
  }
  public jsObjectToHtml(obj: ElementStructure): HTMLElement {
    const element = document.createElement(obj.type);

    // Set the ID if available
    if (obj.id) {
      element.id = obj.id;
    }

    // Set attributes (e.g., class, style, etc.)
    for (const [key, value] of Object.entries(obj.attributes)) {
      element.setAttribute(key, value || "");
    }

    // Add text content if present
    if (obj.content) {
      element.textContent = obj.content;
    }

    // Recursively create and append children
    for (const child of obj.children || []) {
      element.appendChild(this.jsObjectToHtml(child));
    }

    return element;
  }
  public getJsObject(): ElementStructure[] {
    return this.state;
  }

  // Get the current state as an HTML string
  public getHtml(): string {
    return this.canvas?.innerHTML || "";
  }
}
