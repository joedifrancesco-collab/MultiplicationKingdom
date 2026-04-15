import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import { getProgress } from '../../../../store/progress';
import GameCard from '../../../../shared/components/GameCard';
import useDeviceType from '../../../../hooks/useDeviceType';
import './KingdomScreen.css';

export default function KingdomScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deviceType = useDeviceType();
  const kingdomId = parseInt(id, 10);
  const kingdom = KINGDOMS[kingdomId - 1];
  const progress = getProgress();
  const kp = progress.kingdoms.find(k => k.id === kingdomId);

  if (!kingdom || !kp?.unlocked) {
    navigate('/kingdom');
    return null;
  }

  return (
    <div className="kingdom-screen" style={{ '--kingdom-color': kingdom.color }}>
      <button className="back-btn" onClick={() => navigate('/kingdom')}>‹</button>
      <h1 className="kingdom-title">{kingdom.name}</h1>
      <p className="kingdom-desc">Conquer the {kingdomId}× land!</p>

      <div className="kingdom-stars-display">
        {[1, 2, 3].map(s => (
          <span key={s} className={s <= kp.stars ? 'star filled' : 'star empty'}>★</span>
        ))}
      </div>

      <div className="mode-buttons">
        {/* Game modes using GameCard component with device type awareness */}
        <GameCard
          icon="⚡"
          title="Speed Challenge"
          description="Beat the clock!"
          onClick={() => navigate(`/kingdom/${id}/speed`)}
          platforms="both"
          deviceType={deviceType}
        />

        <GameCard
          icon="🔀"
          title="Match Game"
          description="Find the matching pairs"
          onClick={() => navigate(`/kingdom/${id}/match`)}
          platforms="both"
          deviceType={deviceType}
        />

        <GameCard
          icon="⚔️"
          title="Kingdom Siege"
          description="Defend the kingdom!"
          onClick={() => navigate(`/kingdom/${id}/siege`)}
          platforms="both"
          deviceType={deviceType}
        />
      </div>
    </div>
  );
}
