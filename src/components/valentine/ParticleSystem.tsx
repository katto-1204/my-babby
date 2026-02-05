import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemProps {
  isActive: boolean;
  count?: number;
  type?: 'sparkles' | 'hearts' | 'stars' | 'mixed';
}

const SparkleIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
  </svg>
);

const HeartIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const StarIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ParticleSystem = ({ isActive, count = 30, type = 'mixed' }: ParticleSystemProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const particleType = type === 'mixed' 
        ? ['sparkle', 'heart', 'star'][Math.floor(Math.random() * 3)]
        : type.slice(0, -1); // Remove 's' from 'sparkles', 'hearts', 'stars'
      
      return {
        id: i,
        type: particleType,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1,
        size: 8 + Math.random() * 12,
        color: [
          'hsl(145, 50%, 60%)',
          'hsl(150, 45%, 65%)',
          'hsl(155, 55%, 55%)',
          'hsl(350, 60%, 70%)',
          'hsl(45, 80%, 65%)',
        ][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
        xOffset: (Math.random() - 0.5) * 100,
      };
    });
  }, [count, type]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((particle) => {
        const IconComponent = 
          particle.type === 'heart' ? HeartIcon :
          particle.type === 'star' ? StarIcon :
          SparkleIcon;

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.left}%`,
              top: '50%',
            }}
            initial={{ 
              scale: 0, 
              opacity: 0,
              y: 0,
              x: 0,
            }}
            animate={{
              scale: [0, 1.2, 1, 0],
              opacity: [0, 1, 1, 0],
              y: -200 + Math.random() * 100,
              x: particle.xOffset,
              rotate: particle.rotation + 360,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
          >
            <IconComponent size={particle.size} color={particle.color} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ParticleSystem;
