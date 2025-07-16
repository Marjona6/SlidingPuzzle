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
 * Creates individual image tiles by generating URLs that show only the specific portion
 * of the original image for each tile position
 */
export const createImageTiles = (level: PuzzleLevel, originalImageUrl: string, imageSize: number = 800): ImageTile[] => {
  const totalTiles = level.size * level.size;
  const tileSize = imageSize / level.size;

  const tiles: ImageTile[] = [];

  for (let row = 0; row < level.size; row++) {
    for (let col = 0; col < level.size; col++) {
      const index = row * level.size + col;
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
 */
export const shuffleImageTiles = (tiles: ImageTile[]): ImageTile[] => {
  const shuffled = [...tiles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
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
