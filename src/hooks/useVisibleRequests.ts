
import { useMemo } from 'react';
import { EquipmentRequest, User } from '@/types';

export const useVisibleRequests = (
  requests: EquipmentRequest[],
  currentUser: User | null
): EquipmentRequest[] => {
  return useMemo(() => {
    return currentUser?.role === 'admin'
      ? requests
      : requests.filter(r => r.userId === currentUser?.id);
  }, [requests, currentUser]);
};
