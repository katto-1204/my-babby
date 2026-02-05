import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import ParticleSystem from '@/components/valentine/ParticleSystem';
import { useSound } from '@/hooks/useSound';

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState(() => {
    const saved = localStorage.getItem('countdownTarget');
    return saved || '';
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);
  const [dailyMessage, setDailyMessage] = useState('');
  const { playSound } = useSound();

  const dailyMessages = [
    "Every moment brings us closer together",
    "Our love grows stronger with each passing day",
    "I'm counting down to see you again",
    "Distance means nothing when someone means everything",
    "You're worth the wait, always",
    "Time flies when I'm thinking of you",
    "Each day is one step closer to forever",
  ];

  useEffect(() => {
    if (targetDate) {
      localStorage.setItem('countdownTarget', targetDate);
      setIsActive(true);
    }
  }, [targetDate]);

  useEffect(() => {
    if (!isActive || !targetDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });

        // Set daily message based on days left
        const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
        setDailyMessage(dailyMessages[daysLeft % dailyMessages.length]);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        playSound('success');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, targetDate, playSound]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      className="flex flex-col items-center"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-elevated mb-2 min-w-[100px] md:min-w-[120px]"
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="text-4xl md:text-5xl font-heavy text-primary">{value}</div>
      </motion.div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen gradient-romantic relative flex items-center justify-center">
      <FloatingHearts count={15} />
      <ParticleSystem isActive={isActive && timeLeft.days === 0} count={50} type="mixed" />
      
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-heavy text-primary mb-4">
            Countdown to Our Special Day
          </h1>
          <p className="text-muted-foreground font-serif-italic text-lg mb-12">
            {dailyMessage || 'Set a date to start counting down'}
          </p>
        </motion.div>

        {!isActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-elevated max-w-md mx-auto"
          >
            <label className="block text-left mb-4">
              <span className="text-foreground font-medium mb-2 block">Select Target Date</span>
              <input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  playSound('buttonClick');
                }}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
              />
            </label>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </motion.div>

            <motion.button
              onClick={() => {
                setIsActive(false);
                setTargetDate('');
                localStorage.removeItem('countdownTarget');
                playSound('buttonClick');
              }}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-lg text-primary font-medium hover:bg-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Countdown
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
