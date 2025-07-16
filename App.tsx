import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import firebase from "@react-native-firebase/app";

// Import the game screen directly
import GameScreen from "./src/screens/GameScreen";

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Check if Firebase is available
        const app = firebase.app();
        setFirebaseInitialized(true);
        console.log("Firebase is ready");
      } catch (err) {
        console.error("Firebase not available:", err);
        setError("Firebase not configured");
        // Don't crash the app, just show the error
      }
    };

    checkFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <GameScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
