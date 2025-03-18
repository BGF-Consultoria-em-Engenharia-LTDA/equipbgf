
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Package, ClipboardList, Users, Settings, LogOut } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

export const Sidebar: React.FC = () => {
  const { currentUser } = useInventory();
  
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Requests', href: '/requests', icon: ClipboardList },
  ];
  
  // Add admin-only navigation items
  if (currentUser?.role === 'admin') {
    navigationItems.push({ name: 'Users', href: '/users', icon: Users });
    navigationItems.push({ name: 'Settings', href: '/settings', icon: Settings });
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <span className="text-xl font-semibold text-inventory-blue">EquipTrack</span>
        </div>
        <div className="flex flex-col flex-grow px-4 mt-5">
          <nav className="flex-1 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-inventory-blue-50 text-inventory-blue'
                      : 'text-gray-600 hover:bg-gray-100'
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto pb-5">
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                Sign Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
