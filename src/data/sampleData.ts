
import { Equipment, EquipmentRequest, User } from '@/types';

export const sampleEquipment: Equipment[] = [
  {
    id: 'equip-001',
    name: 'Dell XPS 15 Laptop',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    category: 'Computer',
    status: 'available',
    location: 'Main Office',
    serialNumber: 'DL-XPS-123456',
    purchaseDate: '2022-05-15',
    lastMaintenance: '2023-01-20',
    image: 'https://picsum.photos/seed/laptop/300/200',
    quantity: 5
  },
  {
    id: 'equip-002',
    name: 'Canon EOS R Camera',
    description: 'Professional mirrorless camera with 30MP sensor',
    category: 'Photography',
    status: 'in-use',
    location: 'Media Room',
    serialNumber: 'CN-EOS-789012',
    purchaseDate: '2021-11-03',
    lastMaintenance: '2023-03-15',
    image: 'https://picsum.photos/seed/camera/300/200',
    quantity: 2
  },
  {
    id: 'equip-003',
    name: 'Conference Room Projector',
    description: '4K ultra HD projector for presentations',
    category: 'Audio/Visual',
    status: 'available',
    location: 'Conference Room A',
    serialNumber: 'EP-4K-345678',
    purchaseDate: '2022-01-10',
    lastMaintenance: '2023-02-28',
    image: 'https://picsum.photos/seed/projector/300/200',
    quantity: 3
  },
  {
    id: 'equip-004',
    name: 'Standing Desk',
    description: 'Adjustable height standing desk',
    category: 'Furniture',
    status: 'available',
    location: 'Open Office Area',
    serialNumber: 'SD-ADJ-901234',
    purchaseDate: '2022-07-22',
    image: 'https://picsum.photos/seed/desk/300/200',
    quantity: 8
  },
  {
    id: 'equip-005',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones',
    category: 'Audio/Visual',
    status: 'maintenance',
    location: 'IT Department',
    serialNumber: 'WH-NC-567890',
    purchaseDate: '2022-03-05',
    lastMaintenance: '2023-04-10',
    image: 'https://picsum.photos/seed/headphones/300/200',
    quantity: 10
  },
  {
    id: 'equip-006',
    name: 'iPad Pro',
    description: '12.9-inch iPad Pro with Apple Pencil',
    category: 'Mobile Device',
    status: 'available',
    location: 'Design Department',
    serialNumber: 'IP-PRO-123789',
    purchaseDate: '2022-09-18',
    image: 'https://picsum.photos/seed/ipad/300/200',
    quantity: 4
  }
];

export const sampleUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin'
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user'
  },
  {
    id: 'user-003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'user'
  }
];

export const sampleRequests: EquipmentRequest[] = [
  {
    id: 'req-001',
    equipmentId: 'equip-002',
    userId: 'user-002',
    userName: 'Jane Smith',
    requestDate: '2023-05-10T09:30:00Z',
    startDate: '2023-05-15T09:00:00Z',
    endDate: '2023-05-20T17:00:00Z',
    status: 'approved',
    purpose: 'Company event photography',
    quantity: 1
  },
  {
    id: 'req-002',
    equipmentId: 'equip-001',
    userId: 'user-003',
    userName: 'Bob Johnson',
    requestDate: '2023-05-12T14:15:00Z',
    startDate: '2023-05-18T09:00:00Z',
    endDate: '2023-05-25T17:00:00Z',
    status: 'pending',
    purpose: 'Remote work setup',
    quantity: 1
  },
  {
    id: 'req-003',
    equipmentId: 'equip-006',
    userId: 'user-002',
    userName: 'Jane Smith',
    requestDate: '2023-05-08T11:45:00Z',
    startDate: '2023-05-10T09:00:00Z',
    endDate: '2023-05-15T17:00:00Z',
    returnDate: '2023-05-15T16:30:00Z',
    status: 'returned',
    purpose: 'Client presentation',
    quantity: 1
  }
];
