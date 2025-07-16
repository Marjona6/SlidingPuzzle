import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from "react-native";
import { PUZZLE_LEVELS, PUZZLE_IMAGES, PuzzleLevel, PuzzleImage } from "../data/puzzleData";
import { theme } from "../config/theme";

interface LevelSelectionScreenProps {
  onLevelSelected: (level: PuzzleLevel, image: PuzzleImage) => void;
}

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ onLevelSelected }) => {
  const [selectedLevel, setSelectedLevel] = useState<PuzzleLevel | null>(null);
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);

  const handleStartGame = () => {
    if (selectedLevel && selectedImage) {
      onLevelSelected(selectedLevel, selectedImage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Challenge</Text>
        <Text style={styles.subtitle}>Select difficulty and image</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            {PUZZLE_LEVELS.map((item, index) => (
              <TouchableOpacity key={item.id} style={[styles.levelItem, selectedLevel?.id === item.id && styles.levelItemSelected, { marginRight: index === PUZZLE_LEVELS.length - 1 ? 20 : 10 }]} onPress={() => setSelectedLevel(item)}>
                <Text style={[styles.levelTitle, selectedLevel?.id === item.id && styles.levelTitleSelected]}>{item.name}</Text>
                <Text style={[styles.levelDescription, selectedLevel?.id === item.id && styles.levelDescriptionSelected]}>{item.description}</Text>
                <View style={styles.levelGrid}>
                  {Array.from({ length: item.rows * item.cols }).map((_, gridIndex) => (
                    <View key={gridIndex} style={[styles.gridCell, { width: 20, height: 20 }]} />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Puzzle Image</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
          <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
            {PUZZLE_IMAGES.map((item, index) => (
              <TouchableOpacity key={item.id} style={[styles.imageItem, selectedImage?.id === item.id && styles.imageItemSelected, { marginRight: index === PUZZLE_IMAGES.length - 1 ? 20 : 10 }]} onPress={() => setSelectedImage(item)}>
                <Image source={{ uri: item.thumbnail }} style={styles.imageThumbnail} resizeMode="cover" />
                <Text style={[styles.imageName, selectedImage?.id === item.id && styles.imageNameSelected]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.startButton, (!selectedLevel || !selectedImage) && styles.startButtonDisabled]} onPress={handleStartGame} disabled={!selectedLevel || !selectedImage}>
          <Text style={styles.startButtonText}>Start Puzzle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  levelItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    width: 160,
    height: 160,
    ...theme.shadows.small,
  },
  levelItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  levelTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  levelTitleSelected: {
    color: theme.colors.textInverse,
  },
  levelDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  levelDescriptionSelected: {
    color: theme.colors.textInverse,
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
  },
  gridCell: {
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  imageItem: {
    alignItems: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    width: 120,
    height: 140,
  },
  imageItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  imageName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  imageNameSelected: {
    color: theme.colors.textInverse,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  startButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  startButtonText: {
    ...theme.typography.h4,
    color: theme.colors.textInverse,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  horizontalScroll: {
    height: 180,
  },
  levelScrollContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    minWidth: 1000, // Force content to be wider than screen
  },
  imageScrollContent: {
    flexDirection: "row",
    paddingHorizontal: 20,
    minWidth: 800, // Force content to be wider than screen
  },
});

export default LevelSelectionScreen;
