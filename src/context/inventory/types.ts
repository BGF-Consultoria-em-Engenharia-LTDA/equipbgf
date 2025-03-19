
import { User, Equipment, EquipmentRequest, RequestStatus } from '@/types';

export interface InventoryContextType {
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
