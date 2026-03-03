import { useEffect, useRef } from 'react';

function drawNailDesign(ctx, design, nx, ny, nw, nh, uploadedImg) {
  if (uploadedImg && design?.id === 'uploaded') {
    ctx.drawImage(uploadedImg, nx, ny, nw, nh);
    return;
  }

  if (!design) return;

  const [c1, c2] = design.colors;
  const g = ctx.createLinearGradient(nx, ny, nx + nw, ny + nh);

  switch (design.type) {
    case 'french': {
      const baseG = ctx.createLinearGradient(nx, ny, nx, ny + nh);
      baseG.addColorStop(0, '#fff8f8ee');
      baseG.addColorStop(1, '#ffeef4ee');
      ctx.fillStyle = baseG;
      ctx.fillRect(nx, ny, nw, nh);
      ctx.beginPath();
      ctx.fillStyle = '#ffffffee';
      ctx.ellipse(nx + nw / 2, ny + 4, nw * 0.52, nh * 0.35, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'gradient':
    case 'aura': {
      g.addColorStop(0, c1); g.addColorStop(0.5, c2); g.addColorStop(1, c1);
      ctx.fillStyle = g;
      ctx.fillRect(nx, ny, nw, nh);
      const ag = ctx.createRadialGradient(nx + nw / 2, ny + nh / 2, 2, nx + nw / 2, ny + nh / 2, nw * 0.7);
      ag.addColorStop(0, '#ffffff55'); ag.addColorStop(1, 'transparent');
      ctx.fillStyle = ag;
      ctx.fillRect(nx, ny, nw, nh);
      break;
    }
    case 'jelly': {
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(nx, ny, nw, nh);
      const jg = ctx.createRadialGradient(nx + nw * 0.3, ny + nh * 0.2, 1, nx + nw * 0.3, ny + nh * 0.2, nw * 0.5);
      jg.addColorStop(0, '#ffffffaa'); jg.addColorStop(1, 'transparent');
      ctx.fillStyle = jg; ctx.fillRect(nx, ny, nw, nh);
      break;
    }
    case 'glaze': {
      const gg = ctx.createLinearGradient(nx, ny, nx + nw, ny + nh);
      gg.addColorStop(0, '#ffd6e8dd'); gg.addColorStop(0.3, '#ffe8f8ee');
      gg.addColorStop(0.6, '#e8d6ffdd'); gg.addColorStop(1, '#ffd6e8dd');
      ctx.fillStyle = gg; ctx.fillRect(nx, ny, nw, nh);
      const sg = ctx.createLinearGradient(nx, ny, nx + nw * 0.6, ny + nh * 0.6);
      sg.addColorStop(0, '#ffffffaa'); sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg; ctx.fillRect(nx, ny, nw, nh);
      break;
    }
    case 'floral': {
      ctx.fillStyle = c1; ctx.fillRect(nx, ny, nw, nh);
      [[nx + nw * 0.3, ny + nh * 0.45], [nx + nw * 0.72, ny + nh * 0.65]].forEach(([fx, fy]) => {
        const pr = nw * 0.14;
        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.fillStyle = '#ff99bb99';
          ctx.ellipse(fx + Math.cos(angle) * pr * 0.7, fy + Math.sin(angle) * pr * 0.7, pr * 0.55, pr * 0.35, angle, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath(); ctx.fillStyle = '#ffe0aa';
        ctx.arc(fx, fy, pr * 0.3, 0, Math.PI * 2); ctx.fill();
      });
      break;
    }
    default: {
      g.addColorStop(0, c1 + 'ee'); g.addColorStop(1, c2 + 'ee');
      ctx.fillStyle = g; ctx.fillRect(nx, ny, nw, nh);
    }
  }

  // Shine on every nail
  ctx.beginPath();
  ctx.fillStyle = '#ffffff44';
  ctx.ellipse(nx + nw * 0.35, ny + nh * 0.25, nw * 0.2, nh * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function useNailCanvas(canvasRef, handModel, design, uploadedDesignImg) {
  const handImgRef = useRef(null);

  useEffect(() => {
    if (!handModel?.image) return;

    const img = new Image();
    img.onload = () => {
      handImgRef.current = img;
      renderCanvas();
    };
    img.src = handModel.image;
  }, [handModel]);

  useEffect(() => {
    if (handImgRef.current) renderCanvas();
  }, [design, uploadedDesignImg]);

  function renderCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !handImgRef.current) return;
    const ctx = canvas.getContext('2d');
    const img = handImgRef.current;

    // Resize canvas to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the real hand photo
    ctx.drawImage(img, 0, 0);

    // Overlay nails on top
    handModel.nails.forEach((nail) => {
      ctx.save();
      // Translate to nail center, rotate, then draw
      const cx = nail.x + nail.w / 2;
      const cy = nail.y + nail.h / 2;
      ctx.translate(cx, cy);
      ctx.rotate((nail.rotation * Math.PI) / 180);

      const nx = -nail.w / 2;
      const ny = -nail.h / 2;

      // Clip to rounded nail shape
      ctx.beginPath();
      ctx.roundRect(nx, ny, nail.w, nail.h, [nail.w / 2, nail.w / 2, nail.rx / 2, nail.rx / 2]);
      ctx.clip();

      if (design) {
        drawNailDesign(ctx, design, nx, ny, nail.w, nail.h, uploadedDesignImg);
      }

      ctx.restore();

      // Draw nail outline over clip (so it's not clipped itself)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((nail.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.roundRect(-nail.w / 2, -nail.h / 2, nail.w, nail.h, [nail.w / 2, nail.w / 2, nail.rx / 2, nail.rx / 2]);
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });
  }
}