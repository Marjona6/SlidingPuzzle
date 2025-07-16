import { PuzzleLevel } from "../data/puzzleData";

export interface ImageTile {
  id: number;
  value: number;
  isBlank: boolean;
  imageUrl: string;
  originalRow: number;
  originalCol: number;
}

/**
 * Checks if a puzzle configuration is solvable
 * Based on the mathematical properties of sliding puzzles
 * @param tiles Array of tiles in their current positions
 * @param level Puzzle level with rows and cols
 * @returns true if the puzzle is solvable, false otherwise
 */
export const isPuzzleSolvable = (tiles: ImageTile[], level: PuzzleLevel): boolean => {
  const { rows, cols } = level;
  const totalTiles = rows * cols;

  // Find the position of the blank tile
  const blankIndex = tiles.findIndex((tile) => tile.isBlank);
  const blankRow = Math.floor(blankIndex / cols);
  const blankCol = blankIndex % cols;

  // Calculate the taxicab distance of the blank from the lower right corner
  const targetRow = rows - 1;
  const targetCol = cols - 1;
  const taxicabDistance = Math.abs(blankRow - targetRow) + Math.abs(blankCol - targetCol);

  // Count inversions (pairs of tiles that are out of order)
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].isBlank) continue;

    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j].isBlank) continue;

      // If tile i should come after tile j in the solved state, it's an inversion
      if (tiles[i].value > tiles[j].value) {
        inversions++;
      }
    }
  }

  // For rectangular grids, the solvability depends on the grid dimensions
  if (rows === cols) {
    // Square grid: solvable if inversions + taxicab distance is even
    return (inversions + taxicabDistance) % 2 === 0;
  } else {
    // Rectangular grid: all even permutations are solvable
    // For rectangular grids, we need to check if the permutation is even
    return inversions % 2 === 0;
  }
};

/**
 * Creates individual image tiles by generating URLs that show only the specific portion
 * of the original image for each tile position
 */
export const createImageTiles = (level: PuzzleLevel, originalImageUrl: string, imageSize: number = 800): ImageTile[] => {
  const totalTiles = level.rows * level.cols;
  const tileWidth = imageSize / level.cols;
  const tileHeight = imageSize / level.rows;

  const tiles: ImageTile[] = [];

  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      const index = row * level.cols + col;
      const value = index + 1; // 1-based values

      const tileImageUrl = originalImageUrl;

      tiles.push({
        id: index,
        value,
        isBlank: false,
        imageUrl: tileImageUrl,
        originalRow: row,
        originalCol: col,
      });
    }
  }

  // Replace the last tile with a blank tile
  const lastIndex = tiles.length - 1;

  tiles[lastIndex] = {
    ...tiles[lastIndex],
    value: 0,
    isBlank: true,
    imageUrl: "",
  };

  return tiles;
};

/**
 * Shuffles the tiles while preserving their individual image URLs
 * Ensures the resulting configuration is solvable
 */
export const shuffleImageTiles = (tiles: ImageTile[], level: PuzzleLevel): ImageTile[] => {
  let shuffled: ImageTile[];
  let attempts = 0;
  const maxAttempts = 1000; // Prevent infinite loops

  do {
    shuffled = [...tiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
  } while (!isPuzzleSolvable(shuffled, level) && attempts < maxAttempts);

  // If we couldn't find a solvable configuration, return the original (solved) state
  if (attempts >= maxAttempts) {
    console.warn("Could not generate solvable puzzle after", maxAttempts, "attempts, returning solved state");
    return tiles;
  }

  return shuffled;
};

/**
 * Checks if the puzzle is complete by verifying each tile is in its correct numerical position
 * The puzzle is solved when tiles are arranged as: 1, 2, 3, 4, 5, 6, 7, 8, blank
 * Each tile should be in the position that matches its value
 */
export const isPuzzleComplete = (tiles: ImageTile[], level: PuzzleLevel): boolean => {
  return tiles.every((tile, index) => {
    if (index === tiles.length - 1) {
      return tile.isBlank; // Last tile should be blank
    }

    // Check if the tile value matches its expected position (1-based)
    // Position 0 should have value 1, position 1 should have value 2, etc.
    return tile.value === index + 1;
  });
};
