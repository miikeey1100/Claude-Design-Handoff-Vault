// Line icons, stroke 1.5, 16x16 viewbox
const I = ({ children, size = 16, stroke = 'currentColor', fill = 'none', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={fill} stroke={stroke}
       strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

const Icon = {
  Play: (p) => <I {...p}><path d="M4 3l9 5-9 5V3z" fill="currentColor" stroke="none"/></I>,
  Pause: (p) => <I {...p}><rect x="4" y="3" width="3" height="10"/><rect x="9" y="3" width="3" height="10"/></I>,
  Stop: (p) => <I {...p}><rect x="4" y="4" width="8" height="8" fill="currentColor" stroke="none"/></I>,
  Back: (p) => <I {...p}><path d="M11 3l-5 5 5 5"/></I>,
  Fwd:  (p) => <I {...p}><path d="M5 3l5 5-5 5"/></I>,
  Plus: (p) => <I {...p}><path d="M8 3v10M3 8h10"/></I>,
  Sparkle: (p) => <I {...p}><path d="M8 2v4M8 10v4M2 8h4M10 8h4"/><path d="M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"/></I>,
  Wand: (p) => <I {...p}><path d="M3 13L11 5"/><path d="M10 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="currentColor" stroke="none"/></I>,
  Layers: (p) => <I {...p}><path d="M8 2l6 3-6 3-6-3 6-3z"/><path d="M2 8l6 3 6-3"/><path d="M2 11l6 3 6-3"/></I>,
  Grid: (p) => <I {...p}><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></I>,
  Folder: (p) => <I {...p}><path d="M2 5a1 1 0 011-1h3l1 1h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"/></I>,
  Settings: (p) => <I {...p}><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"/></I>,
  Search: (p) => <I {...p}><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></I>,
  Chevron: (p) => <I {...p}><path d="M4 6l4 4 4-4"/></I>,
  Mic: (p) => <I {...p}><rect x="6" y="2" width="4" height="8" rx="2"/><path d="M4 8a4 4 0 008 0M8 12v2"/></I>,
  Camera: (p) => <I {...p}><rect x="2" y="4" width="12" height="9" rx="1.5"/><circle cx="8" cy="8.5" r="2.5"/></I>,
  Image: (p) => <I {...p}><rect x="2" y="3" width="12" height="10" rx="1"/><circle cx="6" cy="7" r="1.2"/><path d="M2 11l3.5-3.5L9 11l2-2 3 3"/></I>,
  Lock: (p) => <I {...p}><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></I>,
  Eye: (p) => <I {...p}><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></I>,
  Volume: (p) => <I {...p}><path d="M3 6v4h2l3 2V4L5 6H3z" fill="currentColor" stroke="none"/><path d="M10 6a2.5 2.5 0 010 4M12 4a5 5 0 010 8"/></I>,
  Magnet: (p) => <I {...p}><path d="M3 3v5a5 5 0 0010 0V3"/><path d="M3 3h3v5M10 3h3v5"/></I>,
  Split: (p) => <I {...p}><path d="M8 2v4M8 10v4"/><circle cx="8" cy="8" r="1.5"/><path d="M2 8h4M10 8h4"/></I>,
  Waveform: (p) => <I {...p}><path d="M2 8v0M4 5v6M6 6v4M8 3v10M10 5v6M12 7v2M14 8v0"/></I>,
  Cut: (p) => <I {...p}><circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><path d="M5.5 10.5L13 4M10.5 10.5L3 4"/></I>,
  Expand: (p) => <I {...p}><path d="M3 6V3h3M10 3h3v3M13 10v3h-3M6 13H3v-3"/></I>,
  Check: (p) => <I {...p}><path d="M3 8l3 3 7-7"/></I>,
  Dot: (p) => <I {...p}><circle cx="8" cy="8" r="2" fill="currentColor" stroke="none"/></I>,
  Bolt: (p) => <I {...p}><path d="M9 2L3 9h4l-1 5 6-7H8l1-5z" fill="currentColor" stroke="none"/></I>,
  Aperture: (p) => <I {...p}><circle cx="8" cy="8" r="6"/><path d="M8 2l3 5-6 0 3-5zM14 8l-3 5 0-6 3 1zM2 8l3-1 0 6-3-5z"/></I>,
  Stars: (p) => <I {...p}><path d="M4 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zM11 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></I>,
  Link: (p) => <I {...p}><path d="M7 9l2-2M6 5l1-1a2 2 0 013 3l-1 1M10 11l-1 1a2 2 0 01-3-3l1-1"/></I>,
};

window.Icon = Icon;
