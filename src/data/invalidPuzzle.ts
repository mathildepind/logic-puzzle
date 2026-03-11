import type { LogicGridPuzzle } from '../types/puzzle';

/**
 * INVALID Logic Grid Puzzle: "Pet Owners" (Broken Version)
 *
 * This puzzle is intentionally broken to test validation.
 * It has transitive inconsistencies in the solution.
 *
 * Three people (Alice, Bob, Charlie) each have a different pet (Cat, Dog, Bird)
 * and a favorite color (Red, Blue, Green).
 */
export const invalidPuzzle: LogicGridPuzzle = {
  id: 'puzzle-invalid',
  title: 'Pet Owners (Invalid)',
  description: 'This puzzle has an invalid solution for testing purposes.',
  difficulty: 'easy',

  categories: [
    {
      id: 'people',
      name: 'People',
      items: ['Alice', 'Bob', 'Charlie']
    },
    {
      id: 'pets',
      name: 'Pets',
      items: ['Cat', 'Dog', 'Bird']
    },
    {
      id: 'colors',
      name: 'Colors',
      items: ['Red', 'Blue', 'Green']
    }
  ],

  clues: [
    {
      id: 'clue-1',
      text: 'Alice does not own the dog.',
      order: 1
    },
    {
      id: 'clue-2',
      text: 'The person who likes blue owns the bird.',
      order: 2
    },
    {
      id: 'clue-3',
      text: 'Bob\'s favorite color is red.',
      order: 3
    }
  ],

  solution: [
    // Alice - Bird - Blue
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'pets', itemIndex2: 2 },
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'colors', itemIndex2: 1 },
    // MISSING: Bird - Blue relationship!

    // Bob - Dog - Red
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'pets', itemIndex2: 1 },
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'colors', itemIndex2: 0 },
    { categoryId1: 'pets', itemIndex1: 1, categoryId2: 'colors', itemIndex2: 0 },

    // Charlie - Cat - Green
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'pets', itemIndex2: 0 },
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'colors', itemIndex2: 2 },
    // WRONG: Should be Cat - Green, but we have Cat - Red!
    { categoryId1: 'pets', itemIndex1: 0, categoryId2: 'colors', itemIndex2: 0 }
  ]
};
