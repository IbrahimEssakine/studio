"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { useOrders } from '@/context/order-context';
import { useAppointments } from '@/context/appointment-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { User as UserIcon, Package, Calendar, Briefcase, Pencil } from 'lucide-react';
import type { Order, Appointment, CartItem, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const { orders } = useOrders();
  const { appointments } = useAppointments();
  const { toast } = useToast();

  const [editableUser, setEditableUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setEditableUser(user);
    }
  }, [user, router]);

  if (!user || !editableUser) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (editableUser) {
        updateUser(editableUser.id, editableUser);
        toast({
            title: "Profile Updated",
            description: "Your information has been successfully saved.",
        });
    }
  };


  const userOrders = orders.filter(order => order.shippingAddress?.email === user.email);
  const userAppointments = appointments.filter(apt => apt.email === user.email);

  const purchasedProducts = userOrders.reduce((acc: CartItem[], order) => {
    if (order.details) {
      order.details.forEach(item => {
        const existingItem = acc.find(p => p.id === item.id && p.color === item.color && p.lensType === item.lensType);
        if (!existingItem) {
          acc.push(item);
        }
      });
    }
    return acc;
  }, []);

  const getStatusVariant = (status: Order['status'] | Appointment['status']) => {
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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground rounded-full p-3">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-bold">Welcome, {user.firstName}</h1>
            <p className="text-muted-foreground">Here's your personal dashboard.</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info"><Pencil className="mr-2 h-4 w-4" /> My Info</TabsTrigger>
          <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" /> My Orders</TabsTrigger>
          <TabsTrigger value="appointments"><Calendar className="mr-2 h-4 w-4" />My Appointments</TabsTrigger>
          <TabsTrigger value="products"><Briefcase className="mr-2 h-4 w-4" />My Products</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
            <Card>
                <CardHeader>
                    <CardTitle>My Information</CardTitle>
                    <CardDescription>View and update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveChanges} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={editableUser.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={editableUser.lastName} onChange={handleInputChange} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={editableUser.email} disabled />
                            <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={editableUser.phone} onChange={handleInputChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" value={editableUser.address} onChange={handleInputChange} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" value={editableUser.city} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input id="zip" name="zip" value={editableUser.zip} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>A history of all your purchases.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.length > 0 ? (
                    userOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TableCell>
                        <TableCell className="text-right">{order.total.toFixed(2)} DH</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">You haven't placed any orders yet.</TableCell>
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
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>Your scheduled and past appointments.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAppointments.length > 0 ? (
                    userAppointments.map(apt => (
                      <TableRow key={apt.id}>
                        <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(apt.status)}>{apt.status}</Badge></TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">You have no appointments scheduled.</TableCell>
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
              <CardTitle>My Products</CardTitle>
              <CardDescription>A list of all items you have purchased.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasedProducts.length > 0 ? (
                    purchasedProducts.map(item => (
                      <TableRow key={`${item.id}-${item.color}-${item.lensType}`}>
                        <TableCell className="flex items-center gap-4">
                           <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
                           <span className="font-medium">{item.name}</span>
                        </TableCell>
                        <TableCell>Color: {item.color}, Lens: {item.lensType}</TableCell>
                        <TableCell className="text-right">{item.price.toFixed(2)} DH</TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">You have not purchased any products yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
