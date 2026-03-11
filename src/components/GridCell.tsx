import type { CellState as CellStateType } from '../types/puzzle';
import { CellState } from '../types/puzzle';
import './GridCell.css';

interface GridCellProps {
  state: CellStateType;
  onClick: () => void;
  className?: string;
}

export function GridCell({ state, onClick, className = '' }: GridCellProps) {
  const getCellContent = () => {
    switch (state) {
      case CellState.YES:
        return '✓';
      case CellState.NO:
        return '✗';
      case CellState.UNKNOWN:
      default:
        return '';
    }
  };

  return (
    <button
      className={`grid-cell grid-cell-${state} ${className}`}
      onClick={onClick}
      type="button"
    >
      {getCellContent()}
    </button>
  );
}
