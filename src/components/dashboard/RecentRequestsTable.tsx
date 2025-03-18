
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EquipmentRequest } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentRequestsTableProps {
  requests: EquipmentRequest[];
  limit?: number;
}

export const RecentRequestsTable: React.FC<RecentRequestsTableProps> = ({ 
  requests, 
  limit = 5 
}) => {
  const navigate = useNavigate();
  const limitedRequests = requests.slice(0, limit);

  const getStatusColor = (status: EquipmentRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'returned': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {limitedRequests.map((request) => (
              <TableRow 
                key={request.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/requests/${request.id}`)}
              >
                <TableCell className="py-4">
                  {request.equipmentId.substring(0, 8)}...
                </TableCell>
                <TableCell>{request.userName}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
                </TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {request.purpose}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {limitedRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No recent requests
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/requests')}
        >
          View All Requests
        </Button>
      </div>
    </div>
  );
};
