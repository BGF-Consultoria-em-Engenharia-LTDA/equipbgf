
import React from 'react';
import { Equipment } from '@/types';
import { RequestFormContainer } from './request-form/RequestFormContainer';

interface RequestFormProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = (props) => {
  return <RequestFormContainer {...props} />;
};
