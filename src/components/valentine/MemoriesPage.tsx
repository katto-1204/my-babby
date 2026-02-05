import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import FloatingHearts from './FloatingHearts';
import CameraIcon from './icons/CameraIcon';
import FlowerIcon from './icons/FlowerIcon';
import SparkleIcon from './icons/SparkleIcon';
import { useSound } from '../../hooks/useSound';

interface MemoriesPageProps {
  onComplete: () => void;
}

const memories = [
  {
    id: 1,
    caption: "Do you remember this day?",
    description: "Every moment with you becomes a cherished memory.",
  },
  {
    id: 2,
    caption: "Moments like these make everything worth it.",
    description: "The little things we share mean the world to me.",
  },
  {
    id: 3,
    caption: "Each smile reminds me why I'm here.",
    description: "Your happiness is my greatest joy.",
  },
];

const iconComponents = [CameraIcon, FlowerIcon, SparkleIcon];

const MemoryCard = ({ memory, index }: { memory: typeof memories[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const IconComponent = iconComponents[index];

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 py-16`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Image placeholder */}
      <div className="w-full md:w-1/2">
        <motion.div
          className="aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated bg-gradient-to-br from-secondary to-muted flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center p-8">
            <motion.div
              className="flex justify-center mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            >
              <IconComponent 
                size={64} 
                color="hsl(145, 35%, 55%)" 
                animate 
              />
            </motion.div>
            <p className="text-muted-foreground text-sm">
              Add your photo here
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              memory{index + 1}.jpg
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Caption */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <motion.h2
          className="text-2xl md:text-3xl font-serif-italic text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {memory.caption}
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {memory.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const MemoriesPage = ({ onComplete }: MemoriesPageProps) => {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={10} />
      
      {/* Header */}
      <motion.div
        className="text-center pt-20 pb-8 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
          Our Memories
        </h1>
        <p className="text-muted-foreground">Scroll down to relive our moments together</p>
      </motion.div>
      
      {/* Memories */}
      <div className="container max-w-5xl mx-auto px-6">
        {memories.map((memory, index) => (
          <MemoryCard key={memory.id} memory={memory} index={index} />
        ))}
      </div>
      
      {/* Continue Button */}
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p className="text-muted-foreground mb-6 font-serif-italic text-lg">
          I have something special for you...
        </p>
        <motion.button
          className="btn-romantic flex items-center gap-2 mx-auto"
          onClick={() => {
            playSound('buttonClick');
            playSound('sparkle');
            onComplete();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Continue to my flowers</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MemoriesPage;
