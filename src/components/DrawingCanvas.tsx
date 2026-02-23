import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DrawingCanvasProps {
  onDrawingComplete: (canvas: HTMLCanvasElement) => void;
  onClear: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingComplete, onClear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
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
  }, []);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const ctx = canvasRef.current!.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext('2d')!;
    const pos = getPos(e);
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onClear();
  };

  const handleRecognize = () => {
    if (canvasRef.current && hasDrawn) {
      onDrawingComplete(canvasRef.current);
    }
  };

  return (
    <div className="glass-panel p-6 glow-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          <span className="text-primary font-mono mr-2">01</span>
          Zone de dessin
        </h3>
        <span className="text-xs font-mono text-muted-foreground">200×200px</span>
      </div>

      <div className="relative mx-auto w-fit">
        <div className="absolute inset-0 rounded-lg grid-bg opacity-20 pointer-events-none" />
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="border-2 border-border rounded-lg cursor-crosshair bg-foreground/95 touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3 mb-4">
        Dessinez un chiffre (0-9) dans la zone ci-dessus
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Effacer
        </button>
        <button
          onClick={handleRecognize}
          disabled={!hasDrawn}
          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Reconnaître
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
