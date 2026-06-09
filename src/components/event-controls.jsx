"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function EventControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "date";
  const currentOrder = searchParams.get("order") || "desc";
  const currentCategory = searchParams.get("category") || "all";

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value) => {
    let sort = "date";
    let order = "desc";
    
    if (value === "date_desc") { sort = "date"; order = "desc"; }
    if (value === "date_asc") { sort = "date"; order = "asc"; }
    if (value === "name_asc") { sort = "name"; order = "asc"; }
    if (value === "name_desc") { sort = "name"; order = "desc"; }

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.set("order", order);
    router.push("/?" + params.toString());
  };

  const handleCategoryChange = (val) => {
    router.push("/?" + createQueryString("category", val));
  };

  const currentSortValue = `${currentSort}_${currentOrder}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-[#141414] border border-white/[0.08] p-4 rounded-2xl">
      <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-2 sm:gap-4 flex-1">
        <Label className="text-[#8B8B8B] whitespace-nowrap">Sort By</Label>
        <Select value={currentSortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-black border-white/[0.1] text-white">
            <SelectValue placeholder="Sort events" />
          </SelectTrigger>
          <SelectContent className="bg-[#141414] border-white/[0.1] text-white">
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-2 sm:gap-4">
        <Label className="text-[#8B8B8B] whitespace-nowrap">Category</Label>
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-black border-white/[0.1] text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-[#141414] border-white/[0.1] text-white">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Photoshoot">Photoshoot</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Trip">Trip</SelectItem>
            <SelectItem value="Competition">Competition</SelectItem>
            <SelectItem value="Cultural Fest">Cultural Fest</SelectItem>
            <SelectItem value="Party">Party</SelectItem>
            <SelectItem value="General">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
