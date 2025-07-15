

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Upload, CheckCircle, Calendar, Truck, Undo2 } from "lucide-react";
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
import { useLanguage } from "@/context/language-context";
import { Separator } from "@/components/ui/separator";
import { useBrands } from "@/context/brand-context";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.75 13.96c.25.13.41.34.41.58v1.1c0 .21-.07.4-.19.56a.93.93 0 0 1-.58.26c-.22.03-.46.03-.7.03-.82 0-1.6-.16-2.32-.47-1.42-.6-2.6-1.53-3.56-2.73-1.12-1.37-1.63-2.93-1.63-4.59 0-2.34 1.12-4.28 2.94-5.26a.54.54 0 0 1 .48-.02c.21.07.36.23.44.44l.62 1.83c.08.24.03.5-.13.68L12 7.5a.69.69 0 0 0-.15.78c.15.33.41.67.74 1.02s.67.57 1 .7c.21.08.47.03.65-.13l1.4-1.28c.18-.16.44-.21.68-.13l1.83.62c.2.08.37.23.44.44a.54.54 0 0 1-.02.48l-.42.96c-.1.25-.26.43-.48.54Z M12 2a10 10 0 0 0-8.6 14.94l-1.32 4.88a.5.5 0 0 0 .63.63l4.88-1.32A10 10 0 1 0 12 2Z"/>
    </svg>
);


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { getProductById } = useProducts();
  const { brands } = useBrands();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { dictionary } = useLanguage();
  const { productPage } = dictionary;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  const [selectedGlassesType, setSelectedGlassesType] = useState('with-correction');
  const [selectedPrescriptionMethod, setSelectedPrescriptionMethod] = useState('');
  const [selectedLens, setSelectedLens] = useState<LensTypeOption | null>(null);

  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  const glassesTypes = [
    { id: "with-correction", name: productPage.glassesTypes.withCorrection },
    { id: "blue-light", name: productPage.glassesTypes.blueLight },
    { id: "sunglasses", name: productPage.glassesTypes.sunglasses },
    { id: "both", name: productPage.glassesTypes.both },
    { id: "frames-only", name: productPage.glassesTypes.framesOnly },
  ];
  
  const prescriptionMethods = [
      { id: "manual", name: productPage.prescriptionMethods.manual },
      { id: "upload", name: productPage.prescriptionMethods.upload },
      { id: "book", name: productPage.prescriptionMethods.book },
  ];
  
  const lensTypes: LensTypeOption[] = [
    { name: 'amincis_antireflets_bleue', price: 100 },
    { name: 'super_amincis_antireflets_bleue', price: 300 },
    { name: 'ultra_amincis_antireflets_bleue', price: 500 },
    { name: 'premium_amincis', price: 300 },
    { name: 'premium_super_amincis', price: 500 },
    { name: 'premium_ultra_amincis', price: 1500 },
    { name: 'photogray_antireflets_bleue', price: 300 },
    { name: 'demander_devis', price: 0 },
  ];

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
  
  useEffect(() => {
      setSelectedPrescriptionMethod('');
      setSelectedLens(null);
  }, [selectedGlassesType]);

  if (!product) {
    return <div>{productPage.loading}</div>;
  }
  
  const brandName = brands.find(b => b.id === product.brandId)?.name;

  const showPrescriptionMethods = selectedGlassesType === 'with-correction';
  const showLensOptions = showPrescriptionMethods && (selectedPrescriptionMethod === 'manual' || selectedPrescriptionMethod === 'upload');

  const totalPrice = product.price + (selectedLens?.price || 0);

  const getLensTypeName = () => {
    if (selectedGlassesType === 'frames-only') return productPage.cart.framesOnly;
    if (selectedGlassesType === 'with-correction') {
      if (selectedPrescriptionMethod === 'book') return productPage.cart.appointmentScheduled;
      if (selectedLens) {
        const key = selectedLens.name as keyof typeof productPage.lensTypes;
        return productPage.lensTypes[key]?.name || productPage.cart.prescriptionLens;
      }
      return productPage.cart.prescriptionLens;
    }
    const glassesType = glassesTypes.find(t => t.id === selectedGlassesType);
    return glassesType?.name || productPage.cart.custom;
  };

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
      title: productPage.toast.title,
      description: productPage.toast.description.replace('{productName}', product.name),
    });
  };
  
  const whatsappNumber = "212628889950";
  const whatsappMessage = encodeURIComponent(`Hello, I would like more information about the product: ${product.name} (ID: ${product.id})`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


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
            {brandName && <h2 className="text-sm uppercase tracking-wider text-muted-foreground mt-2">{brandName}</h2>}
            <h1 className="text-4xl md:text-5xl font-headline font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {[...Array(Math.floor(product.rating))].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                {product.rating % 1 !== 0 && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
              </div>
              <span className="text-muted-foreground">{product.rating} ({product.reviews} {productPage.reviews})</span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{productPage.color}: <span className="font-normal">{selectedColor}</span></h3>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-2">
              {product.colors.map(color => (
                <div key={color}>
                  <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                  <Label htmlFor={`color-${color}`} className="block w-10 h-10 rounded-full border-2 cursor-pointer" style={{ backgroundColor: color.toLowerCase() === 'tortoise' ? '#654321' : color.toLowerCase() }} />
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{productPage.step1}</h3>
             <RadioGroup value={selectedGlassesType} onValueChange={setSelectedGlassesType} className="grid grid-cols-2 gap-3">
                {glassesTypes.map(type => (
                     <div key={type.id}>
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <Label htmlFor={type.id} className={cn("flex items-center text-center justify-center p-4 rounded-lg border-2 cursor-pointer h-full", selectedGlassesType === type.id ? "border-primary" : "border-muted")}>
                           {type.name}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
          </div>

          {showPrescriptionMethods && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{productPage.step2}</h3>
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
                        <Label htmlFor="od">{productPage.prescriptionManual.od}</Label>
                        <Input id="od" placeholder="e.g. -1.25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="os">{productPage.prescriptionManual.os}</Label>
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
                          <span>{prescriptionFile ? prescriptionFile.name : productPage.prescriptionUpload.button}</span>
                        </Label>
                    </Button>
                    <input id="prescription-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                     {prescriptionFile && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {prescriptionFile.name} {productPage.prescriptionUpload.success}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {showLensOptions && (
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">{productPage.step3}</h3>
                 <RadioGroup onValueChange={(value) => setSelectedLens(lensTypes.find(l => l.name === value) || null)}>
                    <div className="space-y-3">
                    {lensTypes.map(lens => {
                       const key = lens.name as keyof typeof productPage.lensTypes;
                       const lensTranslation = productPage.lensTypes[key];
                       return (
                          <Card key={lens.name} className={cn("cursor-pointer", selectedLens?.name === lens.name && "border-primary")}>
                             <Label htmlFor={lens.name} className="flex items-start gap-4 p-4 cursor-pointer">
                                  <RadioGroupItem value={lens.name} id={lens.name} className="mt-1" />
                                  <div className="flex-grow">
                                      <p className="font-semibold">{lensTranslation.name} (+{lens.price} DH)</p>
                                      <p className="text-sm text-muted-foreground">{lensTranslation.details}</p>
                                      <p className="text-xs text-primary font-medium">{productPage.warrantyLabel} {lensTranslation.warranty}</p>
                                  </div>
                             </Label>
                          </Card>
                       )
                    })}
                    </div>
                 </RadioGroup>
            </div>
          )}

           {selectedPrescriptionMethod === 'book' && (
                 <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertTitle>{productPage.appointmentAlert.title}</AlertTitle>
                    <AlertDescription>{productPage.appointmentAlert.description}</AlertDescription>
                </Alert>
            )}


          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-headline">{productPage.total} {totalPrice.toFixed(2)} DH</span>
                <Button size="lg" onClick={handleAddToCart}>{productPage.addToCart}</Button>
              </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                    {productPage.contactOnWhatsApp}
                  </a>
                </Button>
                <Separator />
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span>De Livraison Estimé: 2-3 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Undo2 className="h-5 w-5 text-primary" />
                        <span>Livraison Gratuite Et Retours: Sur toutes les commandes de plus de 400.00 DH</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
