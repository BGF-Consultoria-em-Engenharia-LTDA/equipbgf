
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from "@/components/ui/use-toast";
import { Equipment } from '@/types';
import { useInventory } from '@/context/InventoryContext';
import { EquipmentSelector } from './EquipmentSelector';
import { DateRangePicker } from './DateRangePicker';
import { PurposeField } from './PurposeField';
import { FormFooter } from './FormFooter';

interface RequestFormContainerProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EquipmentRequest {
  equipmentId: string;
  quantity: number;
}

export const RequestFormContainer: React.FC<RequestFormContainerProps> = ({ 
  equipment, 
  isOpen, 
  onClose 
}) => {
  const { equipment: allEquipment, currentUser, addRequest } = useInventory();
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentRequest[]>([]);

  // Reset the form when it's opened or when initially provided equipment changes
  useEffect(() => {
    if (isOpen) {
      setPurpose('');
      setStartDate(new Date());
      setEndDate(new Date());
      
      // Initialize with the equipment passed in props if any
      if (equipment) {
        setSelectedEquipment([{ equipmentId: equipment.id, quantity: 1 }]);
      } else {
        setSelectedEquipment([]);
      }
    }
  }, [isOpen, equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !startDate || !endDate || selectedEquipment.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select at least one equipment item.",
        variant: "destructive"
      });
      return;
    }
    
    // Submit a request for each selected equipment
    selectedEquipment.forEach(item => {
      const equipItem = allEquipment.find(e => e.id === item.equipmentId);
      if (!equipItem) return;
      
      addRequest({
        equipmentId: item.equipmentId,
        userId: currentUser.id,
        userName: currentUser.name,
        purpose,
        quantity: item.quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
    });
    
    // Reset form and close dialog
    setPurpose('');
    setSelectedEquipment([]);
    setStartDate(new Date());
    setEndDate(new Date());
    onClose();
  };

  // Make sure end date is not before start date
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(date);
    }
  };

  // Filter to only show available equipment
  const availableEquipment = allEquipment.filter(
    item => item.status === 'available' && item.quantity > 0
  );

  // Add equipment to the selection
  const handleAddEquipment = (equipmentId: string) => {
    if (selectedEquipment.some(item => item.equipmentId === equipmentId)) {
      return; // Already added
    }
    setSelectedEquipment([...selectedEquipment, { equipmentId, quantity: 1 }]);
  };

  // Remove equipment from the selection
  const handleRemoveEquipment = (equipmentId: string) => {
    setSelectedEquipment(selectedEquipment.filter(item => item.equipmentId !== equipmentId));
  };

  // Update quantity for a selected equipment
  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    const equipItem = allEquipment.find(e => e.id === equipmentId);
    if (!equipItem) return;
    
    // Ensure quantity is within bounds
    const validQuantity = Math.min(Math.max(1, quantity), equipItem.quantity);
    
    setSelectedEquipment(
      selectedEquipment.map(item => 
        item.equipmentId === equipmentId 
          ? { ...item, quantity: validQuantity } 
          : item
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Equipment</DialogTitle>
          <DialogDescription>
            Fill out this form to request equipment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EquipmentSelector
            selectedEquipment={selectedEquipment}
            availableEquipment={availableEquipment}
            onAddEquipment={handleAddEquipment}
            onRemoveEquipment={handleRemoveEquipment}
            onQuantityChange={handleQuantityChange}
            allEquipment={allEquipment}
          />
          
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={setEndDate}
          />
          
          <PurposeField
            purpose={purpose}
            onPurposeChange={setPurpose}
          />
          
          <FormFooter
            onCancel={onClose}
            isSubmitDisabled={selectedEquipment.length === 0}
            itemCount={selectedEquipment.length}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
