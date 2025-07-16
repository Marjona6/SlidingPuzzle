import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DifficultyScreen = () => {
  const navigation = useNavigation();

  const difficulties = [
    { name: "Easy", size: 3 },
    { name: "Medium", size: 4 },
    { name: "Hard", size: 5 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Difficulty</Text>
      {difficulties.map((difficulty) => (
        <TouchableOpacity key={difficulty.name} style={styles.button} onPress={() => navigation.navigate("Game" as never)}>
          <Text style={styles.buttonText}>{difficulty.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DifficultyScreen;
