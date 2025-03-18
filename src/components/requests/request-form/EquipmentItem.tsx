
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Equipment } from '@/types';

interface EquipmentItemProps {
  item: {
    equipmentId: string;
    quantity: number;
  };
  equipmentData: Equipment;
  onQuantityChange: (equipmentId: string, quantity: number) => void;
  onRemove: (equipmentId: string) => void;
}

export const EquipmentItem: React.FC<EquipmentItemProps> = ({
  item,
  equipmentData,
  onQuantityChange,
  onRemove
}) => {
  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md">
      <div className="flex-1">
        <div className="font-medium">{equipmentData.name}</div>
        <div className="text-sm text-gray-500">Available: {equipmentData.quantity}</div>
      </div>
      <div className="flex items-center space-x-2">
        <Input 
          type="number" 
          min={1} 
          max={equipmentData.quantity}
          value={item.quantity} 
          onChange={e => onQuantityChange(item.equipmentId, Number(e.target.value))}
          className="w-16"
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(item.equipmentId)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
