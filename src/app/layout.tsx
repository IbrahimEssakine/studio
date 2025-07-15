
import type { Metadata } from "next";
import { PT_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import { OrderProvider } from "@/context/order-context";
import { AppointmentProvider } from "@/context/appointment-context";
import { UserProvider } from "@/context/user-context";
import { ProductProvider } from "@/context/product-context";
import { LanguageProvider } from "@/context/language-context";
import React from "react";
import { WhatsAppFAB } from "@/components/whatsapp-fab";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "Agharas Vision",
  description: "High-end eyewear for a clear vision and a bold look.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html lang="fr" dir="ltr" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className={cn(
            "min-h-screen bg-background font-body antialiased",
            ptSans.variable,
            playfairDisplay.variable
          )}
        >
          <UserProvider>
              <OrderProvider>
                <AppointmentProvider>
                  <ProductProvider>
                    <CartProvider>
                      <div className="relative flex min-h-dvh flex-col bg-background">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <WhatsAppFAB />
                      </div>
                      <Toaster />
                    </CartProvider>
                  </ProductProvider>
                </AppointmentProvider>
              </OrderProvider>
          </UserProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
