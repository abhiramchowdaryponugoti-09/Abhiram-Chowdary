import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-[#e2e2e7] overflow-hidden flex flex-col p-6 space-y-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <div className="w-4 h-4 bg-black rotate-45"></div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Synth<span className="text-neon-pink">Striker</span> 
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded ml-2 font-normal">v1.0.4</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-8 text-xs tracking-widest uppercase font-bold opacity-60">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#39ff14]"></span>
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-neon-blue" />
            <span>Audio Sync: 99%</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex space-x-6 overflow-hidden">
        {/* Left Side: Music Controls (Design aside) */}
        <aside className="w-72 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <MusicPlayer />
          
          <section className="glass-panel rounded-xl p-5">
             <div className="flex items-center gap-2 mb-4 opacity-40">
               <Terminal className="w-3 h-3" />
               <h2 className="text-[10px] font-bold uppercase tracking-widest">Protocol Stats</h2>
             </div>
             <div className="space-y-3 font-mono text-[10px] opacity-60">
               <div className="flex justify-between"><span>LATTICE SYNC</span><span>ACTIVE</span></div>
               <div className="flex justify-between"><span>DROID ENTITY</span><span>0xFF23</span></div>
               <div className="flex justify-between"><span>CORE LOAD</span><span>42%</span></div>
               <div className="w-full h-0.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                 <motion.div 
                   animate={{ x: ['-100%', '100%'] }}
                   transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                   className="h-full w-1/2 bg-neon-pink" 
                 />
               </div>
             </div>
          </section>
        </aside>

        {/* Center: Snake Game (Design main area) */}
        <div className="flex-1 glass-panel rounded-xl relative overflow-hidden flex flex-col items-center justify-center bg-black/40">
          <SnakeGame />
        </div>
      </main>

      {/* Status Bar */}
      <footer className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-20 flex justify-between px-2">
        <span>Sector 7-G / Neural Interface</span>
        <span>Secure Protocol 0x932A-11</span>
      </footer>
    </div>
  );
}


