
import React, { createContext, useContext } from 'react';
import { Equipment, EquipmentRequest, User } from '@/types';
import { InventoryContextType } from './types';
import { useInventoryState } from './state/useInventoryState';
import { createEquipmentActions } from './actions/equipmentActions';
import { createRequestActions } from './actions/requestActions';
import { createUserActions } from './actions/userActions';
import { getEquipmentById, getRequestsByEquipmentId, getRequestsByUserId } from './hooks';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    equipment, 
    setEquipment,
    requests, 
    setRequests,
    users,
    setUsers,
    currentUser,
    setCurrentUser,
    isLoading,
    fetchData
  } = useInventoryState();

  // Equipment actions
  const equipmentActions = createEquipmentActions(equipment, setEquipment, currentUser);
  
  // Request actions (depends on equipment actions for updating equipment when requests change)
  const requestActions = createRequestActions(
    requests, 
    setRequests, 
    equipment, 
    equipmentActions.updateEquipment,
    currentUser
  );
  
  // User actions
  const userActions = createUserActions(
    users, 
    setUsers, 
    setCurrentUser, 
    fetchData, 
    currentUser
  );

  const value = {
    equipment,
    requests,
    users,
    currentUser,
    addEquipment: equipmentActions.addEquipment,
    updateEquipment: equipmentActions.updateEquipment,
    deleteEquipment: equipmentActions.deleteEquipment,
    addRequest: requestActions.addRequest,
    updateRequestStatus: requestActions.updateRequestStatus,
    getEquipmentById: (id: string) => getEquipmentById(equipment, id),
    getRequestsByEquipmentId: (equipmentId: string) => getRequestsByEquipmentId(requests, equipmentId),
    getRequestsByUserId: (userId: string) => getRequestsByUserId(requests, userId),
    setCurrentUser,
    addUser: userActions.addUser,
    signIn: userActions.signIn,
    signUp: userActions.signUp,
    signOut: userActions.signOut,
    isLoading
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
