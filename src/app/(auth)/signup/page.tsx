"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Activity,
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupInput) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Failed to create account");
        toast.error("Signup failed. Please try again.");
      } else {
        toast.success("Account created successfully!");
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error("Auto-login failed. Please log in manually.");
          router.push("/login");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex flex-col items-center gap-4 mb-12 group w-fit mx-auto">
          <div className="border border-foreground p-3 rounded-none text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
            <Activity className="h-6 w-6" />
          </div>
          <span className="font-heading font-black text-2xl tracking-tight text-foreground uppercase">
            PulseStat
          </span>
        </Link>

        <div className="border border-border bg-background p-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-foreground"></div>

          <div className="mb-8">
            <h1 className="text-2xl font-heading font-black tracking-tight text-foreground uppercase mb-2">Create Account</h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
              {"// JOIN 1,000+ DEVELOPERS"}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-none flex items-center gap-3 font-mono text-xs uppercase">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input
                          placeholder="Your Name"
                          autoComplete="name"
                          className="h-12 pl-10 bg-transparent border-border rounded-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0 text-foreground font-mono text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input
                          placeholder="name@example.com"
                          autoComplete="email"
                          spellCheck={false}
                          className="h-12 pl-10 bg-transparent border-border rounded-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0 text-foreground font-mono text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="h-12 pl-10 pr-10 bg-transparent border-border rounded-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0 text-foreground font-mono text-sm"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 rounded-none font-mono text-xs uppercase tracking-wider group bg-foreground hover:bg-background hover:text-foreground border border-foreground text-background transition-colors duration-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    GET STARTED FREE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link href="/login" className="text-foreground hover:underline transition-all font-bold">
                LOG IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
