// CareerStats.jsx  — Phase 3
// Shows a player's career record across every cricket (and future football) tournament.
// Reads each tournament's Firebase prefix independently so historical data is never lost.

import * as React from "react";
import { useState, useEffect } from "react";
import { createDB } from "./firebase.js";
import { CRICKET_TOURNAMENTS } from "./cricketData.js";

const ek = e => (e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const NR = "NO_RESULT";
const isNR = v => !v || v === NR;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
.cs-wrap{min-height:100vh;background:#f0f4f8;font-family:'Barlow',sans-serif;padding-bottom:32px;}
.cs-header{background:linear-gradient(135deg,#0a1628,#1a2f5e);padding:14px 16px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:40;}
.cs-body{padding:16px;max-width:480px;margin:0 auto;}
.cs-card{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.cs-stat{text-align:center;padding:12px 8px;background:#f8faff;border-radius:10px;}
.cs-stat p:first-child{font-size:24px;font-weight:800;color:#1D428A;margin:0;line-height:1;}
.cs-stat p:last-child{font-size:9px;color:#94a3b8;margin:3px 0 0;text-transform:uppercase;letter-spacing:.5px;}
.cs-t-card{border:1px solid #e8edf5;border-radius:12px;padding:14px;margin-bottom:10px;}
.cs-t-card.active{border-color:#1D428A30;background:#f8faff;}
.cs-t-card.finished{background:#fafafa;}
.cs-badge{display:inline-flex;align-items:center;gap:4px;border-radius:20px;padding:3px 9px;font-size:10px;font-weight:700;text-transform:uppercase;}
.cs-spinner{width:28px;height:28px;border:3px solid rgba(29,66,138,.15);border-top-color:#1D428A;border-radius:50%;animation:cs-spin .8s linear infinite;margin:48px auto;}
@keyframes cs-spin{to{transform:rotate(360deg);}}
`;

function StatBox({ value, label, color }) {
  return (
    <div className="cs-stat">
      <p style={color ? { color } : {}}>{value}</p>
      <p>{label}</p>
    </div>
  );
}

function TournamentCard({ data }) {
  const { tournament: t, matchesPicked, matchesDone, accuracy, perfectCount,
          myChampion, myTop4, championCorrect, top4Correct, totalPts, status } = data;

  const variant = status === "finished" ? "finished" : "active";
  const noPicks = matchesPicked === 0;

  return (
    <div className={`cs-t-card ${variant}`}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 8, background: "#e8edf5",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {t.icon || "🏏"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
            fontSize: 16, margin: 0, color: "#0a1628", textTransform: "uppercase" }}>{t.shortName || t.name}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.name}</p>
        </div>
        <span className="cs-badge" style={{
          background: status === "finished" ? "#f5f3ff" : "#f0fdf4",
          color: status === "finished" ? "#7c3aed" : "#15803d",
          border: `1px solid ${status === "finished" ? "#c4b5fd" : "#bbf7d0"}`,
        }}>
          {status === "finished" ? "🏁 Done" : "🟢 Live"}
        </span>
      </div>

      {noPicks ? (
        <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No picks recorded for this tournament.</p>
      ) : (
        <>
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
            <StatBox value={matchesPicked} label="Picks"/>
            <StatBox value={`${accuracy}%`} label="Accuracy" color={accuracy >= 60 ? "#15803d" : accuracy >= 40 ? "#d97706" : "#dc2626"}/>
            <StatBox value={perfectCount} label="Perfects"/>
            <StatBox value={totalPts || "—"} label="Pts"/>
          </div>

          {/* Season picks */}
          {(myChampion && myChampion !== "__skip__") && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6,
                background: "#f8faff", borderRadius: 8, padding: "6px 10px",
                border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>🏆</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: championCorrect ? "#15803d" : "#0a1628" }}>
                  {myChampion}{championCorrect ? " ✅" : ""}
                </span>
              </div>
              {myTop4.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4,
                  background: "#f8faff", borderRadius: 8, padding: "6px 10px",
                  border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>TOP4</span>
                  <span style={{ fontSize: 11, color: "#0a1628" }}>
                    {top4Correct}/{myTop4.length} correct
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CareerStats({ email, userName, onBack }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    const emk = ek(email);

    async function loadAll() {
      setLoading(true);
      const results = await Promise.all(
        CRICKET_TOURNAMENTS.map(async (t) => {
          try {
            const db = createDB(t.dbPrefix);
            const [ap, rm, spRaw, t4Raw, at4, sw] = await Promise.all([
              db.get("ap"),
              db.get("rm"),
              db.get("sp"),
              db.get("t4"),
              db.get("actualtop4"),
              db.get("sw"),
            ]);

            const myPicks = (ap || {})[emk] || {};
            const matchCount = Object.keys(myPicks).length;
            const rmObj = rm || {};

            let correct = 0, total = 0, perfects = 0;
            Object.entries(myPicks).forEach(([mid, pick]) => {
              const result = rmObj[mid] || rmObj[String(mid)];
              if (!result || !result.win || isNR(result.win)) return;
              total++;
              const winOk = pick.win === result.win;
              const motmOk = pick.motm && result.motm && !isNR(result.motm) &&
                pick.motm.split(" ").slice(-1)[0] === result.motm.split(" ").slice(-1)[0];
              if (winOk) correct++;
              if (winOk && motmOk) perfects++;
            });

            const myChampion = (spRaw || {})[emk] || "";
            const myTop4 = (t4Raw || {})[emk] || [];
            const actualTop4 = Array.isArray(at4) ? at4 : [];
            const actualWinner = sw || null;

            return {
              tournament: t,
              matchesPicked: matchCount,
              matchesDone: Object.keys(rmObj).length,
              accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
              perfectCount: perfects,
              totalPts: null, // could calculate with calcScore if needed
              myChampion,
              myTop4,
              top4Correct: actualTop4.length > 0 ? myTop4.filter(t => actualTop4.includes(t)).length : 0,
              championCorrect: !!(actualWinner && myChampion && myChampion === actualWinner && myChampion !== "__skip__"),
              status: t.status,
            };
          } catch (e) {
            console.error("CareerStats load error", t.id, e);
            return { tournament: t, matchesPicked: 0, matchesDone: 0, accuracy: 0,
              perfectCount: 0, myChampion: "", myTop4: [], top4Correct: 0,
              championCorrect: false, status: t.status };
          }
        })
      );
      setStats(results);
      setLoading(false);
    }

    loadAll();
  }, [email]);

  // All-time totals
  const played = stats.filter(s => s.matchesPicked > 0);
  const totalPicks = stats.reduce((s, t) => s + t.matchesPicked, 0);
  const totalPerfects = stats.reduce((s, t) => s + t.perfectCount, 0);
  const avgAcc = played.length > 0
    ? Math.round(played.reduce((s, t) => s + t.accuracy, 0) / played.length)
    : 0;
  const championships = stats.filter(s => s.championCorrect).length;

  return (
    <div className="cs-wrap">
      <style>{CSS}</style>

      {/* Header */}
      <div className="cs-header">
        <button onClick={onBack} style={{ background: "rgba(255,255,255,.1)",
          border: "1px solid rgba(255,255,255,.2)", color: "rgba(255,255,255,.7)",
          borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: "'Barlow',sans-serif" }}>← Back</button>
        <div>
          <p style={{ color: "#C5A028", fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 900, fontSize: 20, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>
            Career Stats
          </p>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 11, margin: 0 }}>
            {userName || email} · All tournaments
          </p>
        </div>
      </div>

      <div className="cs-body">
        {loading ? (
          <div className="cs-spinner" />
        ) : (
          <>
            {/* All-time summary */}
            {totalPicks > 0 && (
              <div className="cs-card">
                <p style={{ fontSize: 10, fontWeight: 700, color: "#1D428A",
                  textTransform: "uppercase", letterSpacing: 2, margin: "0 0 10px" }}>
                  🏆 All-Time Record
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                  <StatBox value={totalPicks} label="Total Picks"/>
                  <StatBox value={`${avgAcc}%`} label="Avg Accuracy"
                    color={avgAcc >= 60 ? "#15803d" : avgAcc >= 40 ? "#d97706" : "#dc2626"}/>
                  <StatBox value={totalPerfects} label="Perfects"/>
                  <StatBox value={championships > 0 ? `${championships}🏆` : "0"} label="Champ"/>
                </div>
                <p style={{ fontSize: 10, color: "#94a3b8", textAlign: "center",
                  marginTop: 10, fontStyle: "italic" }}>
                  Across {CRICKET_TOURNAMENTS.length} cricket tournament{CRICKET_TOURNAMENTS.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Per-tournament */}
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: 2, margin: "0 0 10px" }}>
              By Tournament
            </p>
            {stats.map(s => <TournamentCard key={s.tournament.id} data={s} />)}

            {stats.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 16px" }}>
                <p style={{ fontSize: 36 }}>📭</p>
                <p style={{ color: "#94a3b8", marginTop: 8 }}>No tournaments found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
