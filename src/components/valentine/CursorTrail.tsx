import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorTrailProps {
  isActive: boolean;
}

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

const CursorTrail = ({ isActive }: CursorTrailProps) => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => {
    if (!isActive) {
      setTrail([]);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      setTrail(prev => {
        const updated = [...prev, newPoint].slice(-15); // Keep last 15 points
        return updated;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, index) => {
        if (index === trail.length - 1) return null; // Skip the last point (actual cursor)
        
        const opacity = (index / trail.length) * 0.3;
        const scale = (index / trail.length) * 0.5 + 0.3;

        return (
          <motion.div
            key={point.id}
            className="absolute w-4 h-4 rounded-full"
            style={{
              left: point.x - 8,
              top: point.y - 8,
              background: `radial-gradient(circle, hsl(145, 50%, 65%) ${scale * 100}%, transparent)`,
              opacity,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale, opacity }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
};

export default CursorTrail;
