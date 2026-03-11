import type { LogicGridPuzzle } from '../types/puzzle';

/**
 * Sample Logic Grid Puzzle: "Pet Owners"
 *
 * Three people (Alice, Bob, Charlie) each have a different pet (Cat, Dog, Bird)
 * and a favorite color (Red, Blue, Green).
 *
 * The player must use the clues to determine which person has which pet and color.
 */
export const samplePuzzle: LogicGridPuzzle = {
  id: 'puzzle-001',
  title: 'Pet Owners',
  description: 'Figure out which person owns which pet and has which favorite color.',
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
    },
    {
      id: 'clue-4',
      text: 'Charlie does not like green.',
      order: 4
    },
    {
      id: 'clue-5',
      text: 'The person with the cat likes green.',
      order: 5
    }
  ],

  solution: [
    // Alice - Bird - Blue
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'pets', itemIndex2: 2 },
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'colors', itemIndex2: 1 },
    { categoryId1: 'pets', itemIndex1: 2, categoryId2: 'colors', itemIndex2: 1 },

    // Bob - Dog - Red
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'pets', itemIndex2: 1 },
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'colors', itemIndex2: 0 },
    { categoryId1: 'pets', itemIndex1: 1, categoryId2: 'colors', itemIndex2: 0 },

    // Charlie - Cat - Green
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'pets', itemIndex2: 0 },
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'colors', itemIndex2: 2 },
    { categoryId1: 'pets', itemIndex1: 0, categoryId2: 'colors', itemIndex2: 2 }
  ]
};
