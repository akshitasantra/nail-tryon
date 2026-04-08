import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';

const FINGER_TIPS =     [4, 8, 12, 16, 20];
const FINGER_KNUCKLES = [3, 7, 11, 15, 19];
const NAIL_IDS =        ['thumb', 'index', 'middle', 'ring', 'pinky'];

export function useHandDetection() {
  const [landmarks, setLandmarks] = useState(null);
  const [nailRects, setNailRects] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError]         = useState(null);
  const handsRef = useRef(null);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      setDetecting(false);

      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        setError('no hand detected — try better lighting or a clearer photo ✿');
        setLandmarks(null);
        setNailRects(null);
        return;
      }

      setError(null);
      const lm = results.multiHandLandmarks[0];
      setLandmarks(lm);
    });

    handsRef.current = hands;
    return () => hands.close();
  }, []);

  async function detect(imgElement) {
    if (!handsRef.current) return;
    setDetecting(true);
    setError(null);
    setLandmarks(null);
    setNailRects(null);
    await handsRef.current.send({ image: imgElement });
  }

  // Takes landmarks directly — no stale closure issues
  function computeNailRects(lm, imgWidth, imgHeight) {
    if (!lm) return null;

    const rects = FINGER_TIPS.map((tipIdx, i) => {
      const knuckleIdx = FINGER_KNUCKLES[i];
      const tip     = lm[tipIdx];
      const knuckle = lm[knuckleIdx];

      const tx = tip.x * imgWidth,     ty = tip.y * imgHeight;
      const kx = knuckle.x * imgWidth, ky = knuckle.y * imgHeight;

      const dx = tx - kx, dy = ty - ky;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      const nailH  = segLen * 0.55;
      const nailW  = segLen * 0.45;

      const angle = Math.atan2(dy, dx) - Math.PI / 2;

      const norm = segLen === 0 ? 1 : segLen;
      const cx = tx + (dx / norm) * (nailH * 0.1);
      const cy = ty + (dy / norm) * (nailH * 0.1);

      return {
        id: NAIL_IDS[i],
        cx, cy,
        w: nailW,
        h: nailH,
        rx: nailW / 2,
        rotation: (angle * 180) / Math.PI,
      };
    });

    setNailRects(rects);
    return rects;
  }

  return { detect, detecting, landmarks, nailRects, computeNailRects, error };
}