'use client';

import { useState } from 'react';

interface SpacingInputProps {
  property: any;
  values: { [key: string]: string };
  onApply: (property: string, value: string) => void;
}

export function SpacingInput({ property, values, onApply }: SpacingInputProps) {
  const [linked, setLinked] = useState(true);
  
  const handleValueChange = (subProperty: string, value: string) => {
    onApply(subProperty, value ? `${value}px` : '');
    
    if (linked) {
      property.subProperties.forEach((sub: any) => {
        if (sub.name !== subProperty) {
          onApply(sub.name, value ? `${value}px` : '');
        }
      });
    }
  };
  
  const getDisplayValue = (value: string) => {
    return value?.replace('px', '') || '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{property.label}</span>
        <button
          type="button"
          className={`text-xs px-2 py-1 rounded ${linked ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setLinked(!linked)}
          title={linked ? "Unlink values" : "Link values"}
        >
          <i className="material-icons text-sm">{linked ? 'link' : 'link_off'}</i>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 relative">
        {/* Top */}
        <div className="col-start-2">
          <input
            type="number"
            className="w-full text-center px-2 py-1 border rounded text-sm"
            placeholder="Top"
            value={getDisplayValue(values[property.subProperties[0].name])}
            onChange={(e) => handleValueChange(property.subProperties[0].name, e.target.value)}
          />
        </div>
        
        {/* Left & Right */}
        <div>
          <input
            type="number"
            className="w-full text-center px-2 py-1 border rounded text-sm"
            placeholder="Left"
            value={getDisplayValue(values[property.subProperties[3].name])}
            onChange={(e) => handleValueChange(property.subProperties[3].name, e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-100 border border-dashed flex items-center justify-center text-xs text-gray-500">
            Box
          </div>
        </div>
        
        <div>
          <input
            type="number"
            className="w-full text-center px-2 py-1 border rounded text-sm"
            placeholder="Right"
            value={getDisplayValue(values[property.subProperties[1].name])}
            onChange={(e) => handleValueChange(property.subProperties[1].name, e.target.value)}
          />
        </div>
        
        {/* Bottom */}
        <div className="col-start-2">
          <input
            type="number"
            className="w-full text-center px-2 py-1 border rounded text-sm"
            placeholder="Bottom"
            value={getDisplayValue(values[property.subProperties[2].name])}
            onChange={(e) => handleValueChange(property.subProperties[2].name, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}