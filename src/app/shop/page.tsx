"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListFilter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useProducts } from "@/context/product-context";

const categories = ["Sunglasses", "Eyeglasses", "Contact Lens"];
const colors = ["Black", "Silver", "Gold", "Tortoise", "Bronze", "Clear", "Red"];

export default function ShopPage() {
  const { products: allProducts } = useProducts();
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  }, [allProducts, priceRange]);

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
            value={priceRange}
            max={5000}
            step={100}
            onValueChange={setPriceRange}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{priceRange[0]} DH</span>
            <span>{priceRange[1]} DH</span>
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
            <p className="text-muted-foreground">{filteredProducts.length} products</p>
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} data-ai-hint="eyewear product" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
