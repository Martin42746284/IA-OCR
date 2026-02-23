import React from 'react';
import type { KNNResult } from '@/lib/ocr-engine';

interface KNNViewProps {
  result: KNNResult | null;
  k: number;
}

const KNNView: React.FC<KNNViewProps> = ({ result, k }) => {
  if (!result) {
    return (
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          <span className="text-primary font-mono mr-2">04</span>
          Classification k-NN (k={k})
        </h3>
        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
          En attente de la classification…
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        <span className="text-primary font-mono mr-2">04</span>
        Classification k-NN (k={k})
      </h3>

      {/* Neighbors table */}
      <div className="mb-4">
        <p className="text-xs font-mono text-muted-foreground mb-2">
          {k} plus proches voisins :
        </p>
        <div className="space-y-1">
          {result.neighbors.map((n, i) => (
            <div key={i} className="flex items-center gap-3 py-1 px-3 rounded bg-muted/50 text-xs font-mono">
              <span className="text-muted-foreground w-6">#{i + 1}</span>
              <span className="text-foreground font-semibold">Classe {n.label}</span>
              <span className="text-muted-foreground ml-auto">d = {n.distance.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Votes */}
      <div className="mb-4">
        <p className="text-xs font-mono text-muted-foreground mb-2">Votes :</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(result.votes)
            .sort(([, a], [, b]) => b - a)
            .map(([label, count]) => (
              <span
                key={label}
                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                  parseInt(label) === result.predictedDigit
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {label}: {count} vote{count > 1 ? 's' : ''}
              </span>
            ))}
        </div>
      </div>

      {/* Result */}
      <div className="p-6 rounded-lg bg-primary/10 border border-primary/30 glow-primary text-center">
        <p className="text-xs font-mono text-muted-foreground mb-2">Chiffre reconnu</p>
        <span className="text-6xl font-bold text-gradient-primary font-mono">
          {result.predictedDigit}
        </span>
      </div>
    </div>
  );
};

export default KNNView;
