"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

export async function toggleLike(mediaId, eventId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: session.user.id,
      mediaId,
    },
  });

  const media = await prisma.media.findUnique({ where: { id: mediaId } });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({
      data: {
        userId: session.user.id,
        mediaId,
      },
    });

    // Send notification if the liker is not the uploader
    if (media && media.uploaderId !== session.user.id) {
      const notif = await prisma.notification.create({
        data: {
          userId: media.uploaderId,
          type: "LIKE",
          message: `${session.user.name} liked your photo.`,
        }
      });
      // Broadcast via Pusher to the uploader's channel
      await pusherServer.trigger(`user-${media.uploaderId}`, 'new-notification', notif);
    }
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, liked: !existingLike };
}

export async function addComment(mediaId, eventId, content) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  if (!content || content.trim() === "") throw new Error("Comment cannot be empty");

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      mediaId,
    },
    include: {
      user: {
        select: { name: true, image: true }
      }
    }
  });

  // Extract @mentions
  const mentions = content.match(/@([a-zA-Z0-9_]+)/g);
  if (mentions) {
    for (const mention of mentions) {
      const username = mention.slice(1); // remove @
      const users = await prisma.user.findMany({
        where: {
          name: { contains: username, mode: "insensitive" },
          id: { not: session.user.id } // don't notify self
        },
        take: 1 // taking first match
      });

      if (users.length > 0) {
        const taggedUser = users[0];
        await prisma.notification.create({
          data: {
            userId: taggedUser.id,
            type: "TAG",
            message: `${session.user.name} tagged you in a comment: "${content}"`
          }
        });
      }
    }
  }

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  
  // Send notification if the commenter is not the uploader
  if (media && media.uploaderId !== session.user.id) {
    const notif = await prisma.notification.create({
      data: {
        userId: media.uploaderId,
        type: "COMMENT",
        message: `${session.user.name} commented: "${content.trim().substring(0, 30)}..."`,
      }
    });
    await pusherServer.trigger(`user-${media.uploaderId}`, 'new-notification', notif);
  }

  // Also broadcast to the event channel so others viewing the image see the comment live
  await pusherServer.trigger(`media-${mediaId}`, 'new-comment', comment);

  revalidatePath(`/events/${eventId}`);
  return { success: true, comment };
}

export async function toggleFavorite(mediaId, eventId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await prisma.favorite.findFirst({
    where: {
      userId: session.user.id,
      mediaId,
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        mediaId,
      },
    });
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, favorited: !existing };
}

export async function getMediaDetails(mediaId) {
  return await prisma.media.findUnique({
    where: { id: mediaId },
    include: {
      uploader: { select: { name: true, image: true } },
      likes: true,
      favorites: true,
      comments: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'asc' }
      },
      tags: true,
    }
  });
}

export async function getUnreadNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  return await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      isRead: false
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
}

export async function markNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true }
  });
}
