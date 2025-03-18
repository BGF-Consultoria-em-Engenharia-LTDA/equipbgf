
import React from 'react';
import { EquipmentCard } from './EquipmentCard';
import { Equipment } from '@/types';

interface EquipmentGridProps {
  equipment: Equipment[];
  onRequestClick?: (equipment: Equipment) => void;
}

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({ 
  equipment, 
  onRequestClick 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {equipment.map((item) => (
        <EquipmentCard 
          key={item.id} 
          equipment={item} 
          onRequestClick={onRequestClick}
        />
      ))}
      {equipment.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No equipment found
        </div>
      )}
    </div>
  );
};
