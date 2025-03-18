
import React, { useState } from 'react';
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

interface RequestFormProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ 
  equipment, 
  isOpen, 
  onClose 
}) => {
  const { currentUser, addRequest } = useInventory();
  const [purpose, setPurpose] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipment || !currentUser) return;
    
    addRequest({
      equipmentId: equipment.id,
      userId: currentUser.id,
      userName: currentUser.name,
      purpose,
      quantity
    });
    
    // Reset form and close dialog
    setPurpose('');
    setQuantity(1);
    onClose();
  };

  if (!equipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Equipment</DialogTitle>
          <DialogDescription>
            Fill out this form to request {equipment.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Input 
              id="equipment" 
              value={equipment.name} 
              disabled 
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity" 
              type="number" 
              min={1} 
              max={equipment.quantity}
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value))}
              required 
            />
            <p className="text-sm text-gray-500">
              Available: {equipment.quantity}
            </p>
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
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
