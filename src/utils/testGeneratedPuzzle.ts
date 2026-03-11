import { generatePuzzle } from './puzzleGenerator';

console.log('Generating a sample puzzle...\n');

const puzzle = generatePuzzle('medium', {
  categoryCount: 3,
  itemCount: 5,
  clueCount: 10
});

console.log(`Title: ${puzzle.title}`);
console.log(`Description: ${puzzle.description}`);
console.log(`Difficulty: ${puzzle.difficulty}`);
console.log(`\nCategories:`);
puzzle.categories.forEach(cat => {
  console.log(`  - ${cat.name}: ${cat.items.join(', ')}`);
});

console.log(`\nClues (${puzzle.clues.length}):`);
puzzle.clues.forEach(clue => {
  console.log(`  ${clue.order}. ${clue.text}`);
  if (clue.metadata) {
    console.log(`     Type: ${clue.metadata.type}, Constraints: ${clue.metadata.constraints.length}`);
  }
});

console.log(`\nSolution has ${puzzle.solution.length} relationships`);
console.log('\nDone!');
