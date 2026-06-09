"use server";

import { prisma } from "@/lib/prisma";

export async function searchMedia(query) {
  if (!query || query.trim() === "") return [];

  // Very basic "semantic-like" split by spaces for broader matching
  const keywords = query.trim().split(/\s+/);

  const orConditions = keywords.flatMap(keyword => [
    { caption: { contains: keyword, mode: "insensitive" } },
    { event: { title: { contains: keyword, mode: "insensitive" } } },
    { event: { location: { contains: keyword, mode: "insensitive" } } },
    { uploader: { name: { contains: keyword, mode: "insensitive" } } },
    { tags: { some: { name: { contains: keyword, mode: "insensitive" } } } }
  ]);

  const results = await prisma.media.findMany({
    where: {
      OR: orConditions
    },
    include: {
      uploader: { select: { name: true } },
      tags: true,
      event: { select: { title: true } }
    },
    orderBy: { id: "desc" },
    take: 50,
  });

  return results;
}
