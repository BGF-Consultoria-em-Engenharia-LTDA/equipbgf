
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
  startDate: string; // When they want to start using the equipment
  endDate: string;   // When they plan to return the equipment
  returnDate?: string; // Actual return date (may differ from planned end date)
  status: RequestStatus;
  purpose: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}
