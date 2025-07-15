
"use client";

import { MoreHorizontal, PlusCircle, ShieldAlert, Star, Upload, XIcon, Eye, Search, ChevronsUpDown } from "lucide-react";
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
import type { Order, Appointment, Product, User, CartItem } from "@/lib/types";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar as CalendarIcon } from "lucide-react";
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

type ActiveItem = {
    type: 'order' | 'appointment' | 'product' | 'user';
    mode: 'add' | 'edit';
    data: any;
} | null;

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
    const [activeItem, setActiveItem] = useState<ActiveItem>(null);
    const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null);
    const [newColorInput, setNewColorInput] = useState("");
    const [newOrderItems, setNewOrderItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (user === undefined) return;
            if (user === null) router.push('/login');
            else if (user.role !== 'admin') router.push('/access-denied');
            else setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, [user, router]);

    const handleEditClick = (type: ActiveItem['type'], data: any) => {
        const dataToEdit = type === 'appointment' ? { ...data, date: new Date(data.date) } : { ...data };
        if (type === 'order' && !dataToEdit.details) {
            dataToEdit.details = [];
        }
        setActiveItem({ type, mode: 'edit', data: dataToEdit });
        if (type === 'product') {
            setNewProductImageFile(null);
            setNewColorInput("");
        }
        if (type === 'order') {
            setNewOrderItems(dataToEdit.details || []);
        }
    };
    
    const handleAddClick = () => {
        const type = activeTab.slice(0, -1) as ActiveItem['type'];
        let initialData;
        switch(type) {
            case 'order': 
                initialData = { customerName: '', status: 'Pending', total: 0, orderDate: new Date().toISOString().split('T')[0], shippingAddress: { email: '', name: '', phone: '', address: '', city: '', zip: '' }, details: [] }; 
                setNewOrderItems([]);
                break;
            case 'appointment': initialData = { name: '', email: '', phone: '', date: new Date(), time: '', status: 'Pending' }; break;
            case 'product': 
                initialData = { id: '', name: '', price: 0, category: 'Eyeglasses', image: '', colors: [], rating: 0, reviews: 0, description: '' };
                setNewProductImageFile(null);
                setNewColorInput("");
                break;
            case 'user': initialData = { firstName: '', lastName: '', email: '', password: '', phone: '', address: '', city: '', zip: '', gender: '', role: 'customer' }; break;
            default: return;
        }
        setActiveItem({ type, mode: 'add', data: initialData });
    };
    
    const handleSave = () => {
        if (!activeItem) return;

        const { type, mode, data } = activeItem;

        try {
            if (mode === 'add') {
                if (type === 'product') {
                    if (!data.id.trim() || !data.name.trim() || !newProductImageFile) {
                        toast({ title: "Error", description: "Product ID, Name, and Image are required.", variant: "destructive" });
                        return;
                    }
                    const reader = new FileReader();
                    reader.readAsDataURL(newProductImageFile);
                    reader.onloadend = () => {
                        const imageDataUrl = reader.result as string;
                        const productToAdd: Product = { ...data, image: imageDataUrl };
                        const result = addProduct(productToAdd);
                        if (result.success) {
                            toast({ title: "Product Added", description: `Product ${productToAdd.name} has been created.` });
                            setActiveItem(null);
                        } else {
                            toast({ title: "Error", description: result.message, variant: "destructive" });
                        }
                    };
                    reader.onerror = () => toast({ title: "Error", description: "Failed to read image file.", variant: "destructive" });
                    return;
                } else if (type === 'user') {
                    const result = addUser(data);
                    if (result.success) toast({ title: "User Added", description: `User ${data.firstName} has been created.` });
                    else { toast({ title: "Error", description: result.message, variant: "destructive" }); return; }
                } else if (type === 'order') {
                    const orderTotal = newOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                    const orderToAdd = { ...data, details: newOrderItems, total: orderTotal, items: newOrderItems.reduce((acc, i) => acc + i.quantity, 0) };
                    addOrder(orderToAdd);
                    toast({ title: "Order Added", description: `A new order for ${data.customerName} has been created.` });
                } else if (type === 'appointment') {
                    addAppointment(data);
                    toast({ title: "Appointment Added", description: `A new appointment for ${data.name} has been created.` });
                }
            } else { // mode === 'edit'
                if (type === 'order') {
                    const updatedOrderData = { ...data, details: newOrderItems };
                    updateOrder(data.id, updatedOrderData);
                    toast({ title: "Order Updated", description: `Order ${data.id} has been updated.` });
                } else if (type === 'appointment') {
                    updateAppointment(data.id, data);
                    toast({ title: "Appointment Updated", description: `Appointment ${data.id} has been updated.` });
                } else if (type === 'product') {
                    if (newProductImageFile) {
                        const reader = new FileReader();
                        reader.readAsDataURL(newProductImageFile);
                        reader.onloadend = () => {
                            const imageDataUrl = reader.result as string;
                            const productToUpdate = { ...data, image: imageDataUrl };
                            updateProduct(data.id, productToUpdate);
                            toast({ title: "Product Updated", description: `Product ${data.name} has been updated.` });
                            setActiveItem(null);
                        };
                        reader.onerror = () => toast({ title: "Error", description: "Failed to read image file.", variant: "destructive" });
                        return;
                    } else {
                        updateProduct(data.id, data);
                        toast({ title: "Product Updated", description: `Product ${data.name} has been updated.` });
                    }
                } else if (type === 'user') {
                    updateUser(data.id, data);
                    toast({ title: "User Updated", description: `User ${data.firstName} has been updated.` });
                }
            }
            setActiveItem(null);
        } catch (e: any) {
            toast({ title: "An Error Occurred", description: e.message, variant: "destructive" });
        }
    };

    const handleDelete = (type: string, id: string) => {
        if (type === 'order') {
            deleteOrder(id);
            toast({ title: "Order Deleted", description: `Order ${id} has been removed.` });
        } else if (type === 'appointment') {
            deleteAppointment(id);
            toast({ title: "Appointment Deleted", description: `Appointment ${id} has been removed.` });
        } else if (type === 'product') {
            deleteProduct(id);
            toast({ title: "Product Deleted", description: `Product ${id} has been removed.` });
        } else if (type === 'user') {
            deleteUser(id);
            toast({ title: "User Deleted", description: `User ${id} has been removed.` });
        }
    };
    
    const handleActiveItemDataChange = (field: string, value: any) => {
        if (activeItem) {
            setActiveItem({ ...activeItem, data: { ...activeItem.data, [field]: value }});
        }
    };

     const handleShippingAddressChange = (field: string, value: string) => {
        if (activeItem && activeItem.data.shippingAddress) {
            const newAddress = { ...activeItem.data.shippingAddress, [field]: value };
            handleActiveItemDataChange('shippingAddress', newAddress);
        }
    };

    const handleAddColor = () => {
        if (activeItem && activeItem.type === 'product' && newColorInput.trim() && !activeItem.data.colors.includes(newColorInput.trim())) {
            const newColors = [...activeItem.data.colors, newColorInput.trim()];
            handleActiveItemDataChange('colors', newColors);
            setNewColorInput("");
        }
    }

    const handleRemoveColor = (colorToRemove: string) => {
        if (activeItem && activeItem.type === 'product') {
            const newColors = activeItem.data.colors.filter((c: string) => c !== colorToRemove);
            handleActiveItemDataChange('colors', newColors);
        }
    }

    const handleUpdateOrderItem = (index: number, field: keyof CartItem, value: any) => {
        const updatedItems = [...newOrderItems];
        if (field === 'quantity') {
            updatedItems[index].quantity = Math.max(1, parseInt(value, 10));
        } else if (field === 'color') {
            updatedItems[index].color = value;
        } else if (field === 'lensType') {
            updatedItems[index].lensType = value;
        }
        setNewOrderItems(updatedItems);
    };

    const handleRemoveOrderItem = (index: number) => {
        setNewOrderItems(prev => prev.filter((_, i) => i !== index));
    };
    
    if (isLoading) {
        return <div className="container mx-auto px-4 md:px-6 py-12"><Skeleton className="h-[50vh] w-full" /></div>;
    }

    if (user?.role !== 'admin') {
        return (
             <div className="container mx-auto px-4 md:px-6 py-20 flex items-center justify-center min-h-[calc(100vh-theme(spacing.28))]">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader><div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit"><ShieldAlert className="h-12 w-12 text-destructive" /></div><CardTitle className="text-3xl font-headline mt-6">Access Denied</CardTitle><CardDescription className="text-lg text-muted-foreground mt-2">You do not have permission to view this page.</CardDescription></CardHeader>
                    <CardContent><p className="text-muted-foreground mb-6">This area is restricted to administrators only.</p><Button asChild size="lg"><Link href="/">Go to Homepage</Link></Button></CardContent>
                </Card>
            </div>
        )
    }

    const renderDialogContent = () => {
        if (!activeItem) return null;

        if (activeItem.type === 'order') {
            const orderItems = newOrderItems;
            const orderItemsCount = orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
            const orderTotal = orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
            
            const handleAddProductToOrder = (product: Product) => {
                 if (!product) return;
                const newItem: CartItem = {
                    ...product,
                    quantity: 1,
                    color: product.colors[0] || 'Default',
                    lensType: 'Standard',
                };
                setNewOrderItems(prev => [...prev, newItem]);
            }

            return (
                <>
                    <DialogHeader>
                        <DialogTitle>{activeItem.mode === 'edit' ? 'Edit Order' : 'Add New Order'} - {activeItem.data.id || 'New'}</DialogTitle>
                        <DialogDescription>
                            {activeItem.mode === 'edit' ? 'View and edit the details of this order.' : 'Create a new order.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 py-4 max-h-[70vh] overflow-y-auto px-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <LabelledInput label="Customer Name" value={activeItem.data.customerName} onChange={(e) => handleActiveItemDataChange('customerName', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <LabelledInput label="Order Date" value={activeItem.data.orderDate} onChange={(e) => handleActiveItemDataChange('orderDate', e.target.value)} disabled />
                                <LabelledInput label="Total" type="number" value={orderTotal.toFixed(2)} disabled />
                            </div>
                            <div className="space-y-2"><Label>Status</Label><Select value={activeItem.data.status} onValueChange={(value) => handleActiveItemDataChange('status', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{orderStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                             <Card>
                                <CardHeader className='pb-2'><CardTitle className="text-lg">Shipping Details</CardTitle></CardHeader>
                                <CardContent className="space-y-3 pt-4">
                                    <LabelledInput label="Contact Name" value={activeItem.data.shippingAddress?.name} onChange={e => handleShippingAddressChange('name', e.target.value)} />
                                    <LabelledInput label="Email" value={activeItem.data.shippingAddress?.email} onChange={e => handleShippingAddressChange('email', e.target.value)} />
                                    <LabelledInput label="Address" value={activeItem.data.shippingAddress?.address} onChange={e => handleShippingAddressChange('address', e.target.value)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <LabelledInput label="City" value={activeItem.data.shippingAddress?.city} onChange={e => handleShippingAddressChange('city', e.target.value)} />
                                        <LabelledInput label="ZIP" value={activeItem.data.shippingAddress?.zip} onChange={e => handleShippingAddressChange('zip', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Right Column */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className='pb-2'><CardTitle className="text-lg">Order Items ({orderItemsCount})</CardTitle></CardHeader>
                                <CardContent className="space-y-3 pt-4">
                                    <div className="space-y-2">
                                        <Label>Add Product</Label>
                                        <ProductSelector products={products} onProductSelect={handleAddProductToOrder} />
                                    </div>

                                    {orderItems.length > 0 ? orderItems.map((item: any, index: number) => (
                                        <Card key={`${item.id}-${index}`} className="p-3">
                                            <div className="flex items-start gap-3">
                                                <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md border aspect-square object-cover" />
                                                <div className="flex-grow">
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm font-medium text-right">{(item.price * item.quantity).toFixed(2)} DH</p>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <Input type="number" value={item.quantity} onChange={(e) => handleUpdateOrderItem(index, 'quantity', e.target.value)} placeholder="Qty" className="h-8"/>
                                                        <Select value={item.color} onValueChange={(value) => handleUpdateOrderItem(index, 'color', value)}>
                                                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                {products.find(p => p.id === item.id)?.colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                        <Input value={item.lensType} onChange={(e) => handleUpdateOrderItem(index, 'lensType', e.target.value)} placeholder="Lens Type" className="h-8 col-span-2"/>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveOrderItem(index)}>
                                                    <XIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    )) : <p className="text-sm text-muted-foreground py-4 text-center">No items in this order.</p>}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
            <DialogHeader>
                <DialogTitle>{activeItem.mode === 'add' ? 'Add New' : 'Edit'} {activeItem.type.charAt(0).toUpperCase() + activeItem.type.slice(1)}</DialogTitle>
            </DialogHeader>
            <div className="py-4 overflow-y-auto px-6 max-h-[70vh]">
                {activeItem.type === 'appointment' && (
                     <div className="space-y-4">
                        <LabelledInput label="Name" value={activeItem.data.name} onChange={(e) => handleActiveItemDataChange('name', e.target.value)} />
                        <LabelledInput label="Email" type="email" value={activeItem.data.email} onChange={(e) => handleActiveItemDataChange('email', e.target.value)} />
                        <LabelledInput label="Phone" type="tel" value={activeItem.data.phone} onChange={(e) => handleActiveItemDataChange('phone', e.target.value)} />
                        <div className="space-y-2"><Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal", !activeItem.data.date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{activeItem.data.date ? format(activeItem.data.date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={activeItem.data.date} onSelect={(d) => d && handleActiveItemDataChange('date', d)} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2"><Label>Time</Label><Select value={activeItem.data.time} onValueChange={(v) => handleActiveItemDataChange('time', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{availableTimes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Status</Label><Select value={activeItem.data.status} onValueChange={(v) => handleActiveItemDataChange('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{appointmentStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                )}
                {activeItem.type === 'product' && (
                     <div className="space-y-4">
                        <LabelledInput label="Product ID" value={activeItem.data.id} onChange={(e) => handleActiveItemDataChange('id', e.target.value)} disabled={activeItem.mode === 'edit'} />
                        <LabelledInput label="Product Name" value={activeItem.data.name} onChange={(e) => handleActiveItemDataChange('name', e.target.value)} />
                        <div className="space-y-2"><Label>Description</Label><Textarea value={activeItem.data.description} onChange={(e) => handleActiveItemDataChange('description', e.target.value)} /></div>
                         <div className="space-y-2"><Label>Image</Label><Input id="new-prod-image" type="file" accept="image/*" onChange={(e) => setNewProductImageFile(e.target.files ? e.target.files[0] : null)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <LabelledInput label="Price" type="number" value={activeItem.data.price} onChange={(e) => handleActiveItemDataChange('price', parseFloat(e.target.value) || 0)} />
                            <div className="space-y-2"><Label>Category</Label><Select value={activeItem.data.category} onValueChange={(v) => handleActiveItemDataChange('category', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{productCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Colors</Label>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                                {activeItem.data.colors.map((color: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">{color}<button type="button" onClick={() => handleRemoveColor(color)} className="rounded-full hover:bg-muted-foreground/20 p-0.5"><XIcon className="h-3 w-3" /></button></Badge>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Input placeholder="Add a color name" value={newColorInput} onChange={(e) => setNewColorInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())} />
                                <Button type="button" variant="outline" onClick={handleAddColor}>Add</Button>
                            </div>
                        </div>
                    </div>
                )}
                {activeItem.type === 'user' && (
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <LabelledInput label="First Name" value={activeItem.data.firstName} onChange={(e) => handleActiveItemDataChange('firstName', e.target.value)} />
                            <LabelledInput label="Last Name" value={activeItem.data.lastName} onChange={(e) => handleActiveItemDataChange('lastName', e.target.value)} />
                        </div>
                        <LabelledInput label="Email" type="email" value={activeItem.data.email} onChange={(e) => handleActiveItemDataChange('email', e.target.value)} disabled={activeItem.mode === 'edit'} />
                        {activeItem.mode === 'add' && <LabelledInput label="Password" type="password" value={activeItem.data.password} onChange={(e) => handleActiveItemDataChange('password', e.target.value)} />}
                        <div className="space-y-2"><Label>Role</Label><Select value={activeItem.data.role} onValueChange={(v) => handleActiveItemDataChange('role', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{userRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                )}
            </div>
            </>
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
                    <Button size="sm" className="h-8 gap-1" onClick={handleAddClick}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add New</span>
                    </Button>
                </div>
            </div>
            
            <TabsContent value="orders">
                <Card>
                    <CardHeader><CardTitle>Orders</CardTitle><CardDescription>A list of recent orders from your store.</CardDescription></CardHeader>
                    <CardContent><TableComponent type="order" data={orders} onEdit={handleEditClick} onDelete={handleDelete} /></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="appointments">
                <Card>
                    <CardHeader><CardTitle>Appointments</CardTitle><CardDescription>Manage all scheduled appointments.</CardDescription></CardHeader>
                    <CardContent><TableComponent type="appointment" data={appointments} onEdit={handleEditClick} onDelete={handleDelete} /></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="products">
                <Card>
                    <CardHeader><CardTitle>Products</CardTitle><CardDescription>Manage your store's products.</CardDescription></CardHeader>
                    <CardContent><TableComponent type="product" data={products} onEdit={handleEditClick} onDelete={handleDelete} /></CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="users">
                <Card>
                    <CardHeader><CardTitle>Users</CardTitle><CardDescription>Manage all registered users.</CardDescription></CardHeader>
                    <CardContent><TableComponent type="user" data={users} onEdit={handleEditClick} onDelete={handleDelete} /></CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <Dialog open={!!activeItem} onOpenChange={(isOpen) => !isOpen && setActiveItem(null)}>
            <DialogContent className="sm:max-w-4xl">
                 {renderDialogContent()}
                 <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
    );
}

const ProductSelector = ({ products, onProductSelect }: { products: Product[], onProductSelect: (product: Product) => void }) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    Select product...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => {
                                        onProductSelect(product);
                                        setOpen(false);
                                    }}
                                >
                                    {product.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const LabelledInput = ({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input {...props} />
    </div>
);

const getBadgeVariant = (status: Order['status'] | Appointment['status']) => {
    switch (status) {
        case 'Delivered': case 'Confirmed': return 'default';
        case 'Shipped': case 'Pending': return 'secondary';
        case 'Cancelled': return 'destructive';
        default: return 'outline';
    }
};

const TableComponent = ({ type, data, onEdit, onDelete }: { type: 'order' | 'appointment' | 'product' | 'user', data: any[], onEdit: (type: any, item: any) => void, onDelete: (type: any, id: string) => void }) => {
    const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);
    const { users } = useUser();

    const getTableHeaders = () => {
        switch (type) {
            case 'order': return ['Order ID', 'Customer', 'Status', 'Total'];
            case 'appointment': return ['Name', 'Date & Time', 'Status', 'Contact'];
            case 'product': return ['Product ID', 'Name', 'Category', 'Price'];
            case 'user': return ['User ID', 'Name', 'Email', 'Role'];
        }
    };
    
    const renderRowCells = (item: any) => {
        switch (type) {
            case 'order': return [<TableCell key="id" className="font-medium">{item.id}</TableCell>, <TableCell key="name">{item.customerName}</TableCell>, <TableCell key="status"><Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge></TableCell>, <TableCell key="total" className="text-right">{item.total.toFixed(2)} DH</TableCell>];
            case 'appointment': return [<TableCell key="name" className="font-medium">{item.name}</TableCell>, <TableCell key="date">{new Date(item.date).toLocaleDateString()} at {item.time}</TableCell>, <TableCell key="status"><Badge variant={getBadgeVariant(item.status)}>{item.status}</Badge></TableCell>, <TableCell key="email">{item.email}</TableCell>];
            case 'product': return [<TableCell key="id" className="font-medium">{item.id}</TableCell>, <TableCell key="name">{item.name}</TableCell>, <TableCell key="cat">{item.category}</TableCell>, <TableCell key="price" className="text-right">{item.price.toFixed(2)} DH</TableCell>];
            case 'user': return [<TableCell key="id" className="font-medium">{item.id}</TableCell>, <TableCell key="name">{item.firstName} {item.lastName}</TableCell>, <TableCell key="email">{item.email}</TableCell>, <TableCell key="role"><Badge variant={item.role === 'admin' ? 'destructive' : 'secondary'}>{item.role}</Badge></TableCell>];
        }
    };

    const renderCardContent = (item: any) => {
         switch (type) {
            case 'order': return <div className="text-sm text-muted-foreground"><strong>Total:</strong> {item.total.toFixed(2)} DH - <strong>Status:</strong> <Badge variant={getBadgeVariant(item.status)} className="ml-1">{item.status}</Badge></div>;
            case 'appointment': return <p className="text-sm text-muted-foreground"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()} at {item.time}</p>;
            case 'product': return <p className="text-sm text-muted-foreground"><strong>Price:</strong> {item.price.toFixed(2)} DH</p>;
            case 'user': return <p className="text-sm text-muted-foreground"><strong>Role:</strong> <Badge variant={item.role === 'admin' ? 'destructive' : 'secondary'} className="ml-1">{item.role}</Badge></p>;
        }
    }

    if (isMobile) {
        return (
            <div className="space-y-4">
                {data.length > 0 ? data.map(item => (
                    <Card key={item.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex justify-between items-start">
                                <span>{item.name || `${item.firstName} ${item.lastName}` || item.id}</span>
                                <ItemActions item={item} type={type} onEdit={onEdit} onDelete={onDelete} users={users} />
                            </CardTitle>
                            <CardDescription>{item.customerName || item.email || item.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                           {renderCardContent(item)}
                        </CardContent>
                    </Card>
                )) : (
                    <p className="text-center text-muted-foreground py-12">No {type}s found.</p>
                )}
            </div>
        )
    }

    return (
        <Table>
            <TableHeader><TableRow>{getTableHeaders().map(h => <TableHead key={h} className={['Total', 'Price'].includes(h) ? 'text-right' : ''}>{h}</TableHead>)}<TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
            <TableBody>
                {data.length > 0 ? (
                    data.map(item => (
                        <TableRow key={item.id}>
                            {renderRowCells(item)}
                            <TableCell className="text-right">
                                <ItemActions item={item} type={type} onEdit={onEdit} onDelete={onDelete} users={users} />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">No {type}s found.</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    );
};


const ItemActions = ({ item, type, onEdit, onDelete, users }: { item: any, type: string, onEdit: Function, onDelete: Function, users: User[] }) => {
    const isDeletable = !(type === 'user' && item.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1);
    
    return (
        <>
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(type, item)}>
                            <Eye className="mr-2 h-4 w-4" /> View / Edit
                        </DropdownMenuItem>
                        {type === 'appointment' && item.status !== 'Confirmed' &&
                            <DropdownMenuItem onClick={() => onEdit(type, {...item, status: 'Confirmed'})}>Confirm</DropdownMenuItem>
                        }
                        <DropdownMenuSeparator />
                        {isDeletable && (
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the {type}.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(type, item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

    