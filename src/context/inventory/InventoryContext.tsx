
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, EquipmentRequest, User, RequestStatus } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { InventoryContextType } from './types';
import { 
  fetchEquipmentData, 
  fetchRequestsData, 
  fetchUsersData,
  addEquipmentToDb,
  updateEquipmentInDb,
  deleteEquipmentFromDb,
  addRequestToDb,
  updateRequestStatusInDb,
  addUserToDb,
  signInUser,
  signOutUser,
  getCurrentSession
} from './dataService';
import {
  getEquipmentById,
  getRequestsByEquipmentId,
  getRequestsByUserId
} from './hooks';

// Sample data
import { sampleEquipment, sampleRequests, sampleUsers } from '@/data/sampleData';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data based on current user
  const fetchData = async () => {
    if (currentUser) {
      try {
        // Fetch equipment data
        const equipmentData = await fetchEquipmentData();
        setEquipment(equipmentData);
        
        // Fetch requests data
        const requestsData = await fetchRequestsData();
        setRequests(requestsData);
        
        // Fetch users data
        const usersData = await fetchUsersData();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data from the server.",
          variant: "destructive"
        });
        
        // Fall back to sample data if there's an error
        setEquipment(sampleEquipment);
        setRequests(sampleRequests);
        setUsers(sampleUsers);
      }
    } else {
      // Use sample data when not authenticated
      setEquipment(sampleEquipment);
      setRequests(sampleRequests);
      setUsers(sampleUsers);
    }
    
    setIsLoading(false);
  };

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentSession();
        if (userData) {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        await fetchData();
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) throw error;
            if (data) {
              const userData: User = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role as 'admin' | 'user'
              };
              setCurrentUser(userData);
              await fetchData();
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          await fetchData();
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // CRUD operations
  const addEquipment = async (newEquipment: Omit<Equipment, 'id'>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add equipment');
      }
      
      const formattedEquipment = await addEquipmentToDb(newEquipment);
      setEquipment([...equipment, formattedEquipment]);
      
      toast({
        title: "Equipment added",
        description: `${newEquipment.name} has been added to inventory.`
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Error",
        description: "Failed to add equipment.",
        variant: "destructive"
      });
      
      // Fall back to client-side operation if offline or error
      const id = Math.random().toString(36).substr(2, 9);
      setEquipment([...equipment, { ...newEquipment, id }]);
    }
  };

  const updateEquipment = async (id: string, updatedEquipment: Partial<Equipment>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update equipment');
      }
      
      await updateEquipmentInDb(id, updatedEquipment);
      
      // Update local state
      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, ...updatedEquipment } : item
        )
      );
      
      toast({
        title: "Equipment updated",
        description: "The equipment details have been updated."
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "Failed to update equipment.",
        variant: "destructive"
      });
      
      // Fall back to client-side operation if offline or error
      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, ...updatedEquipment } : item
        )
      );
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to delete equipment');
      }
      
      await deleteEquipmentFromDb(id);
      
      // Update local state
      setEquipment(equipment.filter((item) => item.id !== id));
      
      toast({
        title: "Equipment removed",
        description: "The equipment has been removed from inventory."
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: "Error",
        description: "Failed to delete equipment.",
        variant: "destructive"
      });
      
      // Fall back to client-side operation if offline or error
      setEquipment(equipment.filter((item) => item.id !== id));
    }
  };

  const addRequest = async (newRequest: Omit<EquipmentRequest, 'id' | 'requestDate' | 'status'>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to submit a request');
      }
      
      const formattedRequest = await addRequestToDb(newRequest);
      setRequests([...requests, formattedRequest]);
      
      toast({
        title: "Request submitted",
        description: `Your request for ${newRequest.quantity} item(s) has been submitted and is pending approval.`
      });
    } catch (error) {
      console.error('Error adding request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request.",
        variant: "destructive"
      });
      
      // Fall back to client-side operation if offline or error
      const id = Math.random().toString(36).substr(2, 9);
      const requestDate = new Date().toISOString();
      setRequests([
        ...requests,
        { ...newRequest, id, requestDate, status: 'pending' }
      ]);
    }
  };

  const updateRequestStatus = async (id: string, status: EquipmentRequest['status']) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update a request');
      }
      
      await updateRequestStatusInDb(id, status);
      
      // Update local state
      setRequests(
        requests.map((req) => {
          if (req.id === id) {
            const updatedReq = { ...req, status };
            
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
              updatedReq.returnDate = new Date().toISOString();
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
            
            return updatedReq;
          }
          return req;
        })
      );
      
      toast({
        title: "Request updated",
        description: `The request status has been updated to ${status}.`
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive"
      });
      
      // Fall back to client-side operation if offline or error
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
    }
  };

  const addUser = async (newUser: Omit<User, 'id'>) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('You must be an admin to add users');
      }
      
      await addUserToDb(newUser);
      await fetchData(); // Refresh the users list
      
      toast({
        title: "User added",
        description: `${newUser.name} has been added as a ${newUser.role}.`
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user.",
        variant: "destructive"
      });
      
      // Fall back to client-side operation if offline or error
      const id = Math.random().toString(36).substr(2, 9);
      setUsers([...users, { ...newUser, id }]);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInUser(email, password);
    return result;
  };

  const signOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    await fetchData();
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
    getEquipmentById: (id: string) => getEquipmentById(equipment, id),
    getRequestsByEquipmentId: (equipmentId: string) => getRequestsByEquipmentId(requests, equipmentId),
    getRequestsByUserId: (userId: string) => getRequestsByUserId(requests, userId),
    setCurrentUser,
    addUser,
    signIn,
    signOut,
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
