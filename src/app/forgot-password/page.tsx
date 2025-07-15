
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Glasses, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "@/services/email-service";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    // In a real app, you'd check if the user exists first.
    // Here, we just simulate sending the email.
    sendPasswordResetEmail(values.email);

    toast({
        title: "Check Your Email",
        description: `If an account exists for ${values.email}, you will receive a password reset link.`,
    });
    form.reset();
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Mail className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">Forgot Password</CardTitle>
            <CardDescription>
                Enter your email and we'll send you a link to reset your password.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2">Send Reset Link</Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
