import { motion } from 'framer-motion';

interface LilyIconProps {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
}

const LilyIcon = ({ size = 120, color = 'hsl(320, 70%, 75%)', className = '', delay = 0 }: LilyIconProps) => {
  return (
    <motion.svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 80 128"
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
    >
      {/* Stem */}
      <motion.path
        d="M40 128 Q38 100 40 70"
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
        d="M40 100 Q20 90 15 70 Q30 80 40 85"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.8 }}
        style={{ transformOrigin: '40px 90px' }}
      />
      
      <motion.path
        d="M40 85 Q60 75 65 55 Q50 65 40 75"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 1 }}
        style={{ transformOrigin: '40px 80px' }}
      />
      
      {/* Lily flower */}
      <motion.g
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1, delay: delay + 1.2, type: "spring", stiffness: 100 }}
        style={{ transformOrigin: '40px 40px' }}
      >
        {/* Back petals (larger, behind) */}
        <motion.path
          d="M40 10 Q50 5 55 20 Q50 30 40 35 Q30 30 25 20 Q30 5 40 10"
          fill={color}
          opacity={0.7}
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Left petal */}
        <motion.path
          d="M20 25 Q10 20 8 35 Q12 45 20 50 Q25 40 20 25"
          fill={color}
          opacity={0.9}
          animate={{ 
            scale: [1, 1.03, 1],
            rotate: [-2, 0, -2],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Right petal */}
        <motion.path
          d="M60 25 Q70 20 72 35 Q68 45 60 50 Q55 40 60 25"
          fill={color}
          opacity={0.9}
          animate={{ 
            scale: [1, 1.03, 1],
            rotate: [2, 0, 2],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        
        {/* Front petals (smaller, in front) */}
        <motion.path
          d="M40 20 Q45 18 48 28 Q45 35 40 40 Q35 35 32 28 Q35 18 40 20"
          fill={color}
          opacity={0.95}
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Center stamen */}
        <motion.g>
          {/* Anthers */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * 60) * Math.PI / 180;
            const radius = 8;
            const cx = 40 + Math.cos(angle) * radius;
            const cy = 30 + Math.sin(angle) * radius;
            return (
              <motion.circle
                key={`anther-${i}`}
                cx={cx}
                cy={cy}
                r="2.5"
                fill="hsl(45, 90%, 60%)"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            );
          })}
          
          {/* Center pistil */}
          <motion.circle
            cx="40"
            cy="30"
            r="3"
            fill="hsl(320, 60%, 65%)"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.g>
        
        {/* Petal details - veins */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * 60) * Math.PI / 180;
          return (
            <motion.line
              key={`vein-${i}`}
              x1="40"
              y1="30"
              x2={40 + Math.cos(angle) * 20}
              y2={30 + Math.sin(angle) * 20}
              stroke="hsl(320, 50%, 70%)"
              strokeWidth="0.5"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: delay + 1.5 + i * 0.1 }}
            />
          );
        })}
      </motion.g>
      
      {/* Gentle sway */}
      <motion.g
        animate={{ 
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '40px 128px' }}
      />
    </motion.svg>
  );
};

export default LilyIcon;
