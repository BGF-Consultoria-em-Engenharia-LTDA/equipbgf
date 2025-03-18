
import React, { useState, useMemo } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { RequestStatus } from '@/types';
import { RequestForm } from '@/components/requests/RequestForm';
import { RequestsHeader } from '@/components/requests/RequestsHeader';
import { RequestsFilters } from '@/components/requests/RequestsFilters';
import { RequestsTable } from '@/components/requests/RequestsTable';

const RequestsList: React.FC = () => {
  const { requests, equipment, currentUser, updateRequestStatus } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const visibleRequests = useMemo(() => {
    return currentUser?.role === 'admin'
      ? requests
      : requests.filter(r => r.userId === currentUser?.id);
  }, [requests, currentUser]);

  const filteredRequests = useMemo(() => {
    return visibleRequests.filter(req => {
      const equipmentItem = equipment.find(e => e.id === req.equipmentId);
      const equipmentName = equipmentItem?.name || '';
      
      const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || statusFilter === 'all' ? true : req.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [visibleRequests, equipment, searchTerm, statusFilter]);

  const handleApprove = (requestId: string) => {
    updateRequestStatus(requestId, 'approved');
  };

  const handleReject = (requestId: string) => {
    updateRequestStatus(requestId, 'rejected');
  };

  const handleReturn = (requestId: string) => {
    updateRequestStatus(requestId, 'returned');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const openRequestForm = () => {
    if (equipment.length > 0) {
      setSelectedEquipment(equipment[0].id);
    }
    setIsRequestFormOpen(true);
  };

  const closeRequestForm = () => {
    setIsRequestFormOpen(false);
  };

  const selectedEquipmentObject = useMemo(() => {
    if (!selectedEquipment) return null;
    return equipment.find(item => item.id === selectedEquipment) || null;
  }, [selectedEquipment, equipment]);

  return (
    <div className="space-y-6">
      <RequestsHeader 
        currentUser={currentUser} 
        onNewRequest={openRequestForm} 
      />
      
      <RequestsFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
        totalResults={filteredRequests.length}
        filtersActive={!!(searchTerm || statusFilter)}
      />
      
      <RequestsTable 
        requests={filteredRequests}
        equipment={equipment}
        currentUser={currentUser}
        onApprove={handleApprove}
        onReject={handleReject}
        onReturn={handleReturn}
      />

      <RequestForm 
        equipment={selectedEquipmentObject} 
        isOpen={isRequestFormOpen} 
        onClose={closeRequestForm} 
      />
    </div>
  );
};

export default RequestsList;
