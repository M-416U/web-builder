import { ElementSize, ElementStructure } from "@/types";

export class ElementBehaviors {
  static setupTextEditing(el: HTMLElement, data: ElementStructure): void {
    el.setAttribute("contenteditable", "true");
    el.addEventListener("blur", () => {
      data.content = el.innerHTML;
    });
  }

  static setupDragging(el: HTMLElement, data: ElementStructure): void {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", (e: DragEvent) => {
      if (!e.dataTransfer) return;
      e.dataTransfer.setData("dragged-element-id", data.id);
    });
  }

  static setupResizing(
    el: HTMLElement,
    data: ElementStructure,
    calculateNewWidth: (width: number) => number,
    updateElementSize: (
      element: HTMLElement,
      data: ElementStructure,
      size: ElementSize
    ) => void
  ): void {
    el.style.resize = "horizontal";
    el.style.overflow = "hidden";
    el.style.cursor = "nwse-resize";
    el.style.userSelect = "none";

    // el.addEventListener("mousedown", (event: MouseEvent) => {
    //   ElementBehaviors.startResizing(
    //     event,
    //     el,
    //     data,
    //     calculateNewWidth,
    //     updateElementSize
    //   );
    // });
  }

  private static startResizing(
    event: MouseEvent,
    element: HTMLElement,
    data: ElementStructure,
    calculateNewWidth: (width: number) => number,
    updateElementSize: (
      element: HTMLElement,
      data: ElementStructure,
      size: ElementSize
    ) => void
  ): void {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = element.clientWidth;
    const startHeight = element.clientHeight;

    const handleResize = (e: MouseEvent) => {
      const newWidth = calculateNewWidth(e.clientX - startX + startWidth);
      const newHeight = e.clientY - startY + startHeight;

      updateElementSize(element, data, {
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
}
