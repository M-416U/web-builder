export const draggableItems = [
  {
    id: "row-1",
    name: "One Column Row",
    structure: {
      id: "row-1",
      type: "div",
      attributes: { class: "row", style: "display:flex; width:100%;" },
      children: [
        {
          id: "col-1",
          type: "div",
          attributes: {
            class: "col",
            style: "flex:1; padding:10px; min-height:50px;",
          },
          children: [],
        },
      ],
    },
  },
  {
    id: "row-2",
    name: "Two Column Row",
    structure: {
      id: "row-2",
      type: "div",
      attributes: { class: "row", style: "display:flex; width:100%;" },
      children: [
        {
          id: "col-1",
          type: "div",
          attributes: {
            class: "col",
            style: "flex:1; padding:10px; min-height:50px;",
          },
          children: [],
        },
        {
          id: "col-2",
          type: "div",
          attributes: {
            class: "col",
            style: "flex:1; padding:10px; min-height:50px;",
          },
          children: [],
        },
      ],
    },
  },
  {
    id: "text",
    name: "Text",
    structure: {
      id: "el-text",
      type: "p",
      attributes: {
        // style: "padding: 5px; margin: 5px; border: 1px dashed gray;",
      },
      content: "New Text",
      children: [],
    },
  },
  {
    id: "button",
    name: "Button",
    structure: {
      id: "el-button",
      type: "button",
      attributes: {
        // style:
        //   "padding: 5px; margin: 5px; border: 1px dashed gray; cursor:pointer;",
      },
      content: "Click Me",
      children: [],
    },
  },
  {
    id: "image",
    name: "Image",
    structure: {
      id: "el-image",
      type: "img",
      attributes: {
        src: "https://placehold.co/100",
        style: "width:auto; height:auto;",
      },
      children: [],
    },
  },
];
