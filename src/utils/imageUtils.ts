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

  // For square grids, solvable if inversions + taxicab distance is even
  if (rows === cols) {
    return (inversions + taxicabDistance) % 2 === 0;
  } else {
    // For rectangular grids, solvable if inversions is even
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
  const maxAttempts = 100;

  do {
    // Create a deep copy of tiles
    shuffled = tiles.map((tile) => ({ ...tile }));

    // Perform random moves to shuffle
    for (let i = 0; i < 50; i++) {
      const blankIndex = shuffled.findIndex((tile) => tile.isBlank);
      const blankRow = Math.floor(blankIndex / level.cols);
      const blankCol = blankIndex % level.cols;

      // Get possible moves
      const possibleMoves = [];
      const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
      ];

      for (const { row: dRow, col: dCol } of directions) {
        const newRow = blankRow + dRow;
        const newCol = blankCol + dCol;
        if (newRow >= 0 && newRow < level.rows && newCol >= 0 && newCol < level.cols) {
          const newIndex = newRow * level.cols + newCol;
          possibleMoves.push(newIndex);
        }
      }

      // Make a random move
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [shuffled[blankIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[blankIndex]];
      }
    }

    attempts++;
  } while (!isPuzzleSolvable(shuffled, level) && attempts < maxAttempts);

  // If we couldn't find a solvable configuration, return a simple known solvable state
  if (attempts >= maxAttempts) {
    console.warn("Could not generate solvable puzzle, using fallback");
    shuffled = tiles.map((tile) => ({ ...tile }));
    // Make a few simple moves that we know create a solvable state
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    if (shuffled.length > 3) {
      [shuffled[1], shuffled[2]] = [shuffled[2], shuffled[1]];
    }
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
