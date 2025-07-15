
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Star, StarHalf } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "./ui/badge";

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
      {halfStar && <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
};

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden group relative", className)} {...props}>
      {product.ribbon && (
        <Badge className="absolute top-2 right-2 z-10" variant="destructive">{product.ribbon}</Badge>
      )}
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} aria-label={product.name}>
          <div className="overflow-hidden">
             <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-auto object-cover aspect-video group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-tight">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="font-bold text-lg text-primary">{product.price} DH</p>
        </div>
        <div className="flex items-center mt-2 gap-2">
          {renderStars(product.rating)}
          <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
        </div>
         <div className="mt-2 flex flex-wrap gap-1">
          {product.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
