import { motion, Variants } from 'framer-motion';

interface HeartIconProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

const HeartIcon = ({ size = 24, color = 'currentColor', animate = false, className = '' }: HeartIconProps) => {
  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.15, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      variants={pulseVariants}
      animate={animate ? "pulse" : undefined}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </motion.svg>
  );
};

export default HeartIcon;
