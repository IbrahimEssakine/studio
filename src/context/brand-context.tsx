
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Brand } from '@/lib/types';

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
  addBrand: (brand: Brand) => { success: boolean, message: string };
  updateBrand: (brandId: string, updatedBrand: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      const storedBrands = localStorage.getItem('brands');
      if (storedBrands) {
        setBrands(JSON.parse(storedBrands));
      } else {
        setBrands(mockBrands);
      }
    } catch (error) {
      console.error("Failed to parse brands from localStorage", error);
      setBrands(mockBrands);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('brands', JSON.stringify(brands));
      } catch (error) {
        console.error("Failed to save brands to localStorage", error);
      }
    }
  }, [brands, isInitialLoad]);

  const getBrandById = (brandId: string) => {
    return brands.find(b => b.id === brandId);
  };

  const addBrand = (brand: Brand): { success: boolean, message: string } => {
    const existingBrand = brands.find(b => b.id.toLowerCase() === brand.id.toLowerCase());
    if (existingBrand) {
        return { success: false, message: 'A brand with this ID already exists.' };
    }
    setBrands(prevBrands => [brand, ...prevBrands]);
    return { success: true, message: 'Brand added successfully.' };
  };

  const updateBrand = (brandId: string, updatedBrand: Partial<Brand>) => {
    setBrands(prevBrands =>
      prevBrands.map(b =>
        b.id === brandId ? { ...b, ...updatedBrand } : b
      )
    );
  };

  const deleteBrand = (brandId: string) => {
    setBrands(prevBrands => prevBrands.filter(b => b.id !== brandId));
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
