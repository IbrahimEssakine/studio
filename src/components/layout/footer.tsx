import Link from "next/link";
import { Glasses, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "../ui/button";

export function Footer() {
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
              Crafting clear vision with style and precision.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                Shop
              </h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">Eyeglasses</Link></li>
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">Sunglasses</Link></li>
                <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary">Contact Lenses</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                About
              </h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">Our Story</Link></li>
                <li><Link href="/book-appointment" className="text-sm text-muted-foreground hover:text-primary">Appointments</Link></li>
                <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary">My Account</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                Contact
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>N° 3, Imm 08, Lot 4, Al Kheir, Cité Essalam, Agadir, Morocco</li>
                <li>Phone: +212 525-270883</li>
                <li>Whatsapp: +212 628-889950</li>
                <li>contact@agharas.vision</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Agharas Vision. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com" target="_blank" rel="noreferrer noopener"><Twitter className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://facebook.com" target="_blank" rel="noreferrer noopener"><Facebook className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://instagram.com" target="_blank" rel="noreferrer noopener"><Instagram className="h-5 w-5" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
