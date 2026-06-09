import { getEventById } from "@/actions/events";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPin, Tag } from "lucide-react";
import { format } from "date-fns";
import { MediaUploader } from "@/components/media-uploader";
import { EventGallery } from "@/components/event-gallery";

export default async function EventDetailPage({ params }) {
  const { id: eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Event Hero */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-[#141414] border-b border-white/[0.08] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/50 to-transparent z-10" />
        
        {/* Placeholder for Cover Image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <CalendarIcon className="w-32 h-32 text-white" />
        </div>

        <div className="container mx-auto px-4 pb-12 relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.08] text-[#E8FF00] text-xs font-bold mb-4">
            <Tag className="w-3 h-3" />
            {event.category || "General Event"}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight">
            {event.title}
          </h1>
          
          <p className="max-w-3xl text-lg text-[#8B8B8B] mb-6 line-clamp-3">
            {event.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#8B8B8B]">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-white">{format(new Date(event.date), "MMMM d, yyyy")}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-white">{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 border-l border-white/[0.1] pl-6 ml-2">
              <div className="w-6 h-6 rounded-full bg-[#E8FF00] flex items-center justify-center text-black text-xs font-bold">
                {event.organizer?.name?.charAt(0) || "U"}
              </div>
              <span>Organized by <span className="text-white">{event.organizer?.name || "User"}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Uploader Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Media</h2>
          <MediaUploader eventId={event.id} />
        </div>

        {/* Gallery Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Event Gallery ({event.media.length})</h2>
        </div>

        <EventGallery media={event.media} eventId={event.id} />
      </div>
    </div>
  );
}
