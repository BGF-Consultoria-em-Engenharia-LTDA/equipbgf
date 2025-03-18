
import React, { useState, useMemo } from 'react';
import { 
  Package2,
  Search, 
  Plus,
  FilterX
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { EquipmentGrid } from '@/components/inventory/EquipmentGrid';
import { RequestForm } from '@/components/requests/RequestForm';
import { useInventory } from '@/context/InventoryContext';
import { Equipment, EquipmentStatus } from '@/types';

const InventoryList: React.FC = () => {
  const { equipment, currentUser } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | ''>('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Extract unique categories from equipment data
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    equipment.forEach(item => uniqueCategories.add(item.category));
    return Array.from(uniqueCategories);
  }, [equipment]);

  // Filter equipment based on search term and filters
  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      // Apply search filter
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply category filter
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      
      // Apply status filter
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [equipment, searchTerm, categoryFilter, statusFilter]);

  const handleRequestClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsRequestFormOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Package2 className="mr-2 h-6 w-6" />
            Equipment Inventory
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and browse available equipment
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button className="bg-inventory-blue hover:bg-inventory-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EquipmentStatus | '')}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || categoryFilter || statusFilter) && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Found {filteredEquipment.length} items
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
      
      <EquipmentGrid 
        equipment={filteredEquipment} 
        onRequestClick={handleRequestClick}
      />
      
      <RequestForm 
        equipment={selectedEquipment}
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
      />
    </div>
  );
};

export default InventoryList;
