'use client';

import { StyleCategory as StyleCategoryType } from "@/types";
import { StylePropertyInput } from "./StylePropertyInput";

interface StyleCategoryProps {
  category: StyleCategoryType;
  styles: { [key: string]: string };
  onApplyStyle: (property: string, value: string) => void;
  onRemoveStyle: (property: string) => void;
}

export function StyleCategory({
  category,
  styles,
  onApplyStyle,
  onRemoveStyle
}: StyleCategoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{category.name}</h3>
      <div className="space-y-3">
        {category.properties.map(property => (
          <StylePropertyInput
            key={property.name}
            property={property}
            value={styles[property.name] || ''}
            onApply={(value) => onApplyStyle(property.name, value)}
            onRemove={() => onRemoveStyle(property.name)}
          />
        ))}
      </div>
    </div>
  );
}
