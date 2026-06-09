import Link from "next/link";
import { getEvents } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Users, PlusSquare } from "lucide-react";
import { format } from "date-fns";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Events Gallery</h1>
          <p className="text-[#8B8B8B]">Discover and relive moments from recent events.</p>
        </div>
        <Link href="/events/create">
          <Button className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90">
            <PlusSquare className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/[0.08] rounded-3xl bg-[#141414]/50 border-dashed">
          <CalendarIcon className="w-12 h-12 text-[#8B8B8B] mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No events yet</h3>
          <p className="text-[#8B8B8B] mb-6 text-center max-w-sm">Be the first to create an event and start organizing your community's memories.</p>
          <Link href="/events/create">
            <Button className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90">Create Event</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group block">
              <div className="bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.2] hover:shadow-2xl hover:shadow-[#E8FF00]/5 flex flex-col h-full">
                <div className="aspect-[4/3] bg-[#222] relative overflow-hidden flex items-center justify-center">
                  {/* If we had a coverImage, we'd render next/image. For now, a placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent z-10 opacity-60" />
                  <CalendarIcon className="w-12 h-12 text-white/[0.1] group-hover:scale-110 transition-transform duration-500" />
                  
                  <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-[#E8FF00] border border-white/[0.08]">
                    {event.category || "General"}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E8FF00] transition-colors">{event.title}</h3>
                  <p className="text-[#8B8B8B] text-sm line-clamp-2 mb-4 flex-1">
                    {event.description || "No description provided."}
                  </p>
                  
                  <div className="flex flex-col gap-2 text-xs text-[#8B8B8B]">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.08]">
                      <div className="w-5 h-5 rounded-full bg-[#E8FF00] flex items-center justify-center text-black text-[10px] font-bold">
                        {event.organizer?.name?.charAt(0) || "U"}
                      </div>
                      <span>Organized by {event.organizer?.name || "User"}</span>
                      <span className="ml-auto flex items-center gap-1 text-white">
                        <Users className="w-3.5 h-3.5" />
                        {event._count?.media || 0} Media
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
