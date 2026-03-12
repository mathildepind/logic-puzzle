import type { Category, CellState as CellStateType, GridState, LogicGridPuzzle, Relationship } from '../types/puzzle';
import { CellState } from '../types/puzzle';

/**
 * Creates a key for identifying a cell in the grid state
 */
export function createCellKey(
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string,
  itemIndex2: number
): string {
  // Ensure consistent ordering (alphabetically by category ID)
  if (categoryId1 > categoryId2) {
    return `${categoryId2}:${itemIndex2}:${categoryId1}:${itemIndex1}`;
  }
  return `${categoryId1}:${itemIndex1}:${categoryId2}:${itemIndex2}`;
}

/**
 * Parses a cell key back into its components
 */
export function parseCellKey(key: string): {
  categoryId1: string;
  itemIndex1: number;
  categoryId2: string;
  itemIndex2: number;
} {
  const [categoryId1, itemIdx1, categoryId2, itemIdx2] = key.split(':');
  return {
    categoryId1,
    itemIndex1: parseInt(itemIdx1, 10),
    categoryId2,
    itemIndex2: parseInt(itemIdx2, 10)
  };
}

/**
 * Initializes an empty grid state for a puzzle
 */
export function initializeGridState(): GridState {
  return {
    cells: {}
  };
}

/**
 * Gets the state of a specific cell
 */
export function getCellState(
  gridState: GridState,
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string,
  itemIndex2: number
): CellStateType {
  const key = createCellKey(categoryId1, itemIndex1, categoryId2, itemIndex2);
  return gridState.cells[key] || CellState.UNKNOWN;
}

/**
 * Sets the state of a specific cell
 */
export function setCellState(
  gridState: GridState,
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string,
  itemIndex2: number,
  state: CellStateType
): GridState {
  const key = createCellKey(categoryId1, itemIndex1, categoryId2, itemIndex2);
  return {
    cells: {
      ...gridState.cells,
      [key]: state
    }
  };
}

/**
 * Checks if a relationship exists in the solution
 */
export function isRelationshipInSolution(
  solution: Relationship[],
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string,
  itemIndex2: number
): boolean {
  return solution.some(rel => {
    return (
      (rel.categoryId1 === categoryId1 &&
        rel.itemIndex1 === itemIndex1 &&
        rel.categoryId2 === categoryId2 &&
        rel.itemIndex2 === itemIndex2) ||
      (rel.categoryId1 === categoryId2 &&
        rel.itemIndex1 === itemIndex2 &&
        rel.categoryId2 === categoryId1 &&
        rel.itemIndex2 === itemIndex1)
    );
  });
}

/**
 * Checks if the player has correctly solved the puzzle
 */
export function isPuzzleSolved(
  puzzle: LogicGridPuzzle,
  gridState: GridState
): boolean {
  // Check that all solution relationships are marked as YES
  for (const rel of puzzle.solution) {
    const state = getCellState(
      gridState,
      rel.categoryId1,
      rel.itemIndex1,
      rel.categoryId2,
      rel.itemIndex2
    );
    if (state !== CellState.YES) {
      return false;
    }
  }

  // Check that no incorrect relationships are marked as YES
  for (const [key, state] of Object.entries(gridState.cells)) {
    if (state === CellState.YES) {
      const { categoryId1, itemIndex1, categoryId2, itemIndex2 } = parseCellKey(key);
      if (!isRelationshipInSolution(puzzle.solution, categoryId1, itemIndex1, categoryId2, itemIndex2)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * When a cell is set to YES, marks all other cells in the same row and column
 * of that sub-grid section as NO (only overwrites UNKNOWN cells).
 */
export function autoFillOnYes(
  gridState: GridState,
  categories: Category[],
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string,
  itemIndex2: number
): GridState {
  let newState = gridState;

  const cat1 = categories.find(c => c.id === categoryId1);
  const cat2 = categories.find(c => c.id === categoryId2);
  if (!cat1 || !cat2) return newState;

  // Fill the rest of itemIndex1's row in this sub-grid (catId1:item1 vs all other catId2 items)
  for (let j = 0; j < cat2.items.length; j++) {
    if (j === itemIndex2) continue;
    if (getCellState(newState, categoryId1, itemIndex1, categoryId2, j) === CellState.UNKNOWN) {
      newState = setCellState(newState, categoryId1, itemIndex1, categoryId2, j, CellState.NO);
    }
  }

  // Fill the rest of itemIndex2's column in this sub-grid (all other catId1 items vs catId2:item2)
  for (let i = 0; i < cat1.items.length; i++) {
    if (i === itemIndex1) continue;
    if (getCellState(newState, categoryId1, i, categoryId2, itemIndex2) === CellState.UNKNOWN) {
      newState = setCellState(newState, categoryId1, i, categoryId2, itemIndex2, CellState.NO);
    }
  }

  return newState;
}

/**
 * When a YES cell is toggled back to UNKNOWN, clears auto-filled NO cells
 * in the same sub-grid row and column back to UNKNOWN.
 */
export function clearAutoFillOnUnyes(
  gridState: GridState,
  categories: Category[],
  categoryId1: string,
  itemIndex1: number,
  categoryId2: string,
  itemIndex2: number
): GridState {
  let newState = gridState;

  const cat1 = categories.find(c => c.id === categoryId1);
  const cat2 = categories.find(c => c.id === categoryId2);
  if (!cat1 || !cat2) return newState;

  for (let j = 0; j < cat2.items.length; j++) {
    if (j === itemIndex2) continue;
    if (getCellState(newState, categoryId1, itemIndex1, categoryId2, j) === CellState.NO) {
      newState = setCellState(newState, categoryId1, itemIndex1, categoryId2, j, CellState.UNKNOWN);
    }
  }

  for (let i = 0; i < cat1.items.length; i++) {
    if (i === itemIndex1) continue;
    if (getCellState(newState, categoryId1, i, categoryId2, itemIndex2) === CellState.NO) {
      newState = setCellState(newState, categoryId1, i, categoryId2, itemIndex2, CellState.UNKNOWN);
    }
  }

  return newState;
}

/**
 * Cycles through cell states: UNKNOWN -> YES -> NO -> UNKNOWN
 */
export function cycleCellState(currentState: CellStateType): CellStateType {
  switch (currentState) {
    case CellState.UNKNOWN:
      return CellState.NO;
    case CellState.YES:
      return CellState.UNKNOWN;
    case CellState.NO:
      return CellState.YES;
    default:
      return CellState.UNKNOWN;
  }
}

/**
 * Checks the player's solution and returns detailed feedback
 */
export function checkSolution(
  puzzle: LogicGridPuzzle,
  gridState: GridState
): {
  allCellsFilled: boolean;
  isCorrect: boolean;
  incorrectCount: number;
  totalCells: number;
} {
  // Generate all possible cell keys for this puzzle
  const allCellKeys = new Set<string>();
  const categories = puzzle.categories;

  for (let i = 0; i < categories.length; i++) {
    for (let j = i + 1; j < categories.length; j++) {
      const cat1 = categories[i];
      const cat2 = categories[j];

      for (let itemIdx1 = 0; itemIdx1 < cat1.items.length; itemIdx1++) {
        for (let itemIdx2 = 0; itemIdx2 < cat2.items.length; itemIdx2++) {
          const key = createCellKey(cat1.id, itemIdx1, cat2.id, itemIdx2);
          allCellKeys.add(key);
        }
      }
    }
  }

  const totalCells = allCellKeys.size;

  // Check if all cells are filled (not UNKNOWN)
  let unfilledCount = 0;
  for (const key of allCellKeys) {
    const { categoryId1, itemIndex1, categoryId2, itemIndex2 } = parseCellKey(key);
    const state = getCellState(gridState, categoryId1, itemIndex1, categoryId2, itemIndex2);
    if (state === CellState.UNKNOWN) {
      unfilledCount++;
    }
  }

  const allCellsFilled = unfilledCount === 0;

  // Count incorrect cells
  let incorrectCount = 0;

  for (const key of allCellKeys) {
    const { categoryId1, itemIndex1, categoryId2, itemIndex2 } = parseCellKey(key);
    const currentState = getCellState(gridState, categoryId1, itemIndex1, categoryId2, itemIndex2);
    const shouldBeYes = isRelationshipInSolution(puzzle.solution, categoryId1, itemIndex1, categoryId2, itemIndex2);

    const expectedState = shouldBeYes ? CellState.YES : CellState.NO;

    if (currentState !== CellState.UNKNOWN && currentState !== expectedState) {
      incorrectCount++;
    }
  }

  const isCorrect = allCellsFilled && incorrectCount === 0;

  return {
    allCellsFilled,
    isCorrect,
    incorrectCount,
    totalCells
  };
}

/**
 * Validates that a puzzle has a valid, complete solution.
 * Returns an object with validation results and any error messages.
 */
export function validatePuzzle(puzzle: LogicGridPuzzle): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check 1: All categories must have the same number of items
  const itemCounts = puzzle.categories.map(cat => cat.items.length);
  const uniqueCounts = new Set(itemCounts);
  if (uniqueCounts.size > 1) {
    errors.push(
      `All categories must have the same number of items. Found: ${itemCounts.join(', ')}`
    );
    // Return early as other checks assume equal category sizes
    return { isValid: false, errors };
  }

  const itemsPerCategory = itemCounts[0];
  const numCategories = puzzle.categories.length;

  // Check 2: Each item must have exactly one match in every other category
  // Build a map of what each item is matched with
  const matches = new Map<string, Map<string, number>>();

  for (const rel of puzzle.solution) {
    const key1 = `${rel.categoryId1}:${rel.itemIndex1}`;
    const key2 = `${rel.categoryId2}:${rel.itemIndex2}`;

    // Store the relationship in both directions
    if (!matches.has(key1)) {
      matches.set(key1, new Map());
    }
    matches.get(key1)!.set(rel.categoryId2, rel.itemIndex2);

    if (!matches.has(key2)) {
      matches.set(key2, new Map());
    }
    matches.get(key2)!.set(rel.categoryId1, rel.itemIndex1);
  }

  // Verify each item has exactly one match in every other category
  for (const category of puzzle.categories) {
    for (let itemIdx = 0; itemIdx < category.items.length; itemIdx++) {
      const itemKey = `${category.id}:${itemIdx}`;
      const itemMatches = matches.get(itemKey);

      if (!itemMatches) {
        errors.push(
          `Item "${category.items[itemIdx]}" in category "${category.name}" has no matches defined`
        );
        continue;
      }

      // Check matches with every other category
      for (const otherCategory of puzzle.categories) {
        if (otherCategory.id === category.id) continue;

        const matchIndex = itemMatches.get(otherCategory.id);
        if (matchIndex === undefined) {
          errors.push(
            `Item "${category.items[itemIdx]}" (${category.name}) is not matched with any item in category "${otherCategory.name}"`
          );
        } else if (matchIndex < 0 || matchIndex >= otherCategory.items.length) {
          errors.push(
            `Item "${category.items[itemIdx]}" (${category.name}) has invalid match index ${matchIndex} for category "${otherCategory.name}"`
          );
        }
      }
    }
  }

  // Check 3: Verify transitive consistency
  // If A→B and A→C, then B→C must exist
  for (const category of puzzle.categories) {
    for (let itemIdx = 0; itemIdx < category.items.length; itemIdx++) {
      const itemKey = `${category.id}:${itemIdx}`;
      const itemMatches = matches.get(itemKey);

      if (!itemMatches || itemMatches.size < numCategories - 1) {
        continue; // Skip if incomplete (already reported above)
      }

      // Get all matches for this item
      const matchedItems: Array<{ catId: string; itemIdx: number }> = [];
      for (const [catId, idx] of itemMatches.entries()) {
        matchedItems.push({ catId, itemIdx: idx });
      }

      // Check that all matched items are also matched with each other
      for (let i = 0; i < matchedItems.length; i++) {
        for (let j = i + 1; j < matchedItems.length; j++) {
          const item1 = matchedItems[i];
          const item2 = matchedItems[j];

          const item1Key = `${item1.catId}:${item1.itemIdx}`;
          const item1Matches = matches.get(item1Key);

          if (!item1Matches || item1Matches.get(item2.catId) !== item2.itemIdx) {
            const cat = puzzle.categories.find(c => c.id === category.id)!;
            const cat1 = puzzle.categories.find(c => c.id === item1.catId)!;
            const cat2 = puzzle.categories.find(c => c.id === item2.catId)!;

            errors.push(
              `Transitive inconsistency: "${cat.items[itemIdx]}" (${cat.name}) matches ` +
              `"${cat1.items[item1.itemIdx]}" (${cat1.name}) and ` +
              `"${cat2.items[item2.itemIdx]}" (${cat2.name}), ` +
              `but those two items are not matched with each other`
            );
          }
        }
      }
    }
  }

  // Check 4: Verify no duplicate relationships
  const seenRelationships = new Set<string>();
  for (const rel of puzzle.solution) {
    const key = createCellKey(rel.categoryId1, rel.itemIndex1, rel.categoryId2, rel.itemIndex2);
    if (seenRelationships.has(key)) {
      const cat1 = puzzle.categories.find(c => c.id === rel.categoryId1);
      const cat2 = puzzle.categories.find(c => c.id === rel.categoryId2);
      if (cat1 && cat2) {
        errors.push(
          `Duplicate relationship: "${cat1.items[rel.itemIndex1]}" (${cat1.name}) ↔ ` +
          `"${cat2.items[rel.itemIndex2]}" (${cat2.name})`
        );
      }
    }
    seenRelationships.add(key);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
