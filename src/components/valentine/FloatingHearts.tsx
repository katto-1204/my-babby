import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingHeartsProps {
  count?: number;
}

// SVG Heart component
const SvgHeart = ({ size, color, opacity }: { size: number; color: string; opacity: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
    style={{ opacity }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const FloatingHearts = ({ count = 10 }: FloatingHeartsProps) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3,
      color: [
        'hsl(145, 40%, 55%)',
        'hsl(150, 35%, 60%)',
        'hsl(155, 45%, 50%)',
        'hsl(140, 30%, 65%)',
        'hsl(350, 50%, 70%)',
      ][Math.floor(Math.random() * 5)],
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{ left: `${heart.left}%`, bottom: '-50px' }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(heart.id) * 30, Math.cos(heart.id) * 20, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <SvgHeart size={heart.size} color={heart.color} opacity={heart.opacity} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
