// NailCanvas.jsx — updated to forward ref
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useNailCanvas } from '../hooks/useNailCanvas';

const NailCanvas = forwardRef(function NailCanvas({ handModel, design, uploadedDesignImg }, ref) {
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    current: canvasRef.current,
    toDataURL: (...args) => canvasRef.current?.toDataURL(...args),
  }));

  useNailCanvas(canvasRef, handModel, design, uploadedDesignImg);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="nail-canvas" />
    </div>
  );
});

export default NailCanvas;