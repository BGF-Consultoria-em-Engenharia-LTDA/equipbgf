
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/types';

interface EquipmentCardProps {
  equipment: Equipment;
  onRequestClick?: (equipment: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ 
  equipment, 
  onRequestClick
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {equipment.image ? (
          <img 
            src={equipment.image} 
            alt={equipment.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(equipment.status)}>
            {equipment.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium truncate" title={equipment.name}>
          {equipment.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {equipment.category}
        </p>
        <p className="text-sm mt-2 line-clamp-2" title={equipment.description}>
          {equipment.description}
        </p>
        <div className="mt-3 text-sm font-medium">
          <span className="text-gray-600">Quantity: </span>
          <span className={equipment.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
            {equipment.quantity}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={() => navigate(`/inventory/${equipment.id}`)}
        >
          Details
        </Button>
        <Button 
          variant="default" 
          className="flex-1 bg-inventory-blue hover:bg-inventory-blue-700"
          disabled={equipment.status !== 'available' || equipment.quantity <= 0}
          onClick={() => onRequestClick?.(equipment)}
        >
          Request
        </Button>
      </CardFooter>
    </Card>
  );
};
