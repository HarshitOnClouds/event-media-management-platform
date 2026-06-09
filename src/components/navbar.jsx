"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { NotificationBell } from "@/components/notification-bell";
import { SearchBar } from "@/components/search-bar";
import { Camera, LogOut, PlusSquare } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8FF00] text-black">
            <Camera size={18} className="font-bold" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">EventLens</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <>
              <SearchBar />
              <NotificationBell />
              <Link href="/profile" className="w-8 h-8 rounded-full bg-[#E8FF00] flex items-center justify-center text-black font-bold shrink-0 hover:scale-105 transition-transform">
                {session.user?.name?.[0] || 'U'}
              </Link>
              
              <Link href="/events/create">
                <Button variant="ghost" size="icon" className="md:w-auto md:px-4 text-[#8B8B8B] hover:text-white hover:bg-white/[0.08]">
                  <PlusSquare className="md:mr-2 h-5 w-5" />
                  <span className="hidden md:inline">Create Event</span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 md:gap-4 border-l border-white/[0.08] pl-2 md:pl-4">
                <span className="hidden md:block text-sm font-medium text-white max-w-[120px] truncate">{session.user?.name}</span>
                
                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-[#8B8B8B] hover:text-red-400 hover:bg-red-400/10"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-[#0A0A0A] border-white/[0.08]">
                    <DialogTitle className="text-white">Sign Out</DialogTitle>
                    <DialogDescription className="text-[#8B8B8B]">
                      Are you sure you want to sign out of EventLens?
                    </DialogDescription>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="ghost" onClick={() => setShowLogoutDialog(false)} className="text-white hover:bg-white/[0.08]">
                        Cancel
                      </Button>
                      <Button onClick={() => signOut({ callbackUrl: "/" })} className="bg-red-500 text-white hover:bg-red-600">
                        Sign Out
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
