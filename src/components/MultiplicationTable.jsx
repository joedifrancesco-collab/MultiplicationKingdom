import { useState } from 'react';
import './MultiplicationTable.css';

export default function MultiplicationTable() {
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);

  const handleCellEnter = (row, col) => {
    setHoverRow(row);
    setHoverCol(col);
  };

  const handleCellLeave = () => {
    setHoverRow(null);
    setHoverCol(null);
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
    <div className="mult-table-container">
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
