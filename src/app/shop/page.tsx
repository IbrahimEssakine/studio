"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { ListFilter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const allProducts: Product[] = [
  { id: "1", name: "Classic Aviator", price: 1500, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Gold", "Silver"], rating: 4.5, reviews: 120 },
  { id: "2", name: "Modern Wayfarer", price: 1300, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Black", "Tortoise"], rating: 4.8, reviews: 250 },
  { id: "3", name: "Retro Round", price: 1200, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Bronze", "Matte Black"], rating: 4.6, reviews: 95 },
  { id: "4", name: "Minimalist Frames", price: 1800, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Titanium", "Clear"], rating: 4.9, reviews: 180 },
  { id: "5", name: "Cat-Eye Chic", price: 1650, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Rose Gold", "Black"], rating: 4.7, reviews: 150 },
  { id: "6", name: "Scholarly Specs", price: 950, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Silver", "Gunmetal"], rating: 4.4, reviews: 88 },
  { id: "7", name: "Sporty Wraparounds", price: 1900, category: "Sunglasses", image: "https://placehold.co/600x400.png", colors: ["Red", "Blue"], rating: 4.8, reviews: 210 },
  { id: "8", name: "Bold Acetate", price: 2100, category: "Eyeglasses", image: "https://placehold.co/600x400.png", colors: ["Crystal", "Emerald Green"], rating: 4.9, reviews: 300 },
];

const categories = ["Sunglasses", "Eyeglasses"];
const colors = ["Black", "Silver", "Gold", "Tortoise", "Bronze", "Clear", "Red"];

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 2500]);
  
  const Filters = () => (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category.toLowerCase()} />
                <Label htmlFor={category.toLowerCase()}>{category}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <Slider
            defaultValue={[0, 2500]}
            max={5000}
            step={100}
            onValueChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>DH{priceRange[0]}</span>
            <span>DH{priceRange[1]}</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Color</h3>
          <RadioGroup defaultValue="all">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="color-all" />
              <Label htmlFor="color-all">All</Label>
            </div>
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <RadioGroupItem value={color.toLowerCase()} id={`color-${color.toLowerCase()}`} />
                <Label htmlFor={`color-${color.toLowerCase()}`}>{color}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find your perfect pair from our wide selection of eyewear.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="hidden md:block md:col-span-1">
          <Filters />
        </aside>
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">{allProducts.length} products</p>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="font-headline">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <Filters />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} data-ai-hint="eyewear product" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
