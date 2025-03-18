
export type EquipmentStatus = 'available' | 'in-use' | 'maintenance' | 'missing';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  status: EquipmentStatus;
  location: string;
  serialNumber?: string;
  purchaseDate?: string;
  lastMaintenance?: string;
  image?: string;
  quantity: number;
}

export interface EquipmentRequest {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  requestDate: string;
  returnDate?: string;
  status: RequestStatus;
  purpose: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
