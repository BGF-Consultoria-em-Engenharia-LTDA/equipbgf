
import { Equipment, EquipmentRequest, User, RequestStatus } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";

// Fetch equipment data from Supabase
export const fetchEquipmentData = async () => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*');
    
    if (error) throw error;
    if (data) {
      return data.map(item => ({
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
    }
    return [];
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    throw error;
  }
};

// Fetch requests data from Supabase
export const fetchRequestsData = async () => {
  try {
    const { data, error } = await supabase
      .from('equipment_requests')
      .select('*');
    
    if (error) throw error;
    if (data) {
      return data.map(req => ({
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
    }
    return [];
  } catch (error) {
    console.error('Error fetching requests data:', error);
    throw error;
  }
};

// Fetch users data from Supabase
export const fetchUsersData = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    if (data) {
      return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as User['role']
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching users data:', error);
    throw error;
  }
};

// Add equipment to Supabase
export const addEquipmentToDb = async (newEquipment: Omit<Equipment, 'id'>) => {
  try {
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
      return {
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
    }
    throw new Error('No data returned');
  } catch (error) {
    console.error('Error adding equipment:', error);
    throw error;
  }
};

// Update equipment in Supabase
export const updateEquipmentInDb = async (id: string, updatedEquipment: Partial<Equipment>) => {
  try {
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
    return true;
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
};

// Delete equipment from Supabase
export const deleteEquipmentFromDb = async (id: string) => {
  try {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
};

// Add request to Supabase
export const addRequestToDb = async (newRequest: Omit<EquipmentRequest, 'id' | 'requestDate' | 'status'>) => {
  try {
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
      return {
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
    }
    throw new Error('No data returned');
  } catch (error) {
    console.error('Error adding request:', error);
    throw error;
  }
};

// Update request status in Supabase
export const updateRequestStatusInDb = async (id: string, status: EquipmentRequest['status']) => {
  try {
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
    return true;
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

// Add user to Supabase
export const addUserToDb = async (newUser: Omit<User, 'id'>) => {
  try {
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
    
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Sign in user with Supabase
export const signInUser = async (email: string, password: string) => {
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
        return { error: null, user };
      }
    }
    
    return { error: new Error('User not found'), user: null };
  } catch (error) {
    return { error, user: null };
  }
};

// Sign out user from Supabase
export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
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
    throw error;
  }
};

// Get current session
export const getCurrentSession = async () => {
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
        return userData;
      }
    }
    return null;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};
