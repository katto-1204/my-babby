import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface LockPageProps {
    onComplete: () => void;
    onAccessGranted?: () => void;
}

type ViewState = 'form' | 'restricted' | 'success';

const LockPage = ({ onComplete, onAccessGranted }: LockPageProps) => {
    const [name, setName] = useState('');
    const [errorCount, setErrorCount] = useState(0);
    const [isPanicking, setIsPanicking] = useState(false);
    const [view, setView] = useState<ViewState>('form');
    const [hint, setHint] = useState('');
    const [countdown, setCountdown] = useState(10);
    const { playSound } = useSound();
    const inputRef = useRef<HTMLInputElement>(null);

    const VALID_NAMES = ['kie', 'kimberlee', 'gigi'];

    useEffect(() => {
        if (view === 'restricted' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (view === 'restricted' && countdown === 0) {
            setView('form');
            setCountdown(10);
            setErrorCount(0);
            setHint('RE-INITIALIZING...');
        }
    }, [view, countdown]);

    const handleLevelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizedName = name.toLowerCase().trim();

        if (VALID_NAMES.includes(sanitizedName)) {
            playSound('success');
            onAccessGranted?.();
            setView('success');
            setTimeout(() => {
                onComplete();
            }, 4500);
        } else {
            const newErrorCount = errorCount + 1;
            setErrorCount(newErrorCount);
            setIsPanicking(true);
            playSound('buttonClick');

            if (newErrorCount >= 4) {
                setView('restricted');
            } else {
                if (newErrorCount === 1) setHint('IDENTITY_UNVERIFIED');
                else if (newErrorCount === 2) setHint('HINT: PERSONAL_NICKNAME');
                else if (newErrorCount === 3) setHint('CRITICAL: LAST_ATTEMPT');
            }

            setTimeout(() => setIsPanicking(false), 800);
        }
    };

    // Background color turns increasingly red with each error
    const bgColor = view === 'restricted'
        ? 'rgb(100, 5, 5)'
        : `rgb(${5 + errorCount * 25}, ${5 - errorCount * 1}, ${5 - errorCount * 1})`;

    return (
        <div
            className="page-container flex flex-col items-center justify-center px-4 relative overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: bgColor }}
        >

            {/* Minimalist Grid Lines */}
            <motion.div
                className="absolute top-[20%] left-0 w-full h-px bg-white/10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5 }}
            />
            <motion.div
                className="absolute top-[80%] left-0 w-full h-px bg-white/10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
            />

            {/* Corner Brackets */}
            <div className="absolute top-12 left-12 w-8 h-8 border-l-2 border-t-2 border-white/20" />
            <div className="absolute top-12 right-12 w-8 h-8 border-r-2 border-t-2 border-white/20" />
            <div className="absolute bottom-12 left-12 w-8 h-8 border-l-2 border-b-2 border-white/20" />
            <div className="absolute bottom-12 right-12 w-8 h-8 border-r-2 border-b-2 border-white/20" />

            <AnimatePresence mode="wait">
                {view === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="max-w-4xl w-full text-center space-y-20 z-10"
                    >
                        <div className="space-y-12">
                            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter leading-none m-0">
                                ACCESS <br />
                                <span className={isPanicking ? 'text-red-500 transition-colors' : 'text-white/10 transition-colors'}>REQUIRED</span>
                            </h1>

                            <p className="text-3xl md:text-4xl text-white/50 font-serif-italic max-w-2xl mx-auto leading-relaxed">
                                Are you <span className="text-white border-b-2 border-white/40 px-3 break-all transition-all duration-300">{name || '_____'}</span>?
                            </p>
                        </div>

                        <form onSubmit={handleLevelSubmit} className="relative group max-w-md mx-auto space-y-12">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="NAME..."
                                    className={`w-full bg-transparent border-b-2 rounded-none px-4 py-8 text-4xl text-center font-mono tracking-widest text-white focus:outline-none transition-all duration-300 ${isPanicking ? 'border-red-600' : 'border-white/10 focus:border-white'
                                        }`}
                                    autoFocus
                                />

                                <div className="absolute -bottom-8 left-0 w-full h-4">
                                    <AnimatePresence>
                                        {hint && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-[10px] font-mono text-red-500 tracking-[0.3em] uppercase font-bold"
                                            >
                                                {hint}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {name.length > 0 && !isPanicking && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    type="submit"
                                    className="px-12 py-5 bg-white text-black font-black text-xs tracking-[0.4em] hover:bg-white/90 transition-colors shadow-2xl"
                                >
                                    CONTINUE
                                </motion.button>
                            )}
                        </form>
                    </motion.div>
                )}

                {view === 'restricted' && (
                    <motion.div
                        key="restricted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-8 z-10"
                    >
                        <h2 className="text-7xl md:text-9xl font-black text-red-600 tracking-tighter">LOCKED</h2>
                        <div className="text-5xl font-mono font-bold text-white/20 italic">
                            {countdown}s
                        </div>
                        <p className="text-white/30 text-[10px] font-mono tracking-[0.4em] uppercase">Security Penalty: Cool-down in progress</p>
                    </motion.div>
                )}

                {view === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-center max-w-6xl z-10"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-center gap-16 px-8 w-full max-w-5xl">
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="flex-1 text-center md:text-left space-y-10"
                            >
                                <div className="h-1 w-20 bg-primary mb-12" />
                                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                                    ACCESS <br />
                                    <span className="text-primary italic">GRANTED</span>
                                </h2>

                                <div className="space-y-4">
                                    <p className="text-3xl text-white font-serif-italic">Hi, <span className="underline decoration-primary underline-offset-8">{name}!</span></p>
                                    <p className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase">Identity confirmed.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, delay: 0.6, ease: "circOut" }}
                                className="relative flex-1 max-w-[420px]"
                            >
                                {/* Clean Border Reveal */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-primary" />
                                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-primary" />

                                <div className="rounded-none overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border-4 border-white translate-y-0">
                                    <img
                                        src="/gigi/gigi main.png"
                                        alt="Gigi"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                {/* Digital Hearts */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                                    <motion.span animate={{ y: [-20, -150], opacity: [0, 1, 0], x: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-10 left-10 text-5xl">❤️</motion.span>
                                    <motion.span animate={{ y: [-20, -180], opacity: [0, 1, 0], x: [10, -10, 10] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className="absolute -top-20 right-10 text-4xl">💖</motion.span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-12 left-12 text-white/5 text-[10px] font-mono tracking-widest uppercase pointer-events-none">
                Valentine.2025
            </div>
        </div>
    );
};

export default LockPage;
