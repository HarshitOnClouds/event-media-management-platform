"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getEventRoles(eventId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const roles = await prisma.eventRole.findMany({
    where: { eventId },
    include: { user: { select: { name: true, email: true } } }
  });

  return roles;
}

export async function addEventRole(eventId, email, role) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  // Verify caller is the organizer or an ADMIN of this event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { roles: { where: { userId: session.user.id } } }
  });

  if (!event) throw new Error("Event not found");

  const isOrganizer = event.organizerId === session.user.id;
  const isEventAdmin = event.roles.some(r => r.role === "ADMIN");

  if (!isOrganizer && !isEventAdmin) {
    throw new Error("Only the event organizer or an event admin can add roles.");
  }

  // Find the target user by email
  const targetUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!targetUser) {
    throw new Error("No user found with this email. Please ask them to register first.");
  }

  if (targetUser.id === event.organizerId) {
    throw new Error("The event organizer already has full access.");
  }

  // Upsert the role
  await prisma.eventRole.upsert({
    where: {
      userId_eventId: {
        userId: targetUser.id,
        eventId
      }
    },
    update: { role },
    create: {
      userId: targetUser.id,
      eventId,
      role
    }
  });

  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function removeEventRole(eventId, userId) {
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
    throw new Error("Only the event organizer or an event admin can remove roles.");
  }

  await prisma.eventRole.delete({
    where: {
      userId_eventId: {
        userId,
        eventId
      }
    }
  });

  revalidatePath(`/events/${eventId}`);
  return { success: true };
}
