
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Upload, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

const productData: Product = {
  id: "2",
  name: "Modern Wayfarer",
  price: 130,
  category: "Eyeglasses",
  image: "https://placehold.co/800x600.png",
  colors: ["Black", "Tortoise"],
  rating: 4.8,
  reviews: 250,
  description: "A modern take on a timeless classic. The Wayfarer's iconic shape is updated with a sleeker profile and lightweight materials, offering both comfort and style. Perfect for any occasion, these frames are a versatile addition to any wardrobe.",
};

const lensTypes = [
  { name: "Standard (Free)", price: 0 },
  { name: "Blue-Light Filtering (+$29)", price: 29 },
  { name: "Transitions® (+$99)", price: 99 },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product] = useState(productData); // In a real app, you'd fetch this
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedLens, setSelectedLens] = useState(lensTypes[0]);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  const totalPrice = product.price + selectedLens.price;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPrescriptionFile(event.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
        ...product,
        price: totalPrice,
        color: selectedColor,
        lensType: selectedLens.name,
        quantity: 1,
    };
    addToCart(cartItem);
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
    });
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <Card className="overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            className="w-full h-auto object-cover"
            data-ai-hint="eyewear product"
          />
        </Card>
        
        <div className="space-y-6">
          <div>
            <span className="text-sm font-medium text-primary">{product.category}</span>
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

          <div className="space-y-2">
            <Label htmlFor="lens-type" className="font-semibold text-lg">Lens Type</Label>
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

          <div>
            <h3 className="font-semibold text-lg mb-2">Your Prescription</h3>
             <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="manual">Enter Manually</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="book">Book Appointment</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="pt-4">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
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
                         <CardContent className="pt-6 space-y-4 text-center">
                            <p className="text-muted-foreground">Need a new prescription or a check-up?</p>
                            <Button asChild>
                                <Link href="/book-appointment">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Book an Appointment
                                </Link>
                            </Button>
                         </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </div>
          
          <Card className="bg-muted/50">
            <CardContent className="p-6">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold font-headline">Total: ${totalPrice.toFixed(2)}</span>
                    <Button size="lg" onClick={handleAddToCart}>Add to Cart</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
