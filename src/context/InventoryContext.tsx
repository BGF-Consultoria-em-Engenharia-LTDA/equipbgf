
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, EquipmentRequest, User, RequestStatus } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

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
  signIn: (email: string, password: string) => Promise<{ error: any | null, user: User | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

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
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select('*');
        
        if (equipmentError) throw equipmentError;
        if (equipmentData) {
          const formattedEquipment = equipmentData.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            category: item.category,
            status: item.status as Equipment['status'],
            location: item.location,
            serialNumber: item.serial_number,
            purchaseDate: item.purchase_date,
            lastMaintenance: item.last_maintenance,
            image: item.image,
            quantity: item.quantity
          }));
          setEquipment(formattedEquipment);
        }
        
        // Fetch requests data
        const { data: requestsData, error: requestsError } = await supabase
          .from('equipment_requests')
          .select('*');
        
        if (requestsError) throw requestsError;
        if (requestsData) {
          const formattedRequests = requestsData.map(req => ({
            id: req.id,
            equipmentId: req.equipment_id,
            userId: req.user_id,
            userName: req.user_name,
            requestDate: req.request_date,
            startDate: req.start_date,
            endDate: req.end_date,
            returnDate: req.return_date,
            status: req.status as RequestStatus,
            purpose: req.purpose,
            quantity: req.quantity
          }));
          setRequests(formattedRequests);
        }
        
        // Fetch users data
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');
        
        if (usersError) throw usersError;
        if (usersData) {
          const formattedUsers = usersData.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as User['role']
          }));
          setUsers(formattedUsers);
        }
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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
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
          }
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

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error, user: null };
      }
      
      if (data.user) {
        // Get user details from our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userError) {
          return { error: userError, user: null };
        }
          
        if (userData) {
          const user: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as 'admin' | 'user'
          };
          setCurrentUser(user);
          return { error: null, user };
        }
      }
      
      return { error: new Error('User not found'), user: null };
    } catch (error) {
      return { error, user: null };
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      await fetchData();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive"
      });
    }
  };

  // CRUD functions
  const addEquipment = async (newEquipment: Omit<Equipment, 'id'>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add equipment');
      }
      
      const { data, error } = await supabase.from('equipment').insert({
        name: newEquipment.name,
        description: newEquipment.description,
        category: newEquipment.category,
        status: newEquipment.status,
        location: newEquipment.location,
        serial_number: newEquipment.serialNumber,
        purchase_date: newEquipment.purchaseDate,
        last_maintenance: newEquipment.lastMaintenance,
        image: newEquipment.image,
        quantity: newEquipment.quantity
      }).select().single();
      
      if (error) throw error;
      
      if (data) {
        const formattedEquipment: Equipment = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          category: data.category,
          status: data.status as Equipment['status'],
          location: data.location,
          serialNumber: data.serial_number,
          purchaseDate: data.purchase_date,
          lastMaintenance: data.last_maintenance,
          image: data.image,
          quantity: data.quantity
        };
        
        setEquipment([...equipment, formattedEquipment]);
        
        toast({
          title: "Equipment added",
          description: `${newEquipment.name} has been added to inventory.`
        });
      }
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
      
      // Convert from frontend model to database model
      const dbEquipment: any = {};
      if (updatedEquipment.name) dbEquipment.name = updatedEquipment.name;
      if (updatedEquipment.description) dbEquipment.description = updatedEquipment.description;
      if (updatedEquipment.category) dbEquipment.category = updatedEquipment.category;
      if (updatedEquipment.status) dbEquipment.status = updatedEquipment.status;
      if (updatedEquipment.location) dbEquipment.location = updatedEquipment.location;
      if ('serialNumber' in updatedEquipment) dbEquipment.serial_number = updatedEquipment.serialNumber;
      if ('purchaseDate' in updatedEquipment) dbEquipment.purchase_date = updatedEquipment.purchaseDate;
      if ('lastMaintenance' in updatedEquipment) dbEquipment.last_maintenance = updatedEquipment.lastMaintenance;
      if ('image' in updatedEquipment) dbEquipment.image = updatedEquipment.image;
      if ('quantity' in updatedEquipment) dbEquipment.quantity = updatedEquipment.quantity;
      
      const { error } = await supabase
        .from('equipment')
        .update(dbEquipment)
        .eq('id', id);
      
      if (error) throw error;
      
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
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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
      
      const { data, error } = await supabase.from('equipment_requests').insert({
        equipment_id: newRequest.equipmentId,
        user_id: newRequest.userId,
        user_name: newRequest.userName,
        start_date: newRequest.startDate,
        end_date: newRequest.endDate,
        purpose: newRequest.purpose,
        quantity: newRequest.quantity,
        status: 'pending'
      }).select().single();
      
      if (error) throw error;
      
      if (data) {
        const formattedRequest: EquipmentRequest = {
          id: data.id,
          equipmentId: data.equipment_id,
          userId: data.user_id,
          userName: data.user_name,
          requestDate: data.request_date,
          startDate: data.start_date,
          endDate: data.end_date,
          returnDate: data.return_date,
          status: data.status as EquipmentRequest['status'],
          purpose: data.purpose,
          quantity: data.quantity
        };
        
        setRequests([...requests, formattedRequest]);
        
        toast({
          title: "Request submitted",
          description: `Your request for ${newRequest.quantity} item(s) has been submitted and is pending approval.`
        });
      }
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
      
      const updateData: any = { status };
      // If status is 'returned', update the return date
      if (status === 'returned') {
        updateData.return_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('equipment_requests')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
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
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password || Math.random().toString(36).substring(2, 12),
        email_confirm: true,
        user_metadata: { name: newUser.name }
      });
      
      if (authError) throw authError;
      
      // The trigger should handle creating the user in the users table,
      // but we'll update the role if it's different from the default
      if (newUser.role !== 'user' && authData.user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: newUser.role })
          .eq('id', authData.user.id);
        
        if (updateError) throw updateError;
      }
      
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
