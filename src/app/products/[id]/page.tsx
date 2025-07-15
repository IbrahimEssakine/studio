
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Upload, CheckCircle, Calendar, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/context/product-context";
import type { Product } from "@/lib/types";

const lensTypes = [
  { name: "Standard (Free)", price: 0 },
  { name: "Blue-Light Filtering (+290 DH)", price: 290 },
  { name: "Transitions® (+990 DH)", price: 990 },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedLens, setSelectedLens] = useState(lensTypes[0]);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionOption, setPrescriptionOption] = useState("manual");
  

  useEffect(() => {
    if (productId) {
        const foundProduct = getProductById(productId);
        if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.colors.length > 0) {
                setSelectedColor(foundProduct.colors[0]);
            }
        }
    }
  }, [getProductById, productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const totalPrice = product.price + (prescriptionOption !== 'none' ? selectedLens.price : 0);
  const lensType = prescriptionOption !== 'none' ? selectedLens.name : 'Frames Only';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPrescriptionFile(event.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    const requiresAppointment = prescriptionOption === 'book';
    const cartItem = {
      ...product,
      price: totalPrice,
      color: selectedColor,
      lensType: lensType,
      quantity: 1,
      requiresAppointment: requiresAppointment,
    };
    addToCart(cartItem);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="md:sticky md:top-24">
            <Card className="overflow-hidden">
                <div className="aspect-video relative w-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full"
                        data-ai-hint="eyewear product"
                    />
                </div>
            </Card>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-primary">{product.category}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {[...Array(Math.floor(product.rating))].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                {product.rating % 1 !== 0 && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
              </div>
              <span className="text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Color: <span className="font-normal">{selectedColor}</span></h3>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-2">
              {product.colors.map(color => (
                <div key={color}>
                  <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                  <Label htmlFor={`color-${color}`} className="block w-10 h-10 rounded-full border-2 cursor-pointer" style={{ backgroundColor: color.toLowerCase() === 'tortoise' ? '#654321' : color.toLowerCase() }} />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Prescription Options</h3>
            <Tabs defaultValue="manual" className="w-full" onValueChange={setPrescriptionOption}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="manual">Enter Manually</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="book">Book Appointment</TabsTrigger>
                <TabsTrigger value="none">Frames Only</TabsTrigger>
              </TabsList>
               <TabsContent value="manual" className="pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="lens-type" className="font-semibold text-md">Lens Type</Label>
                        <Select onValueChange={(value) => setSelectedLens(lensTypes.find(l => l.name === value) || lensTypes[0])}>
                          <SelectTrigger id="lens-type" className="w-full">
                            <SelectValue placeholder="Select lens type" />
                          </SelectTrigger>
                          <SelectContent>
                            {lensTypes.map(lens => (
                              <SelectItem key={lens.name} value={lens.name}>{lens.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="od">OD (Right Eye)</Label>
                        <Input id="od" placeholder="e.g. -1.25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="os">OS (Left Eye)</Label>
                        <Input id="os" placeholder="e.g. -1.50" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Please enter the SPH value for each eye.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="upload" className="pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="lens-type-upload" className="font-semibold text-md">Lens Type</Label>
                        <Select onValueChange={(value) => setSelectedLens(lensTypes.find(l => l.name === value) || lensTypes[0])}>
                          <SelectTrigger id="lens-type-upload" className="w-full">
                            <SelectValue placeholder="Select lens type" />
                          </SelectTrigger>
                          <SelectContent>
                            {lensTypes.map(lens => (
                              <SelectItem key={lens.name} value={lens.name}>{lens.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    <div className="relative">
                      <Button asChild variant="outline" className="w-full">
                        <Label htmlFor="prescription-upload" className="cursor-pointer flex items-center justify-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span>Upload Prescription</span>
                        </Label>
                      </Button>
                      <input id="prescription-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                    {prescriptionFile && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {prescriptionFile.name} uploaded successfully.
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">Accepted formats: PDF, JPG, PNG. Or email it to us later.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="book" className="pt-4">
                 <Card>
                  <CardContent className="pt-6 space-y-2 text-center">
                    <Calendar className="mx-auto h-10 w-10 text-primary" />
                    <h4 className="font-semibold">Need a Prescription?</h4>
                    <p className="text-muted-foreground">
                      An appointment will be added to your order. You can schedule the date and time during checkout.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="none" className="pt-4">
                 <Card>
                  <CardContent className="pt-6 space-y-2 text-center">
                    <Frame className="mx-auto h-10 w-10 text-primary" />
                    <h4 className="font-semibold">Frames Only</h4>
                    <p className="text-muted-foreground">
                      You've selected to purchase the frames only, without prescription lenses.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-headline">Total: {totalPrice.toFixed(2)} DH</span>
                <Button size="lg" onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    