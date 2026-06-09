"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { indexFace } from "@/lib/rekognition";

export async function saveSelfie(url, key) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const faceId = await indexFace(key);
  if (!faceId) {
    throw new Error("No face detected in the image or failed to index. Please upload a clear photo of your face.");
  }

  // Check if they already have an embedding and update or create
  const existing = await prisma.faceEmbedding.findUnique({
    where: { userId: session.user.id }
  });

  if (existing) {
    await prisma.faceEmbedding.update({
      where: { userId: session.user.id },
      data: { faceId, referenceImage: url }
    });
  } else {
    await prisma.faceEmbedding.create({
      data: {
        userId: session.user.id,
        faceId,
        referenceImage: url
      }
    });
  }

  return { success: true };
}

export async function getMyProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { faceEmbedding: true }
  });
}

export async function getMyPhotos() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  // The AI tags the person as PERSON_{userId}
  const tagToLookFor = `PERSON_${session.user.id}`;

  const media = await prisma.media.findMany({
    where: {
      tags: {
        some: {
          name: tagToLookFor
        }
      }
    },
    include: {
      uploader: { select: { name: true } },
      tags: true,
      event: { select: { title: true } }
    },
    orderBy: {
      id: "desc"
    }
  });

  return media;
}
