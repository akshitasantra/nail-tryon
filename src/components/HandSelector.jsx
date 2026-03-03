import { HAND_MODELS } from '../data/hands';

export default function HandSelector({ selected, onSelect }) {
  return (
    <div className="panel">
      <p className="panel-label">pick ur skin tone ✦</p>
      <div className="hand-grid">
        {HAND_MODELS.map(hand => (
          <button
            key={hand.id}
            onClick={() => onSelect(hand)}
            className={`hand-btn ${selected?.id === hand.id ? 'active' : ''}`}
          >
            {/* Thumbnail of the actual hand photo */}
            <img
              src={hand.image}
              alt={hand.label}
              className="hand-thumb"
            />
            <span className="hand-label">{hand.label}</span>
            <span className="hand-undertone">{hand.undertone}</span>
          </button>
        ))}
      </div>
      <p className="panel-note">🌸 photo upload coming soon ~</p>
    </div>
  );
}