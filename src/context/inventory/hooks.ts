
import { Equipment, EquipmentRequest } from '@/types';

// Utility hooks/functions for the inventory context
export const getEquipmentById = (equipment: Equipment[], id: string) => {
  return equipment.find((item) => item.id === id);
};

export const getRequestsByEquipmentId = (requests: EquipmentRequest[], equipmentId: string) => {
  return requests.filter((req) => req.equipmentId === equipmentId);
};

export const getRequestsByUserId = (requests: EquipmentRequest[], userId: string) => {
  return requests.filter((req) => req.userId === userId);
};
