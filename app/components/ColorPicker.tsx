'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = useCallback((newColor: string) => {
    setInputValue(newColor);
    onChange(newColor);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Validate if it's a valid color
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const isValidRgb = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    
    if (isValidHex.test(value) || isValidRgb.test(value)) {
      onChange(value);
    }
  }, [onChange]);

  return (
    <div className="relative flex-1" ref={pickerRef}>
      <div className="flex space-x-2">
        <button
          className="w-10 h-10 rounded border"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <input
          type="text"
          className="flex-1 px-2 py-1 border rounded"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="#000000 or rgb(0,0,0)"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8"
          />
        </div>
      )}
    </div>
  );
}
