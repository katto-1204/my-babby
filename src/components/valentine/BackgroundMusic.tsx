import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BackgroundMusicProps {
  isActive: boolean;
}

// Generate a simple romantic melody using Web Audio API
class MusicGenerator {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Simple romantic melody (C major scale)
  private notes = [
    { freq: 261.63, name: 'C4' }, // C
    { freq: 293.66, name: 'D4' }, // D
    { freq: 329.63, name: 'E4' }, // E
    { freq: 349.23, name: 'F4' }, // F
    { freq: 392.00, name: 'G4' }, // G
    { freq: 440.00, name: 'A4' }, // A
    { freq: 493.88, name: 'B4' }, // B
    { freq: 523.25, name: 'C5' }, // C
  ];

  playMelody() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const ctx = this.getAudioContext();
    
    // Play a gentle romantic melody
    const melody = [0, 2, 4, 2, 0, 4, 5, 4, 2, 0]; // C-E-G-E-C-G-A-G-E-C
    
    melody.forEach((noteIndex, i) => {
      const note = this.notes[noteIndex];
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + i * 0.5);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.5 + 0.4);
      
      oscillator.start(ctx.currentTime + i * 0.5);
      oscillator.stop(ctx.currentTime + i * 0.5 + 0.4);
      
      this.oscillators.push(oscillator);
    });
    
    // Loop the melody
    setTimeout(() => {
      this.isPlaying = false;
      this.oscillators = [];
      if (this.isPlaying) {
        this.playMelody();
      }
    }, melody.length * 500);
  }

  stop() {
    this.isPlaying = false;
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Ignore errors
      }
    });
    this.oscillators = [];
  }
}

const musicGenerator = new MusicGenerator();

const BackgroundMusic = ({ isActive }: BackgroundMusicProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && !isMuted) {
      // Play melody every 6 seconds
      musicGenerator.playMelody();
      intervalRef.current = setInterval(() => {
        musicGenerator.playMelody();
      }, 6000);
    } else {
      musicGenerator.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      musicGenerator.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isMuted]);

  if (!isActive) return null;

  return (
    <motion.button
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
      onClick={() => setIsMuted(!isMuted)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isMuted ? 'Unmute music' : 'Mute music'}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isMuted ? (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </motion.button>
  );
};

export default BackgroundMusic;
