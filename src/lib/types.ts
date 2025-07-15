export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Sunglasses" | "Eyeglasses";
  image: string;
  colors: string[];
  rating: number;
  reviews: number;
  description?: string;
}

export interface CartItem extends Product {
    quantity: number;
    color: string;
    lensType: string;
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
