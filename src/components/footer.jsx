export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0A0A0A] py-8">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[#8B8B8B] text-sm">
        <p>© {new Date().getFullYear()} EventLens. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#E8FF00] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#E8FF00] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#E8FF00] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
