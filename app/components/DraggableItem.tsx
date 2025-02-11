import React from "react";

interface DraggableItemProps {
  id: string;
  name: string;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ id, name }) => (
  <div className="component" draggable="true" data-id={id}>
    {name}
  </div>
);
