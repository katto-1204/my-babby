import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface Letter {
  id: string;
  title: string;
  content: string;
  font: string;
  color: string;
  createdAt: Date;
}

const LoveLetterBuilder = () => {
  const [letters, setLetters] = useState<Letter[]>(() => {
    const saved = localStorage.getItem('loveLetters');
    return saved ? JSON.parse(saved).map((l: any) => ({ ...l, createdAt: new Date(l.createdAt) })) : [];
  });
  const [currentLetter, setCurrentLetter] = useState<Letter>({
    id: '',
    title: '',
    content: '',
    font: 'serif',
    color: 'hsl(150, 20%, 15%)',
    createdAt: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { playSound } = useSound();

  const fonts = [
    { name: 'Serif', value: 'serif', class: 'font-serif-italic' },
    { name: 'Sans', value: 'sans', class: 'font-sans' },
    { name: 'Monospace', value: 'mono', class: 'font-mono' },
  ];

  const colors = [
    { name: 'Dark', value: 'hsl(150, 20%, 15%)' },
    { name: 'Primary', value: 'hsl(145, 35%, 55%)' },
    { name: 'Accent', value: 'hsl(155, 40%, 40%)' },
    { name: 'Romantic', value: 'hsl(350, 60%, 50%)' },
  ];

  const templates = [
    {
      title: 'Sweet & Simple',
      content: 'My dearest,\n\nI wanted to tell you how much you mean to me...\n\nWith all my love,',
    },
    {
      title: 'Romantic',
      content: 'To my beloved,\n\nEvery day with you feels like a dream come true. Your smile lights up my world...\n\nForever yours,',
    },
    {
      title: 'Poetic',
      content: 'My love,\n\nLike flowers bloom in spring,\nYour presence brings me joy...\n\nAlways,',
    },
  ];

  const saveLetter = () => {
    if (!currentLetter.title || !currentLetter.content) {
      playSound('buttonClick');
      return;
    }

    const letter: Letter = {
      ...currentLetter,
      id: currentLetter.id || Date.now().toString(),
      createdAt: currentLetter.id ? currentLetter.createdAt : new Date(),
    };

    const updated = isEditing
      ? letters.map((l) => (l.id === letter.id ? letter : l))
      : [...letters, letter];

    setLetters(updated);
    localStorage.setItem('loveLetters', JSON.stringify(updated));
    setCurrentLetter({ id: '', title: '', content: '', font: 'serif', color: 'hsl(150, 20%, 15%)', createdAt: new Date() });
    setIsEditing(false);
    playSound('success');
  };

  const loadTemplate = (template: typeof templates[0]) => {
    setCurrentLetter({ ...currentLetter, title: template.title, content: template.content });
    playSound('sparkle');
  };

  const editLetter = (letter: Letter) => {
    setCurrentLetter(letter);
    setIsEditing(true);
    playSound('buttonClick');
  };

  const deleteLetter = (id: string) => {
    const updated = letters.filter((l) => l.id !== id);
    setLetters(updated);
    localStorage.setItem('loveLetters', JSON.stringify(updated));
    playSound('buttonClick');
  };

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={8} />
      
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Love Letter Builder
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Write your heart out with beautiful letters
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Editor */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-elevated"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-medium mb-4">Write Your Letter</h2>
            
            {/* Templates */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Templates:</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.title}
                    onClick={() => loadTemplate(template)}
                    className="px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Letter title..."
              value={currentLetter.title}
              onChange={(e) => setCurrentLetter({ ...currentLetter, title: e.target.value })}
              className="w-full px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
            />

            <textarea
              placeholder="Write your letter here..."
              value={currentLetter.content}
              onChange={(e) => setCurrentLetter({ ...currentLetter, content: e.target.value })}
              className="w-full h-64 px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none resize-none"
            />

            <div className="flex gap-4 mb-4">
              <select
                value={currentLetter.font}
                onChange={(e) => setCurrentLetter({ ...currentLetter, font: e.target.value })}
                className="px-3 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
              >
                {fonts.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                value={currentLetter.color}
                onChange={(e) => setCurrentLetter({ ...currentLetter, color: e.target.value })}
                className="px-3 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
              >
                {colors.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveLetter}
                className="flex-1 btn-romantic py-2"
              >
                {isEditing ? 'Update' : 'Save'} Letter
              </button>
              {isEditing && (
                <button
                  onClick={() => {
                    setCurrentLetter({ id: '', title: '', content: '', font: 'serif', color: 'hsl(150, 20%, 15%)', createdAt: new Date() });
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>

          {/* Saved Letters */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-elevated"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-medium mb-4">Saved Letters</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {letters.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No letters yet</p>
              ) : (
                letters.map((letter) => (
                  <motion.div
                    key={letter.id}
                    className="p-4 bg-muted/50 rounded-lg border border-primary/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{letter.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editLetter(letter)}
                          className="text-primary hover:text-accent"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLetter(letter.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{letter.content}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Preview */}
        {currentLetter.content && (
          <motion.div
            className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-elevated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medium">Preview</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
            {showPreview && (
              <motion.div
                className={`p-6 rounded-lg border-2 border-primary/20 ${fonts.find(f => f.value === currentLetter.font)?.class || ''}`}
                style={{ color: currentLetter.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl mb-4">{currentLetter.title}</h3>
                <div className="whitespace-pre-wrap leading-relaxed">{currentLetter.content}</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoveLetterBuilder;
