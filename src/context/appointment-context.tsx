
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Appointment } from '@/lib/types';
// Removed email service imports as they are handled server-side now

// Actions will be server-side, so we don't need mock data here.
const mockAppointments: Appointment[] = [
    { id: "APT001", name: "Emily Brown", email: "emily@example.com", phone: "111-222-3333", date: new Date("2024-11-05"), time: "10:00 AM", status: "Confirmed" },
    { id: "APT002", name: "Michael Clark", email: "customer@example.com", phone: "444-555-6666", date: new Date("2024-11-06"), time: "02:30 PM", status: "Pending" },
    { id: "APT003", name: "Sarah Davis", email: "sarah@example.com", phone: "777-888-9999", date: new Date("2024-11-02"), time: "11:00 AM", status: "Cancelled" },
];

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Promise<void>;
  updateAppointment: (appointmentId: string, updatedAppointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  refreshAppointments: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    // In a real app with server actions, you'd fetch from the server
    // For now, we continue to use mock data loaded from localStorage
     try {
      const stored = localStorage.getItem('appointments');
      if (stored) {
        setAppointments(JSON.parse(stored).map((a: any) => ({...a, date: new Date(a.date) })));
      } else {
        localStorage.setItem('appointments', JSON.stringify(mockAppointments));
      }
    } catch (error) {
      console.error("Failed to access localStorage for appointments", error);
      // Keep mock data as fallback
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const refreshAppointments = () => {
      fetchAppointments();
  }

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'status'>) => {
    // This would be a server action in a real app
    const newAppointment: Appointment = {
      ...appointment,
      id: `APT${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "Pending",
    };
    const newAppointments = [newAppointment, ...appointments];
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const updateAppointment = async (appointmentId: string, updatedAppointment: Partial<Appointment>) => {
    const newAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, ...updatedAppointment } : apt
    );
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const deleteAppointment = async (appointmentId: string) => {
    const newAppointments = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment, refreshAppointments }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within a AppointmentProvider');
  }
  return context;
};
