// import { create } from "zustand";
// import { v4 as uuidv4 } from "uuid";
// // import { CanvasElement, DropElement } from "@/types";

// interface CanvasStore {
//   elements: CanvasElement[];
//   addElement: (
//     content: string,
//     element: DropElement,
//     parentId?: string
//   ) => void;
//   removeElement: (id: string) => void;
//   generateHTML: () => string;
// }

// export const useCanvasStore = create<CanvasStore>((set, get) => ({
//   elements: [],
//   addElement: (content: string, element: DropElement, parentId?: string) => {
//     set((state) => {
//       const newElement: CanvasElement = {
//         id: uuidv4(),
//         content,
//         childs: [],
//         canBeParent: element.canBeParent,
//         type: element.type,
//         label: element.label,
//       };

//       if (!parentId) {
//         return { elements: [...state.elements, newElement] };
//       }

//       const updateChilds = (elements: CanvasElement[]): CanvasElement[] => {
//         return elements.map((el) => {
//           if (el.id === parentId) {
//             return { ...el, childs: [...el.childs, newElement] };
//           }
//           if (el.childs.length > 0) {
//             return { ...el, childs: updateChilds(el.childs) };
//           }
//           return el;
//         });
//       };

//       return { elements: updateChilds(state.elements) };
//     });
//   },
//   removeElement: (id: string) => {
//     set((state) => {
//       const removeFromArray = (elements: CanvasElement[]): CanvasElement[] => {
//         return elements
//           .filter((el) => el.id !== id)
//           .map((el) => ({
//             ...el,
//             childs: removeFromArray(el.childs),
//           }));
//       };

//       return { elements: removeFromArray(state.elements) };
//     });
//   },
//   generateHTML: () => {
//     const buildHTML = (elements: CanvasElement[]): string => {
//       return elements
//         .map((element) => {
//           if (element.childs.length > 0) {
//             const childrenHTML = buildHTML(element.childs);
//             // Insert children HTML into the parent's content
//             const tempDiv = document.createElement("div");
//             tempDiv.innerHTML = element.content;
//             const container = tempDiv.firstElementChild;
//             if (container) {
//               container.innerHTML = childrenHTML;
//               return container.outerHTML;
//             }
//           }
//           return element.content;
//         })
//         .join("\n");
//     };

//     const state = get();
//     return buildHTML(state.elements);
//   },
// }));
