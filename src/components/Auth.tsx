import React, { useState } from "react";
import { api } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Auth({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await api.register(data);
      if (res.token) {
        onLogin(res.token, res.user);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await api.login(data);
      if (res.token) {
        onLogin(res.token, res.user);
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
          <Sparkles className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SkillConnect</h1>
        <p className="text-slate-500 mt-2">Empowering your career journey with AI</p>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <Tabs defaultValue="login" className="w-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-50 p-1 rounded-none">
            <TabsTrigger value="login" className="rounded-2xl data-active:bg-white data-active:shadow-sm">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-2xl data-active:bg-white data-active:shadow-sm">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required className="rounded-xl h-12" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign In"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" name="email" type="email" placeholder="name@example.com" required className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" name="password" type="password" required className="rounded-xl h-12" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="text-center text-slate-400 text-sm mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
