import { DeviceConfig } from "@/types";

export const devices: DeviceConfig[] = [
  {
    id: "desktop",
    name: "Desktop",
    width: 1280,
    height: 800,
    type: "desktop",
  },
  {
    id: "tablet",
    name: "Tablet",
    width: 768,
    height: 1024,
    type: "tablet",
  },
  {
    id: "mobile",
    name: "Mobile",
    width: 375,
    height: 667,
    type: "mobile",
  },
];
