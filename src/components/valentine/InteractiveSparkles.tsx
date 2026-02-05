import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveSparklesProps {
  isActive: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const InteractiveSparkles = ({ isActive }: InteractiveSparklesProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setSparkles([]);
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const newSparkle: Sparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: 8 + Math.random() * 12,
        delay: 0,
      };

      setSparkles(prev => [...prev, newSparkle]);

      // Remove after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: sparkle.x,
            top: sparkle.y,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            y: [0, -30],
            x: [(Math.random() - 0.5) * 40],
            rotate: 360,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="hsl(145, 50%, 65%)">
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveSparkles;
