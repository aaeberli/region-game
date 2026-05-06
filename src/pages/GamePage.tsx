import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import Phase1 from '../components/Phase1';
import Phase2 from '../components/Phase2';
import Phase3 from '../components/Phase3';
import Phase4 from '../components/Phase4';
import Phase5 from '../components/Phase5';

const PHASE_LABELS: Record<string, string> = {
  phase1: 'Phase 1: Select Regions',
  phase2: 'Phase 2: Choose Your Region',
  phase3: 'Phase 3: Trading Rounds',
  phase4: 'Phase 4: Final Trade',
  phase5: 'Phase 5: Reveal',
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { status } = useGameStore();
  const { config } = useAdminStore();

  useEffect(() => {
    if (!config || status === 'idle') {
      navigate('/', { replace: true });
    }
  }, [status, config, navigate]);

  const renderPhase = () => {
    switch (status) {
      case 'phase1': return <Phase1 />;
      case 'phase2': return <Phase2 />;
      case 'phase3': return <Phase3 />;
      case 'phase4': return <Phase4 />;
      case 'phase5': return <Phase5 />;
      case 'complete': return <Phase5 />;
      default: return null;
    }
  };

  if (!config || status === 'idle') return null;

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Progress bar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-gray-100 shrink-0">
        {['phase1','phase2','phase3','phase4','phase5'].map((p, i) => (
          <div
            key={p}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              ['phase1','phase2','phase3','phase4','phase5'].indexOf(status) >= i
                ? 'bg-blue-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="shrink-0 px-3 py-1 text-xs text-gray-400 text-center border-b border-gray-50">
        {PHASE_LABELS[status]}
      </div>
      <div className="flex-1">
        {renderPhase()}
      </div>
    </div>
  );
};

export default GamePage;
