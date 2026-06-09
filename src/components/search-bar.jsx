"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:flex items-center w-64">
      <Search className="absolute left-3 w-4 h-4 text-[#8B8B8B]" />
      <Input
        type="search"
        placeholder="Search photos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-9 pr-4 bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-[#E8FF00] h-9 rounded-full text-sm placeholder:text-[#8B8B8B]"
      />
    </form>
  );
}
