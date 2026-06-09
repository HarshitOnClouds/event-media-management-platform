import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Users, Calendar, Image as ImageIcon, ShieldAlert } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Check if admin (Assuming we have a role field in session or we query the user)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-[#8B8B8B]">You do not have permission to view the Admin Dashboard.</p>
      </div>
    );
  }

  const [userCount, eventCount, mediaCount, recentEvents] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.media.count(),
    prisma.event.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: { organizer: { select: { name: true } }, _count: { select: { media: true } } }
    })
  ]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#141414] border border-white/[0.08] rounded-3xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[#8B8B8B] text-sm font-medium mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{userCount}</p>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/[0.08] rounded-3xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[#8B8B8B] text-sm font-medium mb-1">Total Events</p>
            <p className="text-3xl font-bold text-white">{eventCount}</p>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/[0.08] rounded-3xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[#8B8B8B] text-sm font-medium mb-1">Total Media Uploaded</p>
            <p className="text-3xl font-bold text-white">{mediaCount}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Recent Events</h2>
      <div className="bg-[#141414] border border-white/[0.08] rounded-3xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#8B8B8B]">
          <thead className="bg-black/50 text-xs uppercase text-white border-b border-white/[0.08]">
            <tr>
              <th className="px-6 py-4">Event Title</th>
              <th className="px-6 py-4">Organizer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Media Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {recentEvents.map((event) => (
              <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                <td className="px-6 py-4">{event.organizer.name}</td>
                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] text-xs font-medium text-white">
                    <ImageIcon className="w-3 h-3 text-[#E8FF00]" />
                    {event._count.media}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentEvents.length === 0 && (
          <div className="p-8 text-center text-[#8B8B8B]">No events found.</div>
        )}
      </div>
    </div>
  );
}
