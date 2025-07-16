import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from "react-native";
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

  const renderLevelItem = ({ item }: { item: PuzzleLevel }) => (
    <TouchableOpacity style={[styles.levelItem, selectedLevel?.id === item.id && styles.levelItemSelected]} onPress={() => setSelectedLevel(item)}>
      <Text style={[styles.levelTitle, selectedLevel?.id === item.id && styles.levelTitleSelected]}>{item.name}</Text>
      <Text style={[styles.levelDescription, selectedLevel?.id === item.id && styles.levelDescriptionSelected]}>{item.description}</Text>
      <View style={styles.levelGrid}>
        {Array.from({ length: item.size * item.size }).map((_, index) => (
          <View key={index} style={[styles.gridCell, { width: 20, height: 20 }]} />
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderImageItem = ({ item }: { item: PuzzleImage }) => (
    <TouchableOpacity style={[styles.imageItem, selectedImage?.id === item.id && styles.imageItemSelected]} onPress={() => setSelectedImage(item)}>
      <Image source={{ uri: item.thumbnail }} style={styles.imageThumbnail} resizeMode="cover" />
      <Text style={[styles.imageName, selectedImage?.id === item.id && styles.imageNameSelected]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Challenge</Text>
        <Text style={styles.subtitle}>Select difficulty and image</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty Level</Text>
        <FlatList data={PUZZLE_LEVELS} renderItem={renderLevelItem} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.levelsContainer} ItemSeparatorComponent={() => <View style={{ width: theme.spacing.md }} />} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Puzzle Image</Text>
        <FlatList data={PUZZLE_IMAGES} renderItem={renderImageItem} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.imagesContainer} ItemSeparatorComponent={() => <View style={{ width: theme.spacing.md }} />} />
      </View>

      <TouchableOpacity style={[styles.startButton, (!selectedLevel || !selectedImage) && styles.startButtonDisabled]} onPress={handleStartGame} disabled={!selectedLevel || !selectedImage}>
        <Text style={styles.startButtonText}>Start Puzzle</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
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
  },
  levelsContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  levelItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    width: 140,
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
  imagesContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  imageItem: {
    alignItems: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    width: 100,
  },
  imageItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
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
  startButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  startButtonText: {
    ...theme.typography.h4,
    color: theme.colors.textInverse,
  },
});

export default LevelSelectionScreen;
