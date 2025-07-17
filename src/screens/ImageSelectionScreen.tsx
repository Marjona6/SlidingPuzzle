import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { PUZZLE_IMAGES, PuzzleImage } from "../data/puzzleData";
import { theme } from "../config/theme";

interface ImageSelectionScreenProps {
  onImageSelected: (image: PuzzleImage) => void;
  onBack: () => void;
}

const ImageSelectionScreen: React.FC<ImageSelectionScreenProps> = ({ onImageSelected, onBack }) => {
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);

  const handleStartGame = () => {
    if (selectedImage) {
      onImageSelected(selectedImage);
    }
  };

  const renderImageItem = (item: PuzzleImage) => (
    <TouchableOpacity key={item.id} style={[styles.imageItem, selectedImage?.id === item.id && styles.imageItemSelected]} onPress={() => setSelectedImage(item)}>
      <Image source={{ uri: item.thumbnail }} style={styles.imageThumbnail} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose Your Image</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageGrid}>{PUZZLE_IMAGES.map(renderImageItem)}</View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.startButton, !selectedImage && styles.startButtonDisabled]} onPress={handleStartGame} disabled={!selectedImage}>
          <Text style={styles.startButtonText}>Start Puzzle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontSize: 16,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  imageItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  imageItemSelected: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
});

export default ImageSelectionScreen;
