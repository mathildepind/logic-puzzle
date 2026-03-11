import type { LogicGridPuzzle } from '../types/puzzle';
import './PuzzleInfo.css';

interface PuzzleInfoProps {
  puzzle: LogicGridPuzzle;
  isComplete: boolean;
}

export function PuzzleInfo({ puzzle, isComplete }: PuzzleInfoProps) {
  return (
    <div className="puzzle-info">
      <div className="puzzle-header">
        <h2>{puzzle.title}</h2>
        <span className={`difficulty difficulty-${puzzle.difficulty}`}>
          {puzzle.difficulty}
        </span>
      </div>
      <p className="puzzle-description">{puzzle.description}</p>
      {isComplete && (
        <div className="completion-message">
          Congratulations! You solved the puzzle!
        </div>
      )}
    </div>
  );
}
