
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Equipment Inventory</CardTitle>
          <CardDescription className="text-center">
            {isLoginView 
              ? "Enter your email and password to sign in" 
              : "Create an account to access the equipment inventory"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoginView ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <SignupForm onToggleForm={toggleForm} />
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground mt-2">
            For administrative access, please contact your system administrator.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
