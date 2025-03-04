'use client';

import { ColorPicker } from "../ColorPicker";

interface BorderInputProps {
  property: any;
  values: { [key: string]: string };
  onApply: (property: string, value: string) => void;
}

export function BorderInput({ property, values, onApply }: BorderInputProps) {
  const getDisplayValue = (value: string) => {
    return value?.replace('px', '') || '';
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">{property.label}</span>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Width */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Width</label>
          <input
            type="number"
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Width"
            value={getDisplayValue(values[property.subProperties[0].name])}
            onChange={(e) => onApply(property.subProperties[0].name, e.target.value ? `${e.target.value}px` : '')}
          />
        </div>
        
        {/* Style */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Style</label>
          <select
            className="w-full px-2 py-1 border rounded text-sm"
            value={values[property.subProperties[1].name] || ''}
            onChange={(e) => onApply(property.subProperties[1].name, e.target.value)}
          >
            <option value="">Select...</option>
            {property.subProperties[1].options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Color */}
        <div className="space-y-1 col-span-2">
          <label className="text-xs text-gray-500">Color</label>
          <ColorPicker
            color={values[property.subProperties[2].name] || '#000000'}
            onChange={(value) => onApply(property.subProperties[2].name, value)}
          />
        </div>
      </div>
      
      {/* Preview */}
      <div 
        className="h-10 border rounded"
        style={{
          borderWidth: values[property.subProperties[0].name] || '1px',
          borderStyle: values[property.subProperties[1].name] || 'solid',
          borderColor: values[property.subProperties[2].name] || '#000000'
        }}
      ></div>
    </div>
  );
}