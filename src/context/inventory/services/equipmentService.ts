
import { Equipment } from '@/types';
import { supabase } from '@/lib/supabase';

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
