
import React, { useState, useMemo } from 'react';
import { 
  ClipboardList,
  Search, 
  Check, 
  X, 
  Clock,
  FilterX
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useInventory } from '@/context/InventoryContext';
import { RequestStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const RequestsList: React.FC = () => {
  const { requests, equipment, currentUser, updateRequestStatus } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');

  // Determine whether to show all requests or just the user's requests
  const visibleRequests = useMemo(() => {
    // Admins see all requests, users see only their requests
    return currentUser?.role === 'admin'
      ? requests
      : requests.filter(r => r.userId === currentUser?.id);
  }, [requests, currentUser]);

  // Filter requests based on search term and status filter
  const filteredRequests = useMemo(() => {
    return visibleRequests.filter(req => {
      // Get equipment name for search
      const equipmentItem = equipment.find(e => e.id === req.equipmentId);
      const equipmentName = equipmentItem?.name || '';
      
      // Apply search filter
      const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           req.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const matchesStatus = statusFilter ? req.status === statusFilter : true;
      
      return matchesSearch && matchesStatus;
    });
  }, [visibleRequests, equipment, searchTerm, statusFilter]);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'returned':
        return <Badge className="bg-blue-100 text-blue-800">Returned</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardList className="mr-2 h-6 w-6" />
          Equipment Requests
        </h1>
        <p className="text-gray-500 mt-1">
          {currentUser?.role === 'admin' 
            ? 'Manage equipment requests from users' 
            : 'View and manage your equipment requests'}
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RequestStatus | '')}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || statusFilter) && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Found {filteredRequests.length} requests
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="flex items-center"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                {currentUser?.role === 'admin' && <TableHead>Requested By</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => {
                const equipmentItem = equipment.find(e => e.id === request.equipmentId);
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {equipmentItem?.name || "Unknown Equipment"}
                    </TableCell>
                    {currentUser?.role === 'admin' && <TableCell>{request.userName}</TableCell>}
                    <TableCell>
                      {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {request.purpose}
                    </TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {currentUser?.role === 'admin' && request.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReturn(request.id)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Return
                          </Button>
                        )}
                        {request.status === 'pending' && (
                          <div className="flex items-center text-yellow-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-xs">Waiting</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={currentUser?.role === 'admin' ? 7 : 6} className="py-10 text-center text-gray-500">
                    No requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RequestsList;
