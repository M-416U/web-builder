"use client";

import { useState } from "react";
import { ColorPicker } from "../ColorPicker";

interface StylePropertyInputProps {
  property: any;
  value: string;
  onApply: (value: string) => void;
  onRemove: () => void;
}

export function StylePropertyInput({
  property,
  value,
  onApply,
  onRemove,
}: StylePropertyInputProps) {
  const [showUnits, setShowUnits] = useState(false);
  const displayValue = value?.replace(property.unit || "", "") || "";

  const units = ["px", "%", "em", "rem", "vh", "vw"];
  const [selectedUnit, setSelectedUnit] = useState(property.unit || "px");

  const handleUnitChange = (unit: string) => {
    setSelectedUnit(unit);
    if (displayValue) {
      onApply(`${displayValue}${unit}`);
    }
  };

  const handleValueChange = (newValue: string) => {
    if (property.type === "dimension" && newValue) {
      onApply(`${newValue}${selectedUnit}`);
    } else {
      onApply(newValue);
    }
  };

  return (
    <div className="group rounded-md p-2 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{property.label}</label>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {value && (
            <button
              className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
              onClick={onRemove}
              title="Remove property"
            >
              <i className="material-icons text-sm">delete</i>
            </button>
          )}
          {property.type === "dimension" && (
            <button
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              onClick={() => setShowUnits(!showUnits)}
              title="Change units"
            >
              <i className="material-icons text-sm">straighten</i>
            </button>
          )}
        </div>
      </div>

      <div className="mt-1 relative">
        {property.type === "color" ? (
          <ColorPicker color={value || "#000000"} onChange={onApply} />
        ) : property.type === "select" ? (
          <select
            className="w-full px-3 py-2 border rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={value || ""}
            onChange={(e) => onApply(e.target.value)}
          >
            <option value="">Select...</option>
            {property.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : property.type === "range" ? (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              className="flex-1"
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
              value={displayValue || property.min || 0}
              onChange={(e) => handleValueChange(e.target.value)}
            />
            <input
              type="number"
              className="w-16 px-2 py-1 border rounded text-sm"
              min={property.min || 0}
              max={property.max || 100}
              step={property.step || 1}
              value={displayValue || ""}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        ) : property.type === "text" ? (
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={property.placeholder || ""}
            value={value || ""}
            onChange={(e) => onApply(e.target.value)}
          />
        ) : property.type === "dimension" ? (
          <div className="flex items-center">
            <input
              type="number"
              className="flex-1 px-3 py-2 border rounded-l-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={displayValue}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="0"
            />
            <div className="relative">
              <button
                className="px-3 py-2 border border-l-0 rounded-r-md bg-gray-50 text-sm hover:bg-gray-100"
                onClick={() => setShowUnits(!showUnits)}
              >
                {selectedUnit || "px"}
              </button>

              {showUnits && (
                <div className="absolute left-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10">
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {units.map((unit) => (
                      <button
                        key={unit}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedUnit === unit
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          handleUnitChange(unit);
                          setShowUnits(false);
                        }}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : property.type === "checkbox" ? (
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500"
              checked={value === "true"}
              onChange={(e) => onApply(e.target.checked ? "true" : "false")}
            />
            <span className="ml-2 text-sm text-gray-700">Enabled</span>
          </label>
        ) : (
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={value || ""}
            onChange={(e) => onApply(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
