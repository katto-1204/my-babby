import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorPage from './ErrorPage';
import EnvelopePage from './EnvelopePage';
import LetterPage from './LetterPage';
import MemoriesPage from './MemoriesPage';
import FlowerPage from './FlowerPage';
import QuestionPage from './QuestionPage';
import ClosingPage from './ClosingPage';
import BackgroundMusic from './BackgroundMusic';
import CursorTrail from './CursorTrail';
import InteractiveSparkles from './InteractiveSparkles';
import LockPage from './LockPage';

type Page = 'lock' | 'error' | 'envelope' | 'letter' | 'memories' | 'flowers' | 'question' | 'closing';



const ValentineApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('lock');
  const [musicVibe, setMusicVibe] = useState<'romantic' | 'inspecting'>('inspecting');

  const goToPage = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAccessGranted = useCallback(() => {
    setMusicVibe('romantic');
  }, []);

  const handleReplay = useCallback(() => {
    setCurrentPage('error');
    setMusicVibe('romantic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Music stays active throughout the entire flow as requested */}
      <BackgroundMusic isActive={true} vibe={musicVibe} />


      <CursorTrail isActive={currentPage !== 'error'} />
      <InteractiveSparkles isActive={currentPage !== 'error'} />
      <AnimatePresence mode="wait">
        {currentPage === 'lock' && (
          <motion.div
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LockPage
              onComplete={() => goToPage('error')}
              onAccessGranted={handleAccessGranted}
            />

          </motion.div>
        )}

        {currentPage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ErrorPage onComplete={() => goToPage('envelope')} />
          </motion.div>
        )}


        {currentPage === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EnvelopePage onComplete={() => goToPage('letter')} />
          </motion.div>
        )}

        {currentPage === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LetterPage onComplete={() => goToPage('memories')} />
          </motion.div>
        )}

        {currentPage === 'memories' && (
          <motion.div
            key="memories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoriesPage onComplete={() => goToPage('flowers')} />
          </motion.div>
        )}

        {currentPage === 'flowers' && (
          <motion.div
            key="flowers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FlowerPage onComplete={() => goToPage('question')} />
          </motion.div>
        )}

        {currentPage === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuestionPage onComplete={() => goToPage('closing')} />
          </motion.div>
        )}

        {currentPage === 'closing' && (
          <motion.div
            key="closing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ClosingPage onReplay={handleReplay} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValentineApp;
