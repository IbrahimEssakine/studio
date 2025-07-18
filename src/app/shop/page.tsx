
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
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
import { Product } from "@/lib/types";
import { useBrands } from "@/context/brand-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories: Product['category'][] = ["Sunglasses", "Eyeglasses", "Contact Lens", "Clip 2 in 1"];
const genders: Product['gender'][] = ["Homme", "Femme", "Unisex"];

export default function ShopPage() {
  const { products: allProducts } = useProducts();
  const { brands } = useBrands();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const brandId = searchParams.get('brandId');
    
    if (category) {
        setSelectedCategories([category]);
    }
    if (gender) {
        setSelectedGender(gender);
    }
    if (brandId) {
        setSelectedBrand(brandId);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = useMemo(() => {
    let products = allProducts.filter((product) => {
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const genderMatch = selectedGender === 'all' || product.gender === selectedGender || (selectedGender === 'Homme' && product.gender === 'Unisex') || (selectedGender === 'Femme' && product.gender === 'Unisex');
      const brandMatch = selectedBrand === 'all' || product.brandId === selectedBrand;
      return priceMatch && categoryMatch && genderMatch && brandMatch;
    });

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return products;
  }, [allProducts, priceRange, selectedCategories, selectedGender, selectedBrand, sortBy]);

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
                <Checkbox id={category.toLowerCase()} onCheckedChange={() => handleCategoryChange(category)} checked={selectedCategories.includes(category)} />
                <Label htmlFor={category.toLowerCase()}>{category}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Gender</h3>
          <RadioGroup value={selectedGender} onValueChange={setSelectedGender}>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="gender-all" />
              <Label htmlFor="gender-all">All</Label>
            </div>
            {genders.map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem value={gender} id={`gender-${gender.toLowerCase()}`} />
                <Label htmlFor={`gender-${gender.toLowerCase()}`}>{gender}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Brand</h3>
           <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
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
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                      <SelectItem value="name-asc">Alphabetical: A-Z</SelectItem>
                      <SelectItem value="name-desc">Alphabetical: Z-A</SelectItem>
                  </SelectContent>
              </Select>
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
