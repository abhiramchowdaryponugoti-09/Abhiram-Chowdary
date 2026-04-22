import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthAura AI",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ff41"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "GlitchMind AI",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300&h=300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff003c"
  },
  {
    id: 3,
    title: "Ether Drive",
    artist: "DeepWave AI",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300&h=300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#00d1ff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div id="music-system" className="flex flex-col space-y-6">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={skipForward}
      />

      {/* Now Playing Panel */}
      <section className="glass-panel rounded-xl p-5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-4">Now Playing</h2>
        
        <div className="aspect-square w-full border-neon-green bg-black mb-6 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#39ff14] via-transparent to-transparent"></div>
          
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-40 mix-blend-screen' : 'scale-100 opacity-20 grayscale'}`}
          />
          
          <div className="flex space-x-1 items-end h-16 relative z-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? [16, 48, 24, 64, 32][(i + currentTrackIndex) % 5] : 8 }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                className="w-1.5 bg-neon-green shadow-[0_0_10px_#39ff14]"
              />
            ))}
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-medium font-serif italic text-white/90 truncate">{currentTrack.title}</h3>
          <p className="text-[10px] text-neon-blue uppercase tracking-widest font-bold">{currentTrack.artist}</p>
        </div>

        <div className="space-y-5">
          <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white shadow-[0_0_8px_#fff]"
              initial={false}
              animate={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center px-2">
            <button 
              onClick={skipBackward}
              className="text-white/30 hover:text-white transition-colors text-lg"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-1" />}
            </button>
            <button 
              onClick={skipForward}
              className="text-white/30 hover:text-white transition-colors text-lg"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Track Selection Panel */}
      <section className="glass-panel rounded-xl p-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">Track Selection</h2>
        <ul className="space-y-2 text-[11px] font-medium">
          {TRACKS.map((track, idx) => (
            <li 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`flex justify-between items-center p-2 rounded cursor-pointer transition-all ${
                currentTrackIndex === idx 
                  ? 'bg-white/5 border-l-2 border-neon-green text-neon-green' 
                  : 'hover:bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              <span>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {track.title}</span>
              <span className="opacity-40 font-mono">03:42</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

