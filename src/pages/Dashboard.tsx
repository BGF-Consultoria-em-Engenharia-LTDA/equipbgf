
import React, { useMemo } from 'react';
import { Package2, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentRequestsTable } from '@/components/dashboard/RecentRequestsTable';
import { useInventory } from '@/context/InventoryContext';

const Dashboard: React.FC = () => {
  const { equipment, requests, currentUser } = useInventory();

  // Calculate statistics
  const stats = useMemo(() => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {currentUser?.name || 'User'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Equipment" 
          value={stats.totalEquipment}
          icon={<Package2 className="h-6 w-6 text-blue-600" />}
        />
        <StatCard 
          title="Available Equipment" 
          value={stats.availableEquipment}
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests}
          icon={<ClipboardList className="h-6 w-6 text-yellow-600" />}
        />
        <StatCard 
          title="Your Active Requests" 
          value={stats.approvedRequests}
          icon={<AlertCircle className="h-6 w-6 text-purple-600" />}
        />
      </div>
      
      <RecentRequestsTable requests={requests} />
    </div>
  );
};

export default Dashboard;
