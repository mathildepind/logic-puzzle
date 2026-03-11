import { describe, it, expect } from 'vitest';
import { validatePuzzle } from './gridHelpers';
import { samplePuzzle } from '../data/samplePuzzle';
import { mediumPuzzle } from '../data/mediumPuzzle';
import { hardPuzzle } from '../data/hardPuzzle';
import { invalidPuzzle } from '../data/invalidPuzzle';
import type { LogicGridPuzzle } from '../types/puzzle';

describe('Puzzle Validation', () => {
  describe('validatePuzzle', () => {
    it('should validate the sample puzzle (easy)', () => {
      const result = validatePuzzle(samplePuzzle);

      if (!result.isValid) {
        console.log('Sample puzzle errors:', result.errors);
      }

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate the medium puzzle', () => {
      const result = validatePuzzle(mediumPuzzle);

      if (!result.isValid) {
        console.log('Medium puzzle errors:', result.errors);
      }

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate the hard puzzle', () => {
      const result = validatePuzzle(hardPuzzle);

      if (!result.isValid) {
        console.log('Hard puzzle errors:', result.errors);
      }

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject the intentionally invalid puzzle', () => {
      const result = validatePuzzle(invalidPuzzle);

      console.log('\n=== Invalid Puzzle Validation Results ===');
      console.log('Is Valid:', result.isValid);
      console.log('Errors found:');
      result.errors.forEach((error, idx) => {
        console.log(`  ${idx + 1}. ${error}`);
      });
      console.log('=========================================\n');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Should catch either missing relationships or transitive inconsistencies
      expect(
        result.errors.some(e =>
          e.includes('not matched') ||
          e.includes('Transitive inconsistency')
        )
      ).toBe(true);
    });

    it('should detect when categories have different item counts', () => {
      const invalidPuzzle: LogicGridPuzzle = {
        id: 'invalid-1',
        title: 'Invalid Puzzle',
        description: 'Test',
        difficulty: 'easy',
        categories: [
          { id: 'cat1', name: 'Cat1', items: ['A', 'B'] },
          { id: 'cat2', name: 'Cat2', items: ['X', 'Y', 'Z'] }, // Different count!
        ],
        clues: [],
        solution: []
      };

      const result = validatePuzzle(invalidPuzzle);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('same number of items');
    });

    it('should detect missing matches', () => {
      const incompletePuzzle: LogicGridPuzzle = {
        id: 'incomplete-1',
        title: 'Incomplete Puzzle',
        description: 'Test',
        difficulty: 'easy',
        categories: [
          { id: 'cat1', name: 'Cat1', items: ['A', 'B'] },
          { id: 'cat2', name: 'Cat2', items: ['X', 'Y'] },
          { id: 'cat3', name: 'Cat3', items: ['1', '2'] },
        ],
        clues: [],
        solution: [
          // Only define some relationships, not all
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat2', itemIndex2: 0 },
        ]
      };

      const result = validatePuzzle(incompletePuzzle);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect transitive inconsistencies', () => {
      const inconsistentPuzzle: LogicGridPuzzle = {
        id: 'inconsistent-1',
        title: 'Inconsistent Puzzle',
        description: 'Test',
        difficulty: 'easy',
        categories: [
          { id: 'cat1', name: 'Cat1', items: ['A', 'B'] },
          { id: 'cat2', name: 'Cat2', items: ['X', 'Y'] },
          { id: 'cat3', name: 'Cat3', items: ['1', '2'] },
        ],
        clues: [],
        solution: [
          // A -> X
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat2', itemIndex2: 0 },
          // A -> 1
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat3', itemIndex2: 0 },
          // X -> 2 (WRONG! Should be X -> 1 since A -> X and A -> 1)
          { categoryId1: 'cat2', itemIndex1: 0, categoryId2: 'cat3', itemIndex2: 1 },

          // B -> Y
          { categoryId1: 'cat1', itemIndex1: 1, categoryId2: 'cat2', itemIndex2: 1 },
          // B -> 2
          { categoryId1: 'cat1', itemIndex1: 1, categoryId2: 'cat3', itemIndex2: 1 },
          // Y -> 1 (WRONG! Should be Y -> 2)
          { categoryId1: 'cat2', itemIndex1: 1, categoryId2: 'cat3', itemIndex2: 0 },
        ]
      };

      const result = validatePuzzle(inconsistentPuzzle);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Transitive inconsistency'))).toBe(true);
    });

    it('should detect duplicate relationships', () => {
      const duplicatePuzzle: LogicGridPuzzle = {
        id: 'duplicate-1',
        title: 'Duplicate Puzzle',
        description: 'Test',
        difficulty: 'easy',
        categories: [
          { id: 'cat1', name: 'Cat1', items: ['A'] },
          { id: 'cat2', name: 'Cat2', items: ['X'] },
        ],
        clues: [],
        solution: [
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat2', itemIndex2: 0 },
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat2', itemIndex2: 0 }, // Duplicate!
        ]
      };

      const result = validatePuzzle(duplicatePuzzle);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Duplicate'))).toBe(true);
    });

    it('should accept a valid complete puzzle', () => {
      const validPuzzle: LogicGridPuzzle = {
        id: 'valid-1',
        title: 'Valid Puzzle',
        description: 'Test',
        difficulty: 'easy',
        categories: [
          { id: 'cat1', name: 'Cat1', items: ['A', 'B'] },
          { id: 'cat2', name: 'Cat2', items: ['X', 'Y'] },
          { id: 'cat3', name: 'Cat3', items: ['1', '2'] },
        ],
        clues: [],
        solution: [
          // A -> X -> 1
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat2', itemIndex2: 0 },
          { categoryId1: 'cat1', itemIndex1: 0, categoryId2: 'cat3', itemIndex2: 0 },
          { categoryId1: 'cat2', itemIndex1: 0, categoryId2: 'cat3', itemIndex2: 0 },

          // B -> Y -> 2
          { categoryId1: 'cat1', itemIndex1: 1, categoryId2: 'cat2', itemIndex2: 1 },
          { categoryId1: 'cat1', itemIndex1: 1, categoryId2: 'cat3', itemIndex2: 1 },
          { categoryId1: 'cat2', itemIndex1: 1, categoryId2: 'cat3', itemIndex2: 1 },
        ]
      };

      const result = validatePuzzle(validPuzzle);

      if (!result.isValid) {
        console.log('Valid puzzle errors:', result.errors);
      }

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
