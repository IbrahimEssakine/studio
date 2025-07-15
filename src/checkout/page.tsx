
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useOrders } from "@/context/order-context";
import { useAppointments } from "@/context/appointment-context";
import { useUser } from "@/context/user-context";
import { useEffect, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const baseSchema = z.object({
  // Shipping info
  email: z.string().email({ message: "A valid email is required." }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(5, "A valid ZIP code is required"),
});

const appointmentSchema = z.object({
  appointmentDate: z.date({ required_error: "An appointment date is required." }),
  appointmentTime: z.string({ required_error: "An appointment time is required." }),
});

const availableTimes = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM",
];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addAppointment } = useAppointments();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const needsAppointment = useMemo(() => cart.some(item => item.requiresAppointment), [cart]);

  const checkoutSchema = needsAppointment ? baseSchema.extend(appointmentSchema.shape) : baseSchema;
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 50.00;
  const total = subtotal + shipping;

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zip: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        city: user.city,
        zip: user.zip,
      });
    }
  }, [user, form]);


  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    const newOrder = {
        id: `ORD${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        customerName: `${values.firstName} ${values.lastName}`,
        orderDate: new Date().toISOString().split('T')[0],
        status: "Pending" as const,
        total,
        items: cart.reduce((acc, item) => acc + item.quantity, 0),
        details: cart,
        shippingAddress: values,
    };
    addOrder(newOrder);

    if (needsAppointment && 'appointmentDate' in values && 'appointmentTime' in values && values.appointmentDate && values.appointmentTime) {
      addAppointment({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: user?.phone || '',
        date: values.appointmentDate,
        time: values.appointmentTime,
      });
    }

    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. We've sent a confirmation to your email.",
    });
    clearCart();
    router.push("/order-confirmation");
  }

  if (cart.length === 0) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-20 text-center">
            <h1 className="text-3xl font-bold">Your cart is empty.</h1>
            <p className="text-muted-foreground mt-2">Add items to your cart before checking out.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="font-headline">Contact Information</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-headline">Shipping Address</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="zip" render={({ field }) => (
                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            {needsAppointment && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2"><CalendarIcon className="w-6 h-6" /> Schedule Your Appointment</CardTitle>
                  <CardDescription>Select a date and time for your eye exam or fitting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Preferred Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                      <FormField
                          control={form.control}
                          name="appointmentTime"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Preferred Time</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select a time slot" />
                                      </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                      {availableTimes.map(time => (
                                          <SelectItem key={time} value={time}>{time}</SelectItem>
                                      ))}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>
                </CardContent>
              </Card>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Payment on Delivery</AlertTitle>
              <AlertDescription>
                You'll pay with cash or card when your order arrives.
              </AlertDescription>
            </Alert>

            <Button type="submit" size="lg" className="w-full">Place Order</Button>
          </form>
        </Form>

        {/* Order Summary Section */}
        <div className="lg:col-start-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={`${item.id}-${item.color}-${item.lensType}`} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.color}, {item.lensType}</p>
                       {item.requiresAppointment && (
                          <div className="flex items-center text-xs text-primary mt-1">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            <span>Appointment included</span>
                          </div>
                        )}
                    </div>
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} DH</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping.toFixed(2)} DH</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
