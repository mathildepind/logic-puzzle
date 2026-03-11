# Logic Grid Puzzle App

A browser-based logic grid puzzle game built with React and TypeScript. Solve classic deduction puzzles or generate new ones on demand.

## What it does

Players are given a set of categories (e.g. People, Departments, Beverages) and a list of clues. The goal is to use logical deduction to determine the unique relationship between every item across all categories by filling in the grid.

**Gameplay**
- Click cells to cycle through states: empty → yes → no
- Use the clues panel to work through the puzzle step by step
- Check your solution at any time — the app reports how many cells are incorrect
- Reset the grid to start over

**Preset puzzles**
- Three hand-crafted puzzles at Easy, Medium, and Hard difficulty

**Puzzle generator**
- Generates a new 3-category, 5-item puzzle with ~10 clues in under a second
- Draws from 8 themed content libraries (Office Workers, Pet Adoption, Restaurant Night, Sports Team, Concert Night, and more)
- Clues come in three types: direct assignments, indirect links between categories, and negative constraints

## Tech stack

- React 19 + TypeScript
- Vite
- Vitest for unit and integration tests

## Getting started

```bash
npm install
npm run dev
```

Run tests:

```bash
npm test
```

## Project structure

```
src/
  components/     # PuzzleGrid, ClueList, PuzzleInfo, Modal, GridCell
  data/           # Preset puzzles and puzzle theme definitions
  types/          # TypeScript interfaces for puzzles and grid state
  utils/          # Grid logic, puzzle generator, clue generator, validation
```
