import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  onComplete: () => void;
}

const ErrorPage = ({ onComplete }: ErrorPageProps) => {
  const { playSound } = useSound();
  const navigate = useNavigate();

  return (
    <div className="page-container bg-[hsl(0,0%,5%)] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Home Button - Top Right */}
      <motion.button
        className="absolute top-4 right-4 px-3 py-1.5 border border-white/30 text-white/70 text-xs font-medium tracking-wider hover:bg-white/10 hover:text-white transition-colors z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => {
          playSound('buttonClick');
          navigate('/home');
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        HOME
      </motion.button>
      
      {/* Glitch lines */}
      <motion.div 
        className="absolute top-[20%] left-0 w-full h-px bg-white/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      <motion.div 
        className="absolute top-[80%] left-0 w-full h-px bg-white/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div 
        className="absolute top-0 left-[10%] w-px h-full bg-white/5"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      />
      <motion.div 
        className="absolute top-0 right-[10%] w-px h-full bg-white/5"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      />
      
      {/* Corner brackets */}
      <motion.div 
        className="absolute top-[18%] left-[8%] w-8 h-8 border-l-2 border-t-2 border-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />
      <motion.div 
        className="absolute bottom-[18%] right-[8%] w-8 h-8 border-r-2 border-b-2 border-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      />
      
      {/* Decorative arrow */}
      <motion.div
        className="absolute left-[8%] top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1">
          <path d="M5 20h30M25 10l10 10-10 10" />
        </svg>
      </motion.div>
      
      {/* Main content */}
      <motion.div
        className="text-center max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Main error text */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-heavy text-white tracking-tighter mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.04em'
          }}
        >
          SOMETHING WENT WRONG
        </motion.h1>
        
        {/* Error badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold tracking-wider">
            404 ERROR
          </span>
          <span className="text-white/50 text-sm tracking-wider">
            PAGE NOT FOUND
          </span>
        </motion.div>
      </motion.div>
      
      {/* Personal message - appears after a delay */}
      <motion.div
        className="absolute bottom-[15%] text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.p
          className="text-2xl md:text-3xl font-serif-italic text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          But wait, <span className="text-[hsl(145,50%,60%)]">Gigi</span>...
        </motion.p>
        
        <motion.p
          className="text-white/50 text-sm mt-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          I have something for you
        </motion.p>
        
        <motion.button
          className="group relative px-8 py-4 bg-white text-black font-medium tracking-wider text-sm overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5 }}
          onClick={() => {
            playSound('buttonClick');
            playSound('sparkle');
            onComplete();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">OPEN YOUR SURPRISE</span>
          <motion.div
            className="absolute inset-0 bg-[hsl(145,50%,60%)]"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-white opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            OPEN YOUR SURPRISE
          </motion.span>
        </motion.button>
      </motion.div>
      
      {/* Subtle animated corner elements */}
      <motion.div
        className="absolute bottom-8 left-8 text-white/20 text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-mono">2025.02.14</span>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
