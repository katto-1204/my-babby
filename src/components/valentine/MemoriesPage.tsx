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
    image: "/gigi/1.png",
    caption: "u in scrubs!",
    description: "imagine, kakasurgery mo lang and amoy kambing kana, you look so stunning dajasfjfajfsa damn baby",
  },
  {
    id: 2,
    image: "/gigi/2.png",
    caption: "The Chokehold Dress",
    description: "i love this leopard print dress u have - u have no idea how this pic has me in chokehold (as in)",
  },
  {
    id: 3,
    image: "/gigi/3.png",
    caption: "My RC Girlie",
    description: "kakagaling mo lang sa meeting ng rc and pagod ka pa neto, sobrang ganda mo talaga bawat anggulo.",
  },
  {
    id: 4,
    image: "/gigi/4.png",
    caption: "That Look...",
    description: "u r so pretty esp when u look at me like that ashfhafssf i love u",
  },
  {
    id: 5,
    image: "/gigi/5.png",
    caption: "Babby",
    description: "uyyy babby lang man yan siya uy :(((",
  },
];

const MemoryCard = ({ memory, index }: { memory: typeof memories[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 py-24`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Image Wrap */}
      <div className="w-full md:w-3/5">
        <motion.div
          className="aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white group relative"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={memory.image}
            alt={memory.caption}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>

      {/* Text Wrap */}
      <div className="w-full md:w-2/5 text-center md:text-left space-y-4">
        <motion.h2
          className="text-4xl md:text-5xl font-serif-italic text-primary"
          initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {memory.caption}
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-xl leading-relaxed font-light"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
        >
          "{memory.description}"
        </motion.p>
      </div>
    </motion.div>
  );
};

const MemoriesPage = ({ onComplete }: MemoriesPageProps) => {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen gradient-romantic relative overflow-x-hidden">
      <FloatingHearts count={15} />

      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center pt-32 pb-16 px-6 space-y-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-heavy text-primary tracking-tight">
            Our Memories
          </h1>
          <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full" />
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground font-serif-italic leading-relaxed px-4">
          "you look beautiful even it times na pagod ka and usually pag nag facetime tayo,
          i kept on complimenting u because ur pretty as hell... <br />
          i always take pics of you every and they are stolen pics but after viewing it,
          you look so good baby :( <br />
          for now here are my top pics!"
        </p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pt-12 text-primary/30"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] mb-2">Relive our moments</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Memories Container */}
      <div className="container max-w-6xl mx-auto px-6 pb-40">
        {memories.map((memory, index) => (
          <MemoryCard key={memory.id} memory={memory} index={index} />
        ))}
      </div>

      {/* Bottom Action */}
      <motion.div
        className="text-center py-32 bg-white/30 backdrop-blur-sm border-t border-white/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="space-y-6 max-w-2xl mx-auto px-6">
          <p className="text-2xl md:text-3xl text-foreground font-serif-italic">
            Every moment with you is a gift...
          </p>
          <p className="text-muted-foreground mb-10">
            But I have something even more special for you.
          </p>
          <motion.button
            className="btn-romantic flex items-center gap-3 mx-auto px-10 py-5 text-xl shadow-romantic-lg"
            onClick={() => {
              playSound('buttonClick');
              playSound('sparkle');
              onComplete();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Continue to my flowers</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MemoriesPage;
