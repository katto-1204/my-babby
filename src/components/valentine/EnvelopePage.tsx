import { useState } from 'react';
import { motion } from 'framer-motion';
import Envelope from './Envelope';
import FloatingHearts from './FloatingHearts';
import ParticleSystem from './ParticleSystem';
import { useSound } from '../../hooks/useSound';

interface EnvelopePageProps {
  onComplete: () => void;
}

const EnvelopePage = ({ onComplete }: EnvelopePageProps) => {
  const [clickCount, setClickCount] = useState(0);
  const { playSound } = useSound();

  const handleEnvelopeClick = () => {
    if (clickCount === 0) {
      setClickCount(1);
      playSound('sparkle');
    } else if (clickCount === 1) {
      setClickCount(2);
      playSound('success');
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  };

  return (
    <div className="page-container gradient-romantic flex flex-col items-center justify-center px-4">
      <FloatingHearts count={15} />
      <ParticleSystem isActive={clickCount >= 1} count={40} type="mixed" />
      
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-heavy text-primary mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A Letter For You
        </motion.h1>
        
        <motion.p
          className="text-xl text-muted-foreground font-serif-italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          I wrote something special, Gigi
        </motion.p>
      </motion.div>
      
      {/* Envelope */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -15 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotateY: 0,
        }}
        transition={{ delay: 1, duration: 1, type: "spring", stiffness: 80, damping: 12 }}
      >
        <Envelope
          isOpen={clickCount >= 1}
          isPaperOut={clickCount >= 2}
          onClick={handleEnvelopeClick}
        />
      </motion.div>
      
      {/* Additional romantic text */}
      <motion.div
        className="mt-12 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {clickCount === 0 && (
          <motion.p
            className="text-muted-foreground text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            This envelope holds my heart
          </motion.p>
        )}
        {clickCount === 1 && (
          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            One more click to read my words...
          </motion.p>
        )}
        {clickCount === 2 && (
          <motion.p
            className="text-primary text-sm font-serif-italic"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Let me show you what's inside...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default EnvelopePage;
