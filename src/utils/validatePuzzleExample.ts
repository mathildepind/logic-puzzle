import { validatePuzzle } from './gridHelpers';
import { samplePuzzle } from '../data/samplePuzzle';
import { mediumPuzzle } from '../data/mediumPuzzle';
import { hardPuzzle } from '../data/hardPuzzle';
import { invalidPuzzle } from '../data/invalidPuzzle';

/**
 * Example script showing how to validate puzzles programmatically
 */

console.log('='.repeat(60));
console.log('PUZZLE VALIDATION EXAMPLES');
console.log('='.repeat(60));

const puzzles = [
  { name: 'Sample (Easy)', puzzle: samplePuzzle },
  { name: 'Medium', puzzle: mediumPuzzle },
  { name: 'Hard', puzzle: hardPuzzle },
  { name: 'Invalid (Test)', puzzle: invalidPuzzle },
];

for (const { name, puzzle } of puzzles) {
  console.log(`\n${name} Puzzle: "${puzzle.title}"`);
  console.log('-'.repeat(60));

  const result = validatePuzzle(puzzle);

  if (result.isValid) {
    console.log('✓ VALID - Puzzle has a correct, complete solution');
  } else {
    console.log('✗ INVALID - Found the following errors:');
    result.errors.forEach((error, idx) => {
      console.log(`  ${idx + 1}. ${error}`);
    });
  }
}

console.log('\n' + '='.repeat(60));
