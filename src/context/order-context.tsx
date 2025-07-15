

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { sendNewOrderEmail, sendOrderStatusUpdateEmail, sendAdminNewOrderNotification } from '@/services/email-service';

// Mock data
const mockOrders: Order[] = [
  { id: "ORD001", customerName: "John Doe", orderDate: "2023-10-26", status: "Delivered", total: 2800, items: 2, shippingAddress: { email: 'customer@example.com', name: 'John Doe'} },
  { id: "ORD002", customerName: "Jane Smith", orderDate: "2023-10-25", status: "Shipped", total: 1500, items: 1, shippingAddress: { email: 'jane@example.com', name: 'Jane Smith'} },
  { id: "ORD003", customerName: "Bob Johnson", orderDate: "2023-10-24", status: "Pending", total: 4200, items: 3, shippingAddress: { email: 'bob@example.com', name: 'Bob Johnson'} },
  { id: "ORD004", customerName: "Alice Williams", orderDate: "2023-10-22", status: "Cancelled", total: 950, items: 1, shippingAddress: { email: 'alice@example.com', name: 'Alice Williams'} },
];


interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'items'>) => void;
  updateOrder: (orderId: string, updatedOrder: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(mockOrders); // Load mock data if nothing in storage
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
      setOrders(mockOrders); // Fallback to mock data
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error("Failed to save orders to localStorage", error);
      }
    }
  }, [orders, isInitialLoad]);

  const addOrder = (order: Omit<Order, 'id' | 'orderDate' | 'items'>) => {
    const newOrder: Order = {
        ...order,
        id: `ORD${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        orderDate: new Date().toISOString().split('T')[0],
        items: order.details?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    // Send emails
    sendNewOrderEmail(newOrder);
    sendAdminNewOrderNotification(newOrder);
  };

  const updateOrder = (orderId: string, updatedOrder: Partial<Order>) => {
    const originalOrder = orders.find(o => o.id === orderId);

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, ...updatedOrder } : order
      )
    );

    if (originalOrder && updatedOrder.status && originalOrder.status !== updatedOrder.status) {
      const finalOrder = { ...originalOrder, ...updatedOrder };
      sendOrderStatusUpdateEmail(finalOrder);
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder }}>
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
