import type { Category, GridState } from '../types/puzzle';
import { getCellState } from '../utils/gridHelpers';
import { GridCell } from './GridCell';
import './PuzzleGrid.css';

interface PuzzleGridProps {
  categories: Category[];
  gridState: GridState;
  onCellClick: (
    categoryId1: string,
    itemIndex1: number,
    categoryId2: string,
    itemIndex2: number
  ) => void;
}

export function PuzzleGrid({ categories, gridState, onCellClick }: PuzzleGridProps) {
  if (categories.length < 2) {
    return <div>Need at least 2 categories</div>;
  }

  // Calculate grid template columns
  // Add a column for row category labels + row item labels + grid columns
  const columnTemplate = `auto auto ${categories.slice(1).map(cat =>
    `repeat(${cat.items.length}, var(--cell-size))`
  ).join(' ')}`;

  return (
    <div className="puzzle-grid-container">
      <div
        className="unified-grid"
        style={{
          gridTemplateColumns: columnTemplate
        }}
      >
        {/* Category name headers (spanning their columns) */}
        <div className="grid-cell-label corner-cell"></div>
        <div className="grid-cell-label corner-cell"></div>
        {categories.slice(1).map((category) => (
          <div
            key={`cat-name-${category.id}`}
            className="category-name-label"
            style={{ gridColumn: `span ${category.items.length}` }}
          >
            {category.name}
          </div>
        ))}

        {/* Top-left corner cells for column headers row */}
        <div className="grid-cell-label corner-cell"></div>
        <div className="grid-cell-label corner-cell"></div>

        {/* Column headers for each category (except the first) */}
        {categories.slice(1).map((category) => (
          category.items.map((item, idx) => (
            <div key={`${category.id}-${idx}`} className="grid-cell-label col-header">
              {item}
            </div>
          ))
        ))}

        {/* Rows - show first and last category only */}
        {[0, categories.length - 1].map((catIdx) => {
          const rowCategory = categories[catIdx];
          return (
            <div key={`category-${rowCategory.id}`} style={{ display: 'contents' }}>
              {rowCategory.items.map((rowItem, rowIdx) => (
                <div key={`row-${rowCategory.id}-${rowIdx}`} className="grid-content-row">
                  {/* Row category header (only on first row of each category) */}
                  {rowIdx === 0 && (
                    <div
                      className="row-category-header"
                      style={{ gridRow: `span ${rowCategory.items.length}` }}
                    >
                      {rowCategory.name}
                    </div>
                  )}

                  {/* Row item label */}
                  <div className="grid-cell-label row-label">
                    {rowItem}
                  </div>

                  {/* Cells for this row */}
                  {categories.slice(1).map((colCategory) => {
                    // Find the index of the column category in the original categories array
                    const colCatIdx = categories.findIndex(c => c.id === colCategory.id);

                    return colCategory.items.map((_colItem, colIdx) => {
                      // Determine position within category section
                      const isFirstColInSection = colIdx === 0;
                      const isLastColInSection = colIdx === colCategory.items.length - 1;
                      const isFirstRowInSection = rowIdx === 0;
                      const isLastRowInSection = rowIdx === rowCategory.items.length - 1;

                      // Determine if this is the first/last section in the grid
                      const isFirstColSection = colCatIdx === 1; // First column section (Pets)
                      const isLastColSection = colCatIdx === categories.length - 1; // Last column section (Colors)
                      const isFirstRowSection = catIdx === 0; // First row section (People)
                      const isLastRowSection = catIdx === categories.length - 1; // Last row section (Colors)

                      // Build class names for section borders
                      // Add borders on all edges of each section
                      const sectionBorderClasses = [
                        // Left border: first column of each section (except first section which has grid border)
                        isFirstColInSection && !isFirstColSection ? 'section-border-left' : '',
                        // Right border: last column of each section (except last section which has grid border)
                        isLastColInSection && !isLastColSection ? 'section-border-right' : '',
                        // Top border: first row of each section (except first section which has grid border)
                        isFirstRowInSection && !isFirstRowSection ? 'section-border-top' : '',
                        // Bottom border: last row of each section (except last section which has grid border)
                        isLastRowInSection && !isLastRowSection ? 'section-border-bottom' : ''
                      ].filter(Boolean).join(' ');

                      // For the last category row, hide cells for its own category
                      if (catIdx === categories.length - 1 && colCatIdx === categories.length - 1) {
                        return (
                          <div
                            key={`${colCategory.id}-${colIdx}`}
                            className={`grid-cell-hidden ${sectionBorderClasses}`}
                          ></div>
                        );
                      }

                      // Valid comparison cell
                      const state = getCellState(
                        gridState,
                        rowCategory.id,
                        rowIdx,
                        colCategory.id,
                        colIdx
                      );
                      return (
                        <GridCell
                          key={`${colCategory.id}-${colIdx}`}
                          state={state}
                          onClick={() => onCellClick(rowCategory.id, rowIdx, colCategory.id, colIdx)}
                          className={sectionBorderClasses}
                        />
                      );
                    });
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
