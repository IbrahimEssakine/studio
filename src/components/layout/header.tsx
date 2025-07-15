
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Glasses, Menu, User, ShoppingCart, LogOut, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

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
import { useLanguage } from "@/context/language-context";

export function Header() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { user, logout } = useUser();
  const { dictionary, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
    { href: "/shop", label: dictionary.header.shop },
    { href: "/about", label: dictionary.header.about },
    { href: "/book-appointment", label: dictionary.header.bookAppointment },
  ];

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
              <NavLink href="/dashboard">{dictionary.header.dashboard}</NavLink>
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
                    <MobileNavLink href="/dashboard">{dictionary.header.dashboard}</MobileNavLink>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
             <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            { isClient && user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">User Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{dictionary.header.myAccount}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/profile">{dictionary.header.profile}</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{dictionary.header.logout}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
            ) : (
                <Button asChild variant="ghost" size="icon">
                    <Link href="/login">
                        <User className="h-5 w-5" />
                        <span className="sr-only">{dictionary.header.login}</span>
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
                <span className="sr-only">{dictionary.header.shoppingCart}</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
