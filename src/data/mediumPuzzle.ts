import type { LogicGridPuzzle } from '../types/puzzle';

/**
 * Medium Logic Grid Puzzle: "Office Workers"
 *
 * Five office workers (Anna, Ben, Carlos, Diana, Eric) each work in a different
 * department (Sales, Marketing, IT, Finance, HR) and prefer a different beverage
 * (Coffee, Tea, Water, Soda, Juice).
 *
 * The player must use the clues to determine which person works in which department
 * and has which beverage preference.
 */
export const mediumPuzzle: LogicGridPuzzle = {
  id: 'puzzle-002',
  title: 'Office Workers',
  description: 'Figure out which person works in which department and prefers which beverage.',
  difficulty: 'medium',

  categories: [
    {
      id: 'people',
      name: 'People',
      items: ['Anna', 'Ben', 'Carlos', 'Diana', 'Eric']
    },
    {
      id: 'departments',
      name: 'Departments',
      items: ['Sales', 'Marketing', 'IT', 'Finance', 'HR']
    },
    {
      id: 'beverages',
      name: 'Beverages',
      items: ['Coffee', 'Tea', 'Water', 'Soda', 'Juice']
    }
  ],

  clues: [
    {
      id: 'clue-1',
      text: 'Anna works in Sales.',
      order: 1
    },
    {
      id: 'clue-2',
      text: 'The person who drinks Coffee works in IT.',
      order: 2
    },
    {
      id: 'clue-3',
      text: 'Ben does not work in Marketing or Finance.',
      order: 3
    },
    {
      id: 'clue-4',
      text: 'Diana drinks Tea.',
      order: 4
    },
    {
      id: 'clue-5',
      text: 'The Marketing employee drinks Water.',
      order: 5
    },
    {
      id: 'clue-6',
      text: 'Carlos works in Finance.',
      order: 6
    },
    {
      id: 'clue-7',
      text: 'Eric does not drink Coffee or Soda.',
      order: 7
    },
    {
      id: 'clue-8',
      text: 'The HR employee drinks Juice.',
      order: 8
    },
    {
      id: 'clue-9',
      text: 'Ben drinks Soda.',
      order: 9
    },
    {
      id: 'clue-10',
      text: 'Anna does not drink Water.',
      order: 10
    }
  ],

  solution: [
    // Anna - Sales - Coffee
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'departments', itemIndex2: 0 },
    { categoryId1: 'people', itemIndex1: 0, categoryId2: 'beverages', itemIndex2: 0 },
    { categoryId1: 'departments', itemIndex1: 0, categoryId2: 'beverages', itemIndex2: 0 },

    // Ben - IT - Soda
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'departments', itemIndex2: 2 },
    { categoryId1: 'people', itemIndex1: 1, categoryId2: 'beverages', itemIndex2: 3 },
    { categoryId1: 'departments', itemIndex1: 2, categoryId2: 'beverages', itemIndex2: 3 },

    // Carlos - Finance - Water
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'departments', itemIndex2: 3 },
    { categoryId1: 'people', itemIndex1: 2, categoryId2: 'beverages', itemIndex2: 2 },
    { categoryId1: 'departments', itemIndex1: 3, categoryId2: 'beverages', itemIndex2: 2 },

    // Diana - Marketing - Tea
    { categoryId1: 'people', itemIndex1: 3, categoryId2: 'departments', itemIndex2: 1 },
    { categoryId1: 'people', itemIndex1: 3, categoryId2: 'beverages', itemIndex2: 1 },
    { categoryId1: 'departments', itemIndex1: 1, categoryId2: 'beverages', itemIndex2: 1 },

    // Eric - HR - Juice
    { categoryId1: 'people', itemIndex1: 4, categoryId2: 'departments', itemIndex2: 4 },
    { categoryId1: 'people', itemIndex1: 4, categoryId2: 'beverages', itemIndex2: 4 },
    { categoryId1: 'departments', itemIndex1: 4, categoryId2: 'beverages', itemIndex2: 4 }
  ]
};
