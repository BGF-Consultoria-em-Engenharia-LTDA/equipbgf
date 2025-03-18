
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Equipment } from '@/types';
import { EquipmentItem } from './EquipmentItem';

interface EquipmentSelectorProps {
  selectedEquipment: Array<{ equipmentId: string; quantity: number }>;
  availableEquipment: Equipment[];
  onAddEquipment: (equipmentId: string) => void;
  onRemoveEquipment: (equipmentId: string) => void;
  onQuantityChange: (equipmentId: string, quantity: number) => void;
  allEquipment: Equipment[];
}

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  selectedEquipment,
  availableEquipment,
  onAddEquipment,
  onRemoveEquipment,
  onQuantityChange,
  allEquipment
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Selected Equipment</Label>
        {selectedEquipment.length > 0 ? (
          <div className="space-y-2">
            {selectedEquipment.map(item => {
              const equipItem = allEquipment.find(e => e.id === item.equipmentId);
              if (!equipItem) return null;
              
              return (
                <EquipmentItem
                  key={item.equipmentId}
                  item={item}
                  equipmentData={equipItem}
                  onQuantityChange={onQuantityChange}
                  onRemove={onRemoveEquipment}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
            No equipment selected
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="add-equipment">Add Equipment</Label>
        <Select onValueChange={onAddEquipment}>
          <SelectTrigger id="add-equipment">
            <SelectValue placeholder="Select equipment to add..." />
          </SelectTrigger>
          <SelectContent>
            {availableEquipment
              .filter(item => !selectedEquipment.some(selected => selected.equipmentId === item.id))
              .map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} ({item.quantity} available)
                </SelectItem>
              ))}
            {availableEquipment.length === 0 || 
            availableEquipment.length === selectedEquipment.length ? (
              <SelectItem value="none" disabled>
                No more equipment available
              </SelectItem>
            ) : null}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
