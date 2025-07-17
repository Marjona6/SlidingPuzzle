import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { theme } from "../config/theme";
import { userProgressService } from "../services/userProgressService";
import { UserProgress, UserAchievement } from "../types/userProgress";

interface StatisticsScreenProps {
  onBack: () => void;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBack }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await userProgressService.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error("Error loading user progress:", error);
      Alert.alert("Error", "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return "--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "0m";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderStatCard = (title: string, value: string | number, subtitle?: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderAchievement = (achievement: UserAchievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementName}>{achievement.name}</Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        <Text style={styles.achievementDate}>{achievement.unlockedAt.toLocaleDateString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Statistics</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!userProgress) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Statistics</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No statistics available</Text>
          <Text style={styles.emptySubtext}>Complete your first puzzle to see your stats!</Text>
        </View>
      </View>
    );
  }

  const { stats, achievements, currentStreak, longestStreak } = userProgress;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard("Games Played", stats.totalGamesPlayed)}
            {renderStatCard("Games Won", stats.totalGamesWon)}
            {renderStatCard("Win Rate", `${stats.winRate.toFixed(1)}%`)}
            {renderStatCard("Total Moves", stats.totalMoves)}
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statsGrid}>
            {renderStatCard("Best Time", formatTime(stats.bestTime), "Fastest completion")}
            {renderStatCard("Avg Moves", stats.averageMoves.toFixed(1), "Average moves per game")}
            {renderStatCard("Total Time", formatDuration(stats.totalTimePlayed), "Time spent playing")}
            {renderStatCard("Current Streak", currentStreak, "Consecutive days")}
          </View>
        </View>

        {/* Streak Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streaks</Text>
          <View style={styles.streakContainer}>
            <View style={styles.streakCard}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakCard}>
              <Text style={styles.streakNumber}>{longestStreak}</Text>
              <Text style={styles.streakLabel}>Longest Streak</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements ({achievements.length})</Text>
          {achievements.length > 0 ? (
            achievements.map(renderAchievement)
          ) : (
            <View style={styles.emptyAchievements}>
              <Text style={styles.emptyText}>No achievements yet</Text>
              <Text style={styles.emptySubtext}>Keep playing to unlock achievements!</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    width: "48%",
    alignItems: "center",
    ...theme.shadows.small,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
  statSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontSize: 12,
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  streakCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flex: 1,
    alignItems: "center",
    ...theme.shadows.small,
  },
  streakNumber: {
    ...theme.typography.h1,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  streakLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  achievementCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  achievementDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  achievementDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontSize: 12,
  },
  emptyAchievements: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
});

export default StatisticsScreen;
