import { useState, useRef } from 'react';
import './MultiplicationTable.css';

export default function MultiplicationTable() {
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [isTouching, setIsTouching] = useState(false);
  const tableContainerRef = useRef(null);

  const handleCellEnter = (row, col) => {
    setHoverRow(row);
    setHoverCol(col);
  };

  const handleCellLeave = () => {
    setHoverRow(null);
    setHoverCol(null);
  };

  /**
   * Find the cell (row, col) at the given touch coordinates
   * Returns { row, col } or null if no cell found
   */
  const getCellAtPoint = (clientX, clientY) => {
    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return null;

    // Find the nearest td element
    const cell = element.closest('.mult-cell');
    if (!cell) return null;

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    if (isNaN(row) || isNaN(col)) return null;
    return { row, col };
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsTouching(true);

    const touch = e.touches[0];
    const cell = getCellAtPoint(touch.clientX, touch.clientY);
    if (cell) {
      handleCellEnter(cell.row, cell.col);
    } else {
      // Tapped outside table - clear highlights
      handleCellLeave();
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isTouching) return;

    const touch = e.touches[0];
    const cell = getCellAtPoint(touch.clientX, touch.clientY);
    if (cell) {
      handleCellEnter(cell.row, cell.col);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsTouching(false);
    // Keep the highlights on the last selected cell until user taps elsewhere
  };

  const getProduct = (row, col) => {
    return row * col;
  };

  const isCellHighlighted = (row, col) => {
    if (hoverRow === null || hoverCol === null) return false;
    
    const isHeaderRow = row === 0;
    const isHeaderCol = col === 0;
    
    // Highlight header cells in the hovered column (top row)
    if (isHeaderRow && col === hoverCol) return true;
    
    // Highlight header cells in the hovered row (left column)
    if (isHeaderCol && row === hoverRow) return true;
    
    // Highlight data cells with light blue from column 0 to hoverCol in hoverRow
    if (row === hoverRow && col <= hoverCol && !isHeaderRow && !isHeaderCol) return true;
    
    // Highlight data cells with light blue from row 0 to hoverRow in hoverCol
    if (col === hoverCol && row <= hoverRow && !isHeaderRow && !isHeaderCol) return true;
    
    return false;
  };

  return (
    <div
      ref={tableContainerRef}
      className="mult-table-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <table className="mult-table">
        <tbody>
          {Array.from({ length: 13 }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: 13 }).map((_, col) => {
                const isHeaderRow = row === 0;
                const isHeaderCol = col === 0;
                const isHeader = isHeaderRow || isHeaderCol;
                const isHighlighted = isCellHighlighted(row, col);
                const isIntersection = hoverRow === row && hoverCol === col && !isHeader;

                return (
                  <td
                    key={`${row}-${col}`}
                    data-row={row}
                    data-col={col}
                    className={`mult-cell ${isHeader ? 'header' : ''} ${
                      isHighlighted ? 'highlighted' : ''
                    } ${isIntersection ? 'intersection' : ''}`}
                    onMouseEnter={() => handleCellEnter(row, col)}
                    onMouseLeave={handleCellLeave}
                  >
                    {isHeaderRow && isHeaderCol ? '' : col === 0 ? row : row === 0 ? col : getProduct(row, col)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
