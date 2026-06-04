// TournamentHistory.jsx
// Shown when a tournament status = "finished" (readOnly=true).
// Replaces the live app entirely with a clean historical summary.
// Works for both Cricket and FIFA — pass sport="cricket"|"football".
//
// Props:
//   lb            → getLb() output array (sorted by pts, already computed by the app)
//   email         → current user's email
//   user          → current user object
//   sw            → actual season champion (team name string)
//   actualTop4    → string[] actual top 4 teams
//   actualWs      → (FIFA) wooden spoon team
//   actualGb      → (FIFA) golden boot player
//   actualGg      → (FIFA) golden glove player(s) array
//   actualGball   → (FIFA) golden ball player
//   done          → number of completed matches
//   tournament    → tournament config object (for name, color etc.)
//   sport         → "cricket" | "football"
//   PTS           → scoring constants object
//   onBack        → () => void — back to hub / sport selector

import * as React from "react";
import { useState } from "react";

/* ─── helpers ──────────────────────────────────────────────── */
const ek = e => (e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
function Av({name,sz=32}){
  const n=(name||"?").trim();
  const ini=n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const hue=(n.charCodeAt(0)*137+(n.charCodeAt(n.length-1)||0)*53)%360;
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:`hsl(${hue},55%,42%)`,
    color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:sz*.38,fontWeight:700,flexShrink:0,fontFamily:"'Barlow',sans-serif"}}>{ini}</div>;
}

/* ─── CSS ──────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
.th-wrap{min-height:100vh;background:#f0f4f8;font-family:'Barlow',sans-serif;padding-bottom:40px;}
.th-header{background:linear-gradient(135deg,#0a1628,#1a2f5e);padding:0 16px 20px;text-align:center;position:relative;}
.th-back{position:absolute;left:14px;top:14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7);border-radius:20px;padding:5px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Barlow',sans-serif;}
.th-tab-bar{display:flex;background:#fff;border-bottom:1px solid #e8edf5;overflow-x:auto;scrollbar-width:none;position:sticky;top:0;z-index:39;}
.th-tab-bar::-webkit-scrollbar{display:none;}
.th-tab{flex:1;padding:13px 6px;border:none;background:transparent;color:#64748b;font-size:12px;font-weight:700;font-family:'Barlow',sans-serif;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;transition:all .15s;}
.th-tab.on{color:#1D428A;border-bottom-color:#1D428A;}
.th-body{padding:16px;max-width:480px;margin:0 auto;}
.th-card{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.th-stat{text-align:center;padding:10px 6px;background:#f8faff;border-radius:10px;}
.th-stat p:first-child{font-size:20px;font-weight:800;color:#1D428A;margin:0;line-height:1.1;}
.th-stat p:last-child{font-size:9px;color:#94a3b8;margin:2px 0 0;text-transform:uppercase;letter-spacing:.5px;}
.th-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;}
.th-row:last-child{border-bottom:none;}
.th-medal{width:28px;text-align:center;font-size:18px;flex-shrink:0;}
.th-award-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9;}
.th-award-row:last-child{border-bottom:none;}
.th-section-label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;}
`;

/* ─── sub-components ───────────────────────────────────────── */
function StatBox({ value, label, color }) {
  return (
    <div className="th-stat">
      <p style={color ? { color } : {}}>{value}</p>
      <p>{label}</p>
    </div>
  );
}

function Chip({ label, correct, pending }) {
  const bg = correct ? "#f0fdf4" : pending ? "#f8faff" : "#fef2f2";
  const color = correct ? "#15803d" : pending ? "#475569" : "#dc2626";
  const border = correct ? "#bbf7d0" : pending ? "#e2e8f0" : "#fecaca";
  return (
    <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 600,
      background: bg, color, border: `1px solid ${border}` }}>
      {label}{correct ? " ✅" : pending ? "" : " ✗"}
    </span>
  );
}

/* ─── leaderboard tab ──────────────────────────────────────── */
function LeaderboardTab({ lb, email, sw, actualTop4, sport, PTS, accentColor }) {
  const totalPicks = lb.reduce((s, u) => s + Object.keys(u.userT4 || []).length, 0);
  const avgAcc = lb.length ? Math.round(lb.reduce((s, u) => s + (u.acc || 0), 0) / lb.length) : 0;
  const perfects = lb.filter(u => (u.bgs || []).some(b => b.id === "p1")).length;

  return (
    <>
      {/* Group summary */}
      <div className="th-card">
        <p className="th-section-label">Tournament Summary</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <StatBox value={lb.length} label="Players"/>
          <StatBox value={`${avgAcc}%`} label="Avg Acc"
            color={avgAcc >= 60 ? "#15803d" : avgAcc >= 40 ? "#d97706" : "#dc2626"}/>
          <StatBox value={perfects} label="Perfects"/>
        </div>
        {sw && (
          <div style={{ marginTop: 12, background: "#FFF9E6", borderRadius: 10,
            padding: "10px 14px", border: "1px solid #FDE68A", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#92400E", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>🏆 Champion</p>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
              fontSize: 22, color: "#0a1628", margin: 0, letterSpacing: .5 }}>{sw}</p>
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="th-card">
        <p className="th-section-label">Final Rankings</p>
        {lb.map((u, i) => {
          const isMe = u.email === email;
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
          const champOk = sw && u.userSp && u.userSp === sw && u.userSp !== "__skip__";
          return (
            <div key={u.email} className="th-row"
              style={{ background: isMe ? "#EBF4FF" : "transparent",
                margin: isMe ? "0 -4px" : 0, padding: isMe ? "10px 4px" : "10px 0",
                borderRadius: isMe ? 8 : 0 }}>
              <div className="th-medal">
                {medal ? <span>{medal}</span>
                  : <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>#{i + 1}</span>}
              </div>
              <Av name={u.name} sz={32}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, margin: 0, color: "#0a1628",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                  {isMe && <span style={{ fontSize: 9, background: accentColor || "#1D428A",
                    color: "#fff", borderRadius: 10, padding: "1px 7px", flexShrink: 0 }}>YOU</span>}
                  {u.hot && <span style={{ fontSize: 12 }}>🔥</span>}
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}>
                  {u.userSp && u.userSp !== "__skip__" && (
                    <Chip label={u.userSp.split(" ").slice(0,2).join(" ")}
                      correct={champOk} pending={!sw}/>
                  )}
                  {u.acc != null && (
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>{u.acc}% acc</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
                  fontSize: 22, color: accentColor || "#1D428A", margin: 0 }}>{u.pts}</p>
                <p style={{ fontSize: 9, color: "#94a3b8", margin: 0 }}>pts</p>
              </div>
            </div>
          );
        })}
        {lb.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center", padding: "24px 0", fontSize: 13 }}>No players found.</p>}
      </div>
    </>
  );
}

/* ─── awards tab ───────────────────────────────────────────── */
function AwardsTab({ sw, actualTop4, actualWs, actualGb, actualGg, actualGball, sport, PTS, done }) {
  const cricketAwards = [
    sw && { icon: "🏆", label: "IPL Champion", value: sw },
    actualTop4?.length > 0 && { icon: "🏅", label: "Playoff Teams", value: actualTop4.join(", ") },
  ].filter(Boolean);

  const footballAwards = [
    sw && { icon: "🏆", label: "World Cup Champion", value: sw },
    actualTop4?.length > 0 && { icon: "🏅", label: "Semi-finalists", value: actualTop4.join(", ") },
    actualWs && { icon: "🪵", label: "Wooden Spoon", value: actualWs },
    actualGb && { icon: "👟", label: "Golden Boot", value: actualGb },
    actualGg?.length > 0 && { icon: "🧤", label: "Golden Glove", value: Array.isArray(actualGg) ? actualGg.join(", ") : actualGg },
    actualGball && { icon: "🏅", label: "Golden Ball", value: actualGball },
  ].filter(Boolean);

  const awards = sport === "football" ? footballAwards : cricketAwards;

  return (
    <div className="th-card">
      <p className="th-section-label">Season Awards</p>
      {awards.length === 0 && (
        <p style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
          Season awards haven't been set yet.
        </p>
      )}
      {awards.map((a, i) => (
        <div key={i} className="th-award-row">
          <span style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }}>{a.icon}</span>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: .5, margin: "0 0 3px" }}>{a.label}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0a1628", margin: 0 }}>{a.value}</p>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: "10px 14px", background: "#f8faff",
        borderRadius: 10, textAlign: "center" }}>
        <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px",
          textTransform: "uppercase", letterSpacing: 1 }}>Matches Played</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: "#1D428A",
          fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>{done}</p>
      </div>
    </div>
  );
}

/* ─── my stats tab ─────────────────────────────────────────── */
function MyStatsTab({ lb, email, sw, actualTop4, actualWs, actualGb, actualGg, sport, PTS }) {
  const me = lb.find(u => u.email === email);
  const myRank = lb.findIndex(u => u.email === email) + 1;
  if (!me) return (
    <div className="th-card">
      <p style={{ color: "#94a3b8", textAlign: "center", padding: "24px 0", fontSize: 13 }}>
        No picks found for your account in this tournament.
      </p>
    </div>
  );

  const champCorrect = sw && me.userSp && me.userSp === sw && me.userSp !== "__skip__";
  const top4Points = actualTop4.length > 0
    ? (me.userT4 || []).filter(t => actualTop4.includes(t)).length * (PTS?.top4 || 50)
    : null;

  return (
    <>
      {/* My final rank */}
      <div className="th-card">
        <p className="th-section-label">My Final Result</p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
              fontSize: 48, color: "#1D428A", margin: 0, lineHeight: 1 }}>
              {myRank === 1 ? "🥇" : myRank === 2 ? "🥈" : myRank === 3 ? "🥉" : `#${myRank}`}
            </p>
            <p style={{ fontSize: 10, color: "#94a3b8", margin: 0,
              textTransform: "uppercase", letterSpacing: 1 }}>of {lb.length}</p>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <StatBox value={me.pts} label="Final Pts"/>
              <StatBox value={`${me.acc || 0}%`} label="Accuracy"
                color={(me.acc||0) >= 60 ? "#15803d" : (me.acc||0) >= 40 ? "#d97706" : "#dc2626"}/>
            </div>
          </div>
        </div>
        {(me.bgs || []).length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {me.bgs.map(b => (
              <span key={b.id} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20,
                background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", fontWeight: 600 }}>
                {b.ic} {b.lb}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* My season picks */}
      <div className="th-card">
        <p className="th-section-label">My Season Picks</p>
        {/* Champion */}
        {me.userSp && me.userSp !== "__skip__" && (
          <div className="th-award-row">
            <span style={{ fontSize: 22, flexShrink: 0 }}>🏆</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8",
                textTransform: "uppercase", margin: "0 0 3px" }}>My Champion Pick</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0a1628" }}>{me.userSp}</span>
                {sw && <Chip label={champCorrect ? `+${PTS?.season || 200}pts` : `Picked wrong`}
                  correct={champCorrect} pending={!sw}/>}
              </div>
            </div>
          </div>
        )}

        {/* Top 4 */}
        {(me.userT4 || []).length > 0 && (
          <div className="th-award-row">
            <span style={{ fontSize: 22, flexShrink: 0 }}>🏅</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8",
                textTransform: "uppercase", margin: "0 0 6px" }}>
                My Top 4 Picks
                {top4Points != null && <span style={{ marginLeft: 6, color: top4Points > 0 ? "#15803d" : "#dc2626" }}>
                  {top4Points > 0 ? `+${top4Points}pts` : "0pts"}
                </span>}
              </p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {(me.userT4 || []).map(t => {
                  const correct = actualTop4.length > 0 && actualTop4.includes(t);
                  const wrong = actualTop4.length > 0 && !correct;
                  return <Chip key={t} label={t} correct={correct} pending={!actualTop4.length}/>;
                })}
              </div>
            </div>
          </div>
        )}

        {/* FIFA-specific picks */}
        {sport === "football" && me.userWs && (
          <div className="th-award-row">
            <span style={{ fontSize: 22, flexShrink: 0 }}>🪵</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8",
                textTransform: "uppercase", margin: "0 0 3px" }}>Wooden Spoon Pick</p>
              <Chip label={me.userWs}
                correct={!!actualWs && me.userWs === actualWs}
                pending={!actualWs}/>
            </div>
          </div>
        )}
        {sport === "football" && (me.userGb || []).length > 0 && (
          <div className="th-award-row">
            <span style={{ fontSize: 22, flexShrink: 0 }}>👟</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8",
                textTransform: "uppercase", margin: "0 0 6px" }}>Golden Boot Picks</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {(me.userGb || []).map(p => (
                  <Chip key={p} label={p.split(" ").slice(-1)[0]}
                    correct={!!actualGb && p === actualGb} pending={!actualGb}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No picks */}
        {!me.userSp && !(me.userT4 || []).length && (
          <p style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
            No season picks were made.
          </p>
        )}
      </div>
    </>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function TournamentHistory({
  lb = [],
  email = "",
  user,
  sw,
  actualTop4 = [],
  actualWs = "",
  actualGb = "",
  actualGg = [],
  actualGball = "",
  done = 0,
  tournament,
  sport = "cricket",
  PTS = {},
  onBack,
}) {
  const [tab, setTab] = useState("lb");
  const isCricket = sport === "cricket";
  const accentColor = isCricket ? "#1D428A" : "#004B87";
  const headerGrad = isCricket
    ? "linear-gradient(135deg,#0a1628,#1D428A)"
    : "linear-gradient(135deg,#003d70,#004B87)";
  const tournamentName = tournament?.name || (isCricket ? "IPL" : "FIFA");
  const myRank = lb.findIndex(u => u.email === email) + 1;

  const TABS = [
    ["lb",      "🏆 Standings"],
    ["awards",  "🎖️ Awards"],
    ["me",      "👤 My Stats"],
  ];

  return (
    <div className="th-wrap">
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background: headerGrad, paddingBottom: 24, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 16px 0" }}>
          <button className="th-back" onClick={onBack}>← Back</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 700,
              color: "rgba(255,255,255,.7)", letterSpacing: 1, textTransform: "uppercase" }}>
              🏁 Final Results
            </span>
          </div>
          <div style={{ width: 80 }}/>
        </div>
        <div style={{ textAlign: "center", padding: "16px 16px 0" }}>
          {tournament?.logo && (
            <img src={tournament.logo} alt={tournamentName}
              style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 8,
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,.3))" }}/>
          )}
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28,
            letterSpacing: 2, color: "#fff", textTransform: "uppercase", margin: 0 }}>
            {tournamentName}
          </p>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: 12, margin: "4px 0 0" }}>
            {done} matches · {lb.length} players
            {myRank > 0 && ` · You finished #${myRank}`}
          </p>
          {sw && (
            <p style={{ color: "#C5A028", fontSize: 13, fontWeight: 700, margin: "6px 0 0" }}>
              🏆 {sw}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="th-tab-bar">
        {TABS.map(([id, label]) => (
          <button key={id} className={`th-tab${tab === id ? " on" : ""}`}
            onClick={() => setTab(id)} style={{ "--accent": accentColor }}>
            {label}
          </button>
        ))}
      </div>

      <div className="th-body">
        {tab === "lb" && (
          <LeaderboardTab lb={lb} email={email} sw={sw} actualTop4={actualTop4}
            sport={sport} PTS={PTS} accentColor={accentColor}/>
        )}
        {tab === "awards" && (
          <AwardsTab sw={sw} actualTop4={actualTop4} actualWs={actualWs}
            actualGb={actualGb} actualGg={actualGg} actualGball={actualGball}
            sport={sport} PTS={PTS} done={done}/>
        )}
        {tab === "me" && (
          <MyStatsTab lb={lb} email={email} sw={sw} actualTop4={actualTop4}
            actualWs={actualWs} actualGb={actualGb} actualGg={actualGg}
            sport={sport} PTS={PTS}/>
        )}
      </div>
    </div>
  );
}
