import './style.css';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';

const EmptyState = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div className="pool-dashboard pool-dashboard__empty">
      <span className="pool-dashboard__empty-icon">📂</span>
      <p className="pool-dashboard__empty-text">
        {isMobile
          ? 'Sélectionnez une pool dans la barre au-dessus'
          : 'Sélectionnez une pool dans la barre latérale gauche'}
      </p>
    </div>
  );
};

export default EmptyState;