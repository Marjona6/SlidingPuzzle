import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HighScore {
  id: string;
  moves: number;
  time: number;
  date: string;
}

const HighScoresScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock data - in a real app, this would come from Firebase or local storage
  const mockHighScores: HighScore[] = [
    { id: "1", moves: 25, time: 120, date: "2024-01-15" },
    { id: "2", moves: 28, time: 145, date: "2024-01-14" },
    { id: "3", moves: 32, time: 180, date: "2024-01-13" },
    { id: "4", moves: 35, time: 200, date: "2024-01-12" },
    { id: "5", moves: 40, time: 250, date: "2024-01-11" },
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderHighScore = ({ item, index }: { item: HighScore; index: number }) => (
    <View style={styles.scoreItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      <View style={styles.scoreDetails}>
        <Text style={styles.scoreText}>{item.moves} moves</Text>
        <Text style={styles.timeText}>{formatTime(item.time)}</Text>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>High Scores</Text>
        <Text style={styles.subtitle}>Best times and moves</Text>
      </View>

      <View style={styles.scoresContainer}>
        <View style={styles.scoresHeader}>
          <Text style={styles.scoresHeaderText}>Rank</Text>
          <Text style={styles.scoresHeaderText}>Moves</Text>
          <Text style={styles.scoresHeaderText}>Time</Text>
          <Text style={styles.scoresHeaderText}>Date</Text>
        </View>

        <FlatList data={mockHighScores} renderItem={renderHighScore} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scoresList} />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
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
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  scoresContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoresHeader: {
    flexDirection: "row",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  scoresHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  scoresList: {
    flexGrow: 1,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankContainer: {
    width: 50,
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  scoreDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  scoreText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HighScoresScreen;
