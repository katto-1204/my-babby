import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import FloatingHearts from './FloatingHearts';
import HeartIcon from './icons/HeartIcon';
import { useSound } from '../../hooks/useSound';

interface QuestionPageProps {
  onComplete: () => void;
}

const QuestionPage = ({ onComplete }: QuestionPageProps) => {
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [noClickCount, setNoClickCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanicking, setIsPanicking] = useState(false);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const { playSound } = useSound();

  // Panic effects
  const panicLevel = Math.min(noClickCount, 10);
  const backgroundColor = isPanicking 
    ? `hsl(${340 - panicLevel * 10}, ${30 + panicLevel * 5}%, ${25 - panicLevel * 1.5}%)`
    : 'hsl(200, 25%, 15%)';
  
  useEffect(() => {
    if (noClickCount >= 3) {
      setIsPanicking(true);
    }
    // Grow yes button as they click no
    setYesButtonScale(1 + noClickCount * 0.1);
  }, [noClickCount]);

  const handleYes = () => {
    playSound('success');
    playSound('heartbeat');
    setShowConfetti(true);
    setAnswered(true);
    setIsPanicking(false);
    
    setTimeout(() => {
      onComplete();
    }, 4000);
  };

  const handleNo = () => {
    playSound('buttonClick');
    setNoClickCount(prev => prev + 1);
    
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const maxX = container.width - 120;
      const maxY = container.height / 2;
      
      // Random position that runs away
      const newX = Math.random() * maxX - maxX / 2;
      const newY = Math.random() * maxY - maxY / 2;
      
      setNoButtonPosition({ x: newX, y: newY });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="page-container flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-500"
      style={{
        background: isPanicking 
          ? `linear-gradient(180deg, ${backgroundColor} 0%, hsl(${350 - panicLevel * 5}, ${40 + panicLevel * 3}%, ${20 - panicLevel}%) 100%)`
          : 'linear-gradient(180deg, hsl(200, 25%, 15%) 0%, hsl(340, 30%, 25%) 100%)',
      }}
    >
      <Confetti isActive={showConfetti} />
      <FloatingHearts count={15} />
      
      {/* Panic screen shake */}
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center"
        animate={isPanicking ? {
          x: [0, -5, 5, -5, 5, 0],
          rotate: [0, -0.5, 0.5, -0.5, 0.5, 0],
        } : {}}
        transition={{ duration: 0.3, repeat: isPanicking ? Infinity : 0, repeatDelay: 0.5 }}
      >
        {!answered ? (
          <>
            {/* Question */}
            <motion.div
              className="text-center max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.p
                className="text-white/80 text-xl mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                So, Gigi, I have one last question.
              </motion.p>
              
              <motion.h2
                className="text-3xl md:text-5xl font-serif-italic text-white mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: isPanicking ? [1, 1.02, 1] : 1,
                  color: isPanicking ? ['#fff', '#ffd1dc', '#fff'] : '#fff'
                }}
                transition={isPanicking ? { 
                  duration: 0.5, 
                  repeat: Infinity 
                } : { delay: 1.5, duration: 0.8 }}
              >
                Will you be my Valentine?
              </motion.h2>
              
              {/* Panic messages */}
              <AnimatePresence>
                {noClickCount >= 3 && (
                  <motion.p
                    className="text-white/60 text-sm mb-4 font-serif-italic"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {noClickCount >= 8 ? "THE PAGE IS HAVING A BREAKDOWN!" :
                     noClickCount >= 6 ? "Please... just say yes..." :
                     noClickCount >= 4 ? "Why are you running from love?!" :
                     "Wait, where are you going?!"}
                  </motion.p>
                )}
              </AnimatePresence>
              
              {/* Answer buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
              >
                {/* YES Button - grows bigger */}
                <motion.button
                  className="px-10 py-4 rounded-full font-medium text-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg relative z-10"
                  onClick={handleYes}
                  animate={{ scale: yesButtonScale }}
                  whileHover={{ scale: yesButtonScale * 1.1 }}
                  whileTap={{ scale: yesButtonScale * 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="flex items-center gap-2">
                    Yes
                    <HeartIcon size={18} color="white" />
                  </span>
                </motion.button>
                
                {/* NO Button - runs away */}
                <motion.button
                  className="px-10 py-4 rounded-full font-medium text-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 transition-all"
                  onClick={handleNo}
                  animate={{ 
                    x: noButtonPosition.x,
                    y: noButtonPosition.y,
                    scale: Math.max(0.5, 1 - noClickCount * 0.08),
                    opacity: Math.max(0.3, 1 - noClickCount * 0.08),
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  whileHover={{ scale: Math.max(0.4, 0.9 - noClickCount * 0.08) }}
                >
                  No
                </motion.button>
              </motion.div>
              
              {/* Panic effects - flying elements */}
              {isPanicking && (
                <>
                  {[...Array(Math.min(noClickCount * 2, 12))].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute pointer-events-none"
                      initial={{ 
                        x: 0, 
                        y: 0,
                        opacity: 0 
                      }}
                      animate={{ 
                        x: (Math.random() - 0.5) * 400,
                        y: (Math.random() - 0.5) * 300,
                        opacity: [0, 0.7, 0],
                        rotate: Math.random() * 360,
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <HeartIcon 
                        size={16 + Math.random() * 16} 
                        color={`hsl(${350 - i * 10}, 60%, 65%)`} 
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </>
        ) : (
          /* Thank you message */
          <motion.div
            className="text-center max-w-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex justify-center mb-8"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 1, repeat: 2 }}
            >
              <HeartIcon size={80} color="hsl(145, 45%, 55%)" animate />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif-italic text-white mb-6">
              Thank you, Gigi.
            </h2>
            
            <p className="text-xl text-white/80">
              You've just made me the happiest person today.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuestionPage;
