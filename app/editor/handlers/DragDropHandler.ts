import { DraggableItem, ElementStructure } from "@/types";

export class DragDropHandler {
  constructor(
    private canvas: HTMLElement,
    private findDraggableItem: (id: string) => DraggableItem | undefined,
    private renderElement: (
      data: ElementStructure,
      parent: HTMLElement,
      id: string
    ) => HTMLElement,
    private onElementSelect?: (element: HTMLElement) => void
  ) {}

  setupEventListeners(): void {
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

    // Add click event listener for element selection
    this.canvas.addEventListener("click", ((e: Event) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute("data-id")) {
        this.handleElementSelect(target);
      }
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
    event.stopPropagation();

    const target = this.findDropTarget(event.target as HTMLElement);
    if (target) {
      this.canvas.querySelectorAll(".drop-target").forEach((el) => {
        el.classList.remove("drop-target");
      });
      target.classList.add("drop-target");
    }
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer) return;
    const componentId = event.dataTransfer.getData("component-id");
    const dropTarget = this.findDropTarget(event.target as HTMLElement);

    this.canvas.querySelectorAll(".drop-target").forEach((el) => {
      el.classList.remove("drop-target");
    });

    if (!dropTarget) {
      console.warn("No valid drop target found");
      return;
    }

    const component = this.findDraggableItem(componentId);
    if (!component) {
      const existingElement = this.canvas.querySelector(`#${componentId}`);

      if (existingElement) {
        dropTarget.appendChild(existingElement);
      }
    } else if (component) {
      const position = this.getDropPosition(event, dropTarget);
      const newElement = this.renderElement(
        component.structure,
        dropTarget,
        component.id
      );

      if (position) {
        dropTarget.insertBefore(newElement, position);
      } else {
        dropTarget.appendChild(newElement);
      }
    } else {
      console.warn("Component not found:", componentId);
    }
  }

  private findDropTarget(element: HTMLElement): HTMLElement | null {
    if (this.isValidDropTarget(element)) {
      return element;
    }

    const closestDropTarget = element.closest(".drop-container, .col, .row");
    if (
      closestDropTarget &&
      this.isValidDropTarget(closestDropTarget as HTMLElement)
    ) {
      return closestDropTarget as HTMLElement;
    }

    return null;
  }

  private isValidDropTarget(element: HTMLElement): boolean {
    return (
      element.classList.contains("drop-container") ||
      element.classList.contains("col") ||
      element.classList.contains("row")
    );
  }

  private getDropPosition(
    event: DragEvent,
    parent: HTMLElement
  ): HTMLElement | null {
    const rect = parent.getBoundingClientRect();
    const children = Array.from(parent.children) as HTMLElement[];

    const edgeThreshold = 10;
    if (event.clientY - rect.top < edgeThreshold) {
      return children[0] || null;
    }
    if (rect.bottom - event.clientY < edgeThreshold) {
      return null;
    }

    return (
      children.find((child) => {
        const childRect = child.getBoundingClientRect();
        return event.clientY < childRect.top + childRect.height / 2;
      }) || null
    );
  }

  private handleElementSelect(element: HTMLElement): void {
    // Remove previous selection
    this.canvas.querySelectorAll(".selected-element").forEach((el) => {
      el.classList.remove("selected-element");
    });

    // Add selection to clicked element
    element.classList.add("selected-element");

    // Only call onElementSelect if it exists
    if (this.onElementSelect) {
      this.onElementSelect(element);
    }
  }
}
