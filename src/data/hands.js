import handDark from '../assets/hands/hand-dark.png';
import handMedium from '../assets/hands/hand-medium.png';
import handLight from '../assets/hands/hand-light.png';

export const HAND_MODELS = [
  {
    id: 'light',
    label: 'light',
    undertone: 'cool',
    image: handLight,
    // These are the pixel coords of each nail ON your specific image.
    // You'll need to tune these to match your actual photos.
    nails: [
      { id: 'pinky',  x: 102, y: 58,  w: 36, h: 48, rx: 12, rotation: -12 },
      { id: 'ring',   x: 154, y: 36,  w: 40, h: 54, rx: 14, rotation: -4  },
      { id: 'middle', x: 210, y: 22,  w: 42, h: 58, rx: 14, rotation:  2  },
      { id: 'index',  x: 264, y: 36,  w: 40, h: 54, rx: 14, rotation:  8  },
      { id: 'thumb',  x: 348, y: 128, w: 34, h: 44, rx: 12, rotation:  38 },
    ],
  },
  {
    id: 'medium',
    label: 'medium',
    undertone: 'warm',
    image: handMedium,
    nails: [
      { id: 'pinky',  x: 102, y: 58,  w: 36, h: 48, rx: 12, rotation: -12 },
      { id: 'ring',   x: 154, y: 36,  w: 40, h: 54, rx: 14, rotation: -4  },
      { id: 'middle', x: 210, y: 22,  w: 42, h: 58, rx: 14, rotation:  2  },
      { id: 'index',  x: 264, y: 36,  w: 40, h: 54, rx: 14, rotation:  8  },
      { id: 'thumb',  x: 348, y: 128, w: 34, h: 44, rx: 12, rotation:  38 },
    ],
  },
  {
    id: 'dark',
    label: 'dark',
    undertone: 'neutral',
    image: handDark,
    nails: [
      { id: 'pinky',  x: 102, y: 58,  w: 36, h: 48, rx: 12, rotation: -12 },
      { id: 'ring',   x: 154, y: 36,  w: 40, h: 54, rx: 14, rotation: -4  },
      { id: 'middle', x: 210, y: 22,  w: 42, h: 58, rx: 14, rotation:  2  },
      { id: 'index',  x: 264, y: 36,  w: 40, h: 54, rx: 14, rotation:  8  },
      { id: 'thumb',  x: 348, y: 128, w: 34, h: 44, rx: 12, rotation:  38 },
    ],
  },
];