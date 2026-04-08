import handLight  from '../assets/hands/hand-light.png';
import handMedium from '../assets/hands/hand-medium.png';
import handDark   from '../assets/hands/hand-dark.png';

export const HAND_MODELS = [
  {
    id: 'light',
    label: 'light',
    undertone: 'cool',
    image: handLight,
    nails: [
      { id: 'thumb',  x: 550,  y: 2453, w: 76,  h: 250, rx: 38,  rotation: -35  },
      { id: 'index',  x: 1413, y: 953,  w: 131, h: 219, rx: 66,  rotation: 8   },
      { id: 'middle', x: 2113, y: 821,  w: 110, h: 219, rx: 55,  rotation: 2   },
      { id: 'ring',   x: 2650, y: 1128, w: 98,  h: 208, rx: 49,  rotation: -4  },
      { id: 'pinky',  x: 3241, y: 1785, w: 44,  h: 197, rx: 22,  rotation: -12 },
    ],
  },
  {
    id: 'medium',
    label: 'medium',
    undertone: 'warm',
    image: handMedium,
    nails: [
      { id: 'thumb',  x: 1263, y: 2395, w: 87,  h: 98,  rx: 44,  rotation: 35  },
      { id: 'index',  x: 1872, y: 1687, w: 109, h: 87,  rx: 55,  rotation: 8   },
      { id: 'middle', x: 2493, y: 1665, w: 87,  h: 109, rx: 44,  rotation: 2   },
      { id: 'ring',   x: 2895, y: 1948, w: 55,  h: 98,  rx: 28,  rotation: -4  },
      { id: 'pinky',  x: 2982, y: 2416, w: 33,  h: 87,  rx: 17,  rotation: -12 },
    ],
  },
  {
    id: 'dark',
    label: 'dark',
    undertone: 'neutral',
    image: handDark,
    nails: [
      { id: 'thumb',  x: 1005, y: 1503, w: 100, h: 91,  rx: 50,  rotation: 35  },
      { id: 'index',  x: 1440, y: 1069, w: 90,  h: 154, rx: 45,  rotation: 8   },
      { id: 'middle', x: 1866, y: 897,  w: 81,  h: 153, rx: 41,  rotation: 2   },
      { id: 'ring',   x: 2291, y: 1132, w: 45,  h: 145, rx: 23,  rotation: -4  },
      { id: 'pinky',  x: 2807, y: 2264, w: 90,  h: 172, rx: 45,  rotation: -12 },
    ],
  },
];