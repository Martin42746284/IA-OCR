import React, { useRef, useEffect } from 'react';
import type { PreprocessingResult } from '@/lib/ocr-engine';

interface PreprocessingViewProps {
  result: PreprocessingResult | null;
}

const MiniCanvas: React.FC<{ data: number[][]; label: string; size?: number }> = ({ data, label, size = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const h = data.length;
    const w = data[0].length;
    canvas.width = w;
    canvas.height = h;

    const imgData = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const v = data[y][x];
        // For binary/normalized: 1 = black(0), 0 = white(255)
        // For grayscale: direct value
        const pixel = v <= 1 ? (v === 1 ? 0 : 255) : (255 - v);
        imgData.data[i] = pixel;
        imgData.data[i + 1] = pixel;
        imgData.data[i + 2] = pixel;
        imgData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        className="border border-border rounded"
      />
      <span className="text-[10px] font-mono text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
};

const PreprocessingView: React.FC<PreprocessingViewProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          <span className="text-primary font-mono mr-2">02</span>
          Prétraitement
        </h3>
        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
          En attente d'une image…
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        <span className="text-primary font-mono mr-2">02</span>
        Prétraitement
      </h3>
      <div className="flex items-center justify-around gap-2 flex-wrap">
        <MiniCanvas data={result.grayscale} label="Niveaux de gris" />
        <span className="text-primary text-lg font-bold hidden sm:block">→</span>
        <MiniCanvas data={result.binary} label="Binarisation" />
        <span className="text-primary text-lg font-bold hidden sm:block">→</span>
        <MiniCanvas data={result.resized} label="20×20" size={60} />
        <span className="text-primary text-lg font-bold hidden sm:block">→</span>
        <MiniCanvas data={result.normalized} label="Normalisé" size={60} />
      </div>
    </div>
  );
};

export default PreprocessingView;
