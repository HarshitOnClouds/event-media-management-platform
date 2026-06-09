import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPresignedUploadUrl } from "@/lib/s3";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { filename, contentType, eventId } = await request.json();

    if (!filename || !contentType || !eventId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Generate a unique key for S3: events/eventId/uniqueId-filename
    const uniqueId = nanoid(10);
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `events/${eventId}/${uniqueId}-${safeFilename}`;

    const { signedUrl, publicUrl } = await getPresignedUploadUrl(key, contentType);

    return NextResponse.json({
      signedUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("PRESIGNED_URL_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
