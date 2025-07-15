"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Glasses, Menu, User, ShoppingCart, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React from "react";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/user-context";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/book-appointment", label: "Book Appointment" },
];

export function Header() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { user, logout } = useUser();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-muted-foreground"
        )}
      >
        {children}
      </Link>
    );
  };

  const MobileNavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = pathname === href;
    return (
      <SheetClose asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive ? "bg-accent text-accent-foreground" : ""
          )}
        >
          <div className="text-sm font-medium leading-none">{children}</div>
        </Link>
      </SheetClose>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Glasses className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Agharas Vision
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
             {user?.role === 'admin' && (
              <NavLink href="/dashboard">Dashboard</NavLink>
            )}
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <Link
                  href="/"
                  className="mr-6 flex items-center space-x-2 mb-6"
                >
                  <Glasses className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">Agharas Vision</span>
                </Link>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <MobileNavLink key={link.href} href={link.href}>
                      {link.label}
                    </MobileNavLink>
                  ))}
                   {user?.role === 'admin' && (
                    <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            { isClient && user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">User Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
            ) : (
                <Button asChild variant="ghost" size="icon">
                    <Link href="/login">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Login</span>
                    </Link>
                </Button>
            )}
            
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {isClient && cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
