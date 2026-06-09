"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Send, X, Download } from "lucide-react";
import { toggleLike, addComment, getMediaDetails } from "@/actions/social";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function MediaModal({ mediaId, eventId, open, onOpenChange, initialUrl, initialType }) {
  const { data: session } = useSession();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    if (open && mediaId) {
      fetchDetails();
    }
  }, [open, mediaId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getMediaDetails(mediaId);
      setDetails(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load media details");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session) return toast.error("Please log in to like media");
    try {
      setIsLiking(true);
      
      // Optimistic update
      const userId = session.user.id;
      const isCurrentlyLiked = details.likes.some(l => l.userId === userId);
      
      setDetails(prev => ({
        ...prev,
        likes: isCurrentlyLiked 
          ? prev.likes.filter(l => l.userId !== userId)
          : [...prev.likes, { userId }]
      }));

      await toggleLike(mediaId, eventId);
    } catch (error) {
      toast.error("Failed to like media");
      fetchDetails(); // Revert on failure
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Please log in to comment");
    if (!commentText.trim()) return;

    try {
      setIsCommenting(true);
      const res = await addComment(mediaId, eventId, commentText);
      if (res.success) {
        setCommentText("");
        setDetails(prev => ({
          ...prev,
          comments: [...prev.comments, res.comment]
        }));
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const isLiked = session && details?.likes?.some(l => l.userId === session.user.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-6xl xl:max-w-[1400px] h-[90vh] p-0 overflow-hidden bg-[#0A0A0A] border-white/[0.08] flex flex-col md:flex-row rounded-2xl [&>button]:hidden">
        {/* Visually hidden Title for accessibility */}
        <DialogTitle className="sr-only">Media View</DialogTitle>
        <DialogDescription className="sr-only">Media details</DialogDescription>
        
        {/* Left Side: Media Display */}
        <div className="relative flex-1 min-w-[20%]  bg-black flex items-center justify-center min-h-[40vh] md:h-full overflow-hidden group">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="absolute top-4 left-4 z-50 bg-black/50 text-white hover:bg-black/80 rounded-full md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>

          {(details?.type || initialType) === "IMAGE" ? (
            <img 
              src={details?.url || initialUrl} 
              alt="Event Media" 
              className="w-full h-full object-contain"
            />
          ) : (
            <video 
              src={details?.url || initialUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          )}

          {/* Download Button Overlay */}
          <a 
            href={`/api/media/${mediaId}/download`}
            download 
            target="_blank" 
            rel="noreferrer"
            className="absolute top-4 right-4 z-50 p-3 bg-black/50 text-white hover:bg-[#E8FF00] hover:text-black rounded-full backdrop-blur-md transition-colors"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>

        {/* Right Side: Interactions */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex flex-col flex-1 md:flex-none md:h-full bg-[#141414] border-l border-white/[0.08]">
          <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8FF00] flex items-center justify-center text-black text-sm font-bold">
                {details?.uploader?.name?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-white">{details?.uploader?.name || "Loading..."}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="hidden md:flex text-[#8B8B8B] hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#E8FF00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : details?.comments?.length === 0 ? (
              <div className="text-center text-[#8B8B8B] py-8 text-sm">
                No comments yet. Be the first to start the conversation!
              </div>
            ) : (
              details?.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.1] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-1">
                    {comment.user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {comment.user.name} <span className="text-xs text-[#8B8B8B] font-normal ml-2">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                    </span>
                    <span className="text-sm text-[#CCCCCC] mt-0.5">{comment.content}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-[#141414] border-t border-white/[0.08]">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={handleLike} 
                disabled={isLiking}
                className="flex items-center gap-2 group transition-colors"
              >
                <Heart className={`w-7 h-7 transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-white group-hover:text-[#8B8B8B]"}`} />
                <span className="font-bold text-white">{details?.likes?.length || 0}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-7 h-7 text-white" />
                <span className="font-bold text-white">{details?.comments?.length || 0}</span>
              </div>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleComment} className="relative flex items-center">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="pr-12 bg-black border-white/[0.1] text-white focus-visible:ring-[#E8FF00] h-12 rounded-full"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                disabled={!commentText.trim() || isCommenting}
                className="absolute right-1 text-[#E8FF00] hover:text-[#E8FF00] hover:bg-transparent"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
