import { create } from "zustand";
interface State {
  selectedElement: HTMLElement | null;
  onSelectElement: (element: HTMLElement) => void;
}

export const useSelectedElement = create<State>((set) => ({
  selectedElement: null,
  onSelectElement: (element: HTMLElement) => {
    set({ selectedElement: element });
  },
}));
