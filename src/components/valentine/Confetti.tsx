import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  isActive: boolean;
}

// SVG Heart for confetti
const ConfettiHeart = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// SVG Star for confetti
const ConfettiStar = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

const Confetti = ({ isActive }: ConfettiProps) => {
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
      size: Math.random() * 10 + 5,
      color: [
        'hsl(145, 40%, 55%)',
        'hsl(150, 35%, 65%)',
        'hsl(155, 45%, 50%)',
        'hsl(140, 30%, 75%)',
        'hsl(350, 60%, 75%)',
        'hsl(40, 60%, 70%)',
        'hsl(200, 50%, 60%)',
        'hsl(280, 40%, 65%)',
      ][Math.floor(Math.random() * 8)],
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
  }, []);

  const heartConfetti = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `heart-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      size: Math.random() * 15 + 10,
      color: [
        'hsl(145, 50%, 55%)',
        'hsl(350, 60%, 65%)',
        'hsl(350, 50%, 70%)',
      ][Math.floor(Math.random() * 3)],
    }));
  }, []);

  const starConfetti = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: `star-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 1.8,
      size: Math.random() * 12 + 8,
      color: 'hsl(45, 80%, 60%)',
    }));
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Regular confetti pieces */}
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            top: -20,
            width: piece.size,
            height: piece.shape === 'circle' ? piece.size : piece.size * 1.5,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px',
          }}
          initial={{ y: -50, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: piece.rotation + 720,
            x: [0, Math.sin(piece.id) * 100, Math.cos(piece.id) * 50, 0],
          }}
          transition={{
            duration: piece.duration + 2,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Heart confetti */}
      {heartConfetti.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{ left: `${heart.left}%`, top: -30 }}
          initial={{ y: -50, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: [0, 180, 360],
            x: [0, Math.sin(parseInt(heart.id.split('-')[1])) * 80],
          }}
          transition={{
            duration: 4,
            delay: heart.delay,
            ease: "easeOut",
          }}
        >
          <ConfettiHeart size={heart.size} color={heart.color} />
        </motion.div>
      ))}
      
      {/* Star confetti */}
      {starConfetti.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{ left: `${star.left}%`, top: -30 }}
          initial={{ y: -50, rotate: 0, opacity: 1, scale: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: [0, 360, 720],
            scale: [1, 1.3, 0.8, 1],
            x: [0, Math.cos(parseInt(star.id.split('-')[1])) * 60],
          }}
          transition={{
            duration: 4.5,
            delay: star.delay,
            ease: "easeOut",
          }}
        >
          <ConfettiStar size={star.size} color={star.color} />
        </motion.div>
      ))}
    </div>
  );
};

export default Confetti;
