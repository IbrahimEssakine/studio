
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Review } from '@/lib/types';

// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "Classic Aviator", brandId: 'ray-ban', price: 1500, category: "Sunglasses", gender: 'Homme', image: "https://m.media-amazon.com/images/I/51PPiD-rH8L._AC_SL1500_.jpg", colors: ["Gold", "Silver"], tags: ["Timeless", "Pilot"], rating: 4.5, reviews: 120, description: "The quintessential pilot's sunglasses, offering timeless style and excellent UV protection.", ribbon: 'Best Seller', reviewsList: [{ id: "r1", author: "John D.", rating: 5, comment: "Amazing glasses, they feel very premium.", date: "2024-05-20"}] },
  { id: "2", name: "Modern Wayfarer", brandId: 'gucci', price: 1300, category: "Eyeglasses", gender: 'Unisex', image: "https://placehold.co/600x400.png", colors: ["Black", "Tortoise"], tags: ["Modern", "Iconic"], rating: 4.8, reviews: 250, description: "A modern take on a timeless classic. The Wayfarer's iconic shape is updated with a sleeker profile and lightweight materials.", reviewsList: [] },
  { id: "3", name: "Retro Round", brandId: 'prada', price: 1200, category: "Sunglasses", gender: 'Femme', image: "https://placehold.co/600x400.png", colors: ["Bronze", "Matte Black"], tags: ["Vintage"], rating: 4.6, reviews: 95, description: "Channel a vintage vibe with these perfectly round sunglasses, inspired by the icons of the past.", reviewsList: [] },
  { id: "4", name: "Minimalist Frames", brandId: 'dior', price: 1800, category: "Eyeglasses", gender: 'Unisex', image: "https://placehold.co/600x400.png", colors: ["Titanium", "Clear"], tags: ["Professional", "Lightweight"], rating: 4.9, reviews: 180, description: "For the modern professional, these minimalist frames are lightweight, durable, and effortlessly stylish.", reviewsList: [] },
  { id: "5", name: "Cat-Eye Chic", brandId: 'tom-ford', price: 1650, category: "Sunglasses", gender: 'Femme', image: "https://placehold.co/600x400.png", colors: ["Rose Gold", "Black"], tags: ["Glamorous"], rating: 4.7, reviews: 150, description: "Make a statement with these glamorous cat-eye sunglasses, designed to turn heads.", ribbon: 'New Arrival', reviewsList: [] },
  { id: "6", name: "Scholarly Specs", brandId: 'ray-ban', price: 950, category: "Eyeglasses", gender: 'Homme', image: "https://placehold.co/600x400.png", colors: ["Silver", "Gunmetal"], tags: ["Smart", "Sophisticated"], rating: 4.4, reviews: 88, description: "Smart and sophisticated, these rectangular frames are perfect for the office or the library.", reviewsList: [] },
  { id: "7", name: "Sporty Wraparounds", brandId: 'oakley', price: 1900, category: "Sunglasses", gender: 'Homme', image: "https://placehold.co/600x400.png", colors: ["Red", "Blue"], tags: ["Performance", "Secure Fit"], rating: 4.8, reviews: 210, description: "Engineered for performance, these wraparound sunglasses provide maximum coverage and a secure fit.", reviewsList: [] },
  { id: "8", name: "Bold Acetate", brandId: 'gucci', price: 2100, category: "Eyeglasses", gender: 'Femme', image: "https://placehold.co/600x400.png", colors: ["Crystal", "Emerald Green"], tags: ["Bold", "Statement"], rating: 4.9, reviews: 300, description: "Express your personality with these thick, bold acetate frames available in a range of stunning colors.", reviewsList: [] },
  { id: "9", name: "Daily Comfort", brandId: 'acuvue', price: 300, category: "Contact Lens", gender: 'Unisex', image: "https://placehold.co/600x400.png", colors: ["Clear"], tags: ["Daily", "Disposable"], rating: 4.9, reviews: 500, description: "Experience all-day comfort with these daily disposable contact lenses.", ribbon: "Most Popular", reviewsList: [] },
  { id: "10", name: "Clip-On Versatility", brandId: 'persol', price: 2500, category: "Clip 2 in 1", gender: 'Unisex', image: "https://placehold.co/600x400.png", colors: ["Black", "Silver"], tags: ["Versatile", "Convenient"], rating: 4.7, reviews: 75, description: "The ultimate in convenience. Switch from eyeglasses to sunglasses in a snap with these stylish clip-on frames.", reviewsList: [] }
];

interface ProductContextType {
  products: Product[];
  getProductById: (productId: string) => Product | undefined;
  addProduct: (product: Product) => { success: boolean, message: string };
  updateProduct: (productId: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
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

  const addProduct = (product: Product): { success: boolean, message: string } => {
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
        return { success: false, message: 'A product with this ID already exists.' };
    }
    setProducts(prevProducts => [{ ...product, reviewsList: product.reviewsList || [] }, ...prevProducts]);
    return { success: true, message: 'Product added successfully.' };
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

  const addReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const newReview: Review = {
            ...review,
            id: `rev${Math.random().toString(36).substr(2, 6)}`,
            date: new Date().toISOString(),
          };
          const reviewsList = [...(p.reviewsList || []), newReview];
          const newTotalRating = reviewsList.reduce((acc, r) => acc + r.rating, 0);
          const newAverageRating = newTotalRating / reviewsList.length;

          return {
            ...p,
            reviewsList,
            reviews: reviewsList.length,
            rating: newAverageRating,
          };
        }
        return p;
      })
    );
  };

  return (
    <ProductContext.Provider value={{ products, getProductById, addProduct, updateProduct, deleteProduct, addReview }}>
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
