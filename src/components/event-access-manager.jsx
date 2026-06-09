"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getEventRoles, addEventRole, removeEventRole } from "@/actions/event-roles";
import { updateEventVisibility } from "@/actions/events";

export function EventAccessManager({ eventId, initialVisibility }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [roleType, setRoleType] = useState("VIEWER");
  const [submitting, setSubmitting] = useState(false);
  const [visibility, setVisibility] = useState(initialVisibility || "PUBLIC");
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open, eventId]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getEventRoles(eventId);
      setRoles(data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      await addEventRole(eventId, email, roleType);
      toast.success("User added successfully");
      setEmail("");
      fetchRoles();
    } catch (error) {
      toast.error(error.message || "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeEventRole(eventId, userId);
      toast.success("User removed");
      fetchRoles();
    } catch (error) {
      toast.error(error.message || "Failed to remove user");
    }
  };

  const handleVisibilityChange = async (newVisibility) => {
    setVisibilityLoading(true);
    try {
      await updateEventVisibility(eventId, newVisibility);
      setVisibility(newVisibility);
      toast.success(`Event is now ${newVisibility.toLowerCase()}`);
    } catch (error) {
      toast.error(error.message || "Failed to update visibility");
    } finally {
      setVisibilityLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-white/[0.1] text-white hover:bg-white/[0.05] gap-2">
          <ShieldCheck className="w-4 h-4" />
          Manage Access
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#141414] border-white/[0.08] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Event Access Management</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-6 pb-6 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Global Visibility</h3>
              <p className="text-xs text-[#8B8B8B]">Should anyone be able to view this event?</p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={visibility} 
                onChange={(e) => handleVisibilityChange(e.target.value)}
                disabled={visibilityLoading}
                className="bg-black border border-white/[0.1] text-white text-sm rounded-md px-3 py-1.5 focus:border-[#E8FF00]"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
              {visibilityLoading && <Loader2 className="w-4 h-4 animate-spin text-[#E8FF00]" />}
            </div>
          </div>

          <form onSubmit={handleAdd} className="flex gap-2 mb-6">
            <Input 
              type="email" 
              placeholder="User's email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-white/[0.1] text-white"
              required
            />
            <select 
              value={roleType} 
              onChange={(e) => setRoleType(e.target.value)}
              className="bg-black border border-white/[0.1] text-white text-sm rounded-md px-3"
            >
              <option value="VIEWER">Viewer</option>
              <option value="CLUB_MEMBER">Club Member</option>
              <option value="PHOTOGRAPHER">Photographer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <Button type="submit" disabled={submitting} className="bg-[#E8FF00] text-black hover:bg-[#E8FF00]/90">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </form>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#8B8B8B] mb-2">Current Members ({roles.length})</h3>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-[#E8FF00]" /></div>
            ) : roles.length === 0 ? (
              <p className="text-sm text-[#8B8B8B] text-center py-4">No specific roles assigned.</p>
            ) : (
              roles.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-white/[0.05]">
                  <div>
                    <p className="text-sm font-medium text-white">{r.user.name}</p>
                    <p className="text-xs text-[#8B8B8B]">{r.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-1 bg-white/[0.1] rounded text-[#E8FF00]">
                      {r.role}
                    </span>
                    <button onClick={() => handleRemove(r.userId)} className="text-red-500 hover:text-red-400 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
