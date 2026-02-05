import { motion, Variants } from 'framer-motion';

interface FlowerIconProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

const FlowerIcon = ({ size = 24, color = 'currentColor', animate = false, className = '' }: FlowerIconProps) => {
  const bloomVariants: Variants = {
    bloom: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
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
      variants={bloomVariants}
      animate={animate ? "bloom" : undefined}
    >
      <circle cx="12" cy="12" r="3" fill="hsl(45, 90%, 60%)" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="6"
          rx="3"
          ry="5"
          fill={color}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </motion.svg>
  );
};

export default FlowerIcon;
