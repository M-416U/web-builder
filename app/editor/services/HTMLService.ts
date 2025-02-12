import { ElementStructure } from "@/types";

export class HTMLService {
  static parseHTMLFromString(htmlString: string): HTMLElement {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString.trim();
    return tempContainer;
  }

  static htmlToJSObject(element: HTMLElement | string): ElementStructure {
    if (typeof element === "string") {
      const doc = HTMLService.parseHTMLFromString(element);
      element = doc;
    }

    const obj: ElementStructure = {
      id: element.id,
      type: element.tagName.toLowerCase(),
      attributes: {},
      children: [],
    };

    Array.from(element.attributes).forEach((attr) => {
      obj.attributes[attr.name] = attr.value;
    });

    if (
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === Node.TEXT_NODE
    ) {
      obj.content = element.textContent?.trim();
    }

    Array.from(element.children).forEach((child) => {
      obj?.children?.push(HTMLService.htmlToJSObject(child as HTMLElement));
    });

    return obj;
  }

  static jsObjectToHtml(obj: ElementStructure): HTMLElement {
    const element = document.createElement(obj.type);

    if (obj.id) {
      element.id = obj.id;
    }

    Object.entries(obj.attributes || {}).forEach(([key, value]) => {
      element.setAttribute(key, value || "");
    });

    if (obj.content) {
      element.textContent = obj.content;
    }

    (obj.children || []).forEach((child) => {
      element.appendChild(HTMLService.jsObjectToHtml(child));
    });

    return element;
  }
}
