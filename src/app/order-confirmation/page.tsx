import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 flex items-center justify-center min-h-[calc(100vh-theme(spacing.28))]">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-headline mt-6">Thank You For Your Order!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Your order has been placed successfully. A confirmation email has been sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            You can check the status of your order in your account.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Go to My Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
