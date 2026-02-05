import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

const features = [
  {
    id: 'photo-gallery',
    title: 'Photo Gallery',
    description: 'Upload and relive beautiful memories together',
    icon: '📸',
    path: '/photo-gallery',
    gradient: 'from-blue-500 via-blue-400 to-cyan-500',
  },
  {
    id: 'countdown',
    title: 'Countdown Timer',
    description: 'Count down to your special moments',
    icon: '⏰',
    path: '/countdown',
    gradient: 'from-purple-500 via-purple-400 to-pink-500',
  },
  {
    id: 'love-letter',
    title: 'Love Letter Builder',
    description: 'Write your heart out with beautiful letters',
    icon: '💌',
    path: '/love-letter',
    gradient: 'from-pink-500 via-rose-400 to-red-500',
  },
  {
    id: 'music',
    title: 'Music Playlist',
    description: 'Create your romantic playlist together',
    icon: '🎵',
    path: '/music',
    gradient: 'from-green-500 via-emerald-400 to-teal-500',
  },
  {
    id: 'date-planner',
    title: 'Date Planner',
    description: 'Plan your perfect dates together',
    icon: '📅',
    path: '/date-planner',
    gradient: 'from-orange-500 via-amber-400 to-yellow-500',
  },
  {
    id: 'love-language',
    title: 'Love Language Quiz',
    description: 'Discover how you give and receive love',
    icon: '💝',
    path: '/love-language',
    gradient: 'from-red-500 via-pink-400 to-rose-500',
  },
  {
    id: 'scrapbook',
    title: 'Scrapbook Creator',
    description: 'Create beautiful digital scrapbooks',
    icon: '📖',
    path: '/scrapbook',
    gradient: 'from-yellow-500 via-amber-400 to-orange-500',
  },
  {
    id: 'voice',
    title: 'Voice Recorder',
    description: 'Record and share voice messages',
    icon: '🎤',
    path: '/voice',
    gradient: 'from-indigo-500 via-purple-400 to-pink-500',
  },
  {
    id: 'flower-3d',
    title: '3D Flower Viewer',
    description: 'Explore beautiful flowers in 3D',
    icon: '🌺',
    path: '/flower-3d',
    gradient: 'from-rose-500 via-pink-400 to-fuchsia-500',
  },
  {
    id: 'decoder',
    title: 'Secret Decoder',
    description: 'Decode hidden messages and unlock rewards',
    icon: '🔐',
    path: '/decoder',
    gradient: 'from-teal-500 via-cyan-400 to-blue-500',
  },
  {
    id: 'flashcards',
    title: 'Flashcard Generator',
    description: 'Upload lessons and create flashcards automatically',
    icon: '📚',
    path: '/flashcards',
    gradient: 'from-violet-500 via-purple-400 to-indigo-500',
  },
  {
    id: 'photobooth',
    title: 'Photobooth',
    description: 'Capture beautiful moments with fun filters',
    icon: '📷',
    path: '/photobooth',
    gradient: 'from-cyan-500 via-blue-400 to-indigo-500',
  },
  {
    id: 'f1-racing',
    title: 'F1 Racing',
    description: 'Race with different F1 cars',
    icon: '🏎️',
    path: '/f1-racing',
    gradient: 'from-red-500 via-orange-400 to-yellow-500',
  },
];

const Home = () => {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen gradient-romantic relative overflow-hidden">
      <FloatingHearts count={25} />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-heavy text-primary mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          >
            Welcome, Gigi
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-muted-foreground font-serif-italic mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Explore all the features I've created for you
          </motion.p>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100 }}
            >
              <Link
                to={feature.path}
                onClick={() => playSound('buttonClick')}
                className="block h-full group"
              >
                <motion.div
                  className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 shadow-elevated h-full text-white relative overflow-hidden transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -8, rotate: 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-4 relative z-10"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
                    <p className="text-white/90 text-sm leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            to="/"
            onClick={() => playSound('sparkle')}
            className="inline-block px-10 py-5 btn-romantic text-xl font-medium shadow-elevated"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Valentine's Journey
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
