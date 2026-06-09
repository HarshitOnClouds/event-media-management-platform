"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
    } else {
      toast.success("Logged in successfully");
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#0A0A0A] px-4">
      <div className="w-full max-w-md bg-[#141414] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8FF00] text-black mb-4">
            <Camera size={24} className="font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-[#8B8B8B] mt-2">Log in to your EventLens account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email</label>
            <Input 
              name="email" 
              type="email" 
              required 
              placeholder="name@example.com"
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] h-12"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Password</label>
            </div>
            <Input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] h-12"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90 h-12 mt-6 font-medium text-base rounded-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#8B8B8B]">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#E8FF00] hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
