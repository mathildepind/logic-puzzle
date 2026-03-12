import { useState, useEffect } from 'react';
import type { GridState, LogicGridPuzzle } from './types/puzzle';
import { samplePuzzle } from './data/samplePuzzle';
import { mediumPuzzle } from './data/mediumPuzzle';
import { hardPuzzle } from './data/hardPuzzle';
import { PuzzleInfo } from './components/PuzzleInfo';
import { PuzzleGrid } from './components/PuzzleGrid';
import { ClueList } from './components/ClueList';
import { Modal } from './components/Modal';
import { initializeGridState, getCellState, setCellState, cycleCellState, autoFillOnYes, clearAutoFillOnUnyes, isPuzzleSolved, checkSolution } from './utils/gridHelpers';
import { generatePuzzle } from './utils/puzzleGenerator';
import './App.css';

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<LogicGridPuzzle>(samplePuzzle);
  const [gridState, setGridState] = useState<GridState>(() => initializeGridState());
  const [isComplete, setIsComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    allCellsFilled: boolean;
    isCorrect: boolean;
    incorrectCount: number;
    totalCells: number;
  } | null>(null);
  const [generatedPuzzles, setGeneratedPuzzles] = useState<LogicGridPuzzle[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if puzzle is solved whenever grid state changes
  useEffect(() => {
    const solved = isPuzzleSolved(currentPuzzle, gridState);
    setIsComplete(solved);
  }, [gridState, currentPuzzle]);

  const handleCellClick = (
    categoryId1: string,
    itemIndex1: number,
    categoryId2: string,
    itemIndex2: number
  ) => {
    const currentState = getCellState(gridState, categoryId1, itemIndex1, categoryId2, itemIndex2);
    const newCellState = cycleCellState(currentState);
    let newGridState = setCellState(gridState, categoryId1, itemIndex1, categoryId2, itemIndex2, newCellState);
    if (newCellState === 'yes') {
      newGridState = autoFillOnYes(newGridState, currentPuzzle.categories, categoryId1, itemIndex1, categoryId2, itemIndex2);
    } else if (currentState === 'yes' && newCellState === 'unknown') {
      newGridState = clearAutoFillOnUnyes(newGridState, currentPuzzle.categories, categoryId1, itemIndex1, categoryId2, itemIndex2);
    }
    setGridState(newGridState);
  };

  const handleReset = () => {
    setGridState(initializeGridState());
    setIsComplete(false);
  };

  const handleDifficultyChange = (puzzle: LogicGridPuzzle) => {
    setCurrentPuzzle(puzzle);
    setGridState(initializeGridState());
    setIsComplete(false);
  };

  const handleCheckSolution = () => {
    const result = checkSolution(currentPuzzle, gridState);
    setCheckResult(result);
    setShowModal(true);
  };

  const handleGenerateNewPuzzle = async () => {
    setIsGenerating(true);
    try {
      // Use setTimeout to allow UI to update with loading state
      await new Promise(resolve => setTimeout(resolve, 100));

      const newPuzzle = generatePuzzle('medium', {
        categoryCount: 3,
        itemCount: 5,
        clueCount: 10
      });

      // Add to generated puzzles list
      setGeneratedPuzzles(prev => [...prev, newPuzzle]);

      // Load the new puzzle
      setCurrentPuzzle(newPuzzle);
      setGridState(initializeGridState());
      setIsComplete(false);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
      alert('Failed to generate puzzle. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Logic Puzzle</h1>
      </header>
      <main>
        <div className="puzzle-header-section">
          <PuzzleInfo puzzle={currentPuzzle} isComplete={isComplete} />
          <div className="controls">
            <div className="difficulty-selector">
              <button
                className={`difficulty-button ${currentPuzzle.id === samplePuzzle.id ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(samplePuzzle)}
              >
                Easy
              </button>
              <button
                className={`difficulty-button ${currentPuzzle.id === mediumPuzzle.id ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(mediumPuzzle)}
              >
                Medium
              </button>
              <button
                className={`difficulty-button ${currentPuzzle.id === hardPuzzle.id ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(hardPuzzle)}
              >
                Hard
              </button>
            </div>
            <div className="action-buttons">
              <button
                className="generate-button"
                onClick={handleGenerateNewPuzzle}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate New Puzzle'}
              </button>
              <button className="check-button" onClick={handleCheckSolution}>
                Check Solution
              </button>
              <button className="reset-button" onClick={handleReset}>
                Reset Puzzle
              </button>
            </div>
          </div>
        </div>

        <div className="game-layout">
          <div className="grid-area">
            <PuzzleGrid
              categories={currentPuzzle.categories}
              gridState={gridState}
              onCellClick={handleCellClick}
            />
          </div>

          <div className="clues-area">
            <ClueList clues={currentPuzzle.clues} />
          </div>
        </div>
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Solution Check"
      >
        {checkResult && (
          <>
            {checkResult.isCorrect ? (
              <div className="result-success">
                Congratulations! Your solution is correct!
              </div>
            ) : !checkResult.allCellsFilled ? (
              <div className="result-warning">
                You haven't filled in all cells yet. Please complete the puzzle before checking.
              </div>
            ) : (
              <>
                <div className="result-error">
                  Your solution is not correct.
                </div>
                <div className="result-details">
                  You have {checkResult.incorrectCount} incorrect cell{checkResult.incorrectCount !== 1 ? 's' : ''} out of {checkResult.totalCells} total cells.
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;
