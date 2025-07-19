
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
// Removed email service import, should be handled server-side

// Mock user data for demonstration
const mockUsers: User[] = [
    {
        id: 'admin-user',
        email: 'purga2ryx@gmail.com',
        password: 'admin123', // In a real app, this would be a hash
        firstName: 'Admin',
        lastName: 'User',
        phone: '000-000-0000',
        address: '123 Admin Way',
        city: 'Dashboard City',
        zip: '00000',
        gender: 'other',
        role: 'admin'
    },
    {
        id: 'customer-user',
        email: 'customer@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
        address: '123 Main St',
        city: 'Anytown',
        zip: '12345',
        gender: 'male',
        role: 'customer'
    }
];

interface UserContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<{ success: boolean, isAdmin: boolean, message: string }>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'role'>) => Promise<{ success: boolean, message: string }>;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<{ success: boolean, message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean, message: string }>;
  refreshUsers: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    // This would be a server action in a real app.
    // We'll use localStorage as a stand-in for a database.
    try {
        const stored = localStorage.getItem('users');
        if (stored) {
            setUsers(JSON.parse(stored));
        } else {
            localStorage.setItem('users', JSON.stringify(mockUsers));
        }
    } catch(e) {
        console.error("Failed to access localStorage for users", e);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    // Check for logged-in user in session storage
    try {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch(e) {
        console.error("Failed to access sessionStorage for loggedInUser", e);
    }
    setLoading(false);
  }, [fetchUsers]);
  
  const refreshUsers = () => {
      fetchUsers();
  }

  const login = async (email: string, password: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      sessionStorage.setItem('loggedInUser', JSON.stringify(userToStore));
      const isAdmin = userToStore.role === 'admin';
      return { success: true, isAdmin, message: 'Login successful' };
    }
    
    return { success: false, isAdmin: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  const addUser = async (userData: Omit<User, 'id' | 'role'>) => {
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
        ...userData,
        id: `USER${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        role: 'customer'
    };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    return { success: true, message: 'Account created successfully.' };
  };

  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    let userUpdated = false;
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            userUpdated = true;
            return { ...u, ...updatedData };
        }
        return u;
    });

    if (userUpdated) {
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        if (user && user.id === userId) {
            const { password, ...userToStore } = { ...user, ...updatedData };
            setUser(userToStore);
            sessionStorage.setItem('loggedInUser', JSON.stringify(userToStore));
        }
        return { success: true, message: "User updated successfully." };
    }
    
    return { success: false, message: "User not found." };
  }

  const deleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
        return { success: false, message: "User not found." };
    }

    if(userToDelete.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
        return { success: false, message: "Cannot delete the only admin."}
    }

    const newUsers = users.filter(u => u.id !== userId);
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    return { success: true, message: "User deleted successfully." };
  }

  if(loading) return <UserContext.Provider value={{ user, users, login, logout, addUser, updateUser, deleteUser, refreshUsers }}>{null}</UserContext.Provider>


  return (
    <UserContext.Provider value={{ user, users, login, logout, addUser, updateUser, deleteUser, refreshUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
