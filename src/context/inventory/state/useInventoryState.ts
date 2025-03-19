
import { useState, useEffect } from 'react';
import { Equipment, EquipmentRequest, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";
import { 
  fetchEquipmentData, 
  fetchRequestsData, 
  fetchUsersData,
  getCurrentSession
} from '../services';

// Sample data
import { sampleEquipment, sampleRequests, sampleUsers } from '@/data/sampleData';

export const useInventoryState = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (currentUser) {
      try {
        const equipmentData = await fetchEquipmentData();
        setEquipment(equipmentData);
        
        const requestsData = await fetchRequestsData();
        setRequests(requestsData);
        
        const usersData = await fetchUsersData();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data from the server.",
          variant: "destructive"
        });
        
        setEquipment(sampleEquipment);
        setRequests(sampleRequests);
        setUsers(sampleUsers);
      }
    } else {
      setEquipment(sampleEquipment);
      setRequests(sampleRequests);
      setUsers(sampleUsers);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const userData = await getCurrentSession();
        if (userData) {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        await fetchData();
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) throw error;
            if (data) {
              const userData: User = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role as 'admin' | 'user'
              };
              setCurrentUser(userData);
              await fetchData();
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          await fetchData();
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    equipment,
    setEquipment,
    requests, 
    setRequests,
    users,
    setUsers,
    currentUser,
    setCurrentUser,
    isLoading,
    fetchData
  };
};
