import { ElementStructure } from "@/types";

export class ElementRenderer {
  static renderElement(
    data: ElementStructure,
    parent: HTMLElement,
    setupBehavior: (el: HTMLElement, data: ElementStructure) => void
  ): HTMLElement {
    const el = document.createElement(data.type);
    if (data.attributes) {
      Object.entries(data.attributes).forEach(([key, value]) => {
        if (value !== undefined) {
          el.setAttribute(key, value);
        }
      });
    }
    el.setAttribute("data-id", data.id.split("el-")[1]);
    if (data.content) {
      el.innerHTML = data.content;
    }

    setupBehavior(el, data);

    if (data.children) {
      data.children.forEach((child) => {
        ElementRenderer.renderElement(child, el, setupBehavior);
      });
    }

    parent.appendChild(el);
    return el;
  }
}
