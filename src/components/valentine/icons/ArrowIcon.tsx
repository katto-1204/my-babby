import { motion } from 'framer-motion';

interface ArrowIconProps {
  size?: number;
  color?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

const ArrowIcon = ({ size = 24, color = 'currentColor', direction = 'right', className = '' }: ArrowIconProps) => {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </motion.svg>
  );
};

export default ArrowIcon;
