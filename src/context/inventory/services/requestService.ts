
import { EquipmentRequest, RequestStatus } from '@/types';
import { supabase } from '@/lib/supabase';

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
