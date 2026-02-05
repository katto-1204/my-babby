import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use jsdelivr CDN (more reliable)
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
} catch (error) {
  // Fallback to unpkg
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  choices?: string[]; // Multiple choice options
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  mastery?: number;
}

interface FlashcardSet {
  id: string;
  name: string;
  flashcards: Flashcard[];
  createdAt: Date;
}

const FlashcardGenerator = () => {
  const [sets, setSets] = useState<FlashcardSet[]>(() => {
    const saved = localStorage.getItem('flashcardSets');
    return saved ? JSON.parse(saved).map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) })) : [];
  });
  const [currentSet, setCurrentSet] = useState<FlashcardSet | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [uploadedText, setUploadedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { playSound } = useSound();

  const generateFlashcards = (text: string, setName: string): Flashcard[] => {
    const flashcards: Flashcard[] = [];
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 20);
    
    paragraphs.forEach((paragraph, index) => {
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      if (sentences.length >= 2) {
        sentences.forEach((sentence, i) => {
          if (i < sentences.length - 1) {
            const question = sentence.trim() + '?';
            const answer = sentences[i + 1].trim();
            
            if (question.length > 10 && answer.length > 10) {
              // Generate multiple choice options
              const wrongAnswers = sentences
                .filter((_, idx) => idx !== i + 1 && idx < sentences.length)
                .slice(0, 3)
                .map(s => s.trim().substring(0, 50));
              
              // Ensure we have 4 options total
              while (wrongAnswers.length < 3) {
                wrongAnswers.push('This is a possible answer option');
              }
              
              const choices = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
              
              flashcards.push({
                id: `${Date.now()}-${index}-${i}`,
                front: question,
                back: answer,
                choices,
                mastery: 0,
              });
            }
          }
        });
      }
      
      const words = paragraph.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (words && words.length > 0) {
        words.slice(0, 5).forEach((word, i) => {
          const context = paragraph.substring(
            Math.max(0, paragraph.indexOf(word) - 50),
            Math.min(paragraph.length, paragraph.indexOf(word) + word.length + 100)
          );
          
          // Generate choices for definition cards
          const otherWords = words.filter(w => w !== word).slice(0, 3);
          const choices = [
            context.trim().substring(0, 80),
            ...otherWords.map(w => `A term related to ${w.toLowerCase()}`),
            'None of the above',
            'All of the above'
          ].slice(0, 4);
          
          flashcards.push({
            id: `${Date.now()}-def-${index}-${i}`,
            front: `What is ${word}?`,
            back: context.trim(),
            choices,
            mastery: 0,
          });
        });
      }
    });

    if (flashcards.length < 5) {
      const keyPhrases = text.match(/(?:^|\n)([A-Z][^.!?]{20,100})/g);
      if (keyPhrases) {
        keyPhrases.slice(0, 10).forEach((phrase, i) => {
          const cleanPhrase = phrase.trim();
          if (cleanPhrase.length > 20) {
            const choices = [
              cleanPhrase,
              cleanPhrase.substring(0, cleanPhrase.length / 2),
              'This concept is complex',
              'Refer to the main text'
            ];
            
            flashcards.push({
              id: `${Date.now()}-key-${i}`,
              front: `Explain: ${cleanPhrase.substring(0, 50)}...`,
              back: cleanPhrase,
              choices,
              mastery: 0,
            });
          }
        });
      }
    }

    return flashcards.slice(0, 50);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Try loading PDF with error handling
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0, // Suppress console warnings
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';

      // Limit to first 10 pages to avoid timeout
      const maxPages = Math.min(pdf.numPages, 10);
      
      for (let i = 1; i <= maxPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n\n';
        } catch (pageError) {
          console.warn(`Error extracting page ${i}:`, pageError);
          // Continue with other pages
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text could be extracted from this PDF. It might be image-based or encrypted.');
      }

      return fullText;
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      if (error.message?.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file. Please check if the file is corrupted.');
      } else if (error.message?.includes('password')) {
        throw new Error('This PDF is password protected. Please remove the password and try again.');
      } else {
        throw new Error(`Failed to extract text: ${error.message || 'Unknown error'}. Please try a different PDF file or convert it to text format.`);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true);
    playSound('buttonClick');

    try {
      let text = '';

      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        alert('Image OCR requires additional setup. Please copy and paste the text content instead.');
        setIsGenerating(false);
        return;
      } else {
        text = await file.text();
      }

      setUploadedText(text);
      
      setTimeout(() => {
        const setName = file.name.replace(/\.[^/.]+$/, '') || 'New Set';
        const flashcards = generateFlashcards(text, setName);
        
        const newSet: FlashcardSet = {
          id: Date.now().toString(),
          name: setName,
          flashcards,
          createdAt: new Date(),
        };

        setSets([...sets, newSet]);
        setCurrentSet(newSet);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        localStorage.setItem('flashcardSets', JSON.stringify([...sets, newSet]));
        setIsGenerating(false);
        playSound('success');
      }, 1500);
    } catch (error: any) {
      console.error('Error reading file:', error);
      alert(error.message || 'Error reading file. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleTextSubmit = () => {
    if (!uploadedText.trim()) {
      playSound('buttonClick');
      return;
    }

    setIsGenerating(true);
    playSound('buttonClick');

    setTimeout(() => {
      const setName = `Lesson ${sets.length + 1}`;
      const flashcards = generateFlashcards(uploadedText, setName);
      
      const newSet: FlashcardSet = {
        id: Date.now().toString(),
        name: setName,
        flashcards,
        createdAt: new Date(),
      };

      setSets([...sets, newSet]);
      setCurrentSet(newSet);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setUploadedText('');
      localStorage.setItem('flashcardSets', JSON.stringify([...sets, newSet]));
      setIsGenerating(false);
      playSound('success');
    }, 1500);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    playSound('sparkle');
  };

  const nextCard = () => {
    if (currentSet && currentCardIndex < currentSet.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setSelectedChoice(null);
      setShowAnswer(false);
      playSound('buttonClick');
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setSelectedChoice(null);
      setShowAnswer(false);
      playSound('buttonClick');
    }
  };

  const markMastery = (cardId: string, mastery: number) => {
    if (!currentSet) return;

    const updated = sets.map((set) => {
      if (set.id === currentSet.id) {
        return {
          ...set,
          flashcards: set.flashcards.map((card) =>
            card.id === cardId
              ? { ...card, mastery, lastReviewed: new Date() }
              : card
          ),
        };
      }
      return set;
    });

    const updatedSet = updated.find((s) => s.id === currentSet.id);
    setSets(updated);
    localStorage.setItem('flashcardSets', JSON.stringify(updated));
    if (updatedSet) {
      setCurrentSet({ ...updatedSet });
    }
    playSound('success');
  };

  const deleteSet = (id: string) => {
    const updated = sets.filter((s) => s.id !== id);
    setSets(updated);
    localStorage.setItem('flashcardSets', JSON.stringify(updated));
    if (currentSet?.id === id) {
      setCurrentSet(null);
      setStudyMode(false);
    }
    playSound('buttonClick');
  };

  const startStudy = (set: FlashcardSet) => {
    setCurrentSet(set);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedChoice(null);
    setShowAnswer(false);
    setStudyMode(true);
    playSound('success');
  };

  const progress = currentSet
    ? Math.round(
        (currentSet.flashcards.reduce((sum, card) => sum + (card.mastery || 0), 0) /
          (currentSet.flashcards.length * 100)) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={10} />
      
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Flashcard Generator
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Upload your lessons and I'll create flashcards for you, Gigi!
          </p>
        </motion.div>

        {!studyMode ? (
          <>
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-elevated mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-medium mb-6">Upload Your Lesson</h2>
              
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">Click to upload a file</p>
                  <p className="text-sm text-muted-foreground">Supports .txt and .pdf files</p>
                </div>

                <div className="text-center text-muted-foreground">or</div>

                <textarea
                  ref={textareaRef}
                  value={uploadedText}
                  onChange={(e) => setUploadedText(e.target.value)}
                  placeholder="Paste your lesson content here..."
                  className="w-full h-48 px-4 py-3 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none resize-none"
                />

                <button
                  onClick={handleTextSubmit}
                  disabled={isGenerating || !uploadedText.trim()}
                  className="w-full btn-romantic py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating Flashcards...' : 'Generate Flashcards'}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-medium mb-6">Your Flashcard Sets</h2>
              {sets.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No flashcard sets yet. Upload a lesson to get started!
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {sets.map((set) => (
                    <motion.div
                      key={set.id}
                      className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-elevated"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-medium mb-1">{set.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {set.flashcards.length} flashcards
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(set.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteSet(set.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() => startStudy(set)}
                        className="w-full btn-romantic py-2"
                      >
                        Study Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        ) : (
          currentSet && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Card {currentCardIndex + 1} of {currentSet.flashcards.length}
                  </span>
                  <span className="text-sm text-muted-foreground">{progress}% Mastered</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Flashcard with Multiple Choice */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-elevated"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6">
                  <div className="text-sm text-muted-foreground mb-4">Question</div>
                  <div className="text-2xl font-medium mb-6">{currentSet.flashcards[currentCardIndex].front}</div>
                </div>

                {currentSet.flashcards[currentCardIndex].choices && currentSet.flashcards[currentCardIndex].choices!.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {currentSet.flashcards[currentCardIndex].choices!.map((choice, idx) => {
                        // Normalize strings for comparison
                        const normalizedChoice = choice.trim().toLowerCase();
                        const normalizedAnswer = currentSet.flashcards[currentCardIndex].back.trim().toLowerCase();
                        const isCorrect = normalizedChoice === normalizedAnswer || 
                                         choice.trim() === currentSet.flashcards[currentCardIndex].back.trim() ||
                                         currentSet.flashcards[currentCardIndex].back.trim().includes(choice.trim()) ||
                                         choice.trim().includes(currentSet.flashcards[currentCardIndex].back.trim());
                        const isSelected = selectedChoice === choice;
                        
                        return (
                          <motion.button
                            key={idx}
                            onClick={() => {
                              if (!showAnswer) {
                                setSelectedChoice(choice);
                                setShowAnswer(true);
                                playSound(isCorrect ? 'success' : 'buttonClick');
                              }
                            }}
                            disabled={showAnswer}
                            className={`w-full p-4 rounded-lg text-left transition-all ${
                              showAnswer
                                ? isCorrect
                                  ? 'bg-green-500 text-white border-2 border-green-600'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-500 text-white border-2 border-red-600'
                                  : 'bg-muted/50 text-muted-foreground border-2 border-transparent'
                                : 'bg-muted/50 hover:bg-primary/10 border-2 border-transparent hover:border-primary/30 cursor-pointer'
                            } ${isSelected && !showAnswer ? 'border-primary bg-primary/5' : ''}`}
                            whileHover={!showAnswer ? { scale: 1.02, x: 5 } : {}}
                            whileTap={!showAnswer ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-lg">
                                <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                                {choice}
                              </span>
                              {showAnswer && (
                                <>
                                  {isCorrect && <span className="text-3xl">✓</span>}
                                  {isSelected && !isCorrect && <span className="text-3xl">✗</span>}
                                </>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {showAnswer && (
                      <motion.div
                        className="p-4 rounded-lg mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          backgroundColor: selectedChoice?.toLowerCase().trim() === currentSet.flashcards[currentCardIndex].back.toLowerCase().trim() 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)'
                        }}
                      >
                        <p className="text-sm font-medium mb-1">
                          {selectedChoice?.toLowerCase().trim() === currentSet.flashcards[currentCardIndex].back.toLowerCase().trim() 
                            ? '✓ Correct!' 
                            : '✗ Incorrect'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Answer:</strong> {currentSet.flashcards[currentCardIndex].back}
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div
                    className="relative h-64 perspective-1000"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      className="absolute inset-0 preserve-3d"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.div
                        className="absolute inset-0 backface-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-elevated flex items-center justify-center cursor-pointer"
                        onClick={flipCard}
                        style={{ backfaceVisibility: 'hidden' }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-4">Click to see answer</div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute inset-0 backface-hidden bg-primary/10 backdrop-blur-sm rounded-2xl p-8 shadow-elevated flex items-center justify-center cursor-pointer rotate-y-180"
                        onClick={flipCard}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-4">Answer</div>
                          <div className="text-xl">{currentSet.flashcards[currentCardIndex].back}</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              <div className="flex gap-4">
                <button
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  className="flex-1 px-4 py-3 bg-white/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Previous
                </button>
                {!currentSet.flashcards[currentCardIndex].choices && (
                  <button
                    onClick={flipCard}
                    className="flex-1 px-4 py-3 btn-romantic"
                  >
                    {isFlipped ? 'Show Question' : 'Show Answer'}
                  </button>
                )}
                <button
                  onClick={nextCard}
                  disabled={currentCardIndex === currentSet.flashcards.length - 1}
                  className="flex-1 px-4 py-3 bg-white/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>

              {/* Mastery buttons - show after answering or flipping */}
              {(showAnswer || isFlipped) && (
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm font-medium mb-3 text-center">How well did you know this?</p>
                  <div className="flex gap-2">
                    {[
                      { label: 'Again', value: 0, color: 'bg-red-500' },
                      { label: 'Hard', value: 25, color: 'bg-orange-500' },
                      { label: 'Good', value: 75, color: 'bg-green-500' },
                      { label: 'Easy', value: 100, color: 'bg-blue-500' },
                    ].map(({ label, value, color }) => (
                      <button
                        key={label}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentSet) {
                            markMastery(currentSet.flashcards[currentCardIndex].id, value);
                            if (currentCardIndex < currentSet.flashcards.length - 1) {
                              setTimeout(() => {
                                nextCard();
                              }, 500);
                            } else {
                              setTimeout(() => {
                                setStudyMode(false);
                                setCurrentSet(null);
                              }, 1000);
                            }
                          }
                        }}
                        className={`flex-1 px-4 py-3 ${color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => {
                  setStudyMode(false);
                  setCurrentSet(null);
                  playSound('buttonClick');
                }}
                className="w-full px-4 py-3 bg-white/90 rounded-lg hover:bg-white transition-colors"
              >
                Back to Sets
              </button>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default FlashcardGenerator;
