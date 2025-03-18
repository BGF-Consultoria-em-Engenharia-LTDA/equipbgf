
import React from 'react';
import { ClipboardList, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface RequestsHeaderProps {
  currentUser: User | null;
  onNewRequest: () => void;
}

export const RequestsHeader: React.FC<RequestsHeaderProps> = ({ 
  currentUser, 
  onNewRequest 
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardList className="mr-2 h-6 w-6" />
          Equipment Requests
        </h1>
        <p className="text-gray-500 mt-1">
          {currentUser?.role === 'admin' 
            ? 'Manage equipment requests from users' 
            : 'View and manage your equipment requests'}
        </p>
      </div>
      
      <Button 
        onClick={onNewRequest}
        className="flex items-center gap-2"
      >
        <FilePlus className="h-4 w-4" />
        New Request
      </Button>
    </div>
  );
};
