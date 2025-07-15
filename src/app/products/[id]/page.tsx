
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Upload, CheckCircle, Calendar, Frame, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/context/product-context";
import type { Product, LensTypeOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

const glassesTypes = [
  { id: "frames-only", name: "Frames Only" },
  { id: "with-correction", name: "With Prescription" },
  { id: "blue-light", name: "Blue-Light Filtering" },
  { id: "sunglasses", name: "Sunglasses" },
  { id: "both", name: "Blue-Light & Sunglasses" },
];

const prescriptionMethods = [
    { id: "manual", name: "Enter Manually" },
    { id: "upload", name: "Upload File" },
    { id: "book", name: "Book Appointment" },
];

const lensTypes: LensTypeOption[] = [
  { name: "Amincis Antireflets bleue", price: 100, details: "1.56 - Correction entre 0.25 et 1", warranty: "1 AN" },
  { name: "Super Amincis Antireflets bleue", price: 300, details: "1.6 - Correction entre 1 et 3", warranty: "1 AN" },
  { name: "Ultra amincis Antireflets Bleue", price: 500, details: "1.67 - correction de +/- 4 ou plus", warranty: "1 AN" },
  { name: "Verres PREMIUM amincis", price: 300, details: "1.56 - Correction entre 0.25 et 1", warranty: "2 ANS" },
  { name: "Verres PREMIUM Super Amincis", price: 500, details: "1.6 - Correction de +/- 3 ou plus", warranty: "2 ANS" },
  { name: "Verres PREMIUM Ultra amincis", price: 1500, details: "1.67 - correction de +/- 4 ou plus", warranty: "2 ANS" },
  { name: "Verres 1.56 amincis photogray antireflets bleue", price: 300, details: "Transition lenses", warranty: "2 ANS" },
  { name: "Demander un devis (appel)", price: 0, details: "Pour les grands mesures", warranty: "N/A" },
];


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  // New state for the multi-step flow
  const [selectedGlassesType, setSelectedGlassesType] = useState('frames-only');
  const [selectedPrescriptionMethod, setSelectedPrescriptionMethod] = useState('');
  const [selectedLens, setSelectedLens] = useState<LensTypeOption | null>(null);

  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

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
  
  // Reset steps when primary glasses type changes
  useEffect(() => {
      setSelectedPrescriptionMethod('');
      setSelectedLens(null);
  }, [selectedGlassesType]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const showPrescriptionMethods = selectedGlassesType === 'with-correction';
  const showLensOptions = showPrescriptionMethods && (selectedPrescriptionMethod === 'manual' || selectedPrescriptionMethod === 'upload');

  const totalPrice = product.price + (selectedLens?.price || 0);

  const getLensTypeName = () => {
      if (selectedGlassesType === 'frames-only') return 'Frames Only';
      if (selectedGlassesType === 'with-correction') {
          if (selectedPrescriptionMethod === 'book') return 'Appointment to be scheduled';
          return selectedLens ? selectedLens.name : 'Prescription Lens';
      }
      return glassesTypes.find(t => t.id === selectedGlassesType)?.name || 'Custom';
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPrescriptionFile(event.target.files[0]);
    }
  };

  const handleAddToCart = () => {
    const requiresAppointment = selectedPrescriptionMethod === 'book';
    const cartItem = {
      ...product,
      price: totalPrice,
      color: selectedColor,
      lensType: getLensTypeName(),
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
          
          {/* Step 1: Glasses Type */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Step 1: Choose your glasses type</h3>
             <RadioGroup value={selectedGlassesType} onValueChange={setSelectedGlassesType} className="grid grid-cols-2 gap-3">
                {glassesTypes.map(type => (
                     <div key={type.id}>
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <Label htmlFor={type.id} className={cn("flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer", selectedGlassesType === type.id ? "border-primary" : "border-muted")}>
                           {type.name}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
          </div>

          {/* Step 2: Prescription Method */}
          {showPrescriptionMethods && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Step 2: Provide your prescription</h3>
              <RadioGroup value={selectedPrescriptionMethod} onValueChange={setSelectedPrescriptionMethod} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {prescriptionMethods.map(method => (
                     <div key={method.id}>
                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                        <Label htmlFor={method.id} className={cn("flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer", selectedPrescriptionMethod === method.id ? "border-primary" : "border-muted")}>
                           {method.name}
                        </Label>
                    </div>
                ))}
              </RadioGroup>

              {selectedPrescriptionMethod === 'manual' && (
                <Card className="mt-2">
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
                  </CardContent>
                </Card>
              )}
               {selectedPrescriptionMethod === 'upload' && (
                <Card className="mt-2">
                  <CardContent className="pt-6 space-y-4">
                    <Button asChild variant="outline" className="w-full">
                        <Label htmlFor="prescription-upload" className="cursor-pointer flex items-center justify-center gap-2">
                          <Upload className="w-4 h-4" />
                          <span>{prescriptionFile ? prescriptionFile.name : "Upload Prescription"}</span>
                        </Label>
                    </Button>
                    <input id="prescription-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                     {prescriptionFile && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {prescriptionFile.name} uploaded successfully.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Lens Options */}
          {showLensOptions && (
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Step 3: Choose your lens type</h3>
                 <RadioGroup onValueChange={(value) => setSelectedLens(lensTypes.find(l => l.name === value) || null)}>
                    <div className="space-y-3">
                    {lensTypes.map(lens => (
                        <Card key={lens.name} className={cn("cursor-pointer", selectedLens?.name === lens.name && "border-primary")}>
                           <Label htmlFor={lens.name} className="flex items-start gap-4 p-4 cursor-pointer">
                                <RadioGroupItem value={lens.name} id={lens.name} className="mt-1" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{lens.name} (+{lens.price} DH)</p>
                                    <p className="text-sm text-muted-foreground">{lens.details}</p>
                                    <p className="text-xs text-primary font-medium">GARANTIE {lens.warranty}</p>
                                </div>
                           </Label>
                        </Card>
                    ))}
                    </div>
                 </RadioGroup>
            </div>
          )}
          
           {selectedPrescriptionMethod === 'book' && (
                 <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertTitle>Appointment Included</AlertTitle>
                    <AlertDescription>
                     An appointment will be added to your order. You can schedule the date and time during checkout.
                    </AlertDescription>
                </Alert>
            )}


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
