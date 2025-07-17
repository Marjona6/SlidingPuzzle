import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { UserProgress, GameStats, PuzzleCompletion, UserAchievement, DailyChallenge, GameSession } from "../types/userProgress";
import { PuzzleLevel, PuzzleImage } from "../data/puzzleData";

const STORAGE_KEYS = {
  USER_PROGRESS: "user_progress",
  GAME_SESSION: "game_session",
  USER_ID: "user_id",
};

class UserProgressService {
  private userId: string | null = null;

  async initialize(userId?: string): Promise<void> {
    if (userId) {
      this.userId = userId;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    } else {
      this.userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    }
  }

  private getUserId(): string {
    if (!this.userId) {
      // Generate a temporary user ID for anonymous users
      this.userId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      AsyncStorage.setItem(STORAGE_KEYS.USER_ID, this.userId);
    }
    return this.userId;
  }

  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const userId = this.getUserId();

      // Try to get from Firebase first (only if Firebase is available)
      try {
        const firebaseDoc = await firestore().collection("userProgress").doc(userId).get();
        if (firebaseDoc.exists) {
          const data = firebaseDoc.data() as UserProgress;
          return this.parseDates(data);
        }
      } catch (firebaseError) {
        console.log("Firebase unavailable, using local storage only");
      }

      // Fallback to local storage
      const localData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (localData) {
        return this.parseDates(JSON.parse(localData));
      }

      // Create new user progress
      return this.createNewUserProgress(userId);
    } catch (error) {
      console.error("Error getting user progress:", error);
      return null;
    }
  }

  async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const userId = this.getUserId();
      progress.userId = userId;
      progress.updatedAt = new Date();

      // Save to local storage first (always available)
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));

      // Try to save to Firebase (optional)
      try {
        await firestore().collection("userProgress").doc(userId).set(progress);
      } catch (firebaseError) {
        console.log("Firebase unavailable, data saved locally only");
      }
    } catch (error) {
      console.error("Error saving user progress:", error);
      // Fallback to local storage only
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    }
  }

  async updateGameStats(level: PuzzleLevel, image: PuzzleImage, moves: number, completionTime: number): Promise<void> {
    const progress = await this.getUserProgress();
    if (!progress) return;

    const puzzleId = `${level.id}_${image.id}`;

    // Update general stats
    progress.stats.totalGamesPlayed++;
    progress.stats.totalGamesWon++;
    progress.stats.totalMoves += moves;
    progress.stats.totalTimePlayed += completionTime;

    if (completionTime < progress.stats.bestTime || progress.stats.bestTime === 0) {
      progress.stats.bestTime = completionTime;
    }

    progress.stats.averageMoves = progress.stats.totalMoves / progress.stats.totalGamesWon;
    progress.stats.winRate = (progress.stats.totalGamesWon / progress.stats.totalGamesPlayed) * 100;

    // Update puzzle completion
    let puzzleCompletion = progress.completedPuzzles.find((p) => p.puzzleId === puzzleId);
    if (!puzzleCompletion) {
      puzzleCompletion = {
        puzzleId,
        levelId: level.id,
        imageId: image.id,
        bestTime: completionTime,
        bestMoves: moves,
        timesCompleted: 1,
        lastCompletedAt: new Date(),
        isCompleted: true,
      };
      progress.completedPuzzles.push(puzzleCompletion);
    } else {
      puzzleCompletion.timesCompleted++;
      puzzleCompletion.lastCompletedAt = new Date();
      if (completionTime < puzzleCompletion.bestTime) {
        puzzleCompletion.bestTime = completionTime;
      }
      if (moves < puzzleCompletion.bestMoves) {
        puzzleCompletion.bestMoves = moves;
      }
    }

    // Update streak
    const today = new Date().toDateString();
    const lastPlayed = progress.lastPlayedAt.toDateString();
    if (today !== lastPlayed) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastPlayed === yesterday.toDateString()) {
        progress.currentStreak++;
      } else {
        progress.currentStreak = 1;
      }
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }
    }

    progress.lastPlayedAt = new Date();

    await this.saveUserProgress(progress);
    await this.checkAchievements(progress);
  }

  async startGameSession(level: PuzzleLevel, image: PuzzleImage): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: GameSession = {
      sessionId,
      levelId: level.id,
      imageId: image.id,
      startTime: new Date(),
      moves: 0,
      isCompleted: false,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(session));
    return sessionId;
  }

  async endGameSession(sessionId: string, moves: number, isCompleted: boolean, completionTime?: number): Promise<void> {
    const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_SESSION);
    if (sessionData) {
      const session: GameSession = JSON.parse(sessionData);
      if (session.sessionId === sessionId) {
        session.endTime = new Date();
        session.moves = moves;
        session.isCompleted = isCompleted;
        session.completionTime = completionTime;

        await AsyncStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(session));
      }
    }
  }

  async getDailyChallenge(date: string): Promise<DailyChallenge | null> {
    const progress = await this.getUserProgress();
    if (!progress) return null;

    return progress.dailyChallenges.find((challenge) => challenge.date === date) || null;
  }

  async completeDailyChallenge(date: string, levelId: string, imageId: string, completionTime: number, moves: number): Promise<void> {
    const progress = await this.getUserProgress();
    if (!progress) return;

    let challenge = progress.dailyChallenges.find((c) => c.date === date);
    if (!challenge) {
      challenge = {
        id: `daily_${date}`,
        date,
        levelId,
        imageId,
        isCompleted: true,
        completionTime,
        moves,
        completedAt: new Date(),
      };
      progress.dailyChallenges.push(challenge);
    } else {
      challenge.isCompleted = true;
      challenge.completionTime = completionTime;
      challenge.moves = moves;
      challenge.completedAt = new Date();
    }

    await this.saveUserProgress(progress);
  }

  private createNewUserProgress(userId: string): UserProgress {
    return {
      userId,
      stats: {
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        totalMoves: 0,
        totalTimePlayed: 0,
        bestTime: 0,
        averageMoves: 0,
        winRate: 0,
      },
      completedPuzzles: [],
      achievements: [],
      dailyChallenges: [],
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private parseDates(data: any): UserProgress {
    return {
      ...data,
      lastPlayedAt: new Date(data.lastPlayedAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      completedPuzzles:
        data.completedPuzzles?.map((p: any) => ({
          ...p,
          lastCompletedAt: new Date(p.lastCompletedAt),
        })) || [],
      achievements:
        data.achievements?.map((a: any) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt),
        })) || [],
      dailyChallenges:
        data.dailyChallenges?.map((c: any) => ({
          ...c,
          completedAt: c.completedAt ? new Date(c.completedAt) : undefined,
        })) || [],
    };
  }

  private async checkAchievements(progress: UserProgress): Promise<void> {
    const newAchievements: UserAchievement[] = [];

    // First Win Achievement
    if (progress.stats.totalGamesWon === 1) {
      newAchievements.push({
        id: "first_win",
        name: "First Victory",
        description: "Complete your first puzzle",
        icon: "🏆",
        unlockedAt: new Date(),
        progress: 100,
        maxProgress: 100,
      });
    }

    // Streak Achievements
    if (progress.currentStreak === 7) {
      newAchievements.push({
        id: "week_streak",
        name: "Week Warrior",
        description: "Play for 7 consecutive days",
        icon: "🔥",
        unlockedAt: new Date(),
        progress: 100,
        maxProgress: 100,
      });
    }

    // Speed Achievements
    if (progress.stats.bestTime > 0 && progress.stats.bestTime < 60) {
      newAchievements.push({
        id: "speed_demon",
        name: "Speed Demon",
        description: "Complete a puzzle in under 1 minute",
        icon: "⚡",
        unlockedAt: new Date(),
        progress: 100,
        maxProgress: 100,
      });
    }

    // Add new achievements to progress
    progress.achievements.push(...newAchievements);

    if (newAchievements.length > 0) {
      await this.saveUserProgress(progress);
    }
  }
}

export const userProgressService = new UserProgressService();
