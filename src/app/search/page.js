import { searchMedia } from "@/actions/search";
import { EventGallery } from "@/components/event-gallery";
import { Search } from "lucide-react";

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";
  const results = await searchMedia(query);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#E8FF00]/10 flex items-center justify-center text-[#E8FF00] mb-6">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Search Results
        </h1>
        <p className="text-[#8B8B8B] text-lg text-center max-w-lg">
          {query ? (
            <>Found <span className="text-white font-bold">{results.length}</span> media files for "<span className="text-[#E8FF00]">{query}</span>"</>
          ) : (
            "Enter a search query in the navigation bar to find photos by AI tags, event name, or photographer."
          )}
        </p>
      </div>

      {query && (
        <div className="mt-8">
          <EventGallery media={results} eventId={null} />
        </div>
      )}
    </div>
  );
}
