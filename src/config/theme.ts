export const theme = {
  colors: {
    primary: "#007AFF",
    primaryDark: "#0056CC",
    secondary: "#34C759",
    secondaryDark: "#28A745",
    danger: "#FF3B30",
    warning: "#FF9500",
    success: "#34C759",
    info: "#5AC8FA",

    // Background colors
    background: "#F5F5F5",
    surface: "#FFFFFF",
    surfaceDark: "#F0F0F0",

    // Text colors
    textPrimary: "#333333",
    textSecondary: "#666666",
    textTertiary: "#999999",
    textInverse: "#FFFFFF",

    // Border colors
    border: "#E0E0E0",
    borderDark: "#CCCCCC",

    // Puzzle specific colors
    tileBackground: "#007AFF",
    tileBackgroundMovable: "#0056CC",
    tileBackgroundBlank: "transparent",
    gameBoardBackground: "#DDDDDD",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
    },
    h2: {
      fontSize: 28,
      fontWeight: "bold" as const,
    },
    h3: {
      fontSize: 24,
      fontWeight: "600" as const,
    },
    h4: {
      fontSize: 20,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 16,
      fontWeight: "normal" as const,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "normal" as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: "normal" as const,
    },
  },

  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
