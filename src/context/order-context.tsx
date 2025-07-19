
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
// Removed email service imports as they are handled server-side now

// Mock data, will be replaced by DB fetch
const mockOrders: Order[] = [
  { id: "ORD001", customerName: "John Doe", orderDate: new Date("2023-10-26").toISOString(), status: "Delivered", total: 2800, items: 2, shippingAddress: { email: 'customer@example.com', name: 'John Doe'} },
  { id: "ORD002", customerName: "Jane Smith", orderDate: new Date("2023-10-25").toISOString(), status: "Shipped", total: 1500, items: 1, shippingAddress: { email: 'jane@example.com', name: 'Jane Smith'} },
  { id: "ORD003", customerName: "Bob Johnson", orderDate: new Date("2023-10-24").toISOString(), status: "Pending", total: 4200, items: 3, shippingAddress: { email: 'bob@example.com', name: 'Bob Johnson'} },
  { id: "ORD004", customerName: "Alice Williams", orderDate: new Date("2023-10-22").toISOString(), status: "Cancelled", total: 950, items: 1, shippingAddress: { email: 'alice@example.com', name: 'Alice Williams'} },
];

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'items' | 'status'>) => Promise<void>;
  updateOrder: (orderId: string, updatedOrder: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    // In a real app with server actions, you'd fetch from the server.
    // For now, we use localStorage as a stand-in for a database.
    try {
        const stored = localStorage.getItem('orders');
        if (stored) {
            setOrders(JSON.parse(stored));
        } else {
            localStorage.setItem('orders', JSON.stringify(mockOrders));
        }
    } catch(e) {
        console.error("Failed to access localStorage for orders", e);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const refreshOrders = () => {
    fetchOrders();
  }

  const addOrder = async (order: Omit<Order, 'id' | 'orderDate' | 'items' | 'status'>) => {
    // This would be a server action
    const newOrder: Order = {
        ...order,
        id: `ORD${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        orderDate: new Date().toISOString(),
        items: order.details?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        status: "Pending",
    };
    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  const updateOrder = async (orderId: string, updatedOrder: Partial<Order>) => {
    const newOrders = orders.map(order =>
        order.id === orderId ? { ...order, ...updatedOrder } : order
    );
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  const deleteOrder = async (orderId: string) => {
    const newOrders = orders.filter(order => order.id !== orderId);
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within a OrderProvider');
  }
  return context;
};
