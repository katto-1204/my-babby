import { motion, Variants } from 'framer-motion';

interface CameraIconProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}

const CameraIcon = ({ size = 24, color = 'currentColor', animate = false, className = '' }: CameraIconProps) => {
  const flashVariants: Variants = {
    flash: {
      opacity: [1, 0.5, 1],
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
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      variants={flashVariants}
      animate={animate ? "flash" : undefined}
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </motion.svg>
  );
};

export default CameraIcon;
