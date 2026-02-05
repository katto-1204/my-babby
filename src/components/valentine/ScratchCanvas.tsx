import { useRef, useEffect, useState, useCallback } from 'react';
import { useSound } from '../../hooks/useSound';

interface ScratchCanvasProps {
  width: number;
  height: number;
  onRevealProgress: (progress: number) => void;
  children: React.ReactNode;
}

const ScratchCanvas = ({ width, height, onRevealProgress, children }: ScratchCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const { playSound } = useSound();
  const lastSoundTime = useRef(0);

  const calculateRevealProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }
    
    return (transparentPixels / (pixels.length / 4)) * 100;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill with scratch overlay color
    ctx.fillStyle = 'hsl(145, 35%, 75%)';
    ctx.fillRect(0, 0, width, height);
    
    // Add pattern
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < width; i += 8) {
      for (let j = 0; j < height; j += 8) {
        if ((i + j) % 16 === 0) {
          ctx.fillStyle = 'hsl(145, 30%, 65%)';
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }
    ctx.globalAlpha = 1;
    
    // Add sparkle decoration
    const drawSparkle = (x: number, y: number, size: number) => {
      ctx.fillStyle = 'hsl(150, 20%, 50%)';
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.3, y - size * 0.3);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.3, y + size * 0.3);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.3, y + size * 0.3);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size * 0.3, y - size * 0.3);
      ctx.closePath();
      ctx.fill();
    };
    
    drawSparkle(width * 0.2, height * 0.3, 8);
    drawSparkle(width * 0.8, height * 0.4, 6);
    drawSparkle(width * 0.5, height * 0.2, 10);
    
    // Add hint text
    ctx.font = 'italic 18px "Instrument Serif", Georgia, serif';
    ctx.fillStyle = 'hsl(150, 20%, 30%)';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here to reveal', width / 2, height / 2 - 10);
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = 'hsl(150, 15%, 40%)';
    ctx.fillText('Use your finger or cursor', width / 2, height / 2 + 20);
  }, [width, height]);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Play scratch sound occasionally (not too frequently)
    const now = Date.now();
    if (now - lastSoundTime.current > 100) {
      playSound('paperSlide');
      lastSoundTime.current = now;
    }
    
    const progress = calculateRevealProgress();
    setCurrentProgress(progress);
    onRevealProgress(progress);
  }, [calculateRevealProgress, onRevealProgress, playSound]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasStarted(true);
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getPosition(e);
    scratch(x, y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  // Calculate blur based on progress (blur until 85% revealed)
  const blurAmount = currentProgress >= 85 ? 0 : Math.max(0, 8 - (currentProgress / 85) * 8);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-elevated" style={{ width, height }}>
      {/* Content underneath with blur effect */}
      <div 
        className="absolute inset-0 p-6 flex flex-col justify-center gradient-paper transition-all duration-300"
        style={{ 
          filter: `blur(${blurAmount}px)`,
          opacity: currentProgress >= 85 ? 1 : 0.7 + (currentProgress / 85) * 0.3
        }}
      >
        {children}
      </div>
      
      {/* Scratch overlay */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="scratch-overlay rounded-2xl"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ touchAction: 'none' }}
      />
      
      {/* Scratch instruction */}
      {!hasStarted && (
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <p className="text-sm text-muted-foreground animate-pulse-soft">
            Touch and drag to scratch
          </p>
        </div>
      )}
    </div>
  );
};

export default ScratchCanvas;
