import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, EquipmentRequest, User } from '@/types';
import { toast } from "@/components/ui/use-toast";

// Sample data
import { sampleEquipment, sampleRequests, sampleUsers } from '@/data/sampleData';

interface InventoryContextType {
  equipment: Equipment[];
  requests: EquipmentRequest[];
  users: User[];
  currentUser: User | null;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addRequest: (request: Omit<EquipmentRequest, 'id' | 'requestDate' | 'status'>) => void;
  updateRequestStatus: (id: string, status: EquipmentRequest['status']) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
  getRequestsByEquipmentId: (equipmentId: string) => EquipmentRequest[];
  getRequestsByUserId: (userId: string) => EquipmentRequest[];
  setCurrentUser: (user: User | null) => void;
  addUser: (user: Omit<User, 'id'>) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize with sample data
  useEffect(() => {
    setEquipment(sampleEquipment);
    setRequests(sampleRequests);
    setUsers(sampleUsers);
    
    // Set a default user (for demo purposes)
    setCurrentUser(sampleUsers[0]);
  }, []);

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setEquipment([...equipment, { ...newEquipment, id }]);
    toast({
      title: "Equipment added",
      description: `${newEquipment.name} has been added to inventory.`
    });
  };

  const updateEquipment = (id: string, updatedEquipment: Partial<Equipment>) => {
    setEquipment(
      equipment.map((item) =>
        item.id === id ? { ...item, ...updatedEquipment } : item
      )
    );
    toast({
      title: "Equipment updated",
      description: "The equipment details have been updated."
    });
  };

  const deleteEquipment = (id: string) => {
    setEquipment(equipment.filter((item) => item.id !== id));
    toast({
      title: "Equipment removed",
      description: "The equipment has been removed from inventory."
    });
  };

  const addRequest = (newRequest: Omit<EquipmentRequest, 'id' | 'requestDate' | 'status'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const requestDate = new Date().toISOString();
    
    setRequests([
      ...requests,
      { ...newRequest, id, requestDate, status: 'pending' }
    ]);
    
    toast({
      title: "Request submitted",
      description: `Your request for ${newRequest.quantity} item(s) has been submitted and is pending approval.`
    });
  };

  const updateRequestStatus = (id: string, status: EquipmentRequest['status']) => {
    setRequests(
      requests.map((req) => {
        if (req.id === id) {
          // If status is 'returned', update equipment status to 'available'
          if (status === 'returned') {
            const relatedEquipment = equipment.find(e => e.id === req.equipmentId);
            if (relatedEquipment) {
              updateEquipment(relatedEquipment.id, { 
                status: 'available',
                quantity: relatedEquipment.quantity + req.quantity
              });
            }
            // Add actual return date when returned
            return { ...req, status, returnDate: new Date().toISOString() };
          }
          
          // If status is 'approved', update equipment status to 'in-use'
          if (status === 'approved') {
            const relatedEquipment = equipment.find(e => e.id === req.equipmentId);
            if (relatedEquipment) {
              updateEquipment(relatedEquipment.id, { 
                status: relatedEquipment.quantity - req.quantity <= 0 ? 'in-use' : 'available',
                quantity: relatedEquipment.quantity - req.quantity
              });
            }
          }
          
          return { ...req, status };
        }
        return req;
      })
    );
    
    toast({
      title: "Request updated",
      description: `The request status has been updated to ${status}.`
    });
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setUsers([...users, { ...newUser, id }]);
    toast({
      title: "User added",
      description: `${newUser.name} has been added as a ${newUser.role}.`
    });
  };

  const getEquipmentById = (id: string) => {
    return equipment.find((item) => item.id === id);
  };

  const getRequestsByEquipmentId = (equipmentId: string) => {
    return requests.filter((req) => req.equipmentId === equipmentId);
  };

  const getRequestsByUserId = (userId: string) => {
    return requests.filter((req) => req.userId === userId);
  };

  const value = {
    equipment,
    requests,
    users,
    currentUser,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    addRequest,
    updateRequestStatus,
    getEquipmentById,
    getRequestsByEquipmentId,
    getRequestsByUserId,
    setCurrentUser,
    addUser
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
