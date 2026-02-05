import { motion, Variants } from 'framer-motion';

interface SparkleIconProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

const SparkleIcon = ({ size = 24, color = 'currentColor', animate = false, className = '' }: SparkleIconProps) => {
  const sparkleVariants: Variants = {
    sparkle: {
      scale: [1, 1.2, 1],
      rotate: [0, 15, -15, 0],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
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
      variants={sparkleVariants}
      animate={animate ? "sparkle" : undefined}
    >
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </motion.svg>
  );
};

export default SparkleIcon;
