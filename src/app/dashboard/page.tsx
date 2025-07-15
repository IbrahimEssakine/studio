
"use client";

import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { notFound, useRouter } from 'next/navigation';


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
const initialNewProductState: Omit<Product, 'id'> = { name: '', price: 0, category: 'Eyeglasses', image: 'https://placehold.co/600x400.png', colors: [], rating: 0, reviews: 0, description: '' };
const initialNewUserState: Omit<User, 'id'> = { firstName: '', lastName: '', email: '', password: '', phone: '', address: '', city: '', zip: '', gender: '', role: 'customer' };


export default function DashboardPage() {
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const [isClient, setIsClient] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                notFound();
            } else {
                setAuthChecked(true);
            }
        }
    }, [isClient, user, router]);


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

    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const [newOrder, setNewOrder] = useState(initialNewOrderState);
    const [newAppointment, setNewAppointment] = useState(initialNewAppointmentState);
    const [newProduct, setNewProduct] = useState(initialNewProductState);
    const [newUser, setNewUser] = useState(initialNewUserState);


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

    const handleAddNewClick = () => {
        switch(activeTab) {
            case 'orders': setAddOrderDialogOpen(true); break;
            case 'appointments': setAddAppointmentDialogOpen(true); break;
            case 'products': setAddProductDialogOpen(true); break;
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
        addProduct(newProduct);
        toast({ title: "Product Added", description: `Product ${newProduct.name} has been created.` });
        setAddProductDialogOpen(false);
        setNewProduct(initialNewProductState);
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

    if (!isClient || !authChecked) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-12">
                <p>Loading...</p>
            </div>
        );
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
                                                            <DropdownMenuItem onClick={() => handleEditOrderClick(order)}>Edit</DropdownMenuItem>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
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
                                    <TableHead>Date & Time</TableHead>
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
                                                            <DropdownMenuItem onClick={() => handleEditAppointmentClick(apt)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => {
                                                                updateAppointment(apt.id, { ...apt, status: 'Confirmed' });
                                                                toast({ title: "Appointment Confirmed", description: `Appointment for ${apt.name} has been confirmed.`})
                                                            }}>Confirm</DropdownMenuItem>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
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
                                                            <DropdownMenuItem onClick={() => handleEditProductClick(product)}>Edit</DropdownMenuItem>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
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
                                                            <DropdownMenuItem onClick={() => handleEditUserClick(user)}>Edit</DropdownMenuItem>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-name" className="text-right">Name</Label>
                        <Input id="new-prod-name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-desc" className="text-right">Description</Label>
                        <Textarea id="new-prod-desc" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-image" className="text-right">Image URL</Label>
                        <Input id="new-prod-image" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-price" className="text-right">Price</Label>
                        <Input id="new-prod-price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-category" className="text-right">Category</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value as Product['category']})}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>{productCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-colors" className="text-right">Colors</Label>
                        <Input id="new-prod-colors" placeholder="e.g. Black, Red, Blue" value={newProduct.colors.join(', ')} onChange={(e) => setNewProduct({...newProduct, colors: e.target.value.split(',').map(c => c.trim())})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-rating" className="text-right">Rating</Label>
                        <Input id="new-prod-rating" type="number" step="0.1" max="5" min="0" value={newProduct.rating} onChange={(e) => setNewProduct({...newProduct, rating: parseFloat(e.target.value) || 0})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-prod-reviews" className="text-right">Reviews</Label>
                        <Input id="new-prod-reviews" type="number" value={newProduct.reviews} onChange={(e) => setNewProduct({...newProduct, reviews: parseInt(e.target.value) || 0})} className="col-span-3" />
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


    </div>
  );
}
