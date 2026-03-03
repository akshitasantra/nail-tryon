import { useEffect, useRef, useState } from 'react';
import { Hands } from '@mediapipe/hands';

// MediaPipe landmark indices
const FINGER_TIPS =   [4, 8, 12, 16, 20];  // thumb → pinky
const FINGER_KNUCKLES = [3, 7, 11, 15, 19]; // one joint below tip

export function useHandDetection() {
  const [landmarks, setLandmarks] = useState(null); // raw MP landmarks
  const [nailRects, setNailRects]   = useState(null); // computed nail positions
  const [detecting, setDetecting]   = useState(false);
  const [error, setError]           = useState(null);
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

  // Run detection on an image element
  async function detect(imgElement) {
    if (!handsRef.current) return;
    setDetecting(true);
    setError(null);
    setLandmarks(null);
    setNailRects(null);
    await handsRef.current.send({ image: imgElement });
  }

  // Convert normalized landmarks → nail rect objects for a given image size
  function computeNailRects(imgWidth, imgHeight) {
    if (!landmarks) return null;

    const NAIL_IDS = ['thumb', 'index', 'middle', 'ring', 'pinky'];

    const rects = FINGER_TIPS.map((tipIdx, i) => {
      const knuckleIdx = FINGER_KNUCKLES[i];
      const tip     = landmarks[tipIdx];
      const knuckle = landmarks[knuckleIdx];

      // Pixel coords
      const tx = tip.x * imgWidth,     ty = tip.y * imgHeight;
      const kx = knuckle.x * imgWidth, ky = knuckle.y * imgHeight;

      // Nail length = distance tip → knuckle * 0.55
      const dx = tx - kx, dy = ty - ky;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      const nailH  = segLen * 0.55;
      const nailW  = segLen * 0.45;

      // Rotation angle from knuckle → tip
      const angle = Math.atan2(dy, dx) - Math.PI / 2; // -90° so 0° = pointing up

      // Nail center = tip, offset slightly toward fingertip direction
      const norm = segLen === 0 ? 1 : segLen;
      const cx = tx + (dx / norm) * (nailH * 0.1);
      const cy = ty + (dy / norm) * (nailH * 0.1);

      return {
        id:       NAIL_IDS[i],
        cx, cy,        // center x/y in pixels
        w:  nailW,
        h:  nailH,
        rx: nailW / 2, // border radius
        rotation: (angle * 180) / Math.PI,
      };
    });

    setNailRects(rects);
    return rects;
  }

  return { detect, detecting, landmarks, nailRects, computeNailRects, error };
}