import { useNavigate, useLocation } from 'react-router-dom';
import MultiplicationTable from './MultiplicationTable';
import './TrainingTable.css';

export default function TrainingTable() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get origin from state, fallback to /training
  const origin = location.state?.origin || '/training';

  return (
    <div className="training-table">
      <header className="tt-header">
        <h1 className="tt-title">Multiplication Table</h1>
      </header>

      <div className="tt-body">
        <MultiplicationTable />
      </div>
    </div>
  );
}
