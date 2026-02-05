import { useState } from 'react';
import { motion } from 'framer-motion';
import ScratchCanvas from './ScratchCanvas';
import FloatingHearts from './FloatingHearts';
import HeartIcon from './icons/HeartIcon';
import { useSound } from '../../hooks/useSound';

interface LetterPageProps {
  onComplete: () => void;
}

const LetterPage = ({ onComplete }: LetterPageProps) => {
  const [revealProgress, setRevealProgress] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const { playSound } = useSound();

  const handleRevealProgress = (progress: number) => {
    setRevealProgress(progress);
    if (progress >= 85 && !showContinue) {
      setShowContinue(true);
      playSound('success');
      playSound('sparkle');
    }
  };

  return (
    <div className="page-container gradient-romantic flex flex-col items-center justify-center px-4 py-8">
      <FloatingHearts count={8} />
      
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-serif-italic text-foreground">
          Gigi, this is for you.
        </h2>
        <p className="text-muted-foreground mt-2">Scratch to reveal what's inside.</p>
      </motion.div>
      
      {/* Scratch Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ScratchCanvas
          width={Math.min(400, window.innerWidth - 48)}
          height={280}
          onRevealProgress={handleRevealProgress}
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-serif-italic text-foreground">
              Hi Gigi,
            </h2>
            <p className="text-foreground/90 leading-relaxed text-sm">
              I wanted to make something small but meaningful.
            </p>
            <p className="text-foreground/90 leading-relaxed text-sm">
              You've made every day brighter, and I wanted to thank you in my own way.
            </p>
            <motion.div
              className="pt-2 flex justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HeartIcon size={32} color="hsl(145, 40%, 55%)" animate />
            </motion.div>
          </div>
        </ScratchCanvas>
      </motion.div>
      
      {/* Progress indicator */}
      <motion.div
        className="mt-6 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {revealProgress < 85 ? (
          <div className="text-center">
            <p>Keep scratching... {Math.round(revealProgress)}% revealed</p>
            <p className="text-xs mt-1 text-muted-foreground/70">Need 85% to continue</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(145, 40%, 55%)">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
            <span>Message revealed!</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(145, 40%, 55%)">
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
            </svg>
          </div>
        )}
      </motion.div>
      
      {/* Continue Button - only shows at 85% */}
      {showContinue && (
        <motion.button
          className="btn-romantic mt-8 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => {
            playSound('buttonClick');
            onComplete();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Continue</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default LetterPage;
