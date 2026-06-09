"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success("Account created successfully!");
      
      // Auto login after registration
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/events");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to create account");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#0A0A0A] px-4 py-12">
      <div className="w-full max-w-md bg-[#141414] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8FF00] text-black mb-4">
            <Camera size={24} className="font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
          <p className="text-[#8B8B8B] mt-2">Join EventLens to manage your media</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Full Name</label>
            <Input 
              name="name" 
              type="text" 
              required 
              placeholder="John Doe"
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] h-12"
            />
          </div>

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
            <label className="text-sm font-medium text-white">Password</label>
            <Input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              minLength={6}
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] h-12"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90 h-12 mt-6 font-medium text-base rounded-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#8B8B8B]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E8FF00] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
