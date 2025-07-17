export interface PuzzleLevel {
  id: string;
  name: string;
  description: string;
  rows: number;
  cols: number;
  difficulty: "easy" | "medium" | "hard" | "expert";
}

export interface PuzzleImage {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
  category: string;
}

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: "easy-3x3",
    name: "Easy",
    description: "Perfect for beginners",
    rows: 3,
    cols: 3,
    difficulty: "easy",
  },
  {
    id: "medium-4x4",
    name: "Medium",
    description: "A good challenge",
    rows: 4,
    cols: 4,
    difficulty: "medium",
  },
  {
    id: "hard-5x5",
    name: "Hard",
    description: "For experienced players",
    rows: 5,
    cols: 5,
    difficulty: "hard",
  },
  {
    id: "expert-6x6",
    name: "Expert",
    description: "Ultimate challenge",
    rows: 6,
    cols: 6,
    difficulty: "expert",
  },
];

export const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    id: "animals-cat",
    name: "Black & White Cat",
    fullImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop",
    category: "animals",
  },
  {
    id: "animals-elephant",
    name: "Elephant Portrait",
    fullImage: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=300&h=300&fit=crop",
    category: "animals",
  },
  {
    id: "nature-1",
    name: "Mountain Landscape",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    category: "nature",
  },
  {
    id: "nature-2",
    name: "Forest Path",
    thumbnail: "https://images.unsplash.com/photo-1623967680551-3e4694e2c9ad?w=300&h=300&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1623967680551-3e4694e2c9ad?w=800&h=800&fit=crop",
    category: "nature",
  },
  {
    id: "nature-3",
    name: "Ocean Waves",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
    category: "nature",
  },
  {
    id: "nature-4",
    name: "Sunset Sky",
    fullImage: "https://images.unsplash.com/photo-1446000649099-aadcb717d36f?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1446000649099-aadcb717d36f?w=300&h=300&fit=crop",
    category: "nature",
  },
  {
    id: "abstract-1",
    name: "Colorful Abstract",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=300&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=800&fit=crop",
    category: "abstract",
  },
  {
    id: "landscapes-desert",
    name: "Desert Sunset",
    fullImage: "https://images.unsplash.com/photo-1480004902249-cdb28d6a01a4?w=800&h=800&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1480004902249-cdb28d6a01a4?w=300&h=300&fit=crop",
    category: "landscapes",
  },

  {
    id: "animals-toucan",
    name: "Toucan",
    thumbnail: "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?w=300&h=300&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?w=800&h=800&fit=crop",
    category: "abstract",
  },
];
