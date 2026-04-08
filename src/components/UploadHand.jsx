import { useState, useRef, useEffect } from 'react';
import { useHandDetection } from '../hooks/useHandDetection';

export default function UploadHand({ onConfirm }) {
  const [imgSrc, setImgSrc]       = useState(null);
  const [imgSize, setImgSize]     = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [localNailRects, setLocalNailRects] = useState(null);

  const imgRef    = useRef(null);
  const canvasRef = useRef(null);
  const fileRef   = useRef(null);

  const { detect, detecting, landmarks, error } = useHandDetection();

  // Fires whenever landmarks update — this is the reliable way to react to detection
  useEffect(() => {
    if (!landmarks || !imgSize) return;

    // Import computeNailRects inline so we pass landmarks directly
    const FINGER_TIPS =     [4, 8, 12, 16, 20];
    const FINGER_KNUCKLES = [3, 7, 11, 15, 19];
    const NAIL_IDS =        ['thumb', 'index', 'middle', 'ring', 'pinky'];

    const rects = FINGER_TIPS.map((tipIdx, i) => {
      const knuckleIdx = FINGER_KNUCKLES[i];
      const tip     = landmarks[tipIdx];
      const knuckle = landmarks[knuckleIdx];

      const tx = tip.x * imgSize.w,     ty = tip.y * imgSize.h;
      const kx = knuckle.x * imgSize.w, ky = knuckle.y * imgSize.h;

      const dx = tx - kx, dy = ty - ky;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      const nailH  = segLen * 0.55;
      const nailW  = segLen * 0.45;
      const angle  = Math.atan2(dy, dx) - Math.PI / 2;
      const norm   = segLen === 0 ? 1 : segLen;
      const cx     = tx + (dx / norm) * (nailH * 0.1);
      const cy     = ty + (dy / norm) * (nailH * 0.1);

      return { id: NAIL_IDS[i], cx, cy, w: nailW, h: nailH, rx: nailW / 2, rotation: (angle * 180) / Math.PI };
    });

    setLocalNailRects(rects);
    drawOverlay(rects, landmarks);
  }, [landmarks, imgSize]);

  function drawOverlay(rects, lm) {
    const canvas = canvasRef.current;
    if (!canvas || !imgSize) return;

    canvas.width  = imgSize.w;
    canvas.height = imgSize.h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Landmark dots
    lm.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * imgSize.w, point.y * imgSize.h, 4, 0, Math.PI * 2);
      ctx.fillStyle   = '#ff88ccaa';
      ctx.fill();
      ctx.strokeStyle = '#ff44aa';
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    // Nail outlines
    rects.forEach((nail) => {
      ctx.save();
      ctx.translate(nail.cx, nail.cy);
      ctx.rotate((nail.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.roundRect(-nail.w / 2, -nail.h / 2, nail.w, nail.h, nail.w / 2);
      ctx.fillStyle   = '#ff88cc33';
      ctx.strokeStyle = '#ff44aacc';
      ctx.lineWidth   = 2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    // Clean up previous object URL if any
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setImgSrc(URL.createObjectURL(file));
    setConfirmed(false);
    setLocalNailRects(null);
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleImgLoad() {
    const img = imgRef.current;
    const size = { w: img.naturalWidth, h: img.naturalHeight };
    setImgSize(size);
    detect(img);
  }

  function handleConfirm() {
    setConfirmed(true);
    onConfirm({ image: imgSrc, imgSize, nailRects: localNailRects });
  }

  return (
    <div className="upload-hand-panel">
      <p className="panel-label">upload ur hand photo ✿</p>

      <button className="upload-btn" onClick={() => fileRef.current?.click()}>
        📷 choose photo
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <p className="upload-tip">
        tip: good lighting + flat hand against a plain background works best 🌸
      </p>

      {imgSrc && (
        <div className="upload-preview-wrap">
          {/* Hidden image used for MediaPipe detection */}
          <img
            ref={imgRef}
            src={imgSrc}
            onLoad={handleImgLoad}
            alt="uploaded hand"
            style={{ display: 'none' }}
            crossOrigin="anonymous"
          />

          {/* Visible image + overlay canvas stacked */}
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <img
              src={imgSrc}
              alt="hand preview"
              className="upload-preview-img"
            />
            <canvas
              ref={canvasRef}
              className="upload-overlay-canvas"
            />
          </div>

          {detecting && (
            <p className="detect-status">✨ detecting hand landmarks...</p>
          )}

          {error && (
            <p className="detect-error">{error}</p>
          )}

          {localNailRects && !confirmed && (
            <div className="detect-actions">
              <p className="detect-success">💅 nails detected! looking good?</p>
              <button className="confirm-btn" onClick={handleConfirm}>
                yes, apply designs →
              </button>
              <button className="retry-btn" onClick={() => fileRef.current?.click()}>
                try a different photo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}