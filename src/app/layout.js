import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata = {
  title: "EventLens - AI Powered Media Platform",
  description: "Centralized Event & Media Management Platform with AI tagging and facial recognition.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`} // Force dark theme
    >
      <body className="min-h-screen bg-[#0A0A0A] font-sans text-[#F5F5F5] antialiased flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster theme="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
