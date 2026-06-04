// cricketUI.jsx
// Small, stateless (or self-contained) presentational components shared across
// the cricket screens. No business logic lives here.

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { TC, SQ } from "./cricketData.js";

export function TLogo({ t, sz = 48 }) {
  const c = TC[t] || { bg: "#94a3b8", dk: "#fff" };
  return (
    <div
      style={{
        width: sz,
        height: sz,
        borderRadius: 8,
        background: c.bg,
        color: c.dk,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed',sans-serif",
        fontWeight: 900,
        fontSize: sz * 0.32,
        flexShrink: 0,
        letterSpacing: 0.5,
        boxShadow: "0 2px 6px rgba(0,0,0,.2)",
      }}
    >
      {(t || "?").slice(0, 3).toUpperCase()}
    </div>
  );
}

export function Av({ name, sz = 32 }) {
  const ini = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const c = ["#C8102E", "#004BA0", "#3A225D", "#E91E8C", "#FF822A", "#1B3A6B", "#166534"];
  return (
    <div
      style={{
        width: sz,
        height: sz,
        borderRadius: "50%",
        background: c[(name || "").charCodeAt(0) % c.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Barlow Condensed',sans-serif",
        fontWeight: 700,
        fontSize: sz * 0.38,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {ini}
    </div>
  );
}

export function Tst({ t }) {
  const bg = t.type === "error" ? "#fef2f2" : t.type === "ok" ? "#f0fdf4" : "#EBF0FA";
  const cl = t.type === "error" ? "#991b1b" : t.type === "ok" ? "#166534" : "#1e40af";
  const br = t.type === "error" ? "#fecaca" : t.type === "ok" ? "#bbf7d0" : "#bfdbfe";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 86,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Barlow',sans-serif",
        whiteSpace: "nowrap",
        zIndex: 999,
        maxWidth: "90vw",
        overflow: "hidden",
        textOverflow: "ellipsis",
        background: bg,
        color: cl,
        border: "1px solid " + br,
        boxShadow: "0 8px 32px rgba(29,66,138,.15)",
      }}
    >
      {t.msg}
    </div>
  );
}

export function Toggle({ on, onChange }) {
  return (
    <button className="tog" onClick={() => onChange(!on)} style={{ background: on ? "#1D428A" : "#e2e8f0" }}>
      <div className="tog-knob" style={{ left: on ? "23px" : "3px" }} />
    </button>
  );
}

export function useCd(ts) {
  const [tl, sT] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = ts - Date.now();
      if (d <= 0) {
        sT("NOW");
        return;
      }
      const h = Math.floor(d / 3600000),
        m = Math.floor((d % 3600000) / 60000),
        s = Math.floor((d % 60000) / 1000);
      sT(h > 0 ? h + "h " + m + "m" : m > 0 ? m + "m " + s + "s" : s + "s");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ts]);
  return tl;
}

export function SBar({ lbl, tA, tB, cA, cB, clA, clB }) {
  const tot = cA + cB || 1,
    pA = Math.round((cA / tot) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{lbl}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{cA + cB} picks</span>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2540", minWidth: 28, textAlign: "right" }}>{pA}%</span>
        <div className="bar-bg" style={{ flex: 1, display: "flex" }}>
          <div className="bar-fill" style={{ width: pA + "%", background: clA }} />
          <div style={{ flex: 1, background: clB }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2540", minWidth: 28 }}>{100 - pA}%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>
          {tA} <span style={{ color: "#64748b", fontWeight: 600 }}>({cA})</span>
        </span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>
          <span style={{ color: "#64748b", fontWeight: 600 }}>({cB})</span> {tB}
        </span>
      </div>
    </div>
  );
}

export function FormDots({ form, align = "left" }) {
  if (!form || form.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 3,
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {form.map((r, i) => (
        <div
          key={i}
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            flexShrink: 0,
            background: r === "W" ? "#22c55e" : r === "NR" ? "#94a3b8" : "#ef4444",
          }}
        />
      ))}
    </div>
  );
}

export function PotmDropdown({ homeTeam, awayTeam, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const players = [
    ...(SQ[homeTeam] || []).map((p) => ({ p, t: homeTeam })),
    ...(SQ[awayTeam] || []).map((p) => ({ p, t: awayTeam })),
  ];
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);
  return (
    <div className="dd-wrap" ref={ref}>
      <button type="button" className={"dd-trigger" + (open ? " open" : "")} onClick={() => setOpen((o) => !o)}>
        <span style={{ color: value ? "#1D428A" : "#94a3b8", fontWeight: value ? 700 : 400 }}>
          {value || "Select Player of the Match…"}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="dd-list">
          {players.map(({ p, t }) => {
            const c = TC[t] || { bg: "#333", dk: "#fff" };
            return (
              <div
                key={p}
                className={"dd-item" + (value === p ? " sel" : "")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(p);
                  setOpen(false);
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.bg, flexShrink: 0 }} />
                <TLogo t={t} sz={18} />
                <span style={{ flex: 1, fontSize: 13, color: value === p ? "#1D428A" : "#475569", fontWeight: value === p ? 600 : 400 }}>
                  {p}
                </span>
                <span style={{ background: c.bg, color: c.dk || "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
                  {t}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
