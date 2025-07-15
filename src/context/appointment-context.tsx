"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Appointment } from '@/lib/types';
import { sendNewAppointmentEmail, sendAppointmentStatusUpdateEmail } from '@/services/email-service';

// Mock data
const mockAppointments: Appointment[] = [
    { id: "APT001", name: "Emily Brown", email: "emily@example.com", phone: "111-222-3333", date: new Date("2024-11-05"), time: "10:00 AM", status: "Confirmed" },
    { id: "APT002", name: "Michael Clark", email: "customer@example.com", phone: "444-555-6666", date: new Date("2024-11-06"), time: "02:30 PM", status: "Pending" },
    { id: "APT003", name: "Sarah Davis", email: "sarah@example.com", phone: "777-888-9999", date: new Date("2024-11-02"), time: "11:00 AM", status: "Cancelled" },
];

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (appointmentId: string, updatedAppointment: Partial<Appointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        // Dates need to be revived from strings
        const parsed = JSON.parse(storedAppointments).map((apt: any) => ({ ...apt, date: new Date(apt.date) }));
        setAppointments(parsed);
      } else {
        setAppointments(mockAppointments);
      }
    } catch (error) {
      console.error("Failed to parse appointments from localStorage", error);
      setAppointments(mockAppointments);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('appointments', JSON.stringify(appointments));
      } catch (error) {
        console.error("Failed to save appointments to localStorage", error);
      }
    }
  }, [appointments, isInitialLoad]);

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `APT${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "Pending",
    };
    setAppointments(prevAppointments => [newAppointment, ...prevAppointments]);
    sendNewAppointmentEmail(newAppointment);
  };

  const updateAppointment = (appointmentId: string, updatedAppointment: Partial<Appointment>) => {
    const originalAppointment = appointments.find(a => a.id === appointmentId);

    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId ? { ...apt, ...updatedAppointment } : apt
      )
    );
    
    if (originalAppointment && updatedAppointment.status && originalAppointment.status !== updatedAppointment.status) {
        const finalAppointment = { ...originalAppointment, ...updatedAppointment };
        sendAppointmentStatusUpdateEmail(finalAppointment);
    }
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(prevAppointments => prevAppointments.filter(apt => apt.id !== appointmentId));
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}>
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
