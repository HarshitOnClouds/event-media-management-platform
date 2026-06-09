"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { detectLabelsForImage, searchFaces } from "@/lib/rekognition";
import { pusherServer } from "@/lib/pusher";

export async function saveMediaRecord(data) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const { eventId, url, key, type, caption, hash } = data;

  if (hash) {
    const existing = await prisma.media.findFirst({
      where: { hash }
    });
    if (existing) {
      return { success: false, error: "This image has already been uploaded." };
    }
  }

  const mediaData = {
    url,
    key,
    type,
    caption,
    eventId,
    uploaderId: session.user.id,
    hash,
  };

  let aiTags = [];
  if (type === "IMAGE") {
    // 1. Label Detection (Smart Tagging)
    const labels = await detectLabelsForImage(key);
    if (labels && labels.length > 0) {
      aiTags = labels.map(l => ({
        name: l.Name,
        confidence: l.Confidence,
      }));
    }

    // 2. Face Recognition (Match users in the image)
    const faceMatches = await searchFaces(key);
    if (faceMatches && faceMatches.length > 0) {
      for (const match of faceMatches) {
        const faceId = match.Face?.FaceId;
        if (faceId) {
          // Find if this face belongs to a registered user
          const embedding = await prisma.faceEmbedding.findFirst({
            where: { faceId }
          });
          
          if (embedding) {
            // Add a special tag for the user
            aiTags.push({
              name: `PERSON_${embedding.userId}`,
              confidence: match.Similarity
            });

            // Notify the user if they are not the uploader
            if (embedding.userId !== session.user.id) {
              const notif = await prisma.notification.create({
                data: {
                  userId: embedding.userId,
                  type: "TAG",
                  message: `You were spotted in a new photo!`
                }
              });
              await pusherServer.trigger(`user-${embedding.userId}`, 'new-notification', notif);
            }
          }
        }
      }
    }
  }

  const media = await prisma.media.create({
    data: {
      ...mediaData,
      tags: {
        create: aiTags
      }
    },
    include: {
      tags: true,
      uploader: { select: { name: true } }
    }
  });

  // Notify the event channel that a new media file was uploaded
  await pusherServer.trigger(`event-${eventId}`, 'new-media', media);

  revalidatePath(`/events/${eventId}`);
  return { success: true, media };
}
