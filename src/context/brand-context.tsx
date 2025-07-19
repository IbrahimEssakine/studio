
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Brand } from '@/lib/types';

// Mock data, will be replaced by DB fetch
const mockBrands: Brand[] = [
    { id: 'ray-ban', name: 'Ray-Ban', logo: 'https://placehold.co/100x50.png' },
    { id: 'gucci', name: 'Gucci', logo: 'https://placehold.co/100x50.png' },
    { id: 'prada', name: 'Prada', logo: 'https://placehold.co/100x50.png' },
    { id: 'dior', name: 'Dior', logo: 'https://placehold.co/100x50.png' },
    { id: 'tom-ford', name: 'Tom Ford', logo: 'https://placehold.co/100x50.png' },
    { id: 'oakley', name: 'Oakley', logo: 'https://placehold.co/100x50.png' },
    { id: 'acuvue', name: 'Acuvue', logo: 'https://placehold.co/100x50.png' },
    { id: 'persol', name: 'Persol', logo: 'https://placehold.co/100x50.png' },
];

interface BrandContextType {
  brands: Brand[];
  getBrandById: (brandId: string) => Brand | undefined;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<{ success: boolean, message: string }>;
  updateBrand: (brandId: string, updatedBrand: Partial<Brand>) => Promise<void>;
  deleteBrand: (brandId: string) => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [loading, setLoading] = useState(true);

  const fetchBrands = useCallback(async () => {
    // In a real app with server actions, you'd fetch from the server.
    // We'll use localStorage for now as a stand-in.
    try {
        const stored = localStorage.getItem('brands');
        if (stored) {
            setBrands(JSON.parse(stored));
        } else {
            localStorage.setItem('brands', JSON.stringify(mockBrands));
        }
    } catch (e) {
        console.error("Failed to access localStorage for brands", e);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const getBrandById = (brandId: string) => {
    return brands.find(b => b.id === brandId);
  };

  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    // This would be a server action
    const newId = brand.name.toLowerCase().replace(/\s+/g, '-');
    const existingBrand = brands.find(b => b.id.toLowerCase() === newId);
    if (existingBrand) {
        return { success: false, message: 'A brand with this ID already exists.' };
    }
    const newBrand = { ...brand, id: newId };
    const newBrands = [newBrand, ...brands];
    setBrands(newBrands);
    localStorage.setItem('brands', JSON.stringify(newBrands));
    return { success: true, message: 'Brand added successfully.' };
  };

  const updateBrand = async (brandId: string, updatedBrand: Partial<Brand>) => {
    const newBrands = brands.map(b => (b.id === brandId ? { ...b, ...updatedBrand } : b));
    setBrands(newBrands);
    localStorage.setItem('brands', JSON.stringify(newBrands));
  };

  const deleteBrand = async (brandId: string) => {
    const newBrands = brands.filter(b => b.id !== brandId);
    setBrands(newBrands);
    localStorage.setItem('brands', JSON.stringify(newBrands));
  };

  return (
    <BrandContext.Provider value={{ brands, getBrandById, addBrand, updateBrand, deleteBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrands = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrands must be used within a BrandProvider');
  }
  return context;
};
