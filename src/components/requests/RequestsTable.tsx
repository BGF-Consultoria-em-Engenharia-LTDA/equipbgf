
import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Equipment, EquipmentRequest, RequestStatus, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface RequestsTableProps {
  requests: EquipmentRequest[];
  equipment: Equipment[];
  currentUser: User | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReturn: (id: string) => void;
}

export const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  equipment,
  currentUser,
  onApprove,
  onReject,
  onReturn
}) => {
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

  return (
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
            {requests.length > 0 ? requests.map((request) => {
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
                            onClick={() => onApprove(request.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onReject(request.id)}
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
                          onClick={() => onReturn(request.id)}
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
            }) : (
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
  );
};
