import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { PUZZLE_LEVELS, PuzzleLevel } from "../data/puzzleData";
import { theme } from "../config/theme";

interface LevelSelectionScreenProps {
  onLevelSelected: (level: PuzzleLevel) => void;
  onShowStatistics: () => void;
}

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({ onLevelSelected, onShowStatistics }) => {
  const [selectedLevel, setSelectedLevel] = useState<PuzzleLevel | null>(null);

  const handleContinue = () => {
    if (selectedLevel) {
      onLevelSelected(selectedLevel);
    }
  };

  const renderLevelItem = (item: PuzzleLevel) => (
    <TouchableOpacity key={item.id} style={[styles.levelItem, selectedLevel?.id === item.id && styles.levelItemSelected]} onPress={() => setSelectedLevel(item)}>
      <View style={styles.levelContent}>
        <View style={styles.levelInfo}>
          <Text style={[styles.levelTitle, selectedLevel?.id === item.id && styles.levelTitleSelected]}>{item.name}</Text>
          <Text style={[styles.levelDescription, selectedLevel?.id === item.id && styles.levelDescriptionSelected]}>{item.description}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={[styles.levelSize, selectedLevel?.id === item.id && styles.levelSizeSelected]}>
            {item.rows}×{item.cols}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Difficulty</Text>
        <Text style={styles.subtitle}>Select your challenge level</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.levelList}>{PUZZLE_LEVELS.map(renderLevelItem)}</View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.continueButton, !selectedLevel && styles.continueButtonDisabled]} onPress={handleContinue} disabled={!selectedLevel}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statsButton} onPress={onShowStatistics}>
          <Text style={styles.statsButtonText}>Statistics</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  levelList: {
    gap: theme.spacing.sm,
  },
  levelItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  levelItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  levelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelInfo: {
    flex: 1,
  },
  levelBadge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
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
  },
  levelDescriptionSelected: {
    color: theme.colors.textInverse,
  },
  levelSize: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "bold",
  },
  levelSizeSelected: {
    color: theme.colors.textInverse,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  continueButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  continueButtonText: {
    ...theme.typography.h4,
    color: theme.colors.textInverse,
  },
  statsButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statsButtonText: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
});

export default LevelSelectionScreen;
