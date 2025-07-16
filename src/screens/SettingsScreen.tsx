import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ false: "#ddd", true: "#007AFF" }} thumbColor={soundEnabled ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ false: "#ddd", true: "#007AFF" }} thumbColor={vibrationEnabled ? "#fff" : "#f4f3f4"} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Difficulty</Text>
          <View style={styles.difficultyButtons}>
            {(["easy", "medium", "hard"] as const).map((level) => (
              <TouchableOpacity key={level} style={[styles.difficultyButton, difficulty === level && styles.difficultyButtonActive]} onPress={() => setDifficulty(level)}>
                <Text style={[styles.difficultyButtonText, difficulty === level && styles.difficultyButtonTextActive]}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  settingsContainer: {
    flex: 1,
    gap: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  difficultyButtons: {
    flexDirection: "row",
    gap: 10,
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  difficultyButtonActive: {
    backgroundColor: "#007AFF",
  },
  difficultyButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  difficultyButtonTextActive: {
    color: "white",
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

export default SettingsScreen;
