import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

interface Tile {
  id: number;
  value: number;
  isBlank: boolean;
}

const GameScreen: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const initializeGame = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    const shuffled = shuffleArray([...numbers, 0]); // 0 represents the blank tile

    const newTiles = shuffled.map((value, index) => ({
      id: index,
      value,
      isBlank: value === 0,
    }));

    setTiles(newTiles);
    setMoves(0);
    setIsComplete(false);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const canMoveTile = (tileIndex: number): boolean => {
    const blankIndex = tiles.findIndex((tile) => tile.isBlank);
    const row = Math.floor(tileIndex / 3);
    const col = tileIndex % 3;
    const blankRow = Math.floor(blankIndex / 3);
    const blankCol = blankIndex % 3;

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
    const isComplete = newTiles.every((tile, index) => {
      if (index === 8) return tile.isBlank; // Last tile should be blank
      return tile.value === index + 1;
    });

    if (isComplete) {
      setIsComplete(true);
      Alert.alert("Congratulations!", `You solved the puzzle in ${moves + 1} moves!`, [{ text: "New Game", onPress: initializeGame }]);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    initializeGame();
  }, []);

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
        <Text style={styles.title}>Sliding Puzzle</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Moves: {moves}</Text>
          <Text style={styles.statText}>Time: {formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <View style={styles.gameBoard}>
        {tiles.map((tile, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const left = col * 98 + 5; // 96px tile + 2px gap
          const top = row * 98 + 5; // 96px tile + 2px gap

          return (
            <TouchableOpacity key={tile.id} style={[styles.tile, tile.isBlank && styles.blankTile, canMoveTile(index) && !tile.isBlank && styles.movableTile, { left, top }]} onPress={() => moveTile(index)} disabled={tile.isBlank}>
              {!tile.isBlank && <Text style={styles.tileText}>{tile.value}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.newGameButton} onPress={initializeGame}>
        <Text style={styles.newGameText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
    gap: 20,
  },
  statText: {
    fontSize: 16,
    color: "#666",
  },
  gameBoard: {
    width: 300,
    height: 300,
    backgroundColor: "#ddd",
    borderRadius: 10,
    padding: 5,
    position: "relative",
  },
  tile: {
    position: "absolute",
    width: 96,
    height: 96,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blankTile: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  movableTile: {
    backgroundColor: "#0056CC",
  },
  tileText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  newGameButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  newGameText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GameScreen;
