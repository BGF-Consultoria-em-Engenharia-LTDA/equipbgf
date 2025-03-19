
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useInventory } from '@/context/InventoryContext';

export const AuthLayout: React.FC = () => {
  const { currentUser } = useInventory();
  const location = useLocation();

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the outlet (child routes)
  return <Outlet />;
};
