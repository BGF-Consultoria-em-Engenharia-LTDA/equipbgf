
import { EquipmentRequest, Equipment } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { 
  addRequestToDb,
  updateRequestStatusInDb
} from '../services';

export const createRequestActions = (
  requests: EquipmentRequest[],
  setRequests: React.Dispatch<React.SetStateAction<EquipmentRequest[]>>,
  equipment: Equipment[],
  updateEquipment: (id: string, updatedEquipment: Partial<Equipment>) => Promise<void>,
  currentUser: any
) => {
  const addRequest = async (newRequest: Omit<EquipmentRequest, 'id' | 'requestDate' | 'status'>) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to submit a request');
      }
      
      const formattedRequest = await addRequestToDb(newRequest);
      setRequests([...requests, formattedRequest]);
      
      toast({
        title: "Request submitted",
        description: `Your request for ${newRequest.quantity} item(s) has been submitted and is pending approval.`
      });
    } catch (error) {
      console.error('Error adding request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request.",
        variant: "destructive"
      });
      
      const id = Math.random().toString(36).substr(2, 9);
      const requestDate = new Date().toISOString();
      setRequests([
        ...requests,
        { ...newRequest, id, requestDate, status: 'pending' }
      ]);
    }
  };

  const updateRequestStatus = async (id: string, status: EquipmentRequest['status']) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update a request');
      }
      
      await updateRequestStatusInDb(id, status);
      
      setRequests(
        requests.map((req) => {
          if (req.id === id) {
            const updatedReq = { ...req, status };
            
            if (status === 'returned') {
              const relatedEquipment = equipment.find(e => e.id === req.equipmentId);
              if (relatedEquipment) {
                updateEquipment(relatedEquipment.id, { 
                  status: 'available',
                  quantity: relatedEquipment.quantity + req.quantity
                });
              }
              updatedReq.returnDate = new Date().toISOString();
            }
            
            if (status === 'approved') {
              const relatedEquipment = equipment.find(e => e.id === req.equipmentId);
              if (relatedEquipment) {
                updateEquipment(relatedEquipment.id, { 
                  status: relatedEquipment.quantity - req.quantity <= 0 ? 'in-use' : 'available',
                  quantity: relatedEquipment.quantity - req.quantity
                });
              }
            }
            
            return updatedReq;
          }
          return req;
        })
      );
      
      toast({
        title: "Request updated",
        description: `The request status has been updated to ${status}.`
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive"
      });
      
      setRequests(
        requests.map((req) => {
          if (req.id === id) {
            if (status === 'returned') {
              const relatedEquipment = equipment.find(e => e.id === req.equipmentId);
              if (relatedEquipment) {
                updateEquipment(relatedEquipment.id, { 
                  status: 'available',
                  quantity: relatedEquipment.quantity + req.quantity
                });
              }
              return { ...req, status, returnDate: new Date().toISOString() };
            }
            
            if (status === 'approved') {
              const relatedEquipment = equipment.find(e => e.id === req.equipmentId);
              if (relatedEquipment) {
                updateEquipment(relatedEquipment.id, { 
                  status: relatedEquipment.quantity - req.quantity <= 0 ? 'in-use' : 'available',
                  quantity: relatedEquipment.quantity - req.quantity
                });
              }
            }
            
            return { ...req, status };
          }
          return req;
        })
      );
    }
  };

  return {
    addRequest,
    updateRequestStatus
  };
};
