import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface Page {
  id: string;
  elements: ScrapbookElement[];
}

interface ScrapbookElement {
  id: string;
  type: 'text' | 'image' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style?: Record<string, string>;
}

const ScrapbookCreator = () => {
  const [pages, setPages] = useState<Page[]>([{ id: '1', elements: [] }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSound();

  const stickers = ['❤️', '💕', '💖', '🌹', '✨', '💫', '🌟', '🎀', '💐', '🦋'];

  const addElement = (type: 'text' | 'image' | 'sticker', content?: string) => {
    const newElement: ScrapbookElement = {
      id: Date.now().toString(),
      type,
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      width: type === 'text' ? 200 : type === 'sticker' ? 50 : 150,
      height: type === 'text' ? 100 : type === 'sticker' ? 50 : 150,
      content: content || (type === 'text' ? 'Your text here' : ''),
    };

    const updated = [...pages];
    updated[currentPage].elements.push(newElement);
    setPages(updated);
    playSound('sparkle');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addElement('image', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (id: string, updates: Partial<ScrapbookElement>) => {
    const updated = [...pages];
    const element = updated[currentPage].elements.find((e) => e.id === id);
    if (element) {
      Object.assign(element, updates);
      setPages(updated);
    }
  };

  const deleteElement = (id: string) => {
    const updated = [...pages];
    updated[currentPage].elements = updated[currentPage].elements.filter((e) => e.id !== id);
    setPages(updated);
    playSound('buttonClick');
  };

  const addPage = () => {
    setPages([...pages, { id: Date.now().toString(), elements: [] }]);
    setCurrentPage(pages.length);
    playSound('success');
  };

  const exportPDF = () => {
    // Simple export - in production, use a library like jsPDF
    alert('PDF export feature - implement with jsPDF library');
    playSound('success');
  };

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={8} />
      
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Digital Scrapbook Creator
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Create beautiful memories together
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-elevated flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => addElement('text')}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
          >
            Add Text
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
          >
            Add Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex gap-2">
            {stickers.map((sticker) => (
              <button
                key={sticker}
                onClick={() => addElement('sticker', sticker)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {sticker}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={addPage} className="px-4 py-2 bg-primary/10 text-primary rounded-lg">
              Add Page
            </button>
            <button onClick={exportPDF} className="px-4 py-2 btn-romantic">
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* Page Navigation */}
        {pages.length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(idx)}
                className={`px-4 py-2 rounded-lg ${
                  idx === currentPage
                    ? 'bg-primary text-white'
                    : 'bg-white/50 text-muted-foreground'
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Canvas */}
        <motion.div
          className="bg-white rounded-2xl shadow-elevated p-8 min-h-[600px] relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {pages[currentPage].elements.map((element) => (
            <motion.div
              key={element.id}
              className={`absolute cursor-move ${
                selectedElement === element.id ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
              }}
              onClick={() => setSelectedElement(element.id)}
              drag
              onDragEnd={(e, info) => {
                updateElement(element.id, { x: element.x + info.offset.x, y: element.y + info.offset.y });
              }}
              whileHover={{ scale: 1.05 }}
            >
              {element.type === 'text' && (
                <textarea
                  value={element.content}
                  onChange={(e) => updateElement(element.id, { content: e.target.value })}
                  className="w-full h-full p-2 border-2 border-primary/30 rounded resize-none focus:outline-none focus:border-primary"
                  style={element.style}
                />
              )}
              {element.type === 'image' && (
                <>
                  <img src={element.content} alt="Scrapbook" className="w-full h-full object-cover rounded" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(element.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
                  >
                    ×
                  </button>
                </>
              )}
              {element.type === 'sticker' && (
                <div className="text-4xl text-center">{element.content}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ScrapbookCreator;
