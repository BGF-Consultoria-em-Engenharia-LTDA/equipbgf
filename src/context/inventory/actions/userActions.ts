
import { User } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { addUserToDb, signInUser, signOutUser } from '../services';

export const createUserActions = (
  users: User[],
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>,
  fetchData: () => Promise<void>,
  currentUser: User | null
) => {
  const addUser = async (newUser: Omit<User, 'id'>) => {
    try {
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('You must be an admin to add users');
      }
      
      await addUserToDb(newUser);
      await fetchData();
      
      toast({
        title: "User added",
        description: `${newUser.name} has been added as a ${newUser.role}.`
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user.",
        variant: "destructive"
      });
      
      const id = Math.random().toString(36).substr(2, 9);
      setUsers([...users, { ...newUser, id }]);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await signInUser(email, password);
  };

  const signOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    await fetchData();
  };

  return {
    addUser,
    signIn,
    signOut
  };
};
