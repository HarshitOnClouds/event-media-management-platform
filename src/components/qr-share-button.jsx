"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QrCode, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export function QrShareButton({ eventTitle }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="bg-black/50 backdrop-blur-md border-white/[0.1] text-white hover:bg-white/[0.1]"
      >
        <QrCode className="w-4 h-4 mr-2" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#0A0A0A] border-white/[0.1]">
          <DialogTitle className="text-xl font-bold text-white text-center">Share Event</DialogTitle>
          <DialogDescription className="text-center text-[#8B8B8B] mb-6">
            Scan this QR code to view and upload media to {eventTitle}.
          </DialogDescription>
          
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl mx-auto w-64 h-64">
            {url && (
              <QRCode 
                value={url} 
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            )}
          </div>

          <div className="flex items-center gap-2 mt-6">
            <div className="flex-1 bg-[#141414] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-[#8B8B8B] truncate">
              {url}
            </div>
            <Button size="icon" variant="outline" className="border-white/[0.1] bg-[#141414] text-white hover:bg-white/[0.1]" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
