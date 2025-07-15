
"use client";

import Link from "next/link";
import { Glasses, Facebook, Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/context/language-context";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 7.333a4.01 4.01 0 0 0-4.01-4.009h-.005a4.01 4.01 0 0 0-3.99 4.009v8.662a4.01 4.01 0 1 0 4.01 4.009V12a8.03 8.03 0 0 0 4-7.333Z"/>
        <path d="M12.995 3.324A4.01 4.01 0 0 0 9 7.333v8.662a4.01 4.01 0 1 0 4.01 4.009V3.324Z"/>
    </svg>
)

export function Footer() {
  const { dictionary } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Glasses className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg font-headline">Agharas Vision</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {dictionary.footer.tagline}
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                {dictionary.footer.shop}
              </h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">{dictionary.footer.eyeglasses}</Link></li>
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">{dictionary.footer.sunglasses}</Link></li>
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">{dictionary.footer.contactLenses}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                {dictionary.footer.about}
              </h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">{dictionary.footer.ourStory}</Link></li>
                <li><Link href="/book-appointment" className="text-sm text-muted-foreground hover:text-primary">{dictionary.footer.appointments}</Link></li>
                <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary">{dictionary.footer.myAccount}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                {dictionary.footer.contact}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>N° 3, Imm 08, Lot 4, Al Kheir, Cité Essalam, Agadir, Morocco</li>
                <li>{dictionary.footer.phone}: +212 525-270883</li>
                <li>{dictionary.footer.whatsapp}: +212 628-889950</li>
                <li>agharas.vision@gmail.com</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {dictionary.footer.copyright.replace('{year}', currentYear.toString())}
          </p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.facebook.com/people/Agharas-Vision-agadir/100077751017111/" target="_blank" rel="noreferrer noopener"><Facebook className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.instagram.com/agharas_vision_agadir/" target="_blank" rel="noreferrer noopener"><Instagram className="h-5 w-5" /></a>
            </Button>
             <Button variant="ghost" size="icon" asChild>
              <a href="https://www.tiktok.com/@agharas__vision_agadir" target="_blank" rel="noreferrer noopener"><TikTokIcon className="h-5 w-5" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
