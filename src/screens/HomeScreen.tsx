import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sliding Puzzle</Text>
        <Text style={styles.subtitle}>Slide the tiles to arrange them in order</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("Game" as never)}>
          <Text style={styles.menuButtonText}>Start New Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuButton, styles.secondaryButton]} onPress={() => navigation.navigate("Settings" as never)}>
          <Text style={styles.menuButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuButton, styles.secondaryButton]} onPress={() => navigation.navigate("HighScores" as never)}>
          <Text style={styles.menuButtonText}>High Scores</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tap tiles adjacent to the empty space to move them</Text>
      </View>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  menuButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "#34C759",
  },
  menuButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HomeScreen;
