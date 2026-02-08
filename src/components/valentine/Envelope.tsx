import { motion } from 'framer-motion';
import { useSound } from '../../hooks/useSound';
import { useEffect } from 'react';

interface EnvelopeProps {
  isOpen: boolean;
  isPaperOut: boolean;
  onClick: () => void;
}

const Envelope = ({ isOpen, isPaperOut, onClick }: EnvelopeProps) => {
  const { playSound } = useSound();

  useEffect(() => {
    if (isOpen && !isPaperOut) {
      playSound('envelopeOpen');
    }
  }, [isOpen, isPaperOut, playSound]);

  useEffect(() => {
    if (isPaperOut) {
      playSound('paperSlide');
    }
  }, [isPaperOut, playSound]);

  const handleClick = () => {
    if (!isOpen) {
      playSound('sealBreak');
    }
    onClick();
  };

  return (
    <motion.div
      className="relative cursor-pointer envelope-btn"
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={{
        y: isOpen ? [0, -8, 0] : 0,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Envelope body with realistic 3D effect */}
      <svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        className="drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))', overflow: 'visible' }}
      >

        <defs>
          {/* Clip path for flap */}
          <clipPath id="flapClip">
            <path d="M20 80 L200 170 L380 80 L380 88 Q380 80 370 80 L30 80 Q20 80 20 88Z" />
          </clipPath>


          {/* Realistic envelope gradient with depth */}
          <linearGradient id="envelopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(150, 35%, 94%)" />
            <stop offset="50%" stopColor="hsl(145, 30%, 90%)" />
            <stop offset="100%" stopColor="hsl(140, 28%, 88%)" />
          </linearGradient>

          {/* Highlight gradient for 3D effect */}
          <linearGradient id="envelopeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsla(150, 40%, 98%, 0.6)" />
            <stop offset="50%" stopColor="hsla(150, 35%, 95%, 0.3)" />
            <stop offset="100%" stopColor="hsla(145, 30%, 92%, 0.1)" />
          </linearGradient>

          {/* Shadow gradient for depth */}
          <linearGradient id="envelopeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsla(145, 30%, 85%, 0.4)" />
            <stop offset="100%" stopColor="hsla(145, 25%, 75%, 0.6)" />
          </linearGradient>

          {/* Paper texture gradient */}
          <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(45, 25%, 98%)" />
            <stop offset="50%" stopColor="hsl(40, 20%, 96%)" />
            <stop offset="100%" stopColor="hsl(35, 18%, 94%)" />
          </linearGradient>

          {/* Flap gradient */}
          <linearGradient id="flapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(150, 32%, 93%)" />
            <stop offset="100%" stopColor="hsl(145, 28%, 89%)" />
          </linearGradient>

          {/* Inner shadow filter */}
          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feOffset in="blur" dx="0" dy="3" result="offsetBlur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Back of envelope - main body */}
        <g filter="url(#dropShadow)">
          <rect
            x="20"
            y="80"
            width="360"
            height="200"
            rx="10"
            fill="url(#envelopeGradient)"
            stroke="hsl(145, 25%, 80%)"
            strokeWidth="2.5"
          />

          {/* Depth shadow on back */}
          <rect
            x="20"
            y="80"
            width="360"
            height="200"
            rx="10"
            fill="url(#envelopeShadow)"
            opacity="0.5"
          />

          {/* Highlight on back */}
          <rect
            x="20"
            y="80"
            width="360"
            height="60"
            rx="10"
            fill="url(#envelopeHighlight)"
          />
        </g>

        {/* Paper inside with realistic texture - LAYERED BETWEEN BACK AND FRONT */}
        <motion.g
          animate={{
            y: isPaperOut ? -160 : 0,
            opacity: isPaperOut ? 1 : isOpen ? 0.95 : 0.75,
            scale: isPaperOut ? 1.05 : isOpen ? 1.02 : 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.6 }
          }}
          style={{ transformOrigin: "200px 180px" }}
        >
          {/* Paper shadow */}
          <rect
            x="50"
            y="105"
            width="300"
            height="180"
            rx="6"
            fill="hsla(0, 0%, 0%, 0.1)"
            transform="translate(4, 4)"
          />

          {/* Paper */}
          <rect
            x="50"
            y="100"
            width="300"
            height="180"
            rx="6"
            fill="url(#paperGradient)"
            stroke="hsl(35, 15%, 88%)"
            strokeWidth="2"
            filter="url(#innerShadow)"
          />

          {/* Paper texture lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="70"
              y1={130 + i * 25}
              x2="330"
              y2={130 + i * 25}
              stroke="hsl(35, 12%, 85%)"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}

          {/* Decorative heart on paper */}
          <motion.g
            animate={{
              scale: isPaperOut ? [1, 1.2, 1.1] : 1,
            }}
            transition={{ duration: 1.2, repeat: isPaperOut ? Infinity : 0, repeatDelay: 0.8 }}
          >
            <path
              d="M200 140 l-3-2.5c-6-5.5-10-9-10-13.5 0-3.5 3-6.5 6.5-6.5 2 0 4 1 5.5 2.5 1.5-1.5 3.5-2.5 5.5-2.5 3.5 0 6.5 3 6.5 6.5 0 4.5-4 8-10 13.5L200 140z"
              fill="hsl(145, 45%, 60%)"
              opacity="0.9"
            />
            {/* Heart highlight */}
            <path
              d="M200 140 l-3-2.5c-6-5.5-10-9-10-13.5 0-3.5 3-6.5 6.5-6.5 2 0 4 1 5.5 2.5 1.5-1.5 3.5-2.5 5.5-2.5 3.5 0 6.5 3 6.5 6.5 0 4.5-4 8-10 13.5L200 140z"
              fill="url(#envelopeHighlight)"
              opacity="0.3"
            />
          </motion.g>
        </motion.g>

        {/* Front of envelope (bottom part) with 3D effect - RESTRUCTURED TO HINGE AT Y=80 */}
        <g>
          <path
            d="M20 80 L20 280 Q20 290 30 290 L370 290 Q380 290 380 280 L380 80 L200 180 Z"
            fill="hsl(140, 30%, 92%)"
            stroke="hsl(145, 25%, 80%)"
            strokeWidth="2.5"
            filter="url(#dropShadow)"
          />

          {/* Depth on front - more solid to prevent transparency */}
          <path
            d="M20 80 L20 280 Q20 290 30 290 L370 290 Q380 290 380 280 L380 80 L200 180 Z"
            fill="url(#envelopeShadow)"
            opacity="0.6"
          />
        </g>


        {/* Envelope flap with realistic 3D rotation - FIXED TRIANGULAR FLAP */}
        <motion.g
          style={{
            transformOrigin: "200px 80px",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateX: isOpen ? -170 : 0,
            z: isOpen ? -10 : 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {/* Flap shadow */}
          <path
            d="M20 80 L200 170 L380 80 L380 88 Q380 80 370 80 L30 80 Q20 80 20 88Z"
            fill="hsla(0, 0%, 0%, 0.15)"
            transform="translate(0, 5)"
            opacity={isOpen ? 0 : 0.5}
          />

          {/* Flap main - PERFECT TRIANGULAR FLAP */}
          <path
            d="M20 80 L200 170 L380 80 L380 88 Q380 80 370 80 L30 80 Q20 80 20 88Z"
            fill={isOpen ? "hsl(145, 30%, 88%)" : "url(#flapGradient)"}
            stroke="hsl(145, 25%, 80%)"
            strokeWidth="2.5"
            filter={isOpen ? "none" : "url(#dropShadow)"}
          />

          {/* Flap highlight */}
          {!isOpen && (
            <path
              d="M20 80 L200 170 L380 80 L380 88 Q380 80 370 80 L30 80 Q20 80 20 88Z"
              fill="url(#envelopeHighlight)"
              opacity="0.6"
            />
          )}


          {/* Decorative pattern on flap */}
          <motion.g
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <line
              x1="100"
              y1="90"
              x2="140"
              y2="120"
              stroke="hsl(145, 15%, 75%)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <line
              x1="260"
              y1="120"
              x2="300"
              y2="90"
              stroke="hsl(145, 15%, 75%)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Decorative corner flourishes */}
            <path
              d="M50 70 Q45 65 50 60 Q55 65 50 70"
              fill="none"
              stroke="hsl(145, 20%, 70%)"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d="M350 70 Q355 65 350 60 Q345 65 350 70"
              fill="none"
              stroke="hsl(145, 20%, 70%)"
              strokeWidth="1"
              opacity="0.5"
            />
          </motion.g>
        </motion.g>

        {/* Seal with breaking animation - CENTERED */}
        <motion.g
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? [1, 1.3, 0] : [1, 1.05, 1],
          }}
          transition={isOpen ?
            { duration: 0.4, ease: "easeIn" } :
            { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Seal shadow */}
          <circle
            cx="200"
            cy="170"
            r="28"
            fill="hsla(0, 0%, 0%, 0.2)"
            transform="translate(3, 3)"
          />

          {/* Seal main - PERFECTLY CENTERED */}
          <circle
            cx="200"
            cy="170"
            r="28"
            fill="hsl(145, 45%, 58%)"
            stroke="hsl(155, 50%, 48%)"
            strokeWidth="3"
            filter="url(#innerShadow)"
          />

          {/* Seal highlight */}
          <circle
            cx="200"
            cy="170"
            r="28"
            fill="url(#envelopeHighlight)"
            opacity="0.4"
          />

          {/* Seal inner ring */}
          <circle
            cx="200"
            cy="170"
            r="20"
            fill="none"
            stroke="hsl(155, 45%, 50%)"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Heart in seal - CENTERED */}
          <motion.g
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path
              d="M200 180l-2.5-2c-5-4.5-8-7.5-8-11 0-3 2.5-5 5-5 1.5 0 3 .8 4 2 1-1.2 2.5-2 4-2 2.5 0 5 2 5 5 0 3.5-3 6.5-8 11L200 180z"
              fill="white"
              opacity="0.95"
            />
          </motion.g>



          {/* Seal cracks (appear when opening) */}
          {isOpen && (
            <>
              <motion.line
                x1="200"
                y1="170"
                x2="220"
                y2="185"
                stroke="hsl(145, 30%, 40%)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.line
                x1="200"
                y1="170"
                x2="180"
                y2="185"
                stroke="hsl(145, 30%, 40%)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            </>
          )}
        </motion.g>

      </svg>


      {/* Hint text with better animation */}
      <motion.p
        className="text-center mt-8 text-muted-foreground text-base font-serif-italic"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {isPaperOut ? "Taking you to my letter..." : isOpen ? "Click to read the letter..." : "Click to open the envelope"}
      </motion.p>

      {/* Enhanced sparkle decorations */}
      {isOpen && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 12}%`,
                top: `${-10 + (i % 3) * 5}%`,
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.3, 1, 0],
                opacity: [0, 1, 1, 0],
                rotate: 360,
                y: [-20, -40],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="hsl(145, 50%, 65%)">
                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
              </svg>
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default Envelope;
