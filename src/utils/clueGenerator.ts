import type { Category, Clue, ClueConstraint } from '../types/puzzle';
import type { PuzzleTheme } from '../data/puzzleThemes';
import { shuffle } from '../data/puzzleThemes';

/**
 * Helper to get a random integer between min (inclusive) and max (exclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Helper to pick N random items from an array without replacement
 */
function sampleArray<T>(array: T[], count: number): T[] {
  return shuffle([...array]).slice(0, Math.min(count, array.length));
}

/**
 * Track which facts have been revealed to avoid redundancy
 */
interface UsedFact {
  categoryId1: string;
  itemIndex1: number;
  categoryId2: string;
  itemIndex2: number;
}

function factKey(fact: UsedFact): string {
  return `${fact.categoryId1}:${fact.itemIndex1}:${fact.categoryId2}:${fact.itemIndex2}`;
}

/**
 * Solution map for quick lookups
 */
export interface SolutionMap {
  get: (cat1: string, item1: number, cat2: string) => number | undefined;
}

/**
 * Generates direct assignment clues
 * Example: "Anna works in Sales"
 * Template: "{itemA} {verb} {itemB}"
 */
export function generateDirectClues(
  count: number,
  categories: Category[],
  theme: PuzzleTheme,
  solutionMap: SolutionMap,
  usedFacts: Set<string>,
  startOrder: number
): Clue[] {
  const clues: Clue[] = [];
  const maxAttempts = count * 10; // Avoid infinite loops

  for (let attempt = 0; attempt < maxAttempts && clues.length < count; attempt++) {
    // Pick two random categories
    const catPairIdx = randomInt(0, categories.length - 1);
    const cat1 = categories[0]; // Always use first category (usually "People")
    const cat2 = categories[catPairIdx + 1];

    // Pick random item from first category
    const itemIdx1 = randomInt(0, cat1.items.length);
    const itemIdx2 = solutionMap.get(cat1.id, itemIdx1, cat2.id);

    if (itemIdx2 === undefined) continue;

    const key = factKey({
      categoryId1: cat1.id,
      itemIndex1: itemIdx1,
      categoryId2: cat2.id,
      itemIndex2: itemIdx2
    });

    if (usedFacts.has(key)) continue; // Already revealed

    // Get verb from theme
    const themeCat = theme.categories.find(tc => tc.name === cat2.name);
    const verb = themeCat?.singularVerb || 'has';

    // Generate clue text
    const text = `${cat1.items[itemIdx1]} ${verb} ${cat2.items[itemIdx2]}.`;

    clues.push({
      id: `clue-direct-${clues.length + 1}`,
      text,
      order: startOrder + clues.length,
      metadata: {
        type: 'direct',
        constraints: [
          {
            categoryId1: cat1.id,
            itemIndex1: itemIdx1,
            categoryId2: cat2.id,
            itemIndex2: itemIdx2,
            isPositive: true
          }
        ]
      }
    });

    usedFacts.add(key);
  }

  return clues;
}

/**
 * Generates indirect/linking clues
 * Example: "The person who drinks Coffee works in IT"
 * Template: "The {cat1_singular} who {verb2} {item2} {verb3} {item3}"
 * Always uses first category (People) as the implicit subject
 */
export function generateIndirectClues(
  count: number,
  categories: Category[],
  theme: PuzzleTheme,
  solutionMap: SolutionMap,
  usedFacts: Set<string>,
  startOrder: number
): Clue[] {
  const clues: Clue[] = [];
  const maxAttempts = count * 10;

  if (categories.length < 3) {
    // Need at least 3 categories for indirect clues
    return clues;
  }

  for (let attempt = 0; attempt < maxAttempts && clues.length < count; attempt++) {
    // Always use first category as the subject (usually "People")
    const cat1 = categories[0];
    const cat2 = categories[1];
    const cat3 = categories[2];

    // Pick random item from first category
    const itemIdx1 = randomInt(0, cat1.items.length);

    // Find matching items in categories 2 and 3
    const itemIdx2 = solutionMap.get(cat1.id, itemIdx1, cat2.id);
    const itemIdx3 = solutionMap.get(cat1.id, itemIdx1, cat3.id);

    if (itemIdx2 === undefined || itemIdx3 === undefined) continue;

    // Check if these facts are already used
    const key12 = factKey({
      categoryId1: cat1.id,
      itemIndex1: itemIdx1,
      categoryId2: cat2.id,
      itemIndex2: itemIdx2
    });
    const key13 = factKey({
      categoryId1: cat1.id,
      itemIndex1: itemIdx1,
      categoryId2: cat3.id,
      itemIndex2: itemIdx3
    });

    if (usedFacts.has(key12) || usedFacts.has(key13)) continue;

    // Get verbs from theme
    const themeCat2 = theme.categories.find(tc => tc.name === cat2.name);
    const themeCat3 = theme.categories.find(tc => tc.name === cat3.name);
    const verb2 = themeCat2?.singularVerb || 'has';
    const verb3 = themeCat3?.singularVerb || 'has';

    // Generate clue text
    // Format: "The person who [verb2] [item2] [verb3] [item3]"
    const irregularSingulars: Record<string, string> = { people: 'person' };
    const lowerName = cat1.name.toLowerCase();
    const singularCat1 = irregularSingulars[lowerName] ?? lowerName.replace(/s$/, '');
    const text = `The ${singularCat1} who ${verb2} ${cat2.items[itemIdx2]} ${verb3} ${cat3.items[itemIdx3]}.`;

    clues.push({
      id: `clue-indirect-${clues.length + 1}`,
      text,
      order: startOrder + clues.length,
      metadata: {
        type: 'indirect',
        constraints: [
          {
            categoryId1: cat1.id,
            itemIndex1: itemIdx1,
            categoryId2: cat2.id,
            itemIndex2: itemIdx2,
            isPositive: true
          },
          {
            categoryId1: cat1.id,
            itemIndex1: itemIdx1,
            categoryId2: cat3.id,
            itemIndex2: itemIdx3,
            isPositive: true
          }
        ]
      }
    });

    usedFacts.add(key12);
    usedFacts.add(key13);
  }

  return clues;
}

/**
 * Generates negative constraint clues
 * Example: "Ben does not work in Marketing or Finance"
 * Template: "{itemA} does not {verb} {itemB} or {itemC}"
 */
export function generateNegativeClues(
  count: number,
  categories: Category[],
  theme: PuzzleTheme,
  solutionMap: SolutionMap,
  usedFacts: Set<string>,
  startOrder: number
): Clue[] {
  const clues: Clue[] = [];
  const maxAttempts = count * 10;

  for (let attempt = 0; attempt < maxAttempts && clues.length < count; attempt++) {
    // Pick two categories
    const catPairIdx = randomInt(0, categories.length - 1);
    const cat1 = categories[0]; // Usually "People"
    const cat2 = categories[catPairIdx + 1];

    // Pick random item from first category
    const itemIdx1 = randomInt(0, cat1.items.length);
    const correctIdx2 = solutionMap.get(cat1.id, itemIdx1, cat2.id);

    if (correctIdx2 === undefined) continue;

    // Pick 2 incorrect items from cat2 (not the correct one)
    const incorrectIndices = [];
    for (let i = 0; i < cat2.items.length; i++) {
      if (i !== correctIdx2) {
        incorrectIndices.push(i);
      }
    }

    if (incorrectIndices.length < 2) continue;

    const [wrongIdx1, wrongIdx2] = sampleArray(incorrectIndices, 2);

    // Get verb from theme (use plural form if available)
    const themeCat = theme.categories.find(tc => tc.name === cat2.name);
    const verb = themeCat?.pluralVerb || themeCat?.singularVerb || 'have';

    // Generate clue text
    const text = `${cat1.items[itemIdx1]} does not ${verb} ${cat2.items[wrongIdx1]} or ${cat2.items[wrongIdx2]}.`;

    clues.push({
      id: `clue-negative-${clues.length + 1}`,
      text,
      order: startOrder + clues.length,
      metadata: {
        type: 'negative',
        constraints: [
          {
            categoryId1: cat1.id,
            itemIndex1: itemIdx1,
            categoryId2: cat2.id,
            itemIndex2: wrongIdx1,
            isPositive: false
          },
          {
            categoryId1: cat1.id,
            itemIndex1: itemIdx1,
            categoryId2: cat2.id,
            itemIndex2: wrongIdx2,
            isPositive: false
          }
        ]
      }
    });
  }

  return clues;
}

/**
 * Main clue generation function
 * Generates a mix of clue types with specified distribution
 */
export function generateClues(
  categories: Category[],
  theme: PuzzleTheme,
  solutionMap: SolutionMap,
  targetCount: number = 10
): Clue[] {
  const usedFacts = new Set<string>();

  // Calculate clue counts (40% direct, 40% indirect, 20% negative)
  const directCount = Math.round(targetCount * 0.4);
  const indirectCount = Math.round(targetCount * 0.4);
  const negativeCount = targetCount - directCount - indirectCount;

  const clues: Clue[] = [];

  // Generate each type
  const directClues = generateDirectClues(
    directCount,
    categories,
    theme,
    solutionMap,
    usedFacts,
    1
  );
  clues.push(...directClues);

  const indirectClues = generateIndirectClues(
    indirectCount,
    categories,
    theme,
    solutionMap,
    usedFacts,
    clues.length + 1
  );
  clues.push(...indirectClues);

  const negativeClues = generateNegativeClues(
    negativeCount,
    categories,
    theme,
    solutionMap,
    usedFacts,
    clues.length + 1
  );
  clues.push(...negativeClues);

  // Shuffle clues for variety
  const shuffledClues = shuffle(clues);

  // Reassign order numbers
  return shuffledClues.map((clue, idx) => ({
    ...clue,
    order: idx + 1
  }));
}
