
import { Equipment } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { 
  addEquipmentToDb,
  updateEquipmentInDb,
  deleteEquipmentFromDb
} from '../services';

export const createEquipmentActions = (
  equipment: Equipment[],
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>,
  currentUser: any
) => {
  const addEquipment = async (newEquipment: Omit<Equipment, 'id'>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add equipment');
      }
      
      const formattedEquipment = await addEquipmentToDb(newEquipment);
      setEquipment([...equipment, formattedEquipment]);
      
      toast({
        title: "Equipment added",
        description: `${newEquipment.name} has been added to inventory.`
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Error",
        description: "Failed to add equipment.",
        variant: "destructive"
      });
      
      const id = Math.random().toString(36).substr(2, 9);
      setEquipment([...equipment, { ...newEquipment, id }]);
    }
  };

  const updateEquipment = async (id: string, updatedEquipment: Partial<Equipment>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update equipment');
      }
      
      await updateEquipmentInDb(id, updatedEquipment);
      
      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, ...updatedEquipment } : item
        )
      );
      
      toast({
        title: "Equipment updated",
        description: "The equipment details have been updated."
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "Failed to update equipment.",
        variant: "destructive"
      });
      
      setEquipment(
        equipment.map((item) =>
          item.id === id ? { ...item, ...updatedEquipment } : item
        )
      );
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to delete equipment');
      }
      
      await deleteEquipmentFromDb(id);
      
      setEquipment(equipment.filter((item) => item.id !== id));
      
      toast({
        title: "Equipment removed",
        description: "The equipment has been removed from inventory."
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: "Error",
        description: "Failed to delete equipment.",
        variant: "destructive"
      });
      
      setEquipment(equipment.filter((item) => item.id !== id));
    }
  };

  return {
    addEquipment,
    updateEquipment,
    deleteEquipment
  };
};
