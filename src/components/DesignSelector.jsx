import { useRef } from 'react';
import { PRESET_DESIGNS } from '../data/designs';

export default function DesignSelector({ selected, onSelect, onUpload, uploadedDesign, onClearUpload }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => onUpload(img);
    img.src = url;
  }

  return (
    <div className="panel">
      <p className="panel-label">pick a vibe ✿</p>

      <button className="upload-btn" onClick={() => fileRef.current?.click()}>
        📌 upload pinterest inspo
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      {uploadedDesign && (
        <div className="upload-badge">
          <span>📌 ur inspo is ON ✓</span>
          <button onClick={onClearUpload} className="clear-btn">✕</button>
        </div>
      )}

      <div className="design-grid">
        {PRESET_DESIGNS.map(d => (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className={`design-btn ${selected?.id === d.id && !uploadedDesign ? 'active' : ''}`}
          >
            <div className="design-preview">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="mini-nail"
                  style={{
                    height: i === 1 ? 16 : 13,
                    background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`,
                  }}
                />
              ))}
            </div>
            <span className="design-emoji">{d.emoji}</span>
            <span className="design-label">{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}