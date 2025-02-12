import { StyleCategory } from "@/types";

export const STYLE_CATEGORIES: StyleCategory[] = [
  {
    name: 'Dimensions',
    properties: [
      { name: 'width', label: 'Width', type: 'number', unit: 'px' },
      { name: 'height', label: 'Height', type: 'number', unit: 'px' },
      { name: 'margin', label: 'Margin', type: 'number', unit: 'px' },
      { name: 'padding', label: 'Padding', type: 'number', unit: 'px' }
    ]
  },
  {
    name: 'Typography',
    properties: [
      { name: 'font-size', label: 'Font Size', type: 'number', unit: 'px' },
      { name: 'font-weight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
      { name: 'color', label: 'Text Color', type: 'color' },
      { name: 'text-align', label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify'] }
    ]
  },
  {
    name: 'Background',
    properties: [
      { name: 'background-color', label: 'Background Color', type: 'color' },
      { name: 'opacity', label: 'Opacity', type: 'number' }
    ]
  },
  {
    name: 'Border',
    properties: [
      { name: 'border-width', label: 'Border Width', type: 'number', unit: 'px' },
      { name: 'border-style', label: 'Border Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted'] },
      { name: 'border-color', label: 'Border Color', type: 'color' },
      { name: 'border-radius', label: 'Border Radius', type: 'number', unit: 'px' }
    ]
  }
];