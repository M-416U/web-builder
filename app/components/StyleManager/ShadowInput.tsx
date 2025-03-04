'use client';

import { useState, useEffect } from 'react';
import { ColorPicker } from "../ColorPicker";

interface ShadowInputProps {
  property: any;
  values: { [key: string]: string };
  onApply: (property: string, value: string) => void;
}

export function ShadowInput({ property, values, onApply }: ShadowInputProps) {
  const [shadowValue, setShadowValue] = useState('');
  
  const getDisplayValue = (value: string) => {
    return value?.replace('px', '') || '';
  };
  
  // Combine all shadow values into a single CSS shadow property
  useEffect(() => {
    const hOffset = values['h-offset'] || '0px';
    const vOffset = values['v-offset'] || '0px';
    const blur = values['blur'] || '0px';
    const spread = values['spread'] || '0px';
    const color = values['color'] || 'rgba(0,0,0,0.5)';
    const inset = values['inset'] === 'true' ? 'inset ' : '';
    
    const shadow = `${inset}${hOffset} ${vOffset} ${blur} ${spread} ${color}`;
    setShadowValue(shadow);
    onApply('box-shadow', shadow);
  }, [values, onApply]);

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">{property.label}</span>
      
      <div className="grid grid-cols-2 gap-3">
        {/* H-Offset */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Horizontal</label>
          <input
            type="number"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="H-Offset"
            value={getDisplayValue(values['h-offset'])}
            onChange={(e) => onApply('h-offset', e.target.value ? `${e.target.value}px` : '0px')}
          />
        </div>
        
        {/* V-Offset */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Vertical</label>
          <input
            type="number"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="V-Offset"
            value={getDisplayValue(values['v-offset'])}
            onChange={(e) => onApply('v-offset', e.target.value ? `${e.target.value}px` : '0px')}
          />
        </div>
        
        {/* Blur */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Blur</label>
          <input
            type="number"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Blur"
            value={getDisplayValue(values['blur'])}
            onChange={(e) => onApply('blur', e.target.value ? `${e.target.value}px` : '0px')}
          />
        </div>
        
        {/* Spread */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Spread</label>
          <input
            type="number"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Spread"
            value={getDisplayValue(values['spread'])}
            onChange={(e) => onApply('spread', e.target.value ? `${e.target.value}px` : '0px')}
          />
        </div>
        
        {/* Color */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Color</label>
          <ColorPicker
            color={values['color'] || 'rgba(0,0,0,0.5)'}
            onChange={(value) => onApply('color', value)}
          />
        </div>
        
        {/* Inset */}
        <div className="space-y-1 flex items-end">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-500"
              checked={values['inset'] === 'true'}
              onChange={(e) => onApply('inset', e.target.checked ? 'true' : 'false')}
            />
            <span className="ml-2 text-xs text-gray-500">Inset</span>
          </label>
        </div>
      </div>
      
      {/* Preview */}
      <div className="p-4 bg-white rounded">
        <div 
          className="h-16 bg-white rounded"
          style={{ boxShadow: shadowValue }}
        ></div>
      </div>
    </div>
  );
}