export interface DraggableItem {
  id: string;
  name: string;
  structure: ElementStructure;
}

export interface ElementStructure {
  id: string;
  type: string;
  content?: string;
  attributes: ElementAttributes;
  children?: ElementStructure[];
}

export interface ElementAttributes {
  class?: string;
  style?: string;
  src?: string;
  [key: string]: string | undefined;
}

export interface ElementSize {
  width: number;
  height: number;
}

export interface DraggableItem {
  id: string;
  structure: ElementStructure;
}
export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  type: "mobile" | "tablet" | "desktop";
}

export interface StyleRule {
  selector: string;
  properties: { [key: string]: string };
  mediaQuery?: string;
}

export interface StyleCategory {
  name: string;
  icon: string;
  properties: StyleProperty[];
}

export interface StyleProperty {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "color"
    | "select"
    | "dimension"
    | "spacing"
    | "border"
    | "shadow"
    | "range"
    | "checkbox";
  options?: string[];
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  subProperties?: SubProperty[];
}

export interface SubProperty {
  name: string;
  label: string;
  type?: "text" | "number" | "color" | "select" | "dimension" | "checkbox";
  options?: string[];
  unit?: string;
}
