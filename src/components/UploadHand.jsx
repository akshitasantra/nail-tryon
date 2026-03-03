import { useState, useRef } from 'react';
import { useHandDetection } from '../hooks/useHandDetection';

export default function UploadHand({ onConfirm }) {
  const [imgSrc, setImgSrc]       = useState(null);
  const [imgSize, setImgSize]     = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const imgRef    = useRef(null);
  const canvasRef = useRef(null);
  const fileRef   = useRef(null);

  const { detect, detecting, landmarks, nailRects, computeNailRects, error } = useHandDetection();

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setConfirmed(false);
  }

  function handleImgLoad() {
    const img = imgRef.current;
    setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    detect(img);
  }

  // Once landmarks arrive, draw overlay dots + nail outlines on canvas
  function handleLandmarksReady() {
    if (!landmarks || !imgSize) return;
    const rects = computeNailRects(imgSize.w, imgSize.h);
    drawOverlay(rects);
  }

  // Call this after computeNailRects runs
  function drawOverlay(rects) {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !rects) return;

    canvas.width  = imgSize.w;
    canvas.height = imgSize.h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmark dots
    if (landmarks) {
      landmarks.forEach((lm) => {
        ctx.beginPath();
        ctx.arc(lm.x * imgSize.w, lm.y * imgSize.h, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff88ccaa';
        ctx.fill();
        ctx.strokeStyle = '#ff44aa';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Draw nail outlines
    rects.forEach((nail) => {
      ctx.save();
      ctx.translate(nail.cx, nail.cy);
      ctx.rotate((nail.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.roundRect(-nail.w / 2, -nail.h / 2, nail.w, nail.h, nail.w / 2);
      ctx.strokeStyle = '#ff44aacc';
      ctx.lineWidth   = 2;
      ctx.fillStyle   = '#ff88cc33';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  // Re-draw whenever landmarks update
  if (landmarks && imgSize && !confirmed) {
    // Use a small timeout so state has settled
    setTimeout(() => handleLandmarksReady(), 0);
  }

  function handleConfirm() {
    setConfirmed(true);
    onConfirm({
      image:    imgSrc,
      imgSize,
      nailRects,
    });
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
          {/* Real image (hidden, used for detection) */}
          <img
            ref={imgRef}
            src={imgSrc}
            onLoad={handleImgLoad}
            alt="uploaded hand"
            style={{ display: 'none' }}
            crossOrigin="anonymous"
          />

          {/* Canvas shows image + overlay */}
          <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            {/* Show image as background of canvas area */}
            <img
              src={imgSrc}
              alt="hand preview"
              className="upload-preview-img"
            />
            {/* Overlay canvas (absolute, same size) */}
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

          {nailRects && !confirmed && (
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