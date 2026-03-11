// Represents a category in the puzzle (e.g., "People", "Colors", "Pets")
export interface Category {
  id: string;
  name: string;
  items: string[]; // e.g., ["Alice", "Bob", "Charlie"]
}

// Represents a constraint derived from a clue (for solver)
export interface ClueConstraint {
  categoryId1: string;
  itemIndex1: number;
  categoryId2: string;
  itemIndex2: number;
  isPositive: boolean; // true = YES, false = NO
}

// Represents a single clue that helps solve the puzzle
export interface Clue {
  id: string;
  text: string;
  order: number; // Display order
  metadata?: {
    type: 'direct' | 'indirect' | 'negative';
    constraints: ClueConstraint[];
  };
}

// Represents the state of a single cell in the grid
export type CellState = 'unknown' | 'yes' | 'no';

export const CellState = {
  UNKNOWN: 'unknown' as const,
  YES: 'yes' as const,
  NO: 'no' as const
};

// Represents a relationship between two items across categories
export interface Relationship {
  categoryId1: string;
  itemIndex1: number;
  categoryId2: string;
  itemIndex2: number;
}

// The complete puzzle definition
export interface LogicGridPuzzle {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: Category[];
  clues: Clue[];
  solution: Relationship[]; // The correct relationships
}

// Tracks the player's current progress on the grid
export interface GridState {
  // Key format: "categoryId1:itemIdx1:categoryId2:itemIdx2"
  // Value: the cell state (yes/no/unknown)
  cells: Record<string, CellState>;
}

// The complete puzzle state including player progress
export interface PuzzleState {
  puzzle: LogicGridPuzzle | null;
  gridState: GridState;
  isComplete: boolean;
  startedAt?: Date;
  completedAt?: Date;
}
