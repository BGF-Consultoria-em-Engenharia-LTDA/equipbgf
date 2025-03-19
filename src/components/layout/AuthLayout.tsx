
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useInventory } from '@/context/inventory/InventoryContext';

export const AuthLayout: React.FC = () => {
  const { currentUser, isLoading } = useInventory();
  const location = useLocation();

  // Show a loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the outlet (child routes)
  return <Outlet />;
};
