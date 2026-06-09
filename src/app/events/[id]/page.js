import { getEventById } from "@/actions/events";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPin, Tag } from "lucide-react";
import { format } from "date-fns";
import { MediaUploader } from "@/components/media-uploader";
import { EventGallery } from "@/components/event-gallery";
import { EventAccessManager } from "@/components/event-access-manager";
import { QrShareButton } from "@/components/qr-share-button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function EventDetailPage({ params }) {
  const { id: eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  // Access Control Check
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  let isAuthorized = event.visibility === "PUBLIC" || event.organizerId === userId;
  let userEventRole = null;

  if (!isAuthorized && userId) {
    const eventRole = await prisma.eventRole.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });
    if (eventRole) {
      isAuthorized = true;
      userEventRole = eventRole.role;
    }
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Private Event</h1>
        <p className="text-[#8B8B8B]">You do not have permission to view this event's media.</p>
      </div>
    );
  }

  const isOrganizer = event.organizerId === userId;
  const isEventAdmin = isOrganizer || userEventRole === "ADMIN";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Event Header */}
      <div className="w-full bg-[#141414] border-b border-white/[0.08] pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.08] text-[#E8FF00] text-xs font-bold">
              <Tag className="w-3 h-3" />
              {event.category || "General Event"}
            </div>
            
            <QrShareButton eventTitle={event.title} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight break-words overflow-hidden">
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

            {isEventAdmin && (
              <div className="ml-auto">
                <EventAccessManager eventId={event.id} initialVisibility={event.visibility} />
              </div>
            )}
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
