// CricketHub.jsx
// Landing screen for Cricket. Lists live tournaments prominently and finished
// ones in a History section. Tournament status is read dynamically from Firebase
// (ipl26_tourneystatus etc.) so AdminHub's "Close Tournament" button takes
// effect here without any code change.

import * as React from "react";
import { useState, useEffect } from "react";
import { CRICKET_TOURNAMENTS } from "./cricketData.js";
import { createDB } from "./firebase.js";

const FSP_LOGO = "/fsp_logo.png";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
.ch-wrap{min-height:100vh;background:linear-gradient(160deg,#0a0f1e,#0f1f45,#0a2060);display:flex;flex-direction:column;align-items:center;padding:28px 20px 40px;font-family:'Barlow',sans-serif;position:relative;overflow:hidden;}
.ch-wrap::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 40%,rgba(29,66,138,.3) 0%,transparent 60%),radial-gradient(ellipse at 80% 10%,rgba(212,175,55,.12) 0%,transparent 50%);pointer-events:none;}
.ch-back{align-self:flex-start;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);font-size:12px;font-family:'Barlow',sans-serif;font-weight:600;padding:7px 14px;border-radius:20px;cursor:pointer;z-index:2;transition:all .2s;}
.ch-back:hover{background:rgba(255,255,255,.15);color:#fff;}
.ch-logo{width:72px;height:72px;object-fit:contain;margin:18px auto 8px;filter:drop-shadow(0 6px 20px rgba(212,175,55,.3));z-index:2;}
.ch-kicker{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:12px;letter-spacing:5px;color:rgba(255,255,255,.4);text-transform:uppercase;text-align:center;z-index:2;}
.ch-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:30px;letter-spacing:2px;color:#fff;text-transform:uppercase;text-align:center;margin-bottom:2px;z-index:2;}
.ch-user{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:26px;text-align:center;z-index:2;}
.ch-section{width:100%;max-width:380px;z-index:2;}
.ch-section-label{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.35);margin:18px 4px 10px;display:flex;align-items:center;gap:8px;}
.ch-section-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.1);}
.ch-card{position:relative;display:flex;align-items:center;gap:14px;border-radius:18px;padding:16px 18px;cursor:pointer;overflow:hidden;border:1px solid rgba(255,255,255,.1);margin-bottom:12px;transition:transform .2s,box-shadow .2s;}
.ch-card:hover{transform:translateY(-2px);}
.ch-card:active{transform:scale(.99);}
.ch-card-live{background:linear-gradient(135deg,#1D428A,#2a5bbf);box-shadow:0 8px 28px rgba(29,66,138,.4);}
.ch-card-live:hover{box-shadow:0 14px 40px rgba(29,66,138,.6);}
.ch-card-finished{background:rgba(255,255,255,.06);}
.ch-card-finished:hover{background:rgba(255,255,255,.1);}
.ch-card-upcoming{background:rgba(255,255,255,.04);opacity:.55;cursor:not-allowed;}
.ch-card-upcoming:hover{transform:none;}
.ch-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.07) 0%,transparent 60%);pointer-events:none;}
.ch-logo-box{width:54px;height:54px;border-radius:12px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:28px;}
.ch-logo-img{width:54px;height:54px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 4px 12px rgba(0,0,0,.3));}
.ch-card-text{flex:1;min-width:0;}
.ch-card-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;letter-spacing:.5px;color:#fff;text-transform:uppercase;margin:0;}
.ch-card-meta{font-size:11px;color:rgba(255,255,255,.6);font-weight:600;margin:2px 0 8px;}
.ch-badge{display:inline-flex;align-items:center;gap:5px;border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.ch-badge-live{background:rgba(34,197,94,.2);border:1px solid rgba(34,197,94,.4);color:#86efac;}
.ch-badge-finished{background:rgba(148,163,184,.18);border:1px solid rgba(148,163,184,.35);color:#cbd5e1;}
.ch-badge-upcoming{background:rgba(251,191,36,.2);border:1px solid rgba(251,191,36,.4);color:#fde68a;}
.ch-arrow{font-size:22px;color:rgba(255,255,255,.4);flex-shrink:0;}
.ch-empty{text-align:center;color:rgba(255,255,255,.4);font-size:13px;padding:32px 0;z-index:2;}
.ch-dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
.ch-spinner{width:28px;height:28px;border:3px solid rgba(255,255,255,.15);border-top-color:#C5A028;border-radius:50%;animation:ch-spin .8s linear infinite;margin:40px auto;}
@keyframes ch-spin{to{transform:rotate(360deg);}}
`;

function TournamentCard({ t, variant, onClick }) {
  const [imgErr, setImgErr] = React.useState(false);
  const disabled = variant === "upcoming";
  const teams = (t.teams || []).length;
  const matches = (t.matches || []).length;

  const badge =
    variant === "live" ? (
      <span className="ch-badge ch-badge-live">
        <span className="ch-dot" style={{ background: "#22c55e" }} /> Live now
      </span>
    ) : variant === "finished" ? (
      <span className="ch-badge ch-badge-finished">🏁 Finished · History</span>
    ) : (
      <span className="ch-badge ch-badge-upcoming">Coming soon</span>
    );

  return (
    <div className={`ch-card ch-card-${variant}`}
      onClick={disabled ? undefined : () => onClick({ ...t, _readOnly: variant === "finished" })}>
      {t.logo && !imgErr ? (
        <img src={t.logo} alt={t.name} className="ch-logo-img" onError={() => setImgErr(true)} />
      ) : (
        <div className="ch-logo-box">🏏</div>
      )}
      <div className="ch-card-text">
        <p className="ch-card-name">{t.name}</p>
        <p className="ch-card-meta">
          {teams} teams · {matches} matches{t.season ? ` · ${t.season}` : ""}
        </p>
        {badge}
      </div>
      {!disabled && <span className="ch-arrow">›</span>}
    </div>
  );
}

export default function CricketHub({ user, isAdmin, onSelectTournament, onBack }) {
  // Merge static config status with live Firebase status
  const [firebaseStatuses, setFirebaseStatuses] = useState({});
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    async function loadStatuses() {
      setStatusLoading(true);
      try {
        const results = await Promise.all(
          CRICKET_TOURNAMENTS.map(async t => {
            const db = createDB(t.dbPrefix);
            const fbStatus = await db.get("tourneystatus");
            return [t.id, fbStatus || t.status];
          })
        );
        setFirebaseStatuses(Object.fromEntries(results));
      } catch (e) {
        console.error("CricketHub status load", e);
        // Fall back to static config
        const fallback = Object.fromEntries(CRICKET_TOURNAMENTS.map(t => [t.id, t.status]));
        setFirebaseStatuses(fallback);
      }
      setStatusLoading(false);
    }
    loadStatuses();
  }, []);

  // Override static status with Firebase status
  const tournaments = CRICKET_TOURNAMENTS.map(t => ({
    ...t,
    status: firebaseStatuses[t.id] || t.status,
  }));

  const live     = tournaments.filter(t => t.status === "active");
  const upcoming = tournaments.filter(t => t.status === "upcoming");
  const finished = tournaments.filter(t => t.status === "finished");
  const nothing  = tournaments.length === 0;

  return (
    <div className="ch-wrap">
      <style>{CSS}</style>
      <button className="ch-back" onClick={onBack}>← Sports</button>

      <img src={FSP_LOGO} alt="FSP" className="ch-logo" />
      <p className="ch-kicker">Fantasy Sports Predictor</p>
      <p className="ch-title">Cricket</p>
      <p className="ch-user">Welcome back, {user?.name || "Player"} 🏏</p>

      {statusLoading && <div className="ch-spinner" />}

      {!statusLoading && nothing && (
        <p className="ch-empty">No cricket tournaments configured yet.</p>
      )}

      {!statusLoading && live.length > 0 && (
        <div className="ch-section">
          <p className="ch-section-label">Playing now</p>
          {live.map(t => (
            <TournamentCard key={t.id} t={t} variant="live" onClick={onSelectTournament} />
          ))}
        </div>
      )}

      {!statusLoading && upcoming.length > 0 && (
        <div className="ch-section">
          <p className="ch-section-label">Coming up</p>
          {upcoming.map(t => (
            <TournamentCard key={t.id} t={t} variant="upcoming" onClick={onSelectTournament} />
          ))}
        </div>
      )}

      {!statusLoading && finished.length > 0 && (
        <div className="ch-section">
          <p className="ch-section-label">History</p>
          {finished.map(t => (
            <TournamentCard key={t.id} t={t} variant="finished" onClick={onSelectTournament} />
          ))}
        </div>
      )}
    </div>
  );
}
