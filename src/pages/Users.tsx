
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useInventory } from '@/context/inventory/InventoryContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types';
import CreateUserForm from '@/components/users/CreateUserForm';

const Users = () => {
  const { users } = useInventory();
  const [createUserOpen, setCreateUserOpen] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setCreateUserOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create User
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-users">
            <TabsList className="mb-4">
              <TabsTrigger value="all-users">All Users</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="regular-users">Regular Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-users">
              <UserTable users={users} />
            </TabsContent>
            
            <TabsContent value="admins">
              <UserTable users={users.filter(user => user.role === 'admin')} />
            </TabsContent>
            
            <TabsContent value="regular-users">
              <UserTable users={users.filter(user => user.role === 'user')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateUserForm open={createUserOpen} onOpenChange={setCreateUserOpen} />
    </div>
  );
};

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Users;
