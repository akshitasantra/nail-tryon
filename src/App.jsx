import { useState, useRef } from 'react';
import HandSelector from './components/HandSelector';
import DesignSelector from './components/DesignSelector';
import NailCanvas from './components/NailCanvas';
import SaveButton from './components/SaveButton';
import { HAND_MODELS } from './data/hands';
import { PRESET_DESIGNS } from './data/designs';
import './styles/globals.css';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hand');
  const [selectedHand, setSelectedHand] = useState(HAND_MODELS[1]); // medium default
  const [selectedDesign, setSelectedDesign] = useState(PRESET_DESIGNS[2]); // aura default
  const [uploadedDesignImg, setUploadedDesignImg] = useState(null);
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const canvasRef = useRef(null);

  function handleUpload(img) {
    setUploadedDesignImg(img);
    setUploadedDesign({ id: 'uploaded', label: 'ur inspo ✿', emoji: '📌', colors: [], type: 'uploaded' });
    setSelectedDesign(null);
  }

  function handleClearUpload() {
    setUploadedDesign(null);
    setUploadedDesignImg(null);
    setSelectedDesign(PRESET_DESIGNS[0]);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-dots">
          <span style={{ background: '#ff6688' }} />
          <span style={{ background: '#ffcc44' }} />
          <span style={{ background: '#44cc88' }} />
        </div>
        <h1 className="header-title">💅 polish.exe</h1>
        <p className="header-sub">virtual nail try-on ✿</p>
        <span className="header-version">v1.0 ♡</span>
      </header>

      <main className="main">
        {/* LEFT — canvas */}
        <section className="preview-col">
          <div className="preview-window">
            <div className="window-bar">
              <span className="window-title">♡ nail preview</span>
              <div className="window-controls">
                <span />
                <span />
                <span />
              </div>
            </div>
            {/* NailCanvas needs the ref forwarded for SaveButton */}
            <div className="canvas-inner">
              <NailCanvas
                handModel={selectedHand}
                design={uploadedDesign || selectedDesign}
                uploadedDesignImg={uploadedDesignImg}
                ref={canvasRef}
              />
            </div>
          </div>

          <div className="current-look">
            <div
              className="look-swatch"
              style={{ background: selectedHand?.tone || '#c47e50' }}
            />
            <span>{selectedHand?.label}</span>
            <span className="divider">✦</span>
            <span>{(uploadedDesign || selectedDesign)?.emoji}</span>
            <span>{(uploadedDesign || selectedDesign)?.label}</span>
          </div>

          <SaveButton canvasRef={canvasRef} />
        </section>

        {/* RIGHT — controls */}
        <section className="controls-col">
          <div className="tabs">
            {['hand', 'design'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'hand' ? 'choose ur hand ♡' : 'nail inspo ✿'}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'hand' && (
              <HandSelector selected={selectedHand} onSelect={setSelectedHand} />
            )}
            {activeTab === 'design' && (
              <DesignSelector
                selected={selectedDesign}
                onSelect={(d) => { setSelectedDesign(d); setUploadedDesign(null); setUploadedDesignImg(null); }}
                onUpload={handleUpload}
                uploadedDesign={uploadedDesign}
                onClearUpload={handleClearUpload}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        made with ♡ polish.exe ~ built for girls with melanin 🌸
        <br />
        <small>photo upload & AI nail detection coming soon ✦</small>
      </footer>
    </div>
  );
}