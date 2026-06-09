export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="flex justify-between items-center mb-12">
        <div className="h-10 w-48 bg-white/[0.05] rounded animate-pulse" />
        <div className="h-10 w-32 bg-[#E8FF00]/10 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#141414] border border-white/[0.08] rounded-3xl overflow-hidden animate-pulse">
            <div className="h-48 bg-white/[0.05]" />
            <div className="p-6">
              <div className="h-6 w-3/4 bg-white/[0.05] rounded mb-3" />
              <div className="h-4 w-full bg-white/[0.02] rounded mb-2" />
              <div className="h-4 w-2/3 bg-white/[0.02] rounded mb-6" />
              <div className="flex gap-4">
                <div className="h-4 w-1/3 bg-white/[0.05] rounded" />
                <div className="h-4 w-1/3 bg-white/[0.05] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
