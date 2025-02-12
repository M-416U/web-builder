'use client';

import { StyleCategory } from "@/types";
import { ColorPicker } from "../ColorPicker";

interface StylePropertyInputProps {
  property: StyleCategory['properties'][0];
  value: string;
  onApply: (value: string) => void;
  onRemove: () => void;
}

export function StylePropertyInput({ 
  property, 
  value, 
  onApply, 
  onRemove 
}: StylePropertyInputProps) {
  const displayValue = value?.replace(property.unit || '', '') || '';

  return (
    <div className="flex items-center space-x-2">
      <label className="w-1/3 text-sm">{property.label}</label>
      <div className="w-2/3 flex space-x-2">
        {property.type === 'color' ? (
          <ColorPicker
            color={value || '#000000'}
            onChange={onApply}
          />
        ) : property.type === 'select' ? (
          <select
            className="flex-1 px-2 py-1 border rounded"
            value={value || ''}
            onChange={(e) => onApply(e.target.value)}
          >
            <option value="">Select...</option>
            {property.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={property.type}
            className="flex-1 px-2 py-1 border rounded"
            value={displayValue}
            onChange={(e) => onApply(e.target.value)}
            placeholder={`Enter ${property.label.toLowerCase()}`}
          />
        )}
        {value && (
          <button
            className="px-2 py-1 text-red-500 hover:text-red-700"
            onClick={onRemove}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
