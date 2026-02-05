import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: Date;
  filter: string;
  template?: string;
}

interface Template {
  id: string;
  name: string;
  overlay: string;
  description: string;
}

const Photobooth = () => {
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('photoboothPhotos');
    return saved ? JSON.parse(saved).map((p: any) => ({ ...p, timestamp: new Date(p.timestamp) })) : [];
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [currentTemplate, setCurrentTemplate] = useState<string>('none');
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { playSound } = useSound();

  const filters = [
    { name: 'None', value: 'none', class: '' },
    { name: 'Vintage', value: 'sepia(0.8)', class: 'sepia-80' },
    { name: 'Warm', value: 'brightness(1.1) saturate(1.2)', class: 'warm' },
    { name: 'Cool', value: 'brightness(0.95) hue-rotate(10deg)', class: 'cool' },
    { name: 'Black & White', value: 'grayscale(100%)', class: 'grayscale' },
    { name: 'Romantic', value: 'sepia(0.3) contrast(1.1) brightness(1.05)', class: 'romantic' },
    { name: 'Vivid', value: 'saturate(1.5) contrast(1.2)', class: 'vivid' },
  ];

  const templates: Template[] = [
    {
      id: 'none',
      name: 'None',
      overlay: '',
      description: 'No template',
    },
    {
      id: 'heart-frame',
      name: 'Heart Frame',
      overlay: '💕',
      description: 'Romantic heart border',
    },
    {
      id: 'sparkle',
      name: 'Sparkle',
      overlay: '✨',
      description: 'Magical sparkles',
    },
    {
      id: 'valentine',
      name: 'Valentine',
      overlay: '💝',
      description: 'Valentine\'s day special',
    },
    {
      id: 'love',
      name: 'Love',
      overlay: '❤️',
      description: 'Love border',
    },
    {
      id: 'flower',
      name: 'Flower',
      overlay: '🌹',
      description: 'Flower frame',
    },
  ];

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        playSound('success');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Please allow camera access to use the photobooth!');
    }
  }, [playSound]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  const drawTemplate = (context: CanvasRenderingContext2D, width: number, height: number, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template || templateId === 'none') return;

    context.save();
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw template overlay
    if (template.overlay) {
      // Corner decorations
      const size = 60;
      const padding = 20;
      
      // Top corners
      context.fillText(template.overlay, padding, padding);
      context.fillText(template.overlay, width - padding, padding);
      
      // Bottom corners
      context.fillText(template.overlay, padding, height - padding);
      context.fillText(template.overlay, width - padding, height - padding);
      
      // Sides
      for (let i = 0; i < 5; i++) {
        const y = padding + (i * (height - padding * 2) / 4);
        context.fillText(template.overlay, padding, y);
        context.fillText(template.overlay, width - padding, y);
      }
      
      // Top and bottom borders
      for (let i = 0; i < 8; i++) {
        const x = padding + (i * (width - padding * 2) / 7);
        context.fillText(template.overlay, x, padding);
        context.fillText(template.overlay, x, height - padding);
      }
    }
    
    context.restore();
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.filter = currentFilter === 'none' ? 'none' : filters.find(f => f.value === currentFilter)?.value || 'none';
    context.drawImage(video, 0, 0);

    // Draw template overlay
    drawTemplate(context, canvas.width, canvas.height, currentTemplate);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    const photo: Photo = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: new Date(),
      filter: currentFilter,
      template: currentTemplate,
    };

    setPhotos([photo, ...photos]);
    localStorage.setItem('photoboothPhotos', JSON.stringify([photo, ...photos]));
    playSound('success');
  }, [videoRef, canvasRef, currentFilter, currentTemplate, photos, playSound, filters]);

  const captureWithCountdown = () => {
    if (countdown > 0) return;
    
    setCountdown(3);
    playSound('buttonClick');
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          playSound('sparkle');
          return 0;
        }
        playSound('heartbeat');
        return prev - 1;
      });
    }, 1000);
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('photoboothPhotos', JSON.stringify(updated));
    playSound('buttonClick');
  };

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a');
    link.download = `photobooth-${photo.id}.jpg`;
    link.href = photo.dataUrl;
    link.click();
    playSound('success');
  };

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={12} />
      
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Photobooth
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Capture beautiful moments with fun filters and templates, Gigi!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-elevated">
              <div className="relative bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                {!isCapturing ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <svg
                        className="w-24 h-24 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-lg">Camera not active</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ filter: currentFilter === 'none' ? 'none' : filters.find(f => f.value === currentFilter)?.value }}
                    />
                    {countdown > 0 && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      >
                        <div className="text-9xl font-heavy text-white">{countdown}</div>
                      </motion.div>
                    )}
                    {currentTemplate !== 'none' && (
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-4 left-4 text-4xl">{templates.find(t => t.id === currentTemplate)?.overlay}</div>
                        <div className="absolute top-4 right-4 text-4xl">{templates.find(t => t.id === currentTemplate)?.overlay}</div>
                        <div className="absolute bottom-4 left-4 text-4xl">{templates.find(t => t.id === currentTemplate)?.overlay}</div>
                        <div className="absolute bottom-4 right-4 text-4xl">{templates.find(t => t.id === currentTemplate)?.overlay}</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Templates */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Design Templates:</label>
                <div className="grid grid-cols-3 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setCurrentTemplate(template.id);
                        playSound('sparkle');
                      }}
                      className={`px-4 py-3 rounded-lg text-sm transition-all border-2 ${
                        currentTemplate === template.id
                          ? 'bg-primary text-white border-primary'
                          : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                      }`}
                    >
                      <div className="text-2xl mb-1">{template.overlay || '📷'}</div>
                      <div className="text-xs">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Filters:</label>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setCurrentFilter(filter.value);
                        playSound('sparkle');
                      }}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        currentFilter === filter.value
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {!isCapturing ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 btn-romantic py-4 text-lg"
                  >
                    Start Camera
                  </button>
                ) : (
                  <>
                    <button
                      onClick={captureWithCountdown}
                      disabled={countdown > 0}
                      className="flex-1 btn-romantic py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `Capturing in ${countdown}...` : '📸 Take Photo'}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-medium mb-4">Your Photos</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {photos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No photos yet. Start capturing!
                </p>
              ) : (
                photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-elevated"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={photo.dataUrl}
                      alt="Photobooth"
                      className="w-full rounded-lg mb-2"
                      style={{ filter: photo.filter === 'none' ? 'none' : filters.find(f => f.value === photo.filter)?.value }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadPhoto(photo)}
                        className="flex-1 px-3 py-1.5 bg-primary/10 text-primary rounded text-sm hover:bg-primary/20"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded text-sm hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {new Date(photo.timestamp).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default Photobooth;
