
"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Eye, ShieldCheck, Gem, Contact, Glasses, PersonStanding, Briefcase, Star, PlayCircle, MapPin, Truck, Box, Headset, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/product-context";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

export default function Home() {
  const { products } = useProducts();
  const { dictionary } = useLanguage();
  const featuredProducts = products.slice(0, 4);
  
  const contactLensesCount = products.filter(p => p.category === 'Contact Lens').length;
  const sunglassesHommeCount = products.filter(p => p.category === 'Sunglasses' && (p.gender === 'Homme' || p.gender === 'Unisex')).length;
  const clip2in1Count = products.filter(p => p.category === 'Clip 2 in 1').length;
  const lunettesFemmeCount = products.filter(p => p.category === 'Eyeglasses' && (p.gender === 'Femme' || p.gender === 'Unisex')).length;
  const lunettesHommeCount = products.filter(p => p.category === 'Eyeglasses' && (p.gender === 'Homme' || p.gender === 'Unisex')).length;
  
  const brands = [...new Set(products.map(p => p.marque).filter(Boolean))];

  const testimonials = [
    {
      name: "Fatima Zahra",
      quote: "Un service incroyable et des lunettes de qualité. Je suis ravie de mon achat !",
      audioSrc: "/audio/testimonial1.mp3"
    },
    {
      name: "Youssef Alaoui",
      quote: "Le personnel était très professionnel et m'a aidé à trouver la paire parfaite. Je recommande vivement.",
      audioSrc: "/audio/testimonial2.mp3"
    },
    {
      name: "Amine El Fassi",
      quote: "J'ai trouvé des lunettes de soleil uniques que je ne trouvais nulle part ailleurs. Merci Agharas Vision !",
      audioSrc: "/audio/testimonial3.mp3"
    }
  ];

  const collections = [
      { icon: <Contact className="h-8 w-8 text-white" />, title: "Lentilles de Contact", count: contactLensesCount },
      { icon: <Glasses className="h-8 w-8 text-white" />, title: "Solaires Homme", count: sunglassesHommeCount },
      { icon: <Briefcase className="h-8 w-8 text-white" />, title: "Clip 2 en 1", count: clip2in1Count },
      { icon: <PersonStanding className="h-8 w-8 text-white" />, title: "Lunettes Femme", count: lunettesFemmeCount },
      { icon: <PersonStanding className="h-8 w-8 text-white" />, title: "Lunettes Homme", count: lunettesHommeCount },
  ];

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
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-foreground">
            Nos Collections
          </h2>
           <div className="mt-12 grid grid-cols-5 gap-4 md:gap-6">
                {collections.map((collection, index) => (
                    <div key={index} className="flex flex-col">
                        <Card className="hover:shadow-lg transition-shadow group relative overflow-hidden h-64 flex flex-col justify-end w-full">
                            <CardContent className="p-4 relative z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent flex flex-col justify-end h-full">
                                <div className="text-white">
                                    {collection.icon}
                                    <p className="font-semibold text-lg mt-2">{collection.title}</p>
                                    <p className="text-sm">({collection.count} articles)</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-foreground">
            Nos Marques
          </h2>
          <div className="mt-12">
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
              className="w-full"
            >
              <CarouselContent>
                {brands.map((brand, index) => (
                  <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-xl font-semibold text-muted-foreground">{brand}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center text-foreground">Ce que disent nos clients</h2>
            <div className="mt-12">
                <Carousel
                    opts={{ align: "start" }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-4">
                                    <Card className="h-full flex flex-col">
                                        <CardContent className="p-6 flex-grow">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                                            </div>
                                            <p className="mt-4 text-muted-foreground italic">"{testimonial.quote}"</p>
                                        </CardContent>
                                        <CardHeader className="pt-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                                </div>
                                                <audio controls src={testimonial.audioSrc} className="w-32 h-8"></audio>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
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

      <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">Visitez Notre Magasin</h2>
                      <p className="mt-4 text-muted-foreground">
                        Nous sommes situés au cœur d'Agadir, prêts à vous accueillir. Venez découvrir nos collections en personne et bénéficiez des conseils de nos experts.
                      </p>
                      <div className="mt-6 flex items-start gap-4">
                          <MapPin className="w-10 h-10 text-primary mt-1" />
                          <div>
                              <h3 className="text-lg font-semibold">Notre Adresse</h3>
                              <p className="text-muted-foreground">N° 3, Imm 08, Lot 4, Al Kheir, Cité Essalam, Agadir, Maroc</p>
                              <Button asChild variant="link" className="px-0">
                                  <a href="https://g.co/kgs/F6yby1B" target="_blank" rel="noopener noreferrer">Obtenir l'itinéraire &rarr;</a>
                              </Button>
                          </div>
                      </div>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl aspect-video">
                      <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.487834571936!2d-9.56708688825827!3d30.39322979999691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3c81063683f73%3A0x46427d1421f18dd1!2sAgharas%20Vision%20agadir!5e0!3m2!1sfr!2sma!4v1700494474771!5m2!1sfr!2sma" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen={false} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                  </div>
              </div>
          </div>
      </section>

      <section className="py-8 bg-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 mb-2" />
              <h4 className="font-semibold">Livraison gratuite</h4>
            </div>
            <div className="flex flex-col items-center">
              <Box className="w-8 h-8 mb-2" />
              <h4 className="font-semibold">Échange & retour faciles</h4>
            </div>
            <div className="flex flex-col items-center">
              <Headset className="w-8 h-8 mb-2" />
              <h4 className="font-semibold">Assistance en ligne</h4>
            </div>
            <div className="flex flex-col items-center">
              <ShieldQuestion className="w-8 h-8 mb-2" />
              <h4 className="font-semibold">Correction sur mesure</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
