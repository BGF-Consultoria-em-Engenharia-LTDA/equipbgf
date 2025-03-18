
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Clock,
  Hash,
  Wrench,
  User,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RequestForm } from '@/components/requests/RequestForm';
import { useInventory } from '@/context/InventoryContext';
import { formatDistanceToNow, format } from 'date-fns';

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEquipmentById, getRequestsByEquipmentId } = useInventory();
  const [isRequestFormOpen, setIsRequestFormOpen] = React.useState(false);

  const equipment = getEquipmentById(id || '');
  const requests = id ? getRequestsByEquipmentId(id) : [];

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Equipment Not Found</h2>
        <p className="text-gray-500">The equipment you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/inventory')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/inventory')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{equipment.name}</h1>
        <Badge className={getStatusColor(equipment.status)}>
          {equipment.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div className="relative h-64 overflow-hidden rounded-md bg-gray-100">
                  {equipment.image ? (
                    <img 
                      src={equipment.image} 
                      alt={equipment.name} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold">Description</h2>
                  <p className="mt-2 text-gray-700">{equipment.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{equipment.category}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">{equipment.location}</div>
                    </div>
                  </div>
                  
                  {equipment.serialNumber && (
                    <div className="flex items-center space-x-2">
                      <Hash className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Serial Number</div>
                        <div className="font-medium">{equipment.serialNumber}</div>
                      </div>
                    </div>
                  )}
                  
                  {equipment.purchaseDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Purchase Date</div>
                        <div className="font-medium">{format(new Date(equipment.purchaseDate), 'MMM d, yyyy')}</div>
                      </div>
                    </div>
                  )}
                  
                  {equipment.lastMaintenance && (
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Last Maintenance</div>
                        <div className="font-medium">{formatDistanceToNow(new Date(equipment.lastMaintenance), { addSuffix: true })}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Quantity</div>
                      <div className={`font-medium ${equipment.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {equipment.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Request History */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Request History</h2>
              {requests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(request => (
                      <TableRow key={request.id}>
                        <TableCell className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{request.userName}</span>
                        </TableCell>
                        <TableCell>{formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              request.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{request.purpose}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No request history available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Actions Sidebar */}
        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Actions</h2>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-inventory-blue hover:bg-inventory-blue-700"
                  disabled={equipment.status !== 'available' || equipment.quantity <= 0}
                  onClick={() => setIsRequestFormOpen(true)}
                >
                  Request Equipment
                </Button>
                
                {equipment.status !== 'available' && (
                  <div className="text-sm text-yellow-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    This equipment is currently {equipment.status.toLowerCase()}
                  </div>
                )}
                
                {equipment.quantity <= 0 && (
                  <div className="text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    No units available for request
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <RequestForm 
        equipment={equipment}
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
      />
    </div>
  );
};

export default EquipmentDetail;
