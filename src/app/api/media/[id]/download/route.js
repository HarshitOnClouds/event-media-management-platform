import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get media and associated event details
    const media = await prisma.media.findUnique({
      where: { id },
      include: { event: { select: { title: true, organizerId: true } } }
    });

    if (!media) {
      return new NextResponse("Media not found", { status: 404 });
    }

    // Fetch the raw image buffer from S3 using the URL
    const imageResponse = await fetch(media.url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch original image from S3: ${imageResponse.statusText}`);
    }
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If it's a video, just return the raw video (we can't easily watermark video with jimp)
    if (media.type === "VIDEO") {
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `attachment; filename="eventlens_video_${id}.mp4"`
        }
      });
    }

    // Create the dynamic watermark text
    const eventName = media.event.title.toUpperCase();

    // Determine user's role for this event
    let userRoleStr = "GUEST";
    if (media.event.organizerId === session.user.id) {
      userRoleStr = "ORGANIZER";
    } else {
      const eventRole = await prisma.eventRole.findUnique({
        where: { userId_eventId: { userId: session.user.id, eventId: media.eventId } }
      });
      if (eventRole) userRoleStr = eventRole.role;
    }

    const watermarkText = `EventLens | ${eventName} | Downloaded by: ${userRoleStr}`;

    // Process image with Sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    let fontSize = 16;
    if (width > 2000) fontSize = 64;
    else if (width > 1000) fontSize = 32;

    const svgOverlay = `
      <svg width="${width}" height="${height}">
        <style>
          .title { fill: rgba(255, 255, 255, 0.9); font-size: ${fontSize}px; font-family: sans-serif; font-weight: bold; }
          .bg { fill: rgba(0, 0, 0, 0.6); }
        </style>
        <rect x="0" y="${height - (fontSize * 2)}" width="${width}" height="${fontSize * 2}" class="bg" />
        <text x="${width - 20}" y="${height - (fontSize * 0.6)}" text-anchor="end" class="title">${watermarkText}</text>
      </svg>
    `;

    const watermarkedBuffer = await image
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .jpeg()
      .toBuffer();

    // Return the response as an attachment to trigger download
    return new NextResponse(watermarkedBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="eventlens_watermarked_${id}.jpg"`
      }
    });

  } catch (error) {
    console.error("WATERMARK_DOWNLOAD_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
