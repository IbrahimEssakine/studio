"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Eye, ShieldCheck, Gem } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/product-context";

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-foreground">
              See the World in Style
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Discover our collection of premium eyewear, crafted with precision
              and designed for the modern individual.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/book-appointment">Book an Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-foreground">
            Featured Products
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            Handpicked styles that define trends and offer unparalleled
            comfort.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="transform hover:scale-105 transition-transform duration-300"
                data-ai-hint="eyewear product"
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-lg">
              <Link href="/shop">Explore Full Collection &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                Quality You Can See and Feel
              </h2>
              <p className="mt-4 text-muted-foreground">
                At Agharas Vision, we believe in a blend of artistry and
                science. Our frames are sourced from the finest materials, and
                our lenses are crafted for ultimate clarity and protection.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Gem className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Premium Materials</h3>
                    <p className="text-muted-foreground">
                      From lightweight titanium to rich, handcrafted acetate,
                      our frames are built for durability and comfort.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Advanced Lens Technology
                    </h3>
                    <p className="text-muted-foreground">
                      Experience superior vision with our anti-reflective,
                      scratch-resistant, and UV-blocking lenses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Expert Craftsmanship</h3>
                    <p className="text-muted-foreground">
                      Each pair is meticulously assembled and inspected by our
                      skilled opticians to ensure a perfect fit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="https://placehold.co/600x700.png"
                alt="Craftsmanship"
                width={600}
                height={700}
                className="rounded-lg shadow-xl"
                data-ai-hint="eyewear crafting"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
