import React from 'react';
import type { Features } from '@/lib/ocr-engine';
import { FEATURE_NAMES } from '@/lib/training-data';

interface FeaturesViewProps {
  features: Features | null;
}

const FeaturesView: React.FC<FeaturesViewProps> = ({ features }) => {
  if (!features) {
    return (
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          <span className="text-primary font-mono mr-2">03</span>
          Extraction des caractéristiques
        </h3>
        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
          En attente du prétraitement…
        </div>
      </div>
    );
  }

  const values = [
    features.blackPixels.toFixed(0),
    features.density.toFixed(4),
    features.centerX.toFixed(2),
    features.centerY.toFixed(2),
    features.centralDensity.toFixed(4),
  ];

  return (
    <div className="glass-panel p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        <span className="text-primary font-mono mr-2">03</span>
        Extraction des caractéristiques
      </h3>
      <div className="space-y-2">
        {FEATURE_NAMES.map((name, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded bg-muted/50">
            <span className="text-xs font-mono text-muted-foreground">{name}</span>
            <span className="text-sm font-mono font-semibold text-primary">{values[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded bg-secondary/50 border border-border">
        <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
          Vecteur X = [{features.vector.map(v => v.toFixed(2)).join(', ')}]
        </p>
      </div>
    </div>
  );
};

export default FeaturesView;
