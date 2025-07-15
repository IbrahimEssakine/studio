"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/lib/types';

// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "Classic Aviator", price: 1500, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Gold", "Silver"], rating: 4.5, reviews: 120, description: "The quintessential pilot's sunglasses, offering timeless style and excellent UV protection." },
  { id: "2", name: "Modern Wayfarer", price: 1300, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Black", "Tortoise"], rating: 4.8, reviews: 250, description: "A modern take on a timeless classic. The Wayfarer's iconic shape is updated with a sleeker profile and lightweight materials." },
  { id: "3", name: "Retro Round", price: 1200, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Bronze", "Matte Black"], rating: 4.6, reviews: 95, description: "Channel a vintage vibe with these perfectly round sunglasses, inspired by the icons of the past." },
  { id: "4", name: "Minimalist Frames", price: 1800, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Titanium", "Clear"], rating: 4.9, reviews: 180, description: "For the modern professional, these minimalist frames are lightweight, durable, and effortlessly stylish." },
  { id: "5", name: "Cat-Eye Chic", price: 1650, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Rose Gold", "Black"], rating: 4.7, reviews: 150, description: "Make a statement with these glamorous cat-eye sunglasses, designed to turn heads." },
  { id: "6", name: "Scholarly Specs", price: 950, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Silver", "Gunmetal"], rating: 4.4, reviews: 88, description: "Smart and sophisticated, these rectangular frames are perfect for the office or the library." },
  { id: "7", name: "Sporty Wraparounds", price: 1900, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Red", "Blue"], rating: 4.8, reviews: 210, description: "Engineered for performance, these wraparound sunglasses provide maximum coverage and a secure fit." },
  { id: "8", name: "Bold Acetate", price: 2100, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Crystal", "Emerald Green"], rating: 4.9, reviews: 300, description: "Express your personality with these thick, bold acetate frames available in a range of stunning colors." },
];

interface ProductContextType {
  products: Product[];
  getProductById: (productId: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Failed to parse products from localStorage", error);
      setProducts(mockProducts);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem('products', JSON.stringify(products));
      } catch (error) {
        console.error("Failed to save products to localStorage", error);
      }
    }
  }, [products, isInitialLoad]);

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
        ...product,
        id: `PROD${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const updateProduct = (productId: string, updatedProduct: Partial<Product>) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, ...updatedProduct } : p
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, getProductById, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
