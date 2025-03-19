
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useInventory } from '@/context/inventory/InventoryContext';

export const AuthLayout: React.FC = () => {
  const { isLoading } = useInventory();

  // Show a loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Always render the outlet without checking for authentication
  return <Outlet />;
};
