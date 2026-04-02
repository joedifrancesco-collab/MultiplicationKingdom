import { useNavigate } from 'react-router-dom';
import MultiplicationTable from './MultiplicationTable';
import './TrainingTable.css';

export default function TrainingTable() {
  const navigate = useNavigate();

  return (
    <div className="training-table">
      <header className="tt-header">
        <button className="tt-back-btn" onClick={() => navigate('/training')}>
          ‹
        </button>
        <h1 className="tt-title">Multiplication Table</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div className="tt-body">
        <MultiplicationTable />
      </div>
    </div>
  );
}
