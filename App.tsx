import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import firebase from "@react-native-firebase/app";
import { PuzzleLevel, PuzzleImage } from "./src/data/puzzleData";
import LevelSelectionScreen from "./src/screens/LevelSelectionScreen";
import ImageSelectionScreen from "./src/screens/ImageSelectionScreen";
import GameScreen from "./src/screens/GameScreen";

type AppState = "level-selection" | "image-selection" | "game";

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>("level-selection");
  const [selectedLevel, setSelectedLevel] = useState<PuzzleLevel | null>(null);
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Check if Firebase is available
        const app = firebase.app();
        setFirebaseInitialized(true);
      } catch (err) {
        console.error("Firebase not available:", err);
        setError("Firebase not configured");
        // Don't crash the app, just show the error
      }
    };

    checkFirebase();
  }, []);

  const handleLevelSelected = (level: PuzzleLevel) => {
    setSelectedLevel(level);
    setAppState("image-selection");
  };

  const handleImageSelected = (image: PuzzleImage) => {
    setSelectedImage(image);
    setAppState("game");
  };

  const handleBackToLevelSelection = () => {
    setAppState("level-selection");
    setSelectedLevel(null);
    setSelectedImage(null);
  };

  const handleBackToImageSelection = () => {
    setAppState("image-selection");
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {appState === "level-selection" && <LevelSelectionScreen onLevelSelected={handleLevelSelected} />}
      {appState === "image-selection" && selectedLevel && <ImageSelectionScreen onImageSelected={handleImageSelected} onBack={handleBackToLevelSelection} />}
      {appState === "game" && selectedLevel && selectedImage && <GameScreen level={selectedLevel} image={selectedImage} onBack={handleBackToImageSelection} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
