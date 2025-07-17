import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import { PuzzleLevel, PuzzleImage } from "../data/puzzleData";
import { userProgressService } from "../services/userProgressService";
import { theme } from "../config/theme";
import { ImageTile, createImageTiles, shuffleImageTiles, isPuzzleComplete } from "../utils/imageUtils";
import ImageTileComponent from "../components/ImageTile";
import { PriorityQueue } from "../utils/priorityQueue";

interface GameScreenProps {
  level: PuzzleLevel;
  image: PuzzleImage;
  onBack: () => void;
}

const { width: screenWidth } = Dimensions.get("window");
const GAME_BOARD_SIZE = Math.min(screenWidth - 40, 350); // Responsive board size

const GameScreen: React.FC<GameScreenProps> = ({ level, image, onBack }) => {
  const [tiles, setTiles] = useState<ImageTile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Add safety check
  if (!level || !image) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  // Calculate tile size based on the larger dimension to maintain square tiles
  const maxDimension = Math.max(level.rows, level.cols);
  const tileSize = GAME_BOARD_SIZE / maxDimension;

  // Calculate actual board dimensions
  const boardWidth = level.cols * tileSize;
  const boardHeight = level.rows * tileSize;

  const initializeGame = () => {
    // Create image tiles with individual portions
    const imageTiles = createImageTiles(level, image.fullImage, 800);
    const shuffledTiles = shuffleImageTiles(imageTiles, level);

    setTiles(shuffledTiles);
    setMoves(0);
    setIsComplete(false);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const canMoveTile = (tileIndex: number): boolean => {
    const blankIndex = tiles.findIndex((tile) => tile.isBlank);
    const row = Math.floor(tileIndex / level.cols);
    const col = tileIndex % level.cols;
    const blankRow = Math.floor(blankIndex / level.cols);
    const blankCol = blankIndex % level.cols;

    // Check if tile is adjacent to blank tile
    return (Math.abs(row - blankRow) === 1 && col === blankCol) || (Math.abs(col - blankCol) === 1 && row === blankRow);
  };

  const moveTile = (tileIndex: number) => {
    if (!canMoveTile(tileIndex)) return;

    const newTiles = [...tiles];
    const blankIndex = newTiles.findIndex((tile) => tile.isBlank);

    // Swap tiles
    [newTiles[tileIndex], newTiles[blankIndex]] = [newTiles[blankIndex], newTiles[tileIndex]];

    setTiles(newTiles);
    setMoves((prev) => prev + 1);

    // Check if puzzle is complete
    if (isPuzzleComplete(newTiles, level)) {
      setIsComplete(true);
      const completionTime = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;

      // Save user progress
      userProgressService.updateGameStats(level, image, moves + 1, completionTime);

      Alert.alert("Congratulations!", `You solved the ${level.name} puzzle in ${moves + 1} moves!`, [{ text: "New Game", onPress: initializeGame }]);
    }
  };

  const solvePuzzle = () => {
    if (isComplete) return;

    const targetState = Array.from({ length: tiles.length }, (_, i) => i + 1);
    targetState[targetState.length - 1] = 0; // Last tile is blank

    const initialState = tiles.map((tile) => tile.value);

    const getNeighbors = (state: number[]): number[][] => {
      const neighbors: number[][] = [];
      const blankIndex = state.indexOf(0);
      const row = Math.floor(blankIndex / level.cols);
      const col = blankIndex % level.cols;

      const directions = [
        { row: -1, col: 0 }, // Up
        { row: 1, col: 0 }, // Down
        { row: 0, col: -1 }, // Left
        { row: 0, col: 1 }, // Right
      ];

      for (const { row: dRow, col: dCol } of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        if (newRow >= 0 && newRow < level.rows && newCol >= 0 && newCol < level.cols) {
          const newIndex = newRow * level.cols + newCol;
          const newState = [...state];
          [newState[blankIndex], newState[newIndex]] = [newState[newIndex], newState[blankIndex]];
          neighbors.push(newState);
        }
      }

      return neighbors;
    };

    const heuristic = (state: number[]): number => {
      let distance = 0;
      for (let i = 0; i < state.length; i++) {
        if (state[i] === 0) continue;
        const targetIndex = state[i] - 1;
        const currentRow = Math.floor(i / level.cols);
        const currentCol = i % level.cols;
        const targetRow = Math.floor(targetIndex / level.cols);
        const targetCol = targetIndex % level.cols;
        distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
      }
      return distance;
    };

    const aStar = (start: number[], goal: number[]): number[][] | null => {
      const openSet = new PriorityQueue<{ state: number[]; path: number[][] }>((a: { priority: number }, b: { priority: number }) => a.priority < b.priority);
      openSet.enqueue({ state: start, path: [] }, heuristic(start));

      const closedSet = new Set<string>();

      while (!openSet.isEmpty()) {
        const { state, path } = openSet.dequeue();

        if (state.toString() === goal.toString()) {
          return path;
        }

        closedSet.add(state.toString());

        for (const neighbor of getNeighbors(state)) {
          if (closedSet.has(neighbor.toString())) continue;

          const newPath = [...path, neighbor];
          const priority = newPath.length + heuristic(neighbor);
          openSet.enqueue({ state: neighbor, path: newPath }, priority);
        }
      }

      return null;
    };

    const solutionPath = aStar(initialState, targetState);

    if (solutionPath) {
      const animateSolution = (index: number) => {
        if (index >= solutionPath.length) return;

        const newTiles = solutionPath[index].map((value: number, i: number) => {
          // Find the original tile that should be at this position
          const originalTile = tiles.find((tile) => tile.value === value);

          return {
            ...originalTile!,
            id: i, // Keep the current position as ID
            value,
            isBlank: value === 0,
          };
        });

        setTiles(newTiles);
        setTimeout(() => animateSolution(index + 1), 500);
      };

      animateSolution(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    initializeGame();
  }, [level, image]);

  useEffect(() => {
    if (startTime && !isComplete) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{image.name}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Level: {level.name}</Text>
          <Text style={styles.statText}>Moves: {moves}</Text>
          <Text style={styles.statText}>Time: {formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <View style={[styles.gameBoard, { width: boardWidth, height: boardHeight }]}>
        {tiles.map((tile, index) => {
          const row = Math.floor(index / level.cols);
          const col = index % level.cols;
          const left = col * tileSize;
          const top = row * tileSize;

          return (
            <TouchableOpacity
              key={tile.id}
              style={[
                styles.tileContainer,
                {
                  width: tileSize,
                  height: tileSize,
                  left,
                  top,
                },
              ]}
              onPress={() => moveTile(index)}
              disabled={tile.isBlank}
            >
              <ImageTileComponent tile={tile} tileSize={tileSize} boardSize={GAME_BOARD_SIZE} levelSize={maxDimension} isMovable={canMoveTile(index) && !tile.isBlank} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.newGameButton} onPress={initializeGame}>
          <Text style={styles.newGameText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.solveButton} onPress={solvePuzzle}>
          <Text style={styles.solveButtonText}>Solve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: theme.spacing.sm,
    zIndex: 1,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    gap: theme.spacing.md,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  gameBoard: {
    alignSelf: "center",
    backgroundColor: theme.colors.gameBoardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: 2,
    position: "relative",
    ...theme.shadows.medium,
  },
  tileContainer: {
    position: "absolute",
  },
  controls: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },
  newGameButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  newGameText: {
    ...theme.typography.h4,
    color: theme.colors.textInverse,
  },
  solveButton: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  solveButtonText: {
    ...theme.typography.h4,
    color: theme.colors.textInverse,
  },
});

export default GameScreen;
