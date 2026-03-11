import type { Clue } from '../types/puzzle';
import './ClueList.css';

interface ClueListProps {
  clues: Clue[];
}

export function ClueList({ clues }: ClueListProps) {
  const sortedClues = [...clues].sort((a, b) => a.order - b.order);

  return (
    <div className="clue-list">
      <h2>Clues</h2>
      <ol>
        {sortedClues.map((clue) => (
          <li key={clue.id} className="clue-item">
            {clue.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
