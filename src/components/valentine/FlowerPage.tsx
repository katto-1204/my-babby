import { motion } from 'framer-motion';
import TulipIcon from './icons/TulipIcon';
import DaisyIcon from './icons/DaisyIcon';
import LilyIcon from './icons/LilyIcon';
import FourLeafCloverIcon from './icons/FourLeafCloverIcon';
import FloatingHearts from './FloatingHearts';
import { useSound } from '../../hooks/useSound';

interface FlowerPageProps {
  onComplete: () => void;
}

const FlowerPage = ({ onComplete }: FlowerPageProps) => {
  const { playSound } = useSound();

  return (
    <div className="page-container gradient-romantic flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingHearts count={8} />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft gradient circles */}
        <motion.div
          className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(145, 30%, 90%) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[5%] w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(350, 40%, 90%) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>
      
      {/* Header */}
      <motion.div
        className="text-center mb-8 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-heavy text-primary mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          My Flower For You
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground font-serif-italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          These flowers bloom just for you, Gigi
        </motion.p>
      </motion.div>
      
      {/* Flowers Container */}
      <motion.div
        className="flex flex-wrap justify-center items-end gap-6 md:gap-8 lg:gap-12 mb-12 z-10 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Tulip */}
        <motion.div
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
        >
          <TulipIcon 
            size={120} 
            color="hsl(350, 60%, 65%)" 
            delay={1}
          />
          <motion.p
            className="text-lg font-serif-italic text-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            A Tulip
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground text-center max-w-[140px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7 }}
          >
            for my perfect love
          </motion.p>
        </motion.div>
        
        {/* Daisy */}
        <motion.div
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
        >
          <DaisyIcon 
            size={110} 
            delay={1.5}
          />
          <motion.p
            className="text-lg font-serif-italic text-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            A Daisy
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground text-center max-w-[140px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            for your innocent beauty
          </motion.p>
        </motion.div>
        
        {/* Lily */}
        <motion.div
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
        >
          <LilyIcon 
            size={120} 
            color="hsl(320, 70%, 75%)" 
            delay={2}
          />
          <motion.p
            className="text-lg font-serif-italic text-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
          >
            A Lily
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground text-center max-w-[140px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7 }}
          >
            for your elegance
          </motion.p>
        </motion.div>
        
        {/* Four-Leaf Clover */}
        <motion.div
          className="flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
        >
          <FourLeafCloverIcon 
            size={110} 
            color="hsl(145, 50%, 50%)" 
            delay={2.5}
          />
          <motion.p
            className="text-lg font-serif-italic text-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
          >
            A Clover
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground text-center max-w-[140px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2 }}
          >
            for our good luck together
          </motion.p>
        </motion.div>
      </motion.div>
      
      {/* Message */}
      <motion.div
        className="text-center max-w-md z-10 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5 }}
      >
        <p className="text-foreground/90 font-serif-italic text-lg leading-relaxed">
          "Like these flowers, my love for you grows stronger each day, 
          blooming more beautiful with every moment we share."
        </p>
      </motion.div>
      
      {/* Continue Button */}
      <motion.button
        className="btn-romantic flex items-center gap-2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5 }}
        onClick={() => {
          playSound('buttonClick');
          playSound('sparkle');
          onComplete();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Continue</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>
      
      {/* Floating petals */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `-5%`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(i) * 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="hsl(350, 50%, 75%)" opacity={0.6}>
            <ellipse cx="10" cy="10" rx="5" ry="8" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default FlowerPage;
