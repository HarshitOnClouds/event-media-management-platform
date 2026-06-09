"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import { SearchBar } from "@/components/search-bar";
import { Camera, LogOut, PlusSquare } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8FF00] text-black">
            <Camera size={18} className="font-bold" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">EventLens</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <SearchBar />
              <Link href="/events" className="text-sm font-medium text-[#8B8B8B] hover:text-white transition-colors">
                Events
              </Link>
              <Link href="/profile" className="text-sm font-medium text-[#8B8B8B] hover:text-white transition-colors">
                Profile
              </Link>
              <NotificationBell />
              <div className="w-8 h-8 rounded-full bg-[#E8FF00] flex items-center justify-center text-black font-bold">
                {session.user?.name?.[0] || 'U'}
              </div>
              <Link href="/events/create">
                <Button variant="ghost" className="text-[#8B8B8B] hover:text-white hover:bg-white/[0.08]">
                  <PlusSquare className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </Link>
              <div className="flex items-center gap-4 border-l border-white/[0.08] pl-4">
                <span className="text-sm font-medium text-white">{session.user?.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-[#8B8B8B] hover:text-red-400 hover:bg-red-400/10"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-[#8B8B8B] hover:text-white hover:bg-white/[0.08]">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
