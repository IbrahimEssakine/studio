
"use client";

import { MoreHorizontal, PlusCircle, ShieldAlert, XIcon, View, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Order, Appointment, Product, User } from "@/lib/types";
import { useOrders } from "@/context/order-context";
import { useAppointments } from "@/context/appointment-context";
import { useProducts } from "@/context/product-context";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";


const availableTimes = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM",
];

const orderStatuses: Order['status'][] = ["Pending", "Shipped", "Delivered", "Cancelled"];
const appointmentStatuses: Appointment['status'][] = ["Pending", "Confirmed", "Cancelled"];
const productCategories: Product['category'][] = ["Sunglasses", "Eyeglasses"];
const userRoles: User['role'][] = ["customer", "admin"];

const initialNewOrderState: Omit<Order, 'id' | 'orderDate' | 'items' | 'details'> = { customerName: '', status: 'Pending', total: 0, shippingAddress: { email: '', name: '', phone: '', address: '' }};
const initialNewAppointmentState: Omit<Appointment, 'id' | 'status'> = { name: '', email: '', phone: '', date: new Date(), time: '' };
const initialNewProductState: Product = { id: '', name: '', price: 0, category: 'Eyeglasses', image: '', colors: [], rating: 0, reviews: 0, description: '' };
const initialNewUserState: Omit<User, 'id'> = { firstName: '', lastName: '', email: '', password: '', phone: '', address: '', city: '', zip: '', gender: '', role: 'customer' };


export default function DashboardPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    const { orders, updateOrder, deleteOrder, addOrder } = useOrders();
    const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { users, addUser, updateUser, deleteUser } = useUser();
    
    const [activeTab, setActiveTab] = useState("orders");

    const [isOrderDialogOpen, setOrderDialogOpen] = useState(false);
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [isProductDialogOpen, setProductDialogOpen] = useState(false);
    const [isUserDialogOpen, setUserDialogOpen] = useState(false);

    const [isAddOrderDialogOpen, setAddOrderDialogOpen] = useState(false);
    const [isAddAppointmentDialogOpen, setAddAppointmentDialogOpen] = useState(false);
    const [isAddProductDialogOpen, setAddProductDialogOpen] = useState(false);
    const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
    
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewingItem, setViewingItem] = useState<{type: string, data: any} | null>(null);

    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const [newOrder, setNewOrder] = useState(initialNewOrderState);
    const [newAppointment, setNewAppointment] = useState(initialNewAppointmentState);
    const [newProduct, setNewProduct] = useState(initialNewProductState);
    const [newUser, setNewUser] = useState(initialNewUserState);
    const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null);
    const [newColorInput, setNewColorInput] = useState("");

    const availableColors = useMemo(() => {
        const allColors = products.flatMap(p => p.colors);
        return [...new Set(allColors)];
    }, [products]);

    useEffect(() => {
        // user context might take a moment to load from session storage
        const timer = setTimeout(() => {
            if (user === undefined) { // Still loading
                return;
            }
            if (user === null) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/access-denied');
            }
             else {
                setIsLoading(false);
            }
        }, 100); // Give a brief moment for user context to initialize

        return () => clearTimeout(timer);
    }, [user, router]);


    const getBadgeVariant = (status: Order['status'] | Appointment['status']) => {
        switch (status) {
            case 'Delivered':
            case 'Confirmed':
                return 'default';
            case 'Shipped':
            case 'Pending':
                return 'secondary';
            case 'Cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };
    
    const handleViewClick = (type: string, data: any) => {
        setViewingItem({ type, data });
        setViewDialogOpen(true);
    };

    const handleAddNewClick = () => {
        switch(activeTab) {
            case 'orders': setAddOrderDialogOpen(true); break;
            case 'appointments': setAddAppointmentDialogOpen(true); break;
            case 'products': 
                setNewProduct(initialNewProductState);
                setNewProductImageFile(null);
                setAddProductDialogOpen(true); 
                break;
            case 'users': setAddUserDialogOpen(true); break;
        }
    }

    const handleEditOrderClick = (order: Order) => {
        setEditingOrder({ ...order });
        setOrderDialogOpen(true);
    };

    const handleEditAppointmentClick = (appointment: Appointment) => {
        setEditingAppointment({ ...appointment, date: new Date(appointment.date) });
        setAppointmentDialogOpen(true);
    }
    
    const handleEditProductClick = (product: Product) => {
        setEditingProduct({ ...product });
        setProductDialogOpen(true);
    }

    const handleEditUserClick = (user: User) => {
        setEditingUser({ ...user });
        setUserDialogOpen(true);
    }

    const handleSaveOrder = () => {
        if (editingOrder) {
            updateOrder(editingOrder.id, editingOrder);
            toast({ title: "Order Updated", description: `Order ${editingOrder.id} has been updated.` });
            setOrderDialogOpen(false);
            setEditingOrder(null);
        }
    };

    const handleSaveAppointment = () => {
        if(editingAppointment) {
            updateAppointment(editingAppointment.id, editingAppointment);
            toast({ title: "Appointment Updated", description: `Appointment ${editingAppointment.id} has been updated.`});
            setAppointmentDialogOpen(false);
            setEditingAppointment(null);
        }
    }
    
    const handleSaveProduct = () => {
        if(editingProduct) {
            updateProduct(editingProduct.id, editingProduct);
            toast({ title: "Product Updated", description: `Product ${editingProduct.name} has been updated.`});
            setProductDialogOpen(false);
            setEditingProduct(null);
        }
    }

    const handleSaveUser = () => {
        if(editingUser) {
            updateUser(editingUser.id, editingUser);
            toast({ title: "User Updated", description: `User ${editingUser.firstName} has been updated.`});
            setUserDialogOpen(false);
            setEditingUser(null);
        }
    }
    
    const handleAddOrder = () => {
        addOrder(newOrder);
        toast({ title: "Order Added", description: `A new order for ${newOrder.customerName} has been created.` });
        setAddOrderDialogOpen(false);
        setNewOrder(initialNewOrderState);
    };
    
    const handleAddAppointment = () => {
        addAppointment(newAppointment);
        toast({ title: "Appointment Added", description: `A new appointment for ${newAppointment.name} has been created.` });
        setAddAppointmentDialogOpen(false);
        setNewAppointment(initialNewAppointmentState);
    }

    const handleAddProduct = () => {
        if (!newProduct.id.trim() || !newProduct.name.trim() || !newProductImageFile) {
            toast({ title: "Error", description: "Product ID, Name, and Image are required.", variant: "destructive" });
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(newProductImageFile);
        reader.onloadend = () => {
            const imageDataUrl = reader.result as string;
            const productToAdd: Product = { ...newProduct, image: imageDataUrl };

            const result = addProduct(productToAdd);

            if (result.success) {
                toast({ title: "Product Added", description: `Product ${productToAdd.name} has been created.` });
                setAddProductDialogOpen(false);
                setNewProduct(initialNewProductState);
                setNewProductImageFile(null);
            } else {
                 toast({ title: "Error", description: result.message, variant: "destructive" });
            }
        };
        reader.onerror = () => {
            toast({ title: "Error", description: "Failed to read image file.", variant: "destructive" });
        };
    }

    const handleAddUser = () => {
        const result = addUser({ ...newUser });
         if (result.success) {
            toast({ title: "User Added", description: `User ${newUser.firstName} has been created.` });
            setAddUserDialogOpen(false);
            setNewUser(initialNewUserState);
         } else {
             toast({ title: "Error", description: result.message, variant: "destructive" });
         }
    }


    const handleDeleteOrder = (id: string) => {
        deleteOrder(id);
        toast({ title: "Order Deleted", description: `Order ${id} has been removed.` });
    };

    const handleDeleteAppointment = (id: string) => {
        deleteAppointment(id);
        toast({ title: "Appointment Deleted", description: `Appointment ${id} has been removed.` });
    };
    
    const handleDeleteProduct = (id: string) => {
        deleteProduct(id);
        toast({ title: "Product Deleted", description: `Product ${id} has been removed.` });
    };

    const handleDeleteUser = (id: string) => {
        deleteUser(id);
        toast({ title: "User Deleted", description: `User ${id} has been removed.` });
    }

    const handleAddColor = () => {
        if (newColorInput.trim() && !newProduct.colors.includes(newColorInput.trim())) {
            setNewProduct(prev => ({ ...prev, colors: [...prev.colors, newColorInput.trim()]}));
            setNewColorInput("");
        }
    }

    const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddColor();
        }
    }
    
    const handleRemoveColor = (colorToRemove: string) => {
        setNewProduct(prev => ({ ...prev, colors: prev.colors.filter(c => c !== colorToRemove)}));
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/4" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return (
             <div className="container mx-auto px-4 md:px-6 py-20 flex items-center justify-center min-h-[calc(100vh-theme(spacing.28))]">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
                            <ShieldAlert className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl font-headline mt-6">Access Denied</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground mt-2">
                            You do not have permission to view this page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                           This area is restricted to administrators only.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="mb-8">
            <h1 className="text-4xl font-headline font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders, appointments, and more.</p>
        </header>

        <Tabs defaultValue="orders" onValueChange={setActiveTab}>
            <div className="flex items-center">
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                    <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
                    <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
                    <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddNewClick}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add New
                        </span>
                    </Button>
                </div>
            </div>
            <TabsContent value="orders">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>A list of recent orders from your store.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{order.total.toFixed(2)} DH</TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Toggle menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleViewClick('order', order)}>View</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditOrderClick(order)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the order.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">No orders found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="appointments">
            <Card>
                    <CardHeader>
                        <CardTitle>Appointments</CardTitle>
                        <CardDescription>Manage all scheduled appointments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Date &amp; Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.length > 0 ? (
                                    appointments.map(apt => (
                                        <TableRow key={apt.id}>
                                            <TableCell className="font-medium">{apt.name}</TableCell>
                                            <TableCell>{new Date(apt.date).toLocaleDateString()} at {apt.time}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(apt.status)}>{apt.status}</Badge>
                                            </TableCell>
                                            <TableCell>{apt.email}</TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Toggle menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleViewClick('appointment', apt)}>View</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditAppointmentClick(apt)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {
                                                                updateAppointment(apt.id, { ...apt, status: 'Confirmed' });
                                                                toast({ title: "Appointment Confirmed", description: `Appointment for ${apt.name} has been confirmed.`})
                                                            }}>Confirm</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                     <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the appointment.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteAppointment(apt.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">No appointments found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="products">
                <Card>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>Manage your store's products.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {/* Mobile view: Cards */}
                        <div className="md:hidden space-y-4">
                            {products.length > 0 ? products.map(product => (
                                <Card key={product.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base flex justify-between items-start">
                                            <span>{product.name}</span>
                                             <AlertDialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost" className="h-6 w-6 -mt-2 -mr-2">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                         <DropdownMenuItem onClick={() => handleViewClick('product', product)}>View</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditProductClick(product)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                 <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the product.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </CardTitle>
                                        <CardDescription>{product.id}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <p><strong>Category:</strong> {product.category}</p>
                                        <p><strong>Price:</strong> {product.price.toFixed(2)} DH</p>
                                    </CardContent>
                                </Card>
                            )) : (
                                <p className="text-center text-muted-foreground py-12">No products found.</p>
                            )}
                        </div>

                         {/* Desktop view: Table */}
                         <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.length > 0 ? (
                                        products.map(product => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.id}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell className="text-right">{product.price.toFixed(2)} DH</TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewClick('product', product)}>View</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditProductClick(product)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the product.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">No products found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="users">
                 <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage all registered users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {/* Mobile View: Cards */}
                        <div className="md:hidden space-y-4">
                            {users.length > 0 ? users.map(user => (
                                <Card key={user.id}>
                                    <CardHeader>
                                        <CardTitle className="text-base flex justify-between items-start">
                                            <span>{user.firstName} {user.lastName}</span>
                                            <AlertDialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1} className="h-6 w-6 -mt-2 -mr-2">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick('user', user)}>View</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditUserClick(user)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the user account.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </CardTitle>
                                        <CardDescription>{user.id}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <p className="truncate"><strong>Email:</strong> {user.email}</p>
                                        <p><strong>Role:</strong> <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></p>
                                    </CardContent>
                                </Card>
                            )) : (
                                <p className="text-center text-muted-foreground py-12">No users found.</p>
                            )}
                        </div>

                         {/* Desktop view: Table */}
                         <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.id}</TableCell>
                                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell><Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewClick('user', user)}>View</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditUserClick(user)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the user account.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">No users found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        
        {/* Edit Order Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setOrderDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Order</DialogTitle>
                </DialogHeader>
                {editingOrder && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Customer Name</Label>
                            <Input id="customerName" value={editingOrder.customerName} onChange={(e) => setEditingOrder({...editingOrder, customerName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="status">Status</Label>
                             <Select value={editingOrder.status} onValueChange={(value) => setEditingOrder({...editingOrder, status: value as Order['status']})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {orderStatuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total">Total</Label>
                            <Input id="total" type="number" value={editingOrder.total} onChange={(e) => setEditingOrder({...editingOrder, total: parseFloat(e.target.value) || 0})} />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveOrder}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

         {/* Edit Appointment Dialog */}
         <Dialog open={isAppointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                </DialogHeader>
                {editingAppointment && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="apt-name">Name</Label>
                            <Input id="apt-name" value={editingAppointment.name} onChange={(e) => setEditingAppointment({...editingAppointment, name: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="apt-email">Email</Label>
                            <Input id="apt-email" type="email" value={editingAppointment.email} onChange={(e) => setEditingAppointment({...editingAppointment, email: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label>Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !editingAppointment.date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editingAppointment.date ? format(editingAppointment.date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(editingAppointment.date)}
                                    onSelect={(date) => date && setEditingAppointment({...editingAppointment, date: date})}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="apt-time">Time</Label>
                             <Select value={editingAppointment.time} onValueChange={(value) => setEditingAppointment({...editingAppointment, time: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apt-status">Status</Label>
                            <Select value={editingAppointment.status} onValueChange={(value) => setEditingAppointment({...editingAppointment, status: value as Appointment['status']})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {appointmentStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveAppointment}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isProductDialogOpen} onOpenChange={setProductDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                {editingProduct && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="prod-name">Product Name</Label>
                            <Input id="prod-name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prod-desc">Description</Label>
                            <Textarea id="prod-desc" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prod-price">Price</Label>
                                <Input id="prod-price" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prod-category">Category</Label>
                                <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value as Product['category']})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveProduct}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

         {/* Edit User Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setUserDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
                {editingUser && (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="user-firstname">First Name</Label>
                                <Input id="user-firstname" value={editingUser.firstName} onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-lastname">Last Name</Label>
                                <Input id="user-lastname" value={editingUser.lastName} onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user-email">Email</Label>
                            <Input id="user-email" disabled value={editingUser.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user-role">Role</Label>
                            <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value as User['role']})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {userRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveUser}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Add Order Dialog */}
        <Dialog open={isAddOrderDialogOpen} onOpenChange={setAddOrderDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Add New Order</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-order-customerName" className="text-right">Customer Name</Label>
                        <Input id="new-order-customerName" value={newOrder.customerName} onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value, shippingAddress: { ...newOrder.shippingAddress, name: e.target.value }})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-order-phone" className="text-right">Phone</Label>
                        <Input id="new-order-phone" value={newOrder.shippingAddress?.phone || ''} onChange={(e) => setNewOrder({...newOrder, shippingAddress: { ...newOrder.shippingAddress, phone: e.target.value }})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-order-address" className="text-right">Address</Label>
                        <Input id="new-order-address" value={newOrder.shippingAddress?.address || ''} onChange={(e) => setNewOrder({...newOrder, shippingAddress: { ...newOrder.shippingAddress, address: e.target.value }})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-order-status" className="text-right">Status</Label>
                         <Select value={newOrder.status} onValueChange={(value) => setNewOrder({...newOrder, status: value as Order['status']})}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>{orderStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                         </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-order-total" className="text-right">Total</Label>
                        <Input id="new-order-total" type="number" value={newOrder.total} onChange={(e) => setNewOrder({...newOrder, total: parseFloat(e.target.value) || 0})} className="col-span-3" />
                    </div>
                    {/* Simplified product adding for now */}
                     <p className="text-sm text-center text-muted-foreground pt-2">Product details for new orders are managed at checkout.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddOrder}>Add Order</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add Appointment Dialog */}
        <Dialog open={isAddAppointmentDialogOpen} onOpenChange={setAddAppointmentDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Add New Appointment</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-apt-name" className="text-right">Name</Label>
                        <Input id="new-apt-name" value={newAppointment.name} onChange={(e) => setNewAppointment({...newAppointment, name: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-apt-email" className="text-right">Email</Label>
                        <Input id="new-apt-email" type="email" value={newAppointment.email} onChange={(e) => setNewAppointment({...newAppointment, email: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-apt-phone" className="text-right">Phone</Label>
                        <Input id="new-apt-phone" value={newAppointment.phone} onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal col-span-3", !newAppointment.date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {newAppointment.date ? format(newAppointment.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newAppointment.date} onSelect={(date) => date && setNewAppointment({...newAppointment, date: date})} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-apt-time" className="text-right">Time</Label>
                         <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a time" /></SelectTrigger>
                            <SelectContent>{availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddAppointment}>Add Appointment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Add Product Dialog */}
        <Dialog open={isAddProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="space-y-2">
                        <Label htmlFor="new-prod-id">Product ID</Label>
                        <Input id="new-prod-id" value={newProduct.id} onChange={(e) => setNewProduct({...newProduct, id: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-prod-name">Name</Label>
                        <Input id="new-prod-name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-prod-desc">Description</Label>
                        <Textarea id="new-prod-desc" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-prod-image">Image</Label>
                        <Input id="new-prod-image" type="file" accept="image/*" onChange={(e) => setNewProductImageFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
                        <Label htmlFor="new-prod-image" className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer w-full flex items-center gap-2")}>
                            <Upload className="w-4 h-4" />
                            <span>{newProductImageFile ? newProductImageFile.name : 'Upload Image'}</span>
                        </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-prod-price">Price</Label>
                            <Input id="new-prod-price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-prod-category">Category</Label>
                            <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value as Product['category']})}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Colors</Label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                            {newProduct.colors.map((color, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {color}
                                    <button type="button" onClick={() => handleRemoveColor(color)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                        <XIcon className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Input 
                                placeholder="Add a color name" 
                                value={newColorInput} 
                                onChange={(e) => setNewColorInput(e.target.value)}
                                onKeyDown={handleColorKeyDown}
                            />
                            <Button type="button" variant="outline" onClick={handleAddColor}>Add</Button>
                        </div>
                        {availableColors.length > 0 && (
                            <div className="pt-2">
                                <Label className="text-sm text-muted-foreground">Or select existing colors:</Label>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {availableColors.filter(c => !newProduct.colors.includes(c)).map(color => (
                                        <Button
                                            key={color}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setNewProduct(prev => ({...prev, colors: [...prev.colors, color]}))}
                                            className="text-xs"
                                        >
                                            {color}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-prod-rating">Rating</Label>
                            <Input id="new-prod-rating" type="number" step="0.1" max="5" min="0" value={newProduct.rating} onChange={(e) => setNewProduct({...newProduct, rating: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-prod-reviews">Reviews</Label>
                            <Input id="new-prod-reviews" type="number" value={newProduct.reviews} onChange={(e) => setNewProduct({...newProduct, reviews: parseInt(e.target.value) || 0})} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="new-user-firstname" className="text-right">First Name</Label>
                         <Input id="new-user-firstname" value={newUser.firstName} onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-user-lastname" className="text-right">Last Name</Label>
                        <Input id="new-user-lastname" value={newUser.lastName} onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-user-email" className="text-right">Email</Label>
                        <Input id="new-user-email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-user-password" className="text-right">Password</Label>
                        <Input id="new-user-password" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-user-role" className="text-right">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as User['role']})}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>{userRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                {viewingItem && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Details for {viewingItem.type.charAt(0).toUpperCase() + viewingItem.type.slice(1)}</DialogTitle>
                            <DialogDescription>
                                Viewing full details for {viewingItem.data.id || viewingItem.data.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {viewingItem.type === 'order' && <OrderDetailsView order={viewingItem.data} />}
                            {viewingItem.type === 'appointment' && <AppointmentDetailsView appointment={viewingItem.data} />}
                            {viewingItem.type === 'product' && <ProductDetailsView product={viewingItem.data} />}
                            {viewingItem.type === 'user' && <UserDetailsView user={viewingItem.data} />}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>


    </div>
  );
}


function OrderDetailsView({ order }: { order: Order }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-muted-foreground">Order ID</p><p className="font-medium">{order.id}</p></div>
                        <div><p className="text-muted-foreground">Order Date</p><p className="font-medium">{order.orderDate}</p></div>
                        <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{order.customerName}</p></div>
                        <div><p className="text-muted-foreground">Status</p><div><Badge>{order.status}</Badge></div></div>
                        <div><p className="text-muted-foreground">Total Items</p><p className="font-medium">{order.items}</p></div>
                        <div><p className="text-muted-foreground">Total Amount</p><p className="font-bold text-base">{order.total.toFixed(2)} DH</p></div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p className="font-medium">{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                    <p>Email: {order.shippingAddress?.email}</p>
                    {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress?.phone}</p>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Items in Order</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.details?.map((item) => (
                                <TableRow key={`${item.id}-${item.color}-${item.lensType}`}>
                                    <TableCell className="flex items-center gap-2">
                                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" />
                                        <span>{item.name}</span>
                                    </TableCell>
                                    <TableCell>{item.color}, {item.lensType}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.price.toFixed(2)} DH</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function AppointmentDetailsView({ appointment }: { appointment: Appointment }) {
    return (
        <Card>
            <CardHeader><CardTitle>Appointment Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Appointment ID</p><p className="font-medium">{appointment.id}</p></div>
                <div><p className="text-muted-foreground">Status</p><div><Badge>{appointment.status}</Badge></div></div>
                <div><p className="text-muted-foreground">Name</p><p className="font-medium">{appointment.name}</p></div>
                <div><p className="text-muted-foreground">Date &amp; Time</p><p className="font-medium">{format(new Date(appointment.date), "PPP")} at {appointment.time}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{appointment.email}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{appointment.phone}</p></div>
            </CardContent>
        </Card>
    );
}

function ProductDetailsView({ product }: { product: Product }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6 flex flex-col sm:flex-row gap-6 items-start">
                    <Image src={product.image} alt={product.name} width={200} height={200} className="rounded-lg border" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.id}</p>
                        <p className="text-lg font-semibold">{product.price.toFixed(2)} DH</p>
                        <p><Badge variant="secondary">{product.category}</Badge></p>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm mb-4">{product.description}</p>
                    <Separator />
                    <div className="mt-4">
                        <p className="font-semibold">Colors:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {product.colors.map(color => <Badge key={color} variant="outline">{color}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function UserDetailsView({ user }: { user: User }) {
    return (
        <Card>
            <CardHeader><CardTitle>User Details</CardTitle></CardHeader>
             <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">User ID</p><p className="font-medium">{user.id}</p></div>
                <div><p className="text-muted-foreground">Role</p><div><Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></div></div>
                <div><p className="text-muted-foreground">First Name</p><p className="font-medium">{user.firstName}</p></div>
                <div><p className="text-muted-foreground">Last Name</p><p className="font-medium">{user.lastName}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground">Email</p><p className="font-medium">{user.email}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{user.phone || 'N/A'}</p></div>
                <div><p className="text-muted-foreground">Gender</p><p className="font-medium capitalize">{user.gender || 'N/A'}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground">Address</p><p className="font-medium">{user.address}, {user.city}, {user.zip}</p></div>
            </CardContent>
        </Card>
    );
}
