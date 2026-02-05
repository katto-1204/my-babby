import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface Photo {
  id: string;
  file: File;
  preview: string;
  filter: string;
}

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSound();

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Vintage', value: 'sepia(0.8)' },
    { name: 'Warm', value: 'brightness(1.1) saturate(1.2)' },
    { name: 'Cool', value: 'brightness(0.95) hue-rotate(10deg)' },
    { name: 'Soft', value: 'contrast(0.9) brightness(1.05)' },
    { name: 'Romantic', value: 'sepia(0.3) contrast(1.1) brightness(1.05)' },
  ];

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photo: Photo = {
            id: Date.now().toString() + Math.random(),
            file,
            preview: e.target?.result as string,
            filter: 'none',
          };
          setPhotos((prev) => [...prev, photo]);
          playSound('success');
        };
        reader.readAsDataURL(file);
      }
    });
  }, [playSound]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    playSound('buttonClick');
  };

  const changeFilter = (id: string, filter: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, filter } : p)));
    playSound('sparkle');
  };

  const PhotoCard = ({ photo, index }: { photo: Photo; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
      <motion.div
        ref={ref}
        className="relative group"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-elevated">
          <img
            src={photo.preview}
            alt={`Memory ${index + 1}`}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            style={{ filter: photo.filter }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <select
                value={photo.filter}
                onChange={(e) => changeFilter(photo.id, e.target.value)}
                className="mb-2 px-3 py-1 bg-white/90 rounded text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {filters.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removePhoto(photo.id)}
                className="w-full px-4 py-2 bg-red-500/90 text-white rounded text-sm hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={10} />
      
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Our Photo Gallery
          </h1>
          <p className="text-muted-foreground font-serif-italic text-lg">
            Upload and relive our beautiful memories together
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          className={`mb-12 border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/10 scale-105'
              : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <motion.div
            className="cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xl font-medium text-foreground mb-2">
              {isDragging ? 'Drop your photos here' : 'Drag & drop photos here'}
            </p>
            <p className="text-muted-foreground">or click to browse</p>
          </motion.div>
        </motion.div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {photos.map((photo, index) => (
                <PhotoCard key={photo.id} photo={photo} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {photos.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground text-lg font-serif-italic">
              No photos yet. Start uploading to create your memory gallery!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
