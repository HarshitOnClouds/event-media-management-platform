"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Camera, Upload, Loader2, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMyProfile, saveSelfie, getMyPhotos } from "@/actions/face";
import { getUserAnalytics } from "@/actions/analytics";
import Image from "next/image";
import { BarChart3, Heart, MessageCircle, Image as ImageIcon, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [myPhotos, setMyPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      getMyProfile().then(p => {
        setProfile(p);
        setLoading(false);
      });
      getMyPhotos().then(photos => {
        setMyPhotos(photos);
        setLoadingPhotos(false);
      });
      getUserAnalytics().then(stats => setAnalytics(stats));
    }
  }, [session]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get presigned URL (we can reuse the existing endpoint)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `selfie_${session.user.id}_${file.name}`,
          contentType: file.type,
          eventId: "profile" // just a dummy value for the folder path
        })
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { signedUrl, publicUrl, key } = await res.json();

      // 2. Upload to S3 directly
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });
      if (!uploadRes.ok) throw new Error("Failed to upload image");

      // 3. Save as Reference Selfie & Index in Rekognition
      await saveSelfie(publicUrl, key);
      toast.success("Selfie uploaded and face indexed successfully!");

      // Refresh profile
      const p = await getMyProfile();
      setProfile(p);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to process selfie");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="text-[#E8FF00]" />
            My Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <ImageIcon className="w-6 h-6 text-[#8B8B8B] mb-2" />
              <div className="text-2xl font-bold text-white">{analytics.totalUploads}</div>
              <div className="text-xs text-[#8B8B8B] uppercase tracking-wider mt-1">Uploads</div>
            </div>
            <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Heart className="w-6 h-6 text-red-500 mb-2 fill-red-500/20" />
              <div className="text-2xl font-bold text-white">{analytics.totalLikesReceived}</div>
              <div className="text-xs text-[#8B8B8B] uppercase tracking-wider mt-1">Likes Rcvd</div>
            </div>
            <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <MessageCircle className="w-6 h-6 text-blue-400 mb-2 fill-blue-400/20" />
              <div className="text-2xl font-bold text-white">{analytics.totalCommentsReceived}</div>
              <div className="text-xs text-[#8B8B8B] uppercase tracking-wider mt-1">Comments Rcvd</div>
            </div>
            <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="w-6 h-6 text-[#E8FF00] mb-2" />
              <div className="text-2xl font-bold text-white">{analytics.eventsOrganized}</div>
              <div className="text-xs text-[#8B8B8B] uppercase tracking-wider mt-1">Events Hosted</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#141414] border border-white/[0.08] rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <UserRoundCheck className="text-[#E8FF00]" />
          Face Recognition Setup
        </h2>
        <p className="text-[#8B8B8B] mb-8 max-w-2xl">
          Upload a clear selfie of your face. We use AWS Rekognition to automatically find you in event photos and notify you when you are spotted!
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-[#8B8B8B]">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : profile?.faceEmbedding ? (
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#E8FF00]/50">
              <Image 
                src={profile.faceEmbedding.referenceImage} 
                alt="Reference Selfie" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm py-2 text-center">
                <span className="text-xs font-bold text-[#E8FF00] tracking-widest uppercase">Indexed</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium text-lg mb-2">Face Successfully Indexed</h3>
              <p className="text-sm text-[#8B8B8B] mb-4 max-w-sm">
                Your face is currently in our system. You will receive notifications when you are spotted in new event photos.
              </p>
              <Button asChild variant="outline" className="border-white/[0.1] text-white hover:bg-white/[0.05]">
                <label className="cursor-pointer">
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {uploading ? "Processing..." : "Update Selfie"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-white/[0.1] rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B8B8B]">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Selfie Uploaded</h3>
            <p className="text-[#8B8B8B] mb-6">Upload a photo to enable smart tagging.</p>
            <Button asChild className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90">
              <label className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploading ? "Processing..." : "Upload Selfie"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </Button>
          </div>
        )}
      </div>

      {/* Photos of You Section */}
      <div className="mt-12 bg-[#141414] border border-white/[0.08] rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Photos of You</h2>
        
        {loadingPhotos ? (
          <div className="flex items-center gap-2 text-[#8B8B8B]">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading photos...
          </div>
        ) : myPhotos.length === 0 ? (
          <div className="text-center text-[#8B8B8B] py-12 border-2 border-dashed border-white/[0.1] rounded-2xl">
            {profile?.faceEmbedding 
              ? "We haven't spotted you in any event photos yet. Check back later!" 
              : "Upload your selfie above to enable AI detection!"}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {myPhotos.map((m) => (
              <a 
                key={m.id} 
                href={`/events/${m.eventId}`}
                className="relative group break-inside-avoid rounded-xl overflow-hidden bg-[#141414] border border-white/[0.08] cursor-pointer block"
              >
                {m.type === "IMAGE" ? (
                  <img 
                    src={m.url} 
                    alt="Event media" 
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <video src={m.url} className="w-full h-auto" />
                )}
                
                {/* Overlay Metadata */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-white text-sm font-medium drop-shadow-md">
                    {m.event?.title}
                  </span>
                  <span className="text-[#E8FF00] text-xs font-bold mt-1">
                    View Event &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
