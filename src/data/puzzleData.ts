export interface PuzzleLevel {
  id: string;
  name: string;
  size: number;
  difficulty: "easy" | "medium" | "hard" | "brain-buster";
  description: string;
}

export interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  category: "nature" | "animals" | "abstract" | "landscapes";
}

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: "easy",
    name: "Easy",
    size: 2,
    difficulty: "easy",
    description: "2x2 grid - Perfect for beginners",
  },
  {
    id: "medium",
    name: "Medium",
    size: 3,
    difficulty: "medium",
    description: "3x3 grid - Classic sliding puzzle",
  },
  {
    id: "hard",
    name: "Hard",
    size: 4,
    difficulty: "hard",
    description: "4x4 grid - For experienced players",
  },
  {
    id: "brain-buster",
    name: "Brain Buster",
    size: 5,
    difficulty: "brain-buster",
    description: "5x5 grid - Ultimate challenge",
  },
];

export const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    id: "animals-cat",
    name: "Black & White Cat",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
    category: "animals",
  },
  {
    id: "nature-1",
    name: "Forest Path",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop",
    category: "nature",
  },
  {
    id: "nature-2",
    name: "Mountain Lake",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
    category: "nature",
  },
  {
    id: "animals-1",
    name: "Lion Portrait",
    url: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=200&h=200&fit=crop",
    category: "animals",
  },
  {
    id: "animals-2",
    name: "Elephant Family",
    url: "https://images.unsplash.com/photo-1557050543-4d5f2e07c5d9?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1557050543-4d5f2e07c5d9?w=200&h=200&fit=crop",
    category: "animals",
  },
  {
    id: "abstract-1",
    name: "Colorful Abstract",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=200&fit=crop",
    category: "abstract",
  },
  {
    id: "landscapes-1",
    name: "Desert Sunset",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
    category: "landscapes",
  },
  {
    id: "landscapes-2",
    name: "Ocean Waves",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
    category: "landscapes",
  },
  {
    id: "abstract-2",
    name: "Geometric Patterns",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    category: "abstract",
  },
];

export const getRandomImage = (): PuzzleImage => {
  const randomIndex = Math.floor(Math.random() * PUZZLE_IMAGES.length);
  return PUZZLE_IMAGES[randomIndex];
};

export const getImagesByCategory = (category: string): PuzzleImage[] => {
  return PUZZLE_IMAGES.filter((img) => img.category === category);
};
