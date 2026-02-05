import { motion } from 'framer-motion';

interface FourLeafCloverIconProps {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
}

const FourLeafCloverIcon = ({ 
  size = 120, 
  color = 'hsl(145, 50%, 50%)', 
  className = '', 
  delay = 0 
}: FourLeafCloverIconProps) => {
  // Heart shape for each leaf
  const heartPath = (cx: number, cy: number, scale: number = 1) => {
    const s = scale;
    return `M${cx} ${cy} 
            C${cx} ${cy - 8 * s}, ${cx - 6 * s} ${cy - 12 * s}, ${cx - 10 * s} ${cy - 8 * s}
            C${cx - 12 * s} ${cy - 4 * s}, ${cx - 8 * s} ${cy}, ${cx} ${cy + 6 * s}
            C${cx + 8 * s} ${cy}, ${cx + 12 * s} ${cy - 4 * s}, ${cx + 10 * s} ${cy - 8 * s}
            C${cx + 6 * s} ${cy - 12 * s}, ${cx} ${cy - 8 * s}, ${cx} ${cy}z`;
  };

  return (
    <motion.svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      className={className}
      initial={{ opacity: 0, y: 50, rotate: -180 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.2, delay, type: "spring", stiffness: 80 }}
    >
      {/* Stem */}
      <motion.path
        d="M50 130 Q48 100 50 70"
        stroke="hsl(145, 40%, 45%)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: delay + 0.3 }}
      />
      
      {/* Small leaf on stem */}
      <motion.path
        d="M50 100 Q35 95 30 80 Q40 88 50 95"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.8 }}
        style={{ transformOrigin: '50px 95px' }}
      />
      
      {/* Four-leaf clover */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: delay + 1.2, type: "spring", stiffness: 100 }}
        style={{ transformOrigin: '50px 50px' }}
      >
        {/* Top leaf */}
        <motion.path
          d={heartPath(50, 35, 1)}
          fill={color}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: delay + 1.3 }}
          style={{ transformOrigin: '50px 35px' }}
        />
        
        {/* Right leaf */}
        <motion.path
          d={heartPath(65, 50, 1)}
          fill={color}
          transform="rotate(90 65 50)"
          initial={{ scale: 0, rotate: 90 }}
          animate={{ scale: 1, rotate: 90 }}
          transition={{ duration: 0.6, delay: delay + 1.4 }}
          style={{ transformOrigin: '65px 50px' }}
        />
        
        {/* Bottom leaf */}
        <motion.path
          d={heartPath(50, 65, 1)}
          fill={color}
          transform="rotate(180 50 65)"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 180 }}
          transition={{ duration: 0.6, delay: delay + 1.5 }}
          style={{ transformOrigin: '50px 65px' }}
        />
        
        {/* Left leaf */}
        <motion.path
          d={heartPath(35, 50, 1)}
          fill={color}
          transform="rotate(-90 35 50)"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: -90 }}
          transition={{ duration: 0.6, delay: delay + 1.6 }}
          style={{ transformOrigin: '35px 50px' }}
        />
        
        {/* Center circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="hsl(145, 60%, 40%)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 1.8 }}
        />
        
        {/* Lucky sparkles */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i * 90) * Math.PI / 180;
          const radius = 25;
          const cx = 50 + Math.cos(angle) * radius;
          const cy = 50 + Math.sin(angle) * radius;
          return (
            <motion.g
              key={`sparkle-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: delay + 2 + i * 0.3,
              }}
            >
              <svg
                x={cx - 6}
                y={cy - 6}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="hsl(45, 80%, 60%)"
              >
                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
              </svg>
            </motion.g>
          );
        })}
      </motion.g>
      
      {/* Gentle rotation animation */}
      <motion.g
        animate={{ 
          rotate: [-3, 3, -3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '50px 130px' }}
      />
    </motion.svg>
  );
};

export default FourLeafCloverIcon;
