"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud, X, FileImage, Loader2 } from "lucide-react";
import { saveMediaRecord } from "@/actions/media";
import Image from "next/image";

export function MediaUploader({ eventId, onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    // Only accept files that aren't already in the list
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (name) => {
    setFiles(files.filter(file => file.name !== name));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp'],
      'video/*': ['.mp4', '.webm']
    }
  });

  const applyWatermark = async (file) => {
    if (!file.type.startsWith("image/")) return file;
    
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(img, 0, 0);
        
        // Add watermark
        ctx.font = `bold ${Math.max(20, img.width / 30)}px Inter, sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText("EventLens", img.width - 20, img.height - 20);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { type: file.type });
            resolve(newFile);
          } else {
            resolve(file); // Fallback
          }
        }, file.type, 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);
    let uploadedCount = 0;

    try {
      for (const originalFile of files) {
        // Apply watermark if image
        const file = await applyWatermark(originalFile);

        // 1. Get presigned URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            eventId
          })
        });

        if (!res.ok) throw new Error("Failed to get upload URL");
        
        const { signedUrl, publicUrl, key } = await res.json();

        // 2. Upload to S3 directly
        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          }
        });

        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`);

        // 3. Save record to DB
        await saveMediaRecord({
          eventId,
          url: publicUrl,
          key,
          type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE"
        });

        uploadedCount++;
        setProgress(Math.round((uploadedCount / files.length) * 100));
      }
      
      toast.success(`Successfully uploaded ${uploadedCount} files`);
      setFiles([]);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to upload files");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-[#E8FF00] bg-[#E8FF00]/5" : "border-white/[0.1] hover:bg-white/[0.02]"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-full ${isDragActive ? "bg-[#E8FF00]/20 text-[#E8FF00]" : "bg-white/[0.05] text-[#8B8B8B]"}`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-medium text-white mb-1">
              {isDragActive ? "Drop media here" : "Drag & drop media here"}
            </p>
            <p className="text-sm text-[#8B8B8B]">or click to select files (Images & MP4)</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Selected Files ({files.length})</h4>
            <Button 
              onClick={uploadFiles} 
              disabled={uploading}
              className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading {progress}%
                </>
              ) : (
                "Upload All"
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div key={file.name} className="relative group rounded-xl overflow-hidden bg-[#141414] border border-white/[0.08] aspect-square">
                {file.type.startsWith("image/") ? (
                  <Image 
                    src={file.preview} 
                    alt={file.name} 
                    fill 
                    className="object-cover" 
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#222]">
                    <FileImage className="w-8 h-8 text-[#8B8B8B]" />
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                  <button 
                    onClick={() => removeFile(file.name)}
                    disabled={uploading}
                    className="p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
