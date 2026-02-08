import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BackgroundMusicProps {
  isActive: boolean;
  vibe?: 'romantic' | 'inspecting';
}

// Generate melodies using Web Audio API
class MusicGenerator {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;
  private currentVibe: 'romantic' | 'inspecting' = 'romantic';
  private loopTimeoutId: number | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Notes frequencies
  private notes = {
    romantic: [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      349.23, // F4
      392.00, // G4
      440.00, // A4
      493.88, // B4
      523.25, // C5
    ],
    inspecting: [
      110.00, // A2 (Low, percussive)
      123.47, // B2
      130.81, // C3
      146.83, // D3
      0,      // Muted step
    ]
  };

  playMelody(vibe: 'romantic' | 'inspecting' = 'romantic') {
    // If already playing the requested vibe, don't restart
    if (this.isPlaying && this.currentVibe === vibe) return;

    this.stop();
    this.isPlaying = true;
    this.currentVibe = vibe;
    const ctx = this.getAudioContext();

    // Ensure context is resumed (browsers often suspend audio until user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let melody: number[] = [];
    let speed = 0.5;
    let type: OscillatorType = 'sine';

    if (vibe === 'romantic') {
      melody = [0, 2, 4, 3, 0, 4, 2, 1];
      speed = 0.6;
      type = 'sine';
    } else {
      // Subdued, rhythmic low pulses (no twinkling)
      melody = [0, 4, 1, 4, 0, 4, 2, 4];
      speed = 0.3;
      type = 'sine'; // Sine is softer than square, less "twinkly" or harsh
    }

    melody.forEach((noteIndex, i) => {
      const freq = vibe === 'romantic' ? this.notes.romantic[noteIndex] : this.notes.inspecting[noteIndex];
      // Skip muted steps
      if (freq === 0) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * speed);

      if (vibe === 'romantic') {
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime + i * speed);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * speed + 0.5);
      } else {
        // More audible percussive hits for inspection
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime + i * speed);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * speed + 0.2);
      }


      oscillator.start(ctx.currentTime + i * speed);
      oscillator.stop(ctx.currentTime + i * speed + speed);

      this.oscillators.push(oscillator);
    });

    // Loop the melody
    this.loopTimeoutId = window.setTimeout(() => {
      if (this.isPlaying && this.currentVibe === vibe) {
        this.isPlaying = false; // Reset for clear call
        this.playMelody(vibe);
      }
    }, melody.length * speed * 1000);
  }

  stop() {
    this.isPlaying = false;

    if (this.loopTimeoutId !== null) {
      window.clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }

    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) { }
    });
    this.oscillators = [];
  }
}

const musicGenerator = new MusicGenerator();

const BackgroundMusic = ({ isActive, vibe = 'romantic' }: BackgroundMusicProps) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isActive && !isMuted) {
      musicGenerator.playMelody(vibe);
    } else {
      musicGenerator.stop();
    }

    return () => {
      musicGenerator.stop();
    };
  }, [isActive, isMuted, vibe]);

  if (!isActive) return null;

  return (
    <motion.button
      className="fixed bottom-4 right-4 z-[9999] p-3 rounded-full bg-black/40 backdrop-blur-lg border border-white/20 hover:bg-black/60 transition-colors shadow-2xl"
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
        stroke="white"
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
