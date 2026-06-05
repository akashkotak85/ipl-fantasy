// WeeklyLeaderboard.jsx
// A "gameweek" view over the existing leaderboard data. Buckets played matches
// into calendar weeks (Mon–Sun) by match date, then scores each user using the
// SAME scoring functions as the overall board — just fed a week-filtered match
// list. Season picks (champion/top4/props) are intentionally excluded, since a
// gameweek board is about match-by-match performance only.

import { useState, useMemo, useEffect } from "react";
import { calcScore, calcScoreBandPts, calcBonusPts, ek } from "./cricketScoring.js";
import { Av } from "./cricketUI.jsx";

// Monday (local) of the week containing an ISO date string "YYYY-MM-DD"
function weekStart(iso) {
  const d = new Date(iso + "T00:00:00");
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  return d;
}
function fmt(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function WeeklyLeaderboard({
  ms,
  users,
  allPicks,
  allBonusPicks,
  scoreBandAnswers,
  bonusAnswers,
  doubleMatch,
  email,
}) {
  // Build the ordered list of weeks that actually have completed matches.
  const weeks = useMemo(() => {
    const played = ms.filter((m) => m.result && m.date);
    const map = new Map(); // key(ISO monday) -> { start, end, matches[] }
    played.forEach((m) => {
      const ws = weekStart(m.date);
      const key = ws.toISOString().slice(0, 10);
      if (!map.has(key)) {
        const we = new Date(ws);
        we.setDate(we.getDate() + 6);
        map.set(key, { key, start: ws, end: we, matches: [] });
      }
      map.get(key).matches.push(m);
    });
    return [...map.values()].sort((a, b) => a.start - b.start);
  }, [ms]);

  const [idx, setIdx] = useState(0);
  // Default to the most recent week with results whenever the set changes.
  useEffect(() => {
    if (weeks.length) setIdx(weeks.length - 1);
  }, [weeks.length]);

  if (weeks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 16px" }}>
        <p style={{ fontSize: 36 }}>📅</p>
        <p style={{ color: "#94a3b8", marginTop: 12 }}>No completed matches yet — gameweek boards appear once results are in.</p>
      </div>
    );
  }

  const wk = weeks[Math.min(idx, weeks.length - 1)];
  const weekMs = wk.matches;

  const approved = Object.values(users).filter((u) => u?.email && u.approved !== false);
  const rows = approved
    .map((u) => {
      const emk = ek(u.email);
      const up = allPicks[emk] || {};
      const ub = allBonusPicks?.[emk] || {};
      const base = calcScore(up, weekMs, doubleMatch);
      const sb = calcScoreBandPts(up, scoreBandAnswers || {}, weekMs, doubleMatch);
      const bn = calcBonusPts(ub, bonusAnswers || {}, weekMs, doubleMatch);
      return { ...u, wkPts: base.pts + sb + bn, played: weekMs.filter((m) => up[String(m.id)] || up[Number(m.id)]).length };
    })
    .sort((a, b) => b.wkPts - a.wkPts);

  const topPts = rows[0]?.wkPts || 0;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      {/* Week selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 10px", marginBottom: 12 }}>
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx <= 0} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #e2e8f0", background: idx <= 0 ? "#f8fafc" : "#fff", color: "#1D428A", cursor: idx <= 0 ? "default" : "pointer", fontSize: 16, fontWeight: 800, opacity: idx <= 0 ? 0.4 : 1 }}>‹</button>
        <div style={{ textAlign: "center" }}>
          <p className="C" style={{ fontSize: 16, fontWeight: 800, color: "#1a2540", margin: 0 }}>Gameweek {idx + 1}</p>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: "1px 0 0" }}>{fmt(wk.start)} – {fmt(wk.end)} · {weekMs.length} match{weekMs.length > 1 ? "es" : ""}</p>
        </div>
        <button onClick={() => setIdx((i) => Math.min(weeks.length - 1, i + 1))} disabled={idx >= weeks.length - 1} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #e2e8f0", background: idx >= weeks.length - 1 ? "#f8fafc" : "#fff", color: "#1D428A", cursor: idx >= weeks.length - 1 ? "default" : "pointer", fontSize: 16, fontWeight: 800, opacity: idx >= weeks.length - 1 ? 0.4 : 1 }}>›</button>
      </div>

      {/* Gameweek MVP */}
      {rows[0] && rows[0].wkPts > 0 && (
        <div style={{ background: "linear-gradient(135deg,#FFF7E0,#FFFBEB)", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>👑</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, color: "#92400E", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>Gameweek MVP</p>
            <p className="C" style={{ fontSize: 17, fontWeight: 800, color: "#1a2540", margin: "1px 0 0" }}>{rows[0].name}</p>
          </div>
          <p className="C" style={{ fontSize: 20, fontWeight: 800, color: "#15803d", margin: 0 }}>+{rows[0].wkPts}</p>
        </div>
      )}

      {/* Ranked rows */}
      {rows.map((u, i) => {
        const isMe = u.email === email;
        return (
          <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 10, background: isMe ? "#EBF0FA" : "#fff", border: "1px solid " + (isMe ? "#1D428A40" : "#e2e8f0"), borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}>
            <span style={{ width: 24, textAlign: "center", fontSize: i < 3 ? 16 : 12, fontWeight: 800, color: "#64748b", fontFamily: "'Barlow Condensed',sans-serif" }}>{i < 3 ? medals[i] : i + 1}</span>
            <Av name={u.name} sz={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2540", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}{isMe ? " (You)" : ""}</p>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{u.played}/{weekMs.length} predicted</p>
            </div>
            {/* points bar relative to week leader */}
            <div style={{ width: 60, marginRight: 4 }}>
              <div style={{ height: 6, borderRadius: 3, background: "#eef2f7", overflow: "hidden" }}>
                <div style={{ width: (topPts > 0 ? Math.round((u.wkPts / topPts) * 100) : 0) + "%", height: "100%", background: u.wkPts > 0 ? "#1D428A" : "transparent" }} />
              </div>
            </div>
            <span className="C" style={{ fontSize: 16, fontWeight: 800, color: u.wkPts > 0 ? "#15803d" : "#94a3b8", minWidth: 34, textAlign: "right" }}>+{u.wkPts}</span>
          </div>
        );
      })}
    </div>
  );
}
