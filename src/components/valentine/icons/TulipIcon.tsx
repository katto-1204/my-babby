import { motion } from 'framer-motion';

interface TulipIconProps {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
}

const TulipIcon = ({ size = 120, color = 'hsl(350, 60%, 65%)', className = '', delay = 0 }: TulipIconProps) => {
  return (
    <motion.svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 80 120"
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
    >
      {/* Stem */}
      <motion.path
        d="M40 120 Q38 90 40 65"
        stroke="hsl(145, 40%, 45%)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: delay + 0.3 }}
      />
      
      {/* Left leaf */}
      <motion.path
        d="M40 95 Q25 85 20 70 Q35 78 40 85"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.8 }}
        style={{ transformOrigin: '40px 90px' }}
      />
      
      {/* Right leaf */}
      <motion.path
        d="M40 85 Q55 75 60 60 Q45 68 40 78"
        fill="hsl(145, 45%, 50%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 1 }}
        style={{ transformOrigin: '40px 80px' }}
      />
      
      {/* Tulip petals */}
      <motion.g
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1, delay: delay + 1.2, type: "spring", stiffness: 100 }}
        style={{ transformOrigin: '40px 50px' }}
      >
        {/* Center petal */}
        <motion.path
          d="M40 10 Q55 25 50 50 Q40 45 40 45 Q40 45 30 50 Q25 25 40 10"
          fill={color}
          animate={{ 
            d: [
              "M40 10 Q55 25 50 50 Q40 45 40 45 Q40 45 30 50 Q25 25 40 10",
              "M40 8 Q57 23 52 52 Q40 46 40 46 Q40 46 28 52 Q23 23 40 8",
              "M40 10 Q55 25 50 50 Q40 45 40 45 Q40 45 30 50 Q25 25 40 10"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Left petal */}
        <motion.path
          d="M25 20 Q15 35 25 55 Q35 50 40 45 Q30 30 25 20"
          fill={color}
          opacity={0.9}
          animate={{ 
            d: [
              "M25 20 Q15 35 25 55 Q35 50 40 45 Q30 30 25 20",
              "M23 18 Q12 33 23 57 Q34 51 40 46 Q29 29 23 18",
              "M25 20 Q15 35 25 55 Q35 50 40 45 Q30 30 25 20"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Right petal */}
        <motion.path
          d="M55 20 Q65 35 55 55 Q45 50 40 45 Q50 30 55 20"
          fill={color}
          opacity={0.9}
          animate={{ 
            d: [
              "M55 20 Q65 35 55 55 Q45 50 40 45 Q50 30 55 20",
              "M57 18 Q68 33 57 57 Q46 51 40 46 Q51 29 57 18",
              "M55 20 Q65 35 55 55 Q45 50 40 45 Q50 30 55 20"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </motion.g>
    </motion.svg>
  );
};

export default TulipIcon;
