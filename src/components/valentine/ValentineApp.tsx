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

type Page = 'error' | 'envelope' | 'letter' | 'memories' | 'flowers' | 'question' | 'closing';

const ValentineApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('error');

  const goToPage = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReplay = useCallback(() => {
    setCurrentPage('error');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <BackgroundMusic isActive={currentPage !== 'error'} />
      <CursorTrail isActive={currentPage !== 'error'} />
      <InteractiveSparkles isActive={currentPage !== 'error'} />
      <AnimatePresence mode="wait">
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
