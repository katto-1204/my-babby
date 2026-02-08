import { motion } from 'framer-motion';
import FloatingHearts from './FloatingHearts';
import HeartIcon from './icons/HeartIcon';
import ReplayIcon from './icons/ReplayIcon';
import SparkleIcon from './icons/SparkleIcon';
import { useSound } from '../../hooks/useSound';

interface ClosingPageProps {
  onReplay: () => void;
}

const ClosingPage = ({ onReplay }: ClosingPageProps) => {
  const { playSound } = useSound();

  return (
    <div className="page-container gradient-romantic flex flex-col items-center justify-center px-4">
      <FloatingHearts count={20} />

      {/* Main content */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Hearts animation */}
        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            >
              <HeartIcon
                size={40}
                color="hsl(145, 40%, 55%)"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Signature */}
        <motion.h2
          className="text-2xl md:text-3xl font-serif-italic text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          With love,
        </motion.h2>

        <motion.h1
          className="text-5xl md:text-7xl font-heavy text-primary mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          katto
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        />

        {/* Final romantic message */}
        <motion.p
          className="text-muted-foreground font-serif-italic text-lg max-w-md mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
        >
          "u r just a babby. i hope u loved it :3."
        </motion.p>

        {/* Sparkles decoration */}
        <motion.div
          className="flex justify-center gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <SparkleIcon size={24} color="hsl(145, 35%, 60%)" />
          </motion.div>
          <motion.div
            animate={{ rotate: [360, 180, 0], scale: [1.2, 1, 1.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <SparkleIcon size={32} color="hsl(350, 50%, 70%)" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 180, 360], scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <SparkleIcon size={20} color="hsl(45, 70%, 60%)" />
          </motion.div>
        </motion.div>

        {/* Replay button */}
        <motion.button
          className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-3 mx-auto group cursor-pointer"
          onClick={() => {
            playSound('buttonClick');
            playSound('sparkle');
            onReplay();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          whileHover={{ scale: 1.05 }}
        >
          <ReplayIcon size={20} color="currentColor" animate />
          <span className="font-serif-italic">Replay from the beginning</span>
        </motion.button>
      </motion.div>

      {/* Footer hearts drifting up */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <motion.div
          className="absolute bottom-10 left-1/4"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <HeartIcon size={24} color="hsl(145, 35%, 55%)" className="opacity-40" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/2"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <HeartIcon size={20} color="hsl(145, 35%, 55%)" className="opacity-30" />
        </motion.div>
        <motion.div
          className="absolute bottom-5 right-1/4"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
        >
          <HeartIcon size={28} color="hsl(145, 35%, 55%)" className="opacity-35" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClosingPage;
