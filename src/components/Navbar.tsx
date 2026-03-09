import { Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-space-900/50 backdrop-blur-md border-b border-white/5">
      <div className="text-xl font-display font-bold tracking-widest uppercase text-white flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple"></div>
        W-S
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-white/70">
        <a href="#mission" className="hover:text-white transition-colors">Mission</a>
        <a href="#fleet" className="hover:text-white transition-colors">Fleet</a>
        <a href="#discoveries" className="hover:text-white transition-colors">Discoveries</a>
        <a href="#join" className="text-neon-blue hover:text-white transition-colors">Join</a>
      </div>
      
      <button className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
}
