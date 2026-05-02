// Dark cyan command center theme
import React from "react";

export const T = {
  accent: "#22d3ee",
  bg: "#060912",
  surface: "rgba(10,16,28,0.6)",
  surfaceSolid: "#0a101c",
  border: "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.12)",
  text: "#e7eef7",
  textDim: "rgba(231,238,247,0.65)",
  textFaint: "rgba(231,238,247,0.4)",
  alert: "#ff6b6b",
  warn: "#fbbf24",
  ok: "#22d3ee",
  flagged: "#ff9b6b",
  font: "'Space Grotesk', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export function GlobalStyles() {
  return (
    <style>{`
      html, body { min-height: 100vh; background: ${T.bg}; color: ${T.text}; font-family: ${T.font}; letter-spacing: -0.005em; }
      body { position: relative; overflow-x: hidden; }
      body::before {
        content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background:
          radial-gradient(800px 500px at 12% -10%, ${T.accent}22, transparent 60%),
          radial-gradient(900px 600px at 110% 110%, ${T.accent}11, transparent 65%);
      }
      body::after {
        content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background-image:
          linear-gradient(${T.accent}08 1px, transparent 1px),
          linear-gradient(90deg, ${T.accent}08 1px, transparent 1px);
        background-size: 48px 48px;
        mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
      }
      #root { position: relative; z-index: 1; min-height: 100vh; }

      input, textarea, button, select { font-family: ${T.font}; color: ${T.text}; }
      input::placeholder, textarea::placeholder { color: rgba(231,238,247,0.3); }
      input:focus, textarea:focus { outline: none; }

      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${T.accent}55; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: ${T.accent}88; }

      .mono { font-family: ${T.mono}; letter-spacing: 0; }

      @keyframes ap-pulse { 50% { opacity: 0.4; } }
      .pulse-dot { display:inline-block; width:6px; height:6px; border-radius:50%;
        background:${T.accent}; box-shadow: 0 0 10px ${T.accent}; animation: ap-pulse 1.6s infinite; }

      .ap-cta { display:inline-flex; align-items:center; gap:14px;
        padding:14px 22px 14px 26px; background:${T.accent}; color:#04070d;
        border:none; font-family:${T.font}; font-size:14px; font-weight:600;
        letter-spacing:.02em; cursor:pointer;
        box-shadow: 0 0 40px ${T.accent}66, inset 0 0 0 1px rgba(255,255,255,.2);
        transition: box-shadow .15s; }
      .ap-cta:hover { box-shadow: 0 0 60px ${T.accent}aa, inset 0 0 0 1px rgba(255,255,255,.3); }
      .ap-cta:disabled { opacity:.4; cursor: default; box-shadow: none; }

      .ap-ghost { background:none; border:1px solid rgba(255,255,255,.15);
        color:rgba(231,238,247,.7); padding:8px 14px; font-family:${T.mono};
        font-size:11px; letter-spacing:.14em; text-transform:uppercase; cursor:pointer;
        transition: color .15s, border-color .15s; }
      .ap-ghost:hover { color:${T.accent}; border-color:${T.accent}; }

      .ap-panel { background:${T.surface}; border:1px solid ${T.border}; padding:20px; position:relative; }
      .ap-panel-h { display:flex; justify-content:space-between; align-items:center;
        margin-bottom:14px; padding-bottom:12px; border-bottom:1px dashed rgba(255,255,255,.08); }
      .ap-panel-h h3 { font-size:11px; font-family:${T.mono}; color:${T.accent};
        letter-spacing:.18em; text-transform:uppercase; margin:0; font-weight:500; }

      .ap-corner { position:absolute; top:-1px; right:-1px;
        width:14px; height:14px; border-top:1px solid ${T.accent};
        border-right:1px solid ${T.accent}; pointer-events:none; }
      .ap-corner.flagged { border-color: ${T.flagged}; }

      .ap-input { width:100%; padding:14px 18px; background:rgba(10,16,28,.6);
        border:1px solid rgba(255,255,255,.08); color:${T.text}; font-size:14px;
        font-family:inherit; transition: border .15s, box-shadow .15s; }
      .ap-input:focus { border-color:${T.accent}; box-shadow: 0 0 0 3px ${T.accent}22; }

      .ap-chip { padding:8px 14px; font-family:${T.mono}; font-size:11px;
        letter-spacing:.08em; text-transform:uppercase; border:1px solid rgba(255,255,255,.1);
        color:rgba(231,238,247,.6); cursor:pointer; transition:all .15s; background:transparent; }
      .ap-chip:hover { color:${T.text}; }
      .ap-chip.active { border-color:${T.accent}; color:${T.accent}; background:${T.accent}15; }

      .ap-crumb { font-family:${T.mono}; font-size:11px; color:rgba(231,238,247,.45);
        letter-spacing:.14em; text-transform:uppercase; margin-bottom:32px;
        display:flex; gap:8px; align-items:center; }
      .ap-crumb b { color:${T.accent}; font-weight:500; }
    `}</style>
  );
}

export function BrandMark() {
  return (
    <div style={{
      width: 28, height: 28, border: `1px solid ${T.accent}`,
      display: "grid", placeItems: "center", position: "relative",
      boxShadow: `0 0 20px ${T.accent}55, inset 0 0 12px ${T.accent}33`,
    }}>
      <div style={{
        position: "absolute", inset: 5, background: T.accent,
        clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
      }} />
    </div>
  );
}
