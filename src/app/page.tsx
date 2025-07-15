
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Eye, ShieldCheck, Gem } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/product-context";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { products } = useProducts();
  const { dictionary } = useLanguage();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-foreground">
              {dictionary.home.heroTitle}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              {dictionary.home.heroSubtitle}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/shop">{dictionary.home.shopNow}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/book-appointment">{dictionary.home.bookAppointmentBtn}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-foreground">
            {dictionary.home.featuredProducts}
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            {dictionary.home.featuredSubtitle}
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
              <Link href="/shop">{dictionary.home.exploreCollection} &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                {dictionary.home.qualityTitle}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {dictionary.home.qualityDescription}
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Gem className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{dictionary.home.premiumMaterials}</h3>
                    <p className="text-muted-foreground">
                      {dictionary.home.premiumMaterialsDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {dictionary.home.advancedLens}
                    </h3>
                    <p className="text-muted-foreground">
                      {dictionary.home.advancedLensDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{dictionary.home.expertCraftsmanship}</h3>
                    <p className="text-muted-foreground">
                      {dictionary.home.expertCraftsmanshipDesc}
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
