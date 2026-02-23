import React from 'react';

const TheoryPanel: React.FC = () => {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        <span className="text-accent font-mono mr-2">📐</span>
        Base théorique
      </h3>

      <div className="space-y-4 text-sm text-secondary-foreground leading-relaxed">
        <div>
          <h4 className="font-semibold text-foreground mb-1">Algorithme k-NN</h4>
          <p className="text-xs text-muted-foreground">
            L'algorithme des k plus proches voisins est un classificateur supervisé non paramétrique.
            Pour classer un nouveau point <span className="font-mono text-primary">x</span>, il calcule la distance
            euclidienne avec tous les points d'entraînement et attribue la classe majoritaire parmi les k voisins les plus proches.
          </p>
        </div>

        <div className="p-3 rounded bg-secondary/50 border border-border font-mono text-xs text-muted-foreground">
          <p>d(x, xᵢ) = √(Σⱼ (xⱼ - xᵢⱼ)²)</p>
          <p className="mt-1">ŷ = mode({'{'} yᵢ : xᵢ ∈ Nₖ(x) {'}'})</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">Pourquoi k-NN ?</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Classification directe (pas de régression)</li>
            <li>Simple à comprendre et implémenter</li>
            <li>Pas de phase d'apprentissage explicite</li>
            <li>Adapté aux espaces de caractéristiques de faible dimension</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-1">Classification vs Régression</h4>
          <p className="text-xs text-muted-foreground">
            Contrairement à la régression (qui prédit une valeur continue), la classification attribue directement
            une catégorie discrète y ∈ {'{'}0, 1, ..., 9{'}'}. Aucun arrondi ni post-traitement n'est nécessaire.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheoryPanel;
