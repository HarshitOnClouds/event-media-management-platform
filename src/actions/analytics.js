"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserAnalytics() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const userId = session.user.id;

  const totalUploads = await prisma.media.count({ where: { uploaderId: userId } });
  
  const myMedia = await prisma.media.findMany({
    where: { uploaderId: userId },
    select: { _count: { select: { likes: true, comments: true } } }
  });

  const totalLikesReceived = myMedia.reduce((acc, curr) => acc + curr._count.likes, 0);
  const totalCommentsReceived = myMedia.reduce((acc, curr) => acc + curr._count.comments, 0);

  const eventsOrganized = await prisma.event.count({ where: { organizerId: userId } });

  return {
    totalUploads,
    totalLikesReceived,
    totalCommentsReceived,
    eventsOrganized
  };
}
