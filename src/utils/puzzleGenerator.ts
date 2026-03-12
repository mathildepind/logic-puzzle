import type { Category, LogicGridPuzzle, Relationship } from '../types/puzzle';
import { selectRandomTheme, shuffle, type PuzzleTheme } from '../data/puzzleThemes';
import type { Category } from '../types/puzzle';
import { validatePuzzle } from './gridHelpers';
import { generateClues } from './clueGenerator';

/**
 * Generates a valid solution for a logic grid puzzle using permutation-based approach
 *
 * Algorithm:
 * 1. Assign identity mapping [0,1,2,3,4] to first category
 * 2. Create random shuffled permutations for other categories
 * 3. Build all pairwise relationships (transitive closure automatic)
 *
 * For 3 categories with 5 items: Creates 15 relationships (3 category pairs × 5 items)
 */
export function generateSolution(categories: Category[]): Relationship[] {
  if (categories.length < 2) {
    throw new Error('Need at least 2 categories to generate solution');
  }

  const itemCount = categories[0].items.length;

  // Verify all categories have same item count
  for (const cat of categories) {
    if (cat.items.length !== itemCount) {
      throw new Error('All categories must have the same number of items');
    }
  }

  // Step 1: Create assignment mappings for each category
  // First category gets identity mapping [0, 1, 2, 3, 4]
  // Other categories get random permutations
  const assignments = new Map<string, number[]>();
  const baseIndices = Array.from({ length: itemCount }, (_, i) => i);

  assignments.set(categories[0].id, baseIndices);

  for (let i = 1; i < categories.length; i++) {
    assignments.set(categories[i].id, shuffle([...baseIndices]));
  }

  // Step 2: Build relationships with automatic transitive closure
  // For each item position (e.g., 0-4), create all pairwise relationships
  const relationships: Relationship[] = [];

  for (let itemIdx = 0; itemIdx < itemCount; itemIdx++) {
    // Get the assigned indices for this item across all categories
    const itemAssignments: Array<{ categoryId: string; itemIndex: number }> = [];

    for (const category of categories) {
      const assignedIndex = assignments.get(category.id)![itemIdx];
      itemAssignments.push({
        categoryId: category.id,
        itemIndex: assignedIndex
      });
    }

    // Create all pairwise relationships (combinations of 2)
    for (let i = 0; i < itemAssignments.length; i++) {
      for (let j = i + 1; j < itemAssignments.length; j++) {
        relationships.push({
          categoryId1: itemAssignments[i].categoryId,
          itemIndex1: itemAssignments[i].itemIndex,
          categoryId2: itemAssignments[j].categoryId,
          itemIndex2: itemAssignments[j].itemIndex
        });
      }
    }
  }

  return relationships;
}

/**
 * Helper to build a lookup map for quick solution queries
 * Maps "catId1:catId2:itemIdx1" -> itemIdx2
 */
export function buildSolutionMap(solution: Relationship[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const rel of solution) {
    // Store both directions for easy lookup
    const key1 = `${rel.categoryId1}:${rel.categoryId2}:${rel.itemIndex1}`;
    const key2 = `${rel.categoryId2}:${rel.categoryId1}:${rel.itemIndex2}`;

    map.set(key1, rel.itemIndex2);
    map.set(key2, rel.itemIndex1);
  }

  return map;
}

/**
 * Query solution map to find which item from cat2 matches item from cat1
 */
export function queryMatch(
  solutionMap: Map<string, number>,
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string
): number | undefined {
  const key = `${categoryId1}:${categoryId2}:${itemIndex1}`;
  return solutionMap.get(key);
}

/**
 * Main puzzle generation function (scaffolding - will be completed in later phases)
 *
 * @param difficulty Puzzle difficulty level
 * @param options Generation options
 * @returns Complete logic grid puzzle
 */
function resolveTheme(
  theme: PuzzleTheme,
  itemCount: number
): { theme: PuzzleTheme; categories: Category[] } {
  const categories: Category[] = theme.categories.map((cat, idx) => ({
    id: `cat${idx}`,
    name: cat.name,
    items: shuffle(cat.items).slice(0, itemCount)
  }));
  return { theme, categories };
}

export function generatePuzzle(
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  options?: {
    categoryCount?: number;
    itemCount?: number;
    clueCount?: number;
    maxAttempts?: number;
    theme?: PuzzleTheme;
  }
): LogicGridPuzzle {
  const config = {
    categoryCount: 3,
    itemCount: 5,
    clueCount: 10,
    maxAttempts: 50,
    ...options
  };

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      // Step 1: Select theme and create categories
      const { theme, categories } = config.theme
        ? resolveTheme(config.theme, config.itemCount)
        : selectRandomTheme(config.itemCount);

      // Ensure we have the right number of categories
      if (categories.length < config.categoryCount) {
        continue; // Try again with different theme
      }

      // Use only the requested number of categories
      const selectedCategories = categories.slice(0, config.categoryCount);

      // Step 2: Generate solution
      const solution = generateSolution(selectedCategories);

      // Step 3: Validate solution structure
      const partialPuzzle = {
        id: `temp-${attempt}`,
        title: theme.name,
        description: theme.description,
        difficulty,
        categories: selectedCategories,
        clues: [], // Will be added later
        solution
      };

      const validation = validatePuzzle(partialPuzzle);
      if (!validation.isValid) {
        console.warn(`Attempt ${attempt + 1}: Invalid solution`, validation.errors);
        continue;
      }

      // Step 4: Generate clues
      const solutionMapRaw = buildSolutionMap(solution);
      const solutionMap = {
        get: (cat1: string, item1: number, cat2: string) =>
          queryMatch(solutionMapRaw, cat1, item1, cat2)
      };

      const clues = generateClues(selectedCategories, theme, solutionMap, config.clueCount);

      // Step 5: Build complete puzzle
      const puzzle: LogicGridPuzzle = {
        id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: theme.name,
        description: theme.description,
        difficulty,
        categories: selectedCategories,
        clues,
        solution
      };

      // Step 6: Verify solvability (TODO - Phase 3)
      // For now, skip solvability check and return puzzle
      console.log(`Generated puzzle "${puzzle.title}" with ${solution.length} relationships`);

      return puzzle;
    } catch (error) {
      console.warn(`Generation attempt ${attempt + 1} failed:`, error);
    }
  }

  throw new Error(`Failed to generate valid puzzle after ${config.maxAttempts} attempts`);
}
