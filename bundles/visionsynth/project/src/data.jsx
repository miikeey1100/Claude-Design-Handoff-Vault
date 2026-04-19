// Shared data: scenes, presets, timeline tracks

const SCENES = [
  {
    id: 's1',
    label: 'Neon Arcade',
    prompt: 'A lone figure walks down a neon-soaked tokyo alley at 3am, rain, anamorphic 2.39:1, 35mm',
    colors: ['#ff2d82', '#7a3cff', '#0ea5ff', '#1a0a2e'],
    timecode: '00:00:04:12',
  },
  {
    id: 's2',
    label: 'Dune Ochre',
    prompt: 'Sweeping drone shot over cracked salt flats at golden hour, heat haze, kodak portra',
    colors: ['#e89456', '#c2541d', '#f5d28a', '#2a1405'],
    timecode: '00:00:11:03',
  },
  {
    id: 's3',
    label: 'Aurora Rift',
    prompt: 'Slow push-in on a glacier cave, aurora borealis visible through the ice, bioluminescent moss',
    colors: ['#4ee0b0', '#1a8fb8', '#a6e3ff', '#061a2e'],
    timecode: '00:00:07:22',
  },
  {
    id: 's4',
    label: 'Analog Noir',
    prompt: '1970s detective office, tungsten lamp, smoke drifting across venetian blinds, super 16',
    colors: ['#d4a64a', '#6b3819', '#2a1808', '#0d0604'],
    timecode: '00:00:03:08',
  },
];

const PRESETS = [
  { id: 'p1', name: 'Kodak Portra 400',   kind: 'Film Stock',   hue: 35,  active: true },
  { id: 'p2', name: 'Anamorphic 2.39',    kind: 'Lens',         hue: 210, active: false },
  { id: 'p3', name: 'Ghibli Watercolor',  kind: 'Illustration', hue: 170, active: false },
  { id: 'p4', name: 'Brutalist Concrete', kind: 'Material',     hue: 50,  active: false },
  { id: 'p5', name: 'Liquid Chrome',      kind: 'Material',     hue: 260, active: false },
  { id: 'p6', name: 'VHS Artifact',       kind: 'Texture',      hue: 320, active: false },
];

// Timeline: 4 tracks, clips with start + duration in seconds; total 48s
const TIMELINE_DURATION = 48;
const TRACKS = [
  {
    id: 't1', kind: 'video', name: 'V2 · Generated',
    clips: [
      { id: 'c1', start: 2,  dur: 11, name: 'neon_alley_01.mp4',  color: 'magenta', thumb: 0 },
      { id: 'c2', start: 14, dur: 9,  name: 'dune_drone_03.mp4',  color: 'accent',  thumb: 1 },
      { id: 'c3', start: 24, dur: 13, name: 'aurora_rift_02.mp4', color: 'teal',    thumb: 2 },
      { id: 'c4', start: 38, dur: 8,  name: 'noir_office_01.mp4', color: 'accent',  thumb: 3 },
    ],
  },
  {
    id: 't2', kind: 'video', name: 'V1 · Plate',
    clips: [
      { id: 'c5', start: 0, dur: 20, name: 'bg_plate_wide.mov',   color: 'dim' },
      { id: 'c6', start: 22, dur: 26, name: 'bg_plate_push.mov',  color: 'dim' },
    ],
  },
  {
    id: 't3', kind: 'fx', name: 'FX · Motion',
    clips: [
      { id: 'c7', start: 4,  dur: 5, name: 'rack focus',   color: 'accent-ghost' },
      { id: 'c8', start: 15, dur: 7, name: 'parallax × 2', color: 'accent-ghost' },
      { id: 'c9', start: 30, dur: 10, name: 'dolly ease-out', color: 'accent-ghost' },
    ],
  },
  {
    id: 't4', kind: 'audio', name: 'A1 · Score',
    clips: [
      { id: 'c10', start: 0,  dur: 22, name: 'drone_bed.wav', color: 'wave' },
      { id: 'c11', start: 24, dur: 24, name: 'strings_swell.wav', color: 'wave' },
    ],
  },
];

const SNAP_MARKERS = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];

window.SCENES = SCENES;
window.PRESETS = PRESETS;
window.TRACKS = TRACKS;
window.TIMELINE_DURATION = TIMELINE_DURATION;
window.SNAP_MARKERS = SNAP_MARKERS;
