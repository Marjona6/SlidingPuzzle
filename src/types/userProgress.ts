export interface GameStats {
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalMoves: number;
  totalTimePlayed: number; // in seconds
  bestTime: number; // fastest completion time in seconds
  averageMoves: number;
  winRate: number; // percentage
}

export interface PuzzleCompletion {
  puzzleId: string; // combination of level.id + image.id
  levelId: string;
  imageId: string;
  bestTime: number;
  bestMoves: number;
  timesCompleted: number;
  lastCompletedAt: Date;
  isCompleted: boolean;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  progress: number; // 0-100 for progress-based achievements
  maxProgress: number;
}

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD format
  levelId: string;
  imageId: string;
  isCompleted: boolean;
  completionTime?: number;
  moves?: number;
  completedAt?: Date;
}

export interface UserProgress {
  userId: string;
  stats: GameStats;
  completedPuzzles: PuzzleCompletion[];
  achievements: UserAchievement[];
  dailyChallenges: DailyChallenge[];
  currentStreak: number; // consecutive days played
  longestStreak: number;
  lastPlayedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSession {
  sessionId: string;
  levelId: string;
  imageId: string;
  startTime: Date;
  endTime?: Date;
  moves: number;
  isCompleted: boolean;
  completionTime?: number; // in seconds
}
