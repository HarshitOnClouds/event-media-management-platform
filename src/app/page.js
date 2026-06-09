import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Image as ImageIcon, Sparkles, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="w-full flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-white/[0.08] text-[#8B8B8B] text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-[#E8FF00]" />
          <span>AI-Powered Event Media Management</span>
        </div>
        
        <h1 className="max-w-4xl font-heading text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Capture the moment.<br />
          <span className="text-[#E8FF00]">We'll handle the rest.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-[#8B8B8B] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Centralize your club's memories. Organize photos seamlessly, find faces instantly with AI, and share albums with your community in a beautiful, premium gallery.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/events">
            <Button size="lg" className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90 h-14 px-8 text-base rounded-xl w-full sm:w-auto">
              Explore Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-white/[0.14] bg-white/[0.02] text-white hover:bg-white/[0.06] h-14 px-8 text-base rounded-xl w-full sm:w-auto">
              Create an Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full max-w-7xl px-4 py-24 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#141414] border border-white/[0.04] p-8 rounded-3xl transition-transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
              <Camera className="w-6 h-6 text-[#E8FF00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Event-wise Organization</h3>
            <p className="text-[#8B8B8B] leading-relaxed">
              Create dedicated spaces for your fests, workshops, and trips. Keep media organized and accessible.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#141414] border border-white/[0.04] p-8 rounded-3xl transition-transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-[#E8FF00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Face Recognition</h3>
            <p className="text-[#8B8B8B] leading-relaxed">
              Upload a selfie and let our AI instantly find every photo you appear in across all events.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#141414] border border-white/[0.04] p-8 rounded-3xl transition-transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-[#E8FF00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Social Interactions</h3>
            <p className="text-[#8B8B8B] leading-relaxed">
              Like, comment, and share. Build a community around your shared memories with realtime notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
