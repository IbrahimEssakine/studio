"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

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
  login: (email: string, password: string) => { success: boolean, isAdmin: boolean, message: string };
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'role'>) => { success: boolean, message: string };
  updateUser: (userId: string, updatedData: Partial<User>) => { success: boolean, message: string };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  
  // Load users from localStorage or use mock data
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      setUsers(mockUsers);
    }
  }, []);

  // Load logged-in user from session storage
  useEffect(() => {
     try {
      const storedUser = sessionStorage.getItem('loggedInUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse logged-in user from sessionStorage", error);
    }
    setIsInitialLoad(false);
  }, []);

  // Persist users to localStorage
  useEffect(() => {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  // Persist logged-in user to session storage
  useEffect(() => {
    if (!isInitialLoad) {
        try {
            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            } else {
                sessionStorage.removeItem('loggedInUser');
            }
        } catch (error) {
            console.error("Failed to save user to sessionStorage", error);
        }
    }
  }, [user, isInitialLoad]);


  const login = (email: string, password: string): { success: boolean, isAdmin: boolean, message: string } => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      const isAdmin = userToStore.role === 'admin';
      return { success: true, isAdmin, message: 'Login successful' };
    }
    
    return { success: false, isAdmin: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  const addUser = (userData: Omit<User, 'id' | 'role'>): { success: boolean, message: string } => {
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
        ...userData,
        id: `USER${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        role: 'customer'
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return { success: true, message: 'Account created successfully.' };
  };

  const updateUser = (userId: string, updatedData: Partial<User>): { success: boolean, message: string } => {
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
        // Also update the currently logged-in user's state
        if (user && user.id === userId) {
             // omit password from the updated user object before setting it in state
            const { password, ...userToStore } = { ...user, ...updatedData };
            setUser(userToStore);
        }
        return { success: true, message: "User updated successfully." };
    }
    
    return { success: false, message: "User not found." };
  }

  return (
    <UserContext.Provider value={{ user, users, login, logout, addUser, updateUser }}>
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
