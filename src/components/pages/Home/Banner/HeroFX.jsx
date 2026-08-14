// Drifting darkroom dust behind the hero.
//
// This was @react-three/fiber + drei's <Sparkles> on a WebGL canvas. That
// pulled in three.js and cost 218KB gzip — 48% of the whole bundle — to draw
// 55 dots covering ~0.4% of the viewport. Same look, no dependency, no WebGL
// context, and it degrades to a static field under prefers-reduced-motion.

// Deterministic pseudo-random so the field is stable across renders.
const rand = (i, salt) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

const MOTES = Array.from({ length: 55 }, (_, i) => ({
  left: `${rand(i, 1) * 100}%`,
  top: `${rand(i, 2) * 100}%`,
  size: `${(1 + rand(i, 3) * 2.4).toFixed(2)}px`,
  // negative delay starts each mote mid-drift, so nothing pops in on load
  animationDelay: `-${(rand(i, 4) * 22).toFixed(2)}s`,
  animationDuration: `${(16 + rand(i, 5) * 14).toFixed(2)}s`,
  opacity: (0.18 + rand(i, 6) * 0.37).toFixed(3),
  // per-mote drift distance, read by the keyframes
  "--dx": `${(rand(i, 7) * 60 - 30).toFixed(1)}px`,
  "--dy": `${(rand(i, 8) * 50 - 25).toFixed(1)}px`,
}));

const HeroFX = () => (
  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
    {MOTES.map((m, i) => (
      <span
        key={i}
        className="dust-mote"
        style={{
          left: m.left,
          top: m.top,
          width: m.size,
          height: m.size,
          opacity: m.opacity,
          animationDelay: m.animationDelay,
          animationDuration: m.animationDuration,
          "--dx": m["--dx"],
          "--dy": m["--dy"],
        }}
      />
    ))}
  </div>
);

export default HeroFX;
