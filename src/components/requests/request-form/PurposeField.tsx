
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PurposeFieldProps {
  purpose: string;
  onPurposeChange: (purpose: string) => void;
}

export const PurposeField: React.FC<PurposeFieldProps> = ({
  purpose,
  onPurposeChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="purpose">Purpose</Label>
      <Textarea 
        id="purpose" 
        placeholder="Describe why you need this equipment" 
        value={purpose} 
        onChange={e => onPurposeChange(e.target.value)}
        className="min-h-[100px]"
        required 
      />
    </div>
  );
};
