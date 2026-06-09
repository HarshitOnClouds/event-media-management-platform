"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarIcon, MapPin, Tag } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    try {
      setLoading(true);
      const res = await createEvent(formData);
      if (res.success) {
        toast.success("Event created successfully!");
        router.push(`/events/${res.eventId}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Create New Event</h1>
        <p className="text-[#8B8B8B]">Set up a new space for your photos and memories.</p>
      </div>

      <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 md:p-8">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-white">Event Title *</label>
            <Input 
              id="title" 
              name="title" 
              required 
              placeholder="e.g. Annual Tech Fest 2026" 
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-white">Description</label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="What is this event about?" 
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#8B8B8B]" /> Date *
              </label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                required 
                className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] block w-full"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#8B8B8B]" /> Category
              </label>
              <Input 
                id="category" 
                name="category" 
                placeholder="e.g. Workshop, Party, Trip" 
                className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B8B8B]" /> Location
            </label>
            <Input 
              id="location" 
              name="location" 
              placeholder="e.g. Main Auditorium" 
              className="bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="border-white/[0.1] text-white hover:bg-white/[0.05]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90 px-8"
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
