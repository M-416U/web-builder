import { DeviceConfig } from "@/types";
import { devices } from "../config/devices";
import { StyleManager } from "./StyleManager";

export class DeviceManager {
  private currentDevice: DeviceConfig;
  private iframe: HTMLIFrameElement;
  private styleManager: StyleManager;

  constructor(iframe: HTMLIFrameElement, styleManager: StyleManager) {
    this.iframe = iframe;
    this.styleManager = styleManager;
    this.currentDevice = devices[0]; // Default to desktop
    this.applyDeviceSettings();
  }

  public setDevice(deviceId: string): void {
    const device = devices.find((d) => d.id === deviceId);
    if (!device) return;

    this.currentDevice = device;
    this.applyDeviceSettings();
    this.styleManager.updateActiveMediaQueries(this.getCurrentMediaQuery());
  }

  private applyDeviceSettings(): void {
    this.iframe.style.width = `${this.currentDevice.width}px`;
    this.iframe.style.height = `${this.currentDevice.height}px`;
    this.iframe.style.maxWidth = "100%";
    this.iframe.style.margin = "0 auto";
    this.iframe.style.border = "1px solid #ccc";
    this.iframe.style.transition = "width 0.3s, height 0.3s";
  }

  public getCurrentDevice(): DeviceConfig {
    return this.currentDevice;
  }

  public getCurrentMediaQuery(): string {
    switch (this.currentDevice.type) {
      case "mobile":
        return "@media (max-width: 767px)";
      case "tablet":
        return "@media (min-width: 768px) and (max-width: 1023px)";
      case "desktop":
        return "@media (min-width: 1024px)";
      default:
        return "";
    }
  }
}
