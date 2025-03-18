
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FormFooterProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
  itemCount: number;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  onCancel,
  isSubmitDisabled,
  itemCount
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitDisabled}
      >
        Submit Request{itemCount > 1 ? 's' : ''}
      </Button>
    </DialogFooter>
  );
};
