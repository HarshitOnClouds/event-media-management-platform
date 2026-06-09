"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createEvent(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const visibility = formData.get("visibility") || "PUBLIC";
  const dateStr = formData.get("date");
  const location = formData.get("location");
  
  if (!title || !dateStr) {
    throw new Error("Missing required fields");
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      category,
      visibility,
      date: new Date(dateStr),
      location,
      organizerId: session.user.id,
    },
  });

  revalidatePath("/events");
  return { success: true, eventId: event.id };
}

export async function getEvents() {
  return await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      organizer: { select: { name: true, image: true } },
      _count: { select: { media: true } }
    }
  });
}

export async function getEventById(id) {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: { select: { name: true, image: true } },
      albums: true,
      media: {
        include: {
          uploader: { select: { name: true } },
          tags: true,
        },
        orderBy: { id: 'desc' }
      }
    }
  });
}
