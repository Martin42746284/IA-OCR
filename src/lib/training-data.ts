// Training data: pre-computed feature vectors for digits 0-9
// Each entry has: label, features [blackPixels, density, centerX, centerY, centralDensity]
// Generated from typical handwritten digit patterns on a 20x20 grid

export interface TrainingSample {
  label: number;
  features: number[];
}

// Helper to create variations of a base feature set
function vary(base: number[], variance: number): number[] {
  return base.map(v => v + (Math.random() - 0.5) * variance * 2);
}

function generateSamplesForDigit(label: number, baseFeatures: number[], count: number): TrainingSample[] {
  const samples: TrainingSample[] = [];
  for (let i = 0; i < count; i++) {
    samples.push({
      label,
      features: vary(baseFeatures, label === 1 ? 8 : 12),
    });
  }
  return samples;
}

// Base feature profiles for each digit [blackPixels, density, centerX, centerY, centralDensity]
// Values are approximate for 20x20 binary images
const digitProfiles: Record<number, number[]> = {
  0: [120, 0.30, 10.0, 10.0, 0.15],  // ring shape, centered, hollow center
  1: [55,  0.14, 10.0, 10.0, 0.25],   // thin vertical, centered, dense center
  2: [100, 0.25, 10.5, 9.0,  0.20],   // top curve + bottom bar
  3: [95,  0.24, 11.0, 10.0, 0.22],   // right-leaning curves
  4: [85,  0.21, 10.0, 9.5,  0.28],   // angular, cross in center
  5: [100, 0.25, 9.5,  10.5, 0.20],   // top bar + bottom curve
  6: [115, 0.29, 9.5,  11.0, 0.25],   // bottom loop, heavier bottom
  7: [65,  0.16, 11.0, 8.5,  0.18],   // top bar + diagonal, light
  8: [130, 0.33, 10.0, 10.0, 0.30],   // two loops, most dense
  9: [110, 0.28, 10.5, 9.0,  0.25],   // top loop, heavier top
};

export function generateTrainingData(): TrainingSample[] {
  const allSamples: TrainingSample[] = [];
  for (let digit = 0; digit <= 9; digit++) {
    allSamples.push(...generateSamplesForDigit(digit, digitProfiles[digit], 20));
  }
  return allSamples;
}

export const FEATURE_NAMES = [
  "x₁ : Pixels noirs",
  "x₂ : Densité",
  "x₃ : Centre masse X",
  "x₄ : Centre masse Y",
  "x₅ : Densité centrale",
];
