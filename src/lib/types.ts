
export interface Product {
  id: string;
  name: string;
  marque?: string;
  price: number;
  category: "Sunglasses" | "Eyeglasses" | "Contact Lens" | "Clip 2 in 1";
  gender: "Homme" | "Femme" | "Unisex";
  image: string;
  colors: string[];
  tags: string[];
  rating: number;
  reviews: number;
  description?: string;
  ribbon?: string;
}

export interface CartItem extends Product {
    quantity: number;
    color: string;
    lensType: string;
    requiresAppointment?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: number;
  details?: CartItem[];
  shippingAddress?: any;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
}

export interface User {
    id: string;
    email: string;
    password?: string; // Should not be stored long-term
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    gender: string;
    role: 'customer' | 'admin';
}

export interface LensTypeOption {
  name: string;
  price: number;
}

    