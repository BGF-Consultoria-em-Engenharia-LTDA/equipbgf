
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";

// Fetch users data from Supabase
export const fetchUsersData = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    if (data) {
      return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as User['role']
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching users data:', error);
    throw error;
  }
};

// Add user to Supabase
export const addUserToDb = async (newUser: Omit<User, 'id'>) => {
  try {
    // Create the auth user with the correct method
    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password || Math.random().toString(36).substring(2, 12),
      options: {
        data: { 
          name: newUser.name,
          role: newUser.role
        }
      }
    });
    
    if (error) throw error;
    
    if (data && data.user) {
      // Check if we need to manually update the role since some Supabase installations
      // might not have the trigger set up to sync user metadata to the users table
      if (newUser.role !== 'user') {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: newUser.role })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.warn('Error updating user role:', updateError);
          // This is not fatal, the trigger might handle it
        }
      }
      
      toast({
        title: "User created successfully",
        description: data.user.email_confirmed_at 
          ? "You can now sign in with your credentials." 
          : "Please check your email to confirm your account before signing in.",
        duration: 5000
      });
      
      return true;
    }
    
    throw new Error('User creation failed');
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};
