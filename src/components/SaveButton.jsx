import { useState, useRef } from 'react';

export default function SaveButton({ canvasRef }) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'polish-exe-nails.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
      {saved ? '✓ saved to camera roll!' : '💾 save look'}
    </button>
  );
}