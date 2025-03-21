
import React from 'react';
import { Package2, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentRequestsTable } from '@/components/dashboard/RecentRequestsTable';
import { RequestsCalendar } from '@/components/dashboard/RequestsCalendar';
import { useInventory } from '@/context/inventory/InventoryContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useVisibleRequests } from '@/hooks/useVisibleRequests';

const Dashboard: React.FC = () => {
  const { equipment, requests, currentUser } = useInventory();
  
  // Use custom hooks to calculate stats and filter requests
  const stats = useDashboardStats(equipment, requests, currentUser);
  const visibleRequests = useVisibleRequests(requests, currentUser);

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
      
      {/* Equipment Schedule Calendar */}
      <RequestsCalendar requests={visibleRequests} />
      
      {/* Recent Requests Table */}
      <RecentRequestsTable requests={visibleRequests} />
    </div>
  );
};

export default Dashboard;
