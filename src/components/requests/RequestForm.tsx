
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Equipment } from '@/types';
import { useInventory } from '@/context/InventoryContext';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from "@/components/ui/use-toast";

interface RequestFormProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EquipmentRequest {
  equipmentId: string;
  quantity: number;
}

export const RequestForm: React.FC<RequestFormProps> = ({ 
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

  const today = new Date();
  
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
          <div className="space-y-2">
            <Label>Selected Equipment</Label>
            {selectedEquipment.length > 0 ? (
              <div className="space-y-2">
                {selectedEquipment.map(item => {
                  const equipItem = allEquipment.find(e => e.id === item.equipmentId);
                  if (!equipItem) return null;
                  
                  return (
                    <div key={item.equipmentId} className="flex items-center space-x-2 p-2 border rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">{equipItem.name}</div>
                        <div className="text-sm text-gray-500">Available: {equipItem.quantity}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number" 
                          min={1} 
                          max={equipItem.quantity}
                          value={item.quantity} 
                          onChange={e => handleQuantityChange(item.equipmentId, Number(e.target.value))}
                          className="w-16"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveEquipment(item.equipmentId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
            <Select onValueChange={handleAddEquipment}>
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
          
          <div className="space-y-2">
            <Label>Usage Period</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      id="startDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      disabled={(date) => date < today}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      id="endDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || today)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea 
              id="purpose" 
              placeholder="Describe why you need this equipment" 
              value={purpose} 
              onChange={e => setPurpose(e.target.value)}
              className="min-h-[100px]"
              required 
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={selectedEquipment.length === 0}
            >
              Submit Request{selectedEquipment.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
