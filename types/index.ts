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
