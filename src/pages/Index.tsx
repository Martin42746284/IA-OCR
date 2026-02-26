import React, { useState, useCallback, useMemo } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import PreprocessingView from '@/components/PreprocessingView';
import FeaturesView from '@/components/FeaturesView';
import KNNView from '@/components/KNNView';
import TheoryPanel from '@/components/TheoryPanel';
import { preprocess, extractFeatures, knnClassify } from '@/lib/ocr-engine';
import type { PreprocessingResult, Features, KNNResult } from '@/lib/ocr-engine';
import { generateTrainingData } from '@/lib/training-data';

const K_VALUE = 5;

const Index = () => {
  const [preprocessing, setPreprocessing] = useState<PreprocessingResult | null>(null);
  const [features, setFeatures] = useState<Features | null>(null);
  const [knnResult, setKnnResult] = useState<KNNResult | null>(null);

  const trainingData = useMemo(() => generateTrainingData(), []);

  const handleDrawingComplete = useCallback((canvas: HTMLCanvasElement) => {
    // Step 1: Preprocess
    const prepResult = preprocess(canvas);
    setPreprocessing(prepResult);

    // Step 2: Extract features
    const feat = extractFeatures(prepResult.normalized);
    setFeatures(feat);

    // Step 3: Classify with k-NN
    const result = knnClassify(feat.vector, trainingData, K_VALUE);
    setKnnResult(result);
  }, [trainingData]);

  const handleClear = useCallback(() => {
    setPreprocessing(null);
    setFeatures(null);
    setKnnResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              <span className="text-gradient-primary">OCR</span> — Reconnaissance de Chiffres
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Classification supervisée par k-NN │ k = {K_VALUE}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="px-2 py-1 rounded bg-muted">Input: 20×20</span>
            <span className="px-2 py-1 rounded bg-muted">5 features</span>
            <span className="px-2 py-1 rounded bg-muted">{trainingData.length} échantillons</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Drawing + Theory */}
          <div className="lg:col-span-4 space-y-6">
            <DrawingCanvas onDrawingComplete={handleDrawingComplete} onClear={handleClear} />
            <TheoryPanel />
          </div>

          {/* Right: Pipeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Pipeline steps label */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Pipeline de traitement
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <PreprocessingView result={preprocessing} />
            <FeaturesView features={features} />
            <KNNView result={knnResult} k={K_VALUE} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <p className="text-center text-xs font-mono text-muted-foreground">
          Projet IA — Classification supervisée k-NN
        </p>
      </footer>
    </div>
  );
};

export default Index;
