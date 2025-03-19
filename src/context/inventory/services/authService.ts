
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from "@/components/ui/use-toast";

// Sign in user with Supabase
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Check specific error types for better user feedback
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: new Error('Please verify your email address before signing in.'), 
          user: null 
        };
      }
      
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: new Error('Invalid email or password. Please try again.'), 
          user: null 
        };
      }
      
      return { error, user: null };
    }
    
    if (data.user) {
      // Get user details from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
        // If we can't get user data, allow login with basic user info
        const basicUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || 'User',
          email: data.user.email || '',
          role: data.user.user_metadata?.role || 'user'
        };
        return { error: null, user: basicUser };
      }
        
      if (userData) {
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as 'admin' | 'user'
        };
        return { error: null, user };
      }
    }
    
    return { error: new Error('User not found'), user: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { error, user: null };
  }
};

// Sign out user from Supabase
export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
  } catch (error) {
    console.error('Error signing out:', error);
    toast({
      title: "Error",
      description: "An error occurred while signing out.",
      variant: "destructive"
    });
    throw error;
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
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
        return userData;
      }
    }
    return null;
  } catch (error) {
    console.error('Error checking session:', error);
    return null;
  }
};
