"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getPusherClient } from "@/lib/pusher";
import { getUnreadNotifications, markNotificationsAsRead } from "@/actions/social";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Fetch initial notifications
    getUnreadNotifications().then((data) => {
      setNotifications(data);
      setUnreadCount(data.length);
    });

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${session.user.id}`);

    channel.bind("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
      setUnreadCount((prev) => prev + 1);
      
      // Also show a toast
      toast(notification.message, {
        icon: notification.type === "LIKE" ? "❤️" : "💬"
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.id]);

  const handleOpen = async (open) => {
    if (open && unreadCount > 0) {
      setUnreadCount(0);
      await markNotificationsAsRead();
    }
  };

  if (!session) return null;

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/[0.08]">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8FF00] rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-[#141414] border border-white/[0.08] p-0 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.08]">
          <h3 className="font-semibold text-white">Notifications</h3>
        </div>
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#8B8B8B] text-sm">
              You're all caught up!
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className={`p-4 border-b border-white/[0.04] flex items-start gap-3 transition-colors ${!notif.isRead ? 'bg-white/[0.02]' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-lg flex-shrink-0">
                  {notif.type === "LIKE" ? "❤️" : notif.type === "COMMENT" ? "💬" : "🔔"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-white">{notif.message}</span>
                  <span className="text-xs text-[#8B8B8B] mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt))} ago
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
