import type { LogicGridPuzzle } from '../types/puzzle';

/**
 * Hard Logic Grid Puzzle: "Restaurant Night"
 *
 * Six friends (Alice, Bob, Carol, David, Emma, Frank) each ordered a different
 * main course (Steak, Pasta, Fish, Burger, Salad, Pizza) and a different drink
 * (Wine, Beer, Juice, Soda, Water, Lemonade).
 *
 * The player must use the clues to determine which person ordered which meal
 * and which drink.
 */
export const hardPuzzle: LogicGridPuzzle = {
  id: 'puzzle-003',
  title: 'Restaurant Night',
  description: 'Figure out which person ordered which meal and drink at the restaurant.',
  difficulty: 'hard',

  categories: [
    {
      id: 'people',
      name: 'People',
      items: ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank']
    },
    {
      id: 'meals',
      name: 'Meals',
      items: ['Steak', 'Pasta', 'Fish', 'Burger', 'Salad', 'Pizza']
    },
    {
      id: 'drinks',
      name: 'Drinks',
      items: ['Wine', 'Beer', 'Juice', 'Soda', 'Water', 'Lemonade']
    }
  ],

  clues: [
    {
      id: 'clue-1',
      text: 'Alice ordered the Steak.',
      order: 1
    },
    {
      id: 'clue-2',
      text: 'The person who ordered Fish drinks Beer.',
      order: 2
    },
    {
      id: 'clue-3',
      text: 'Bob did not order Pasta, Burger, or Salad.',
      order: 3
    },
    {
      id: 'clue-4',
      text: 'The person who ordered Pasta drinks Soda.',
      order: 4
    },
    {
      id: 'clue-5',
      text: 'David ordered the Burger.',
      order: 5
    },
    {
      id: 'clue-6',
      text: 'The person who ordered Salad drinks Juice.',
      order: 6
    },
    {
      id: 'clue-7',
      text: 'Frank drinks Lemonade.',
      order: 7
    },
    {
      id: 'clue-8',
      text: 'Alice drinks Wine.',
      order: 8
    },
    {
      id: 'clue-9',
      text: 'Bob ordered the Fish.',
      order: 9
    },
    {
      id: 'clue-10',
      text: 'David drinks Water.',
      order: 10
    },
    {
      id: 'clue-11',
      text: 'The person who ordered Pizza drinks Lemonade.',
      order: 11
    },
    {
      id: 'clue-12',
      text: 'Emma does not drink Beer, Wine, or Soda.',
      order: 12
    },
    {
      id: 'clue-13',
      text: 'Carol does not order Steak, Fish, or Burger.',
      order: 13
    },
    {
      id: 'clue-14',
      text: 'Frank does not order Steak or Salad.',
      order: 14
    }
  ],

  solution: [
    // Alice - Steak - Wine
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'meals', itemIndex2: 0 },
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'drinks', itemIndex2: 0 },
    { categoryId1: 'meals', itemIndex1: 0, categoryId2: 'drinks', itemIndex2: 0 },

    // Bob - Fish - Beer
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'meals', itemIndex2: 2 },
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'drinks', itemIndex2: 1 },
    { categoryId1: 'meals', itemIndex1: 2, categoryId2: 'drinks', itemIndex2: 1 },

    // Carol - Pasta - Soda
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'meals', itemIndex2: 1 },
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'drinks', itemIndex2: 3 },
    { categoryId1: 'meals', itemIndex1: 1, categoryId2: 'drinks', itemIndex2: 3 },

    // David - Burger - Water
    { categoryId1: 'people', itemIndex1: 3, categoryId2: 'meals', itemIndex2: 3 },
    { categoryId1: 'people', itemIndex1: 3, categoryId2: 'drinks', itemIndex2: 4 },
    { categoryId1: 'meals', itemIndex1: 3, categoryId2: 'drinks', itemIndex2: 4 },

    // Emma - Salad - Juice
    { categoryId1: 'people', itemIndex1: 4, categoryId2: 'meals', itemIndex2: 4 },
    { categoryId1: 'people', itemIndex1: 4, categoryId2: 'drinks', itemIndex2: 2 },
    { categoryId1: 'meals', itemIndex1: 4, categoryId2: 'drinks', itemIndex2: 2 },

    // Frank - Pizza - Lemonade
    { categoryId1: 'people', itemIndex1: 5, categoryId2: 'meals', itemIndex2: 5 },
    { categoryId1: 'people', itemIndex1: 5, categoryId2: 'drinks', itemIndex2: 5 },
    { categoryId1: 'meals', itemIndex1: 5, categoryId2: 'drinks', itemIndex2: 5 }
  ]
};
