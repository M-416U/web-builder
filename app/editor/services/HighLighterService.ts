type OverlayOptions = {
  container: HTMLElement;
  onSelect: (element: HTMLElement | null) => void;
};

export class HighLighterService {
  private container: HTMLElement;
  private onSelect: (element: HTMLElement | null) => void;
  private hoveredElement: HTMLElement | null = null;
  private selectedElement: HTMLElement | null = null;
  private overlayRect: DOMRect | null = null;
  private overlays: HTMLElement[] = [];

  constructor(options: OverlayOptions) {
    this.container = options.container;
    this.onSelect = options.onSelect;
    this.initialize();
  }

  private initialize() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const iframe = document.getElementById("canvas") as HTMLIFrameElement;
    if (!iframe) return;

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.hasAttribute("data-id")) {
        this.hoveredElement = target;
        this.updateOverlay(target);
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      if (!relatedTarget || !relatedTarget.closest("[data-id]")) {
        this.hoveredElement = null;
        this.updateOverlay(this.selectedElement);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.hasAttribute("data-id")) {
        this.selectedElement = target;
        this.onSelect(target);
        this.updateOverlay(target);
      } else {
        this.selectedElement = null;
        this.onSelect(null);
        this.clearOverlays();
      }
    };

    const setupListeners = () => {
      if (!iframe.contentDocument) return;

      iframe.contentDocument.addEventListener("mouseover", handleMouseOver);
      iframe.contentDocument.addEventListener("mouseout", handleMouseOut);
      iframe.contentDocument.addEventListener("click", handleClick);

      const observer = new MutationObserver(() => {
        this.updateOverlay(this.selectedElement || this.hoveredElement || null);
      });
      observer.observe(iframe.contentDocument.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      const resizeObserver = new ResizeObserver(() => {
        this.updateOverlay(this.selectedElement || this.hoveredElement || null);
      });
      resizeObserver.observe(iframe.contentDocument.body);
      resizeObserver.observe(iframe);
    };

    iframe.addEventListener("load", setupListeners);
    if (iframe.contentDocument?.readyState === "complete") {
      setupListeners();
    }
  }

  private updateOverlay(element: HTMLElement | null) {
    this.clearOverlays();
    if (!element) return;

    const iframe = document.getElementById("canvas") as HTMLIFrameElement;
    if (!iframe?.contentDocument) return;

    const rect = element.getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();
    const iframeScrollX = iframe.contentWindow?.scrollX || 0;
    const iframeScrollY = iframe.contentWindow?.scrollY || 0;

    const adjustedRect = new DOMRect(
      rect.left + iframeRect.left - iframeScrollX,
      rect.top + iframeRect.top - iframeScrollY,
      rect.width,
      rect.height
    );

    this.overlayRect = adjustedRect;
    this.renderOverlay();
  }

  private renderOverlay() {
    if (!this.overlayRect) return;

    const isSelected = this.selectedElement !== null;
    const overlay = document.createElement("div");
    overlay.className = `pointer-events-none absolute transition-all duration-100 ${
      isSelected
        ? "border-2 border-blue-500"
        : "outline-dotted outline-offset-2 outline-[0.8px] outline-gray-700 outline-opacity-50"
    }`;
    overlay.style.transform = `translate3d(${this.overlayRect.left}px, ${this.overlayRect.top}px, 0)`;
    overlay.style.width = `${this.overlayRect.width}px`;
    overlay.style.height = `${this.overlayRect.height}px`;
    overlay.style.zIndex = isSelected ? "50" : "40";

    if (isSelected) {
      const toolbar = document.createElement("div");
      toolbar.className =
        "absolute bg-white shadow-lg rounded-lg z-50 flex items-center space-x-2 px-2 py-1";
      toolbar.style.top = "-40px";
      toolbar.style.left = "0";
      toolbar.innerText = "Toolbar";
      overlay.appendChild(toolbar);

      const corners = ["nw", "ne", "sw", "se"];
      corners.forEach((corner) => {
        const handle = document.createElement("div");
        handle.className =
          "absolute w-2 h-2 bg-blue-500 rounded-full cursor-" +
          corner +
          "-resize";
        if (corner.includes("n")) handle.style.top = "-4px";
        if (corner.includes("s")) handle.style.bottom = "-4px";
        if (corner.includes("w")) handle.style.left = "-4px";
        if (corner.includes("e")) handle.style.right = "-4px";
        overlay.appendChild(handle);
      });
    }

    this.container.appendChild(overlay);
    this.overlays.push(overlay);
  }

  private clearOverlays() {
    this.overlays.forEach((overlay) => {
      this.container.removeChild(overlay);
    });
    this.overlays = [];
  }

  public selectElement(element: HTMLElement | null) {
    this.selectedElement = element;
    this.updateOverlay(element);
  }

  public destroy() {
    this.clearOverlays();
    this.selectedElement = null;
    this.hoveredElement = null;
  }
}
