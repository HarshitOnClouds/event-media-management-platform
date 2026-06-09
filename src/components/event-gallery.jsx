"use client";

import { useState, useEffect } from "react";
import { MediaModal } from "@/components/media-modal";
import { CalendarIcon } from "lucide-react";

export function EventGallery({ media, eventId }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mediaId = params.get("media");
      if (mediaId) {
        const targetMedia = media.find(m => m.id === mediaId);
        if (targetMedia) setSelectedMedia(targetMedia);
      }
    }
  }, [media]);

  const handleOpenChange = (open) => {
    if (!open) {
      setSelectedMedia(null);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete("media");
        window.history.replaceState({}, '', url);
      }
    }
  };

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 border border-white/[0.08] rounded-3xl bg-[#141414]/50 border-dashed mt-8">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
          <CalendarIcon className="w-8 h-8 text-[#8B8B8B]" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No media uploaded yet</h3>
        <p className="text-[#8B8B8B] mb-6 text-center max-w-sm">Be the first to upload photos and videos to this event.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-8">
        {media.map((m) => (
          <div 
            key={m.id} 
            className="relative group break-inside-avoid rounded-xl overflow-hidden bg-[#141414] border border-white/[0.08] cursor-pointer"
            onClick={() => setSelectedMedia(m)}
          >
            {m.type === "IMAGE" ? (
              <img 
                src={m.url} 
                alt="Event media" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <video src={m.url} className="w-full h-auto" />
            )}
            
            {/* Overlay Metadata */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#E8FF00] flex items-center justify-center text-black text-xs font-bold">
                  {m.uploader?.name?.charAt(0) || "U"}
                </div>
                <span className="text-white text-sm font-medium drop-shadow-md">{m.uploader?.name}</span>
              </div>
              
              {m.tags && m.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {m.tags.slice(0, 3).map(tag => (
                    <span key={tag.id} className="px-2 py-0.5 bg-black/50 backdrop-blur-sm border border-white/[0.1] rounded text-[10px] text-[#E8FF00]">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MediaModal 
        open={!!selectedMedia} 
        onOpenChange={handleOpenChange}
        mediaId={selectedMedia?.id}
        eventId={eventId}
        initialUrl={selectedMedia?.url}
        initialType={selectedMedia?.type}
      />
    </>
  );
}
