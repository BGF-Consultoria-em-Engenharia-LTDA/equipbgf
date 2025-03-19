
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useInventory } from '@/context/inventory/InventoryContext';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CreateUserForm from '@/components/users/CreateUserForm';
import { PlusCircle, InfoIcon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  
  const { signIn } = useInventory();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error, user } = await signIn(email, password);

      if (error) {
        setError(error.message);
        
        // Show instructions about email verification if needed
        if (error.message.includes('verify your email')) {
          toast({
            title: "Email verification required",
            description: "Check your inbox and verify your email before signing in.",
            duration: 5000
          });
        }
      } else if (user) {
        toast({
          title: 'Login successful',
          description: `Welcome back, ${user.name}!`,
        });
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md px-4">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">EquipTrack</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>For testing purposes</AlertTitle>
                <AlertDescription className="text-sm">
                  If you've just created a new account, you might need to disable email verification in the Supabase dashboard or use the default admin account below.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCreateUserOpen(true)}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Account
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-500">
              <p>
                Default credentials:
                <br />
                Email: admin@example.com | Password: admin123
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <CreateUserForm open={createUserOpen} onOpenChange={setCreateUserOpen} />
    </>
  );
};

export default Login;
