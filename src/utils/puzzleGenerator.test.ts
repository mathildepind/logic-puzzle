import { describe, it, expect } from 'vitest';
import { generateSolution, generatePuzzle, buildSolutionMap, queryMatch } from './puzzleGenerator';
import { validatePuzzle } from './gridHelpers';
import type { Category } from '../types/puzzle';

describe('Puzzle Generator', () => {
  describe('generateSolution', () => {
    it('should generate correct number of relationships for 3 categories with 5 items', () => {
      const categories: Category[] = [
        { id: 'cat0', name: 'People', items: ['A', 'B', 'C', 'D', 'E'] },
        { id: 'cat1', name: 'Pets', items: ['1', '2', '3', '4', '5'] },
        { id: 'cat2', name: 'Colors', items: ['X', 'Y', 'Z', 'W', 'V'] }
      ];

      const solution = generateSolution(categories);

      // 3 categories choose 2 = 3 pairs
      // 3 pairs × 5 items = 15 relationships
      expect(solution.length).toBe(15);
    });

    it('should generate valid solution that passes validation', () => {
      const categories: Category[] = [
        { id: 'cat0', name: 'People', items: ['A', 'B', 'C', 'D', 'E'] },
        { id: 'cat1', name: 'Pets', items: ['1', '2', '3', '4', '5'] },
        { id: 'cat2', name: 'Colors', items: ['X', 'Y', 'Z', 'W', 'V'] }
      ];

      const solution = generateSolution(categories);

      const puzzle = {
        id: 'test',
        title: 'Test',
        description: 'Test',
        difficulty: 'medium' as const,
        categories,
        clues: [],
        solution
      };

      const validation = validatePuzzle(puzzle);

      if (!validation.isValid) {
        console.log('Validation errors:', validation.errors);
      }

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should throw error for categories with different item counts', () => {
      const categories: Category[] = [
        { id: 'cat0', name: 'People', items: ['A', 'B', 'C'] },
        { id: 'cat1', name: 'Pets', items: ['1', '2', '3', '4', '5'] } // Different count!
      ];

      expect(() => generateSolution(categories)).toThrow(
        'All categories must have the same number of items'
      );
    });

    it('should generate different solutions on multiple calls', () => {
      const categories: Category[] = [
        { id: 'cat0', name: 'People', items: ['A', 'B', 'C', 'D', 'E'] },
        { id: 'cat1', name: 'Pets', items: ['1', '2', '3', '4', '5'] },
        { id: 'cat2', name: 'Colors', items: ['X', 'Y', 'Z', 'W', 'V'] }
      ];

      const solution1 = generateSolution(categories);
      const solution2 = generateSolution(categories);

      // Convert to strings for comparison
      const str1 = JSON.stringify(solution1.sort());
      const str2 = JSON.stringify(solution2.sort());

      // Should be different (very unlikely to be same with random permutations)
      // Note: This test could theoretically fail with probability 1/(5!)^2 ≈ 0.000007%
      expect(str1).not.toBe(str2);
    });
  });

  describe('buildSolutionMap', () => {
    it('should create bidirectional lookup map', () => {
      const solution = [
        { categoryId1: 'cat0', itemIndex1: 0, categoryId2: 'cat1', itemIndex2: 2 },
        { categoryId1: 'cat0', itemIndex1: 1, categoryId2: 'cat1', itemIndex2: 3 }
      ];

      const map = buildSolutionMap(solution);

      // Forward lookup
      expect(queryMatch(map, 'cat0', 0, 'cat1')).toBe(2);
      expect(queryMatch(map, 'cat0', 1, 'cat1')).toBe(3);

      // Reverse lookup
      expect(queryMatch(map, 'cat1', 2, 'cat0')).toBe(0);
      expect(queryMatch(map, 'cat1', 3, 'cat0')).toBe(1);
    });
  });

  describe('generatePuzzle', () => {
    it('should generate complete puzzle with valid structure', () => {
      const puzzle = generatePuzzle('medium', {
        categoryCount: 3,
        itemCount: 5,
        clueCount: 10
      });

      expect(puzzle).toBeDefined();
      expect(puzzle.id).toBeTruthy();
      expect(puzzle.title).toBeTruthy();
      expect(puzzle.categories.length).toBe(3);
      expect(puzzle.categories[0].items.length).toBe(5);
      expect(puzzle.solution.length).toBe(15);

      // Validate structure
      const validation = validatePuzzle(puzzle);
      if (!validation.isValid) {
        console.log('Generated puzzle errors:', validation.errors);
      }
      expect(validation.isValid).toBe(true);
    });

    it('should generate multiple unique puzzles', () => {
      const puzzle1 = generatePuzzle('medium');
      const puzzle2 = generatePuzzle('medium');

      // Should have different IDs
      expect(puzzle1.id).not.toBe(puzzle2.id);

      // Solutions should be different (very high probability)
      const sol1 = JSON.stringify(puzzle1.solution);
      const sol2 = JSON.stringify(puzzle2.solution);
      expect(sol1).not.toBe(sol2);
    });

    it('should handle generation with different item counts', () => {
      const puzzle3 = generatePuzzle('medium', { itemCount: 3 });
      const puzzle5 = generatePuzzle('medium', { itemCount: 5 });

      expect(puzzle3.categories[0].items.length).toBe(3);
      expect(puzzle3.solution.length).toBe(9); // 3 pairs × 3 items

      expect(puzzle5.categories[0].items.length).toBe(5);
      expect(puzzle5.solution.length).toBe(15); // 3 pairs × 5 items
    });
  });
});
