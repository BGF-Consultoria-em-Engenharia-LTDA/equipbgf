
import { useMemo } from 'react';
import { Equipment, EquipmentRequest, User } from '@/types';

interface DashboardStats {
  totalEquipment: number;
  availableEquipment: number;
  pendingRequests: number;
  approvedRequests: number;
}

export const useDashboardStats = (
  equipment: Equipment[], 
  requests: EquipmentRequest[], 
  currentUser: User | null
): DashboardStats => {
  return useMemo(() => {
    const totalEquipment = equipment.length;
    const availableEquipment = equipment.filter(e => e.status === 'available').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    
    // For admin, show all requests
    // For regular users, show only their requests
    const userRequests = currentUser?.role === 'admin'
      ? requests
      : requests.filter(r => r.userId === currentUser?.id);
      
    const approvedRequests = userRequests.filter(r => r.status === 'approved').length;
    
    return {
      totalEquipment,
      availableEquipment,
      pendingRequests,
      approvedRequests
    };
  }, [equipment, requests, currentUser]);
};
