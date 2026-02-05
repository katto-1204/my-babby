import { motion } from 'framer-motion';

interface ReplayIconProps {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

const ReplayIcon = ({ size = 24, color = 'currentColor', className = '', animate = false }: ReplayIconProps) => {
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
      animate={animate ? { rotate: 360 } : undefined}
      transition={animate ? { duration: 2, repeat: Infinity, ease: "linear" } : undefined}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </motion.svg>
  );
};

export default ReplayIcon;
