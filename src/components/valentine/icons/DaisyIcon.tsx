import { motion } from 'framer-motion';

interface DaisyIconProps {
  size?: number;
  petalColor?: string;
  centerColor?: string;
  className?: string;
  delay?: number;
}

const DaisyIcon = ({ 
  size = 120, 
  petalColor = 'hsl(0, 0%, 98%)', 
  centerColor = 'hsl(45, 90%, 55%)',
  className = '', 
  delay = 0 
}: DaisyIconProps) => {
  const petalCount = 12;
  const petals = Array.from({ length: petalCount }, (_, i) => i * (360 / petalCount));

  return (
    <motion.svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 100 140"
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
    >
      {/* Stem */}
      <motion.path
        d="M50 140 Q48 110 50 75"
        stroke="hsl(145, 40%, 45%)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: delay + 0.3 }}
      />
      
      {/* Leaves */}
      <motion.path
        d="M50 115 Q30 105 25 85 Q40 95 50 105"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.8 }}
        style={{ transformOrigin: '50px 110px' }}
      />
      
      <motion.path
        d="M50 100 Q70 90 75 70 Q60 80 50 90"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 1 }}
        style={{ transformOrigin: '50px 95px' }}
      />
      
      {/* Flower head */}
      <motion.g
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, delay: delay + 1.2, type: "spring", stiffness: 80 }}
        style={{ transformOrigin: '50px 45px' }}
      >
        {/* Petals */}
        {petals.map((angle, i) => (
          <motion.ellipse
            key={i}
            cx="50"
            cy="25"
            rx="8"
            ry="18"
            fill={petalColor}
            stroke="hsl(45, 20%, 85%)"
            strokeWidth="0.5"
            transform={`rotate(${angle} 50 45)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: delay + 1.4 + i * 0.05 }}
          />
        ))}
        
        {/* Center */}
        <motion.circle
          cx="50"
          cy="45"
          r="12"
          fill={centerColor}
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Center texture dots */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const radius = 6;
          const cx = 50 + Math.cos(angle) * radius;
          const cy = 45 + Math.sin(angle) * radius;
          return (
            <circle
              key={`dot-${i}`}
              cx={cx}
              cy={cy}
              r="1.5"
              fill="hsl(35, 80%, 45%)"
            />
          );
        })}
      </motion.g>
      
      {/* Gentle sway animation */}
      <motion.g
        animate={{ 
          rotate: [-2, 2, -2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '50px 140px' }}
      />
    </motion.svg>
  );
};

export default DaisyIcon;
