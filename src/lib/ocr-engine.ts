// OCR Engine: Preprocessing, Feature Extraction, k-NN Classification

export interface PreprocessingResult {
  grayscale: number[][];    // 2D array of grayscale values 0-255
  binary: number[][];       // 2D array of 0 or 1
  resized: number[][];      // 20x20 binary image
  normalized: number[][];   // 20x20 normalized [0,1]
}

export interface Features {
  blackPixels: number;
  density: number;
  centerX: number;
  centerY: number;
  centralDensity: number;
  vector: number[];
}

export interface KNNResult {
  predictedDigit: number;
  neighbors: { label: number; distance: number }[];
  votes: Record<number, number>;
}

// ====== PREPROCESSING ======

export function getImageDataFromCanvas(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function toGrayscale(imageData: ImageData): number[][] {
  const { width, height, data } = imageData;
  const gray: number[][] = [];
  for (let y = 0; y < height; y++) {
    gray[y] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // Luminance formula
      gray[y][x] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
  }
  return gray;
}

export function binarize(grayscale: number[][], threshold: number = 128): number[][] {
  return grayscale.map(row => row.map(v => v < threshold ? 1 : 0));
}

export function resize(binary: number[][], targetSize: number = 20): number[][] {
  const srcH = binary.length;
  const srcW = binary[0]?.length || 0;
  if (srcH === 0 || srcW === 0) return Array(targetSize).fill(null).map(() => Array(targetSize).fill(0));

  const result: number[][] = [];
  for (let y = 0; y < targetSize; y++) {
    result[y] = [];
    for (let x = 0; x < targetSize; x++) {
      const srcY = Math.floor(y * srcH / targetSize);
      const srcX = Math.floor(x * srcW / targetSize);
      result[y][x] = binary[srcY][srcX];
    }
  }
  return result;
}

export function normalize(binary: number[][]): number[][] {
  return binary.map(row => row.map(v => v));
}

export function preprocess(canvas: HTMLCanvasElement): PreprocessingResult {
  const imageData = getImageDataFromCanvas(canvas);
  const grayscale = toGrayscale(imageData);
  const binary = binarize(grayscale);
  const resized = resize(binary, 20);
  const normalized = normalize(resized);
  return { grayscale, binary, resized, normalized };
}

// ====== FEATURE EXTRACTION ======

export function extractFeatures(image: number[][]): Features {
  const height = image.length;
  const width = image[0]?.length || 0;
  const totalPixels = height * width;

  let blackPixels = 0;
  let sumX = 0;
  let sumY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (image[y][x] === 1) {
        blackPixels++;
        sumX += x;
        sumY += y;
      }
    }
  }

  const density = totalPixels > 0 ? blackPixels / totalPixels : 0;
  const centerX = blackPixels > 0 ? sumX / blackPixels : width / 2;
  const centerY = blackPixels > 0 ? sumY / blackPixels : height / 2;

  // Central zone density (middle 40% of image)
  const cx1 = Math.floor(width * 0.3);
  const cx2 = Math.floor(width * 0.7);
  const cy1 = Math.floor(height * 0.3);
  const cy2 = Math.floor(height * 0.7);
  let centralBlack = 0;
  let centralTotal = 0;
  for (let y = cy1; y < cy2; y++) {
    for (let x = cx1; x < cx2; x++) {
      centralTotal++;
      if (image[y][x] === 1) centralBlack++;
    }
  }
  const centralDensity = centralTotal > 0 ? centralBlack / centralTotal : 0;

  const vector = [blackPixels, density, centerX, centerY, centralDensity];

  return { blackPixels, density, centerX, centerY, centralDensity, vector };
}

// ====== k-NN CLASSIFIER ======

export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

export function knnClassify(
  testFeatures: number[],
  trainingData: { label: number; features: number[] }[],
  k: number = 5
): KNNResult {
  // Calculate distances
  const distances = trainingData.map(sample => ({
    label: sample.label,
    distance: euclideanDistance(testFeatures, sample.features),
  }));

  // Sort by distance
  distances.sort((a, b) => a.distance - b.distance);

  // Take k nearest
  const neighbors = distances.slice(0, k);

  // Vote
  const votes: Record<number, number> = {};
  for (const n of neighbors) {
    votes[n.label] = (votes[n.label] || 0) + 1;
  }

  // Find majority
  let maxVotes = 0;
  let predictedDigit = 0;
  for (const [label, count] of Object.entries(votes)) {
    if (count > maxVotes) {
      maxVotes = count;
      predictedDigit = parseInt(label);
    }
  }

  return { predictedDigit, neighbors, votes };
}
