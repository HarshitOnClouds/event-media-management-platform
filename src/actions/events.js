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

  revalidatePath("/");
  return { success: true, eventId: event.id };
}

export async function getEvents() {
  const session = await getServerSession(authOptions);
  let userId = session?.user?.id;

  const events = await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      organizer: {
        select: { name: true },
      },
      roles: {
        where: { userId: userId || "NONE" }
      },
      _count: {
        select: { media: true },
      },
    },
  });

  // Filter events: PUBLIC, or user is organizer, or user has an EventRole
  return events.filter(event => {
    if (event.visibility === "PUBLIC") return true;
    if (!userId) return false; // Private and not logged in
    if (event.organizerId === userId) return true; // Organizer has access
    if (event.roles.length > 0) return true; // User has an explicit role (ADMIN, MEMBER, etc.)
    return false;
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

export async function updateEventVisibility(eventId, visibility) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { roles: { where: { userId: session.user.id } } }
  });

  if (!event) throw new Error("Event not found");

  const isOrganizer = event.organizerId === session.user.id;
  const isEventAdmin = event.roles.some(r => r.role === "ADMIN");

  if (!isOrganizer && !isEventAdmin) {
    throw new Error("Only the organizer or an event admin can change visibility.");
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { visibility }
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
  
  return { success: true };
}
