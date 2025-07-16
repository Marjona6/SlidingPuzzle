import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import { PuzzleLevel, PuzzleImage } from "../data/puzzleData";
import { theme } from "../config/theme";
import { ImageTile, createImageTiles, shuffleImageTiles, isPuzzleComplete } from "../utils/imageUtils";
import ImageTileComponent from "../components/ImageTile";

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

  const tileSize = GAME_BOARD_SIZE / level.size;

  const initializeGame = () => {
    // Create image tiles with individual portions
    const imageTiles = createImageTiles(level, image.url, 800);
    const shuffledTiles = shuffleImageTiles(imageTiles);

    setTiles(shuffledTiles);
    setMoves(0);
    setIsComplete(false);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const canMoveTile = (tileIndex: number): boolean => {
    const blankIndex = tiles.findIndex((tile) => tile.isBlank);
    const row = Math.floor(tileIndex / level.size);
    const col = tileIndex % level.size;
    const blankRow = Math.floor(blankIndex / level.size);
    const blankCol = blankIndex % level.size;

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
      Alert.alert("Congratulations!", `You solved the ${level.name} puzzle in ${moves + 1} moves!`, [{ text: "New Game", onPress: initializeGame }]);
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

      <View style={[styles.gameBoard, { width: GAME_BOARD_SIZE, height: GAME_BOARD_SIZE }]}>
        {tiles.map((tile, index) => {
          const row = Math.floor(index / level.size);
          const col = index % level.size;
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
              <ImageTileComponent tile={tile} tileSize={tileSize} boardSize={GAME_BOARD_SIZE} levelSize={level.size} isMovable={canMoveTile(index) && !tile.isBlank} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.newGameButton} onPress={initializeGame}>
          <Text style={styles.newGameText}>New Game</Text>
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
});

export default GameScreen;
