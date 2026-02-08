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
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 mb-12 z-10 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Tulip */}
        <motion.div
          className="flex flex-col items-center text-center max-w-xs"
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
            Tulip
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7 }}
          >
            Your most favorite flower. Although u have lots of favorites, somehow it's Gigi's trademark. Tulips always remind me of your warmth. Just like how the sun radiates in your eyes, ahahaha, you look so beautiful. Being with you feels like coming home, always.
          </motion.p>
        </motion.div>
        
        {/* Daisy */}
        <motion.div
          className="flex flex-col items-center text-center max-w-xs"
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
            Daisy
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            It's my favorite flower and I always get them from you. I actually don't have a particular favorite in mind, but ever since we talked, all I could ever think of is daisy. Also, we did say we'll always try for each other. As for me, I'll be welcoming new beginnings of me to do better. That's why I love daisies, as they also mean new beginnings. Every daisy from you reminds me of your thoughtfulness. They make me feel loved in a way that words cannot fully capture.
          </motion.p>
        </motion.div>
        
        {/* Lily */}
        <motion.div
          className="flex flex-col items-center text-center max-w-xs"
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
            Lily
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7 }}
          >
            This is your new favorite. I kept giving em to you, as they are as pretty as u :3 This is a Gigi flower and, aside from tulips, u r the only one in mind that comes across. Lilies feel delicate yet strong, just like you. I love how they reflect your beauty and I just cant explain u look so UGHHHH ESPECIALLY IF MAG FT TAYO! I love lilies din kasi pang bading yan na flower ehahahah anws. Every time I see them, I think of how lucky I am to have you in my life.
          </motion.p>
        </motion.div>
        
        {/* Four-Leaf Clover */}
        <motion.div
          className="flex flex-col items-center text-center max-w-xs"
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
            4-Leaf Clover
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2 }}
          >
            4 is our number, baby, and you are the lucky charm of my life. With your good soul and energy, it gives me hope and luck to do better each day. Finding you feels like finding a rare treasure. You make everything brighter just by being in my life. I feel protected and inspired whenever I'm with you. Having you is the kind of luck that I never thought was real.
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
          Like these flowers, my love for you grows stronger each day, blooming more beautiful with every moment we share.
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
