// CricketHub.jsx
// Landing screen for the Cricket sport. Sits between SportSelector and the
// actual tournament game (CricketTournamentApp). Lists LIVE tournaments as
// entry cards and FINISHED ones under a History section (read-only).
//
// Driven entirely by the CRICKET_TOURNAMENTS registry in cricketData.js — add
// a tournament there and it shows up here automatically, no edits to this file.
//
// Props:
//   user                -> { name, ... } for the greeting
//   isAdmin             -> boolean (reserved for future admin-only tournaments)
//   onSelectTournament  -> (tournamentConfig) => void   enter / view a tournament
//   onBack              -> () => void                   back to SportSelector
//
// Auto-skip tip: if you don't want an extra tap while only IPL 2026 exists,
// have the PARENT skip this screen when there is exactly one live tournament
// and nothing finished — see the migration notes.

import * as React from "react";
import {
  CRICKET_TOURNAMENTS,
  getLiveTournaments,
  getUpcomingTournaments,
  getFinishedTournaments,
} from "./cricketData.js";

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
`;

function TournamentCard({ t, variant, onClick }) {
  const [imgErr, setImgErr] = React.useState(false);
  const disabled = variant === "upcoming";
  const teams = (t.teams || []).length;
  const matches = (t.matches || []).length;

  const badge =
    variant === "live" ? (
      <span className="ch-badge ch-badge-live"><span className="ch-dot" style={{ background: "#22c55e" }} /> Live now</span>
    ) : variant === "finished" ? (
      <span className="ch-badge ch-badge-finished">Finished · History</span>
    ) : (
      <span className="ch-badge ch-badge-upcoming">Starts soon</span>
    );

  return (
    <div className={`ch-card ch-card-${variant}`} onClick={disabled ? undefined : () => onClick(t)}>
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
      {!disabled && <span className="ch-arrow">{variant === "finished" ? "›" : "›"}</span>}
    </div>
  );
}

export default function CricketHub({ user, isAdmin, onSelectTournament, onBack }) {
  const live = getLiveTournaments();
  const upcoming = getUpcomingTournaments();
  const finished = getFinishedTournaments();
  const nothing = CRICKET_TOURNAMENTS.length === 0;

  return (
    <div className="ch-wrap">
      <style>{CSS}</style>
      <button className="ch-back" onClick={onBack}>← Sports</button>

      <img src={FSP_LOGO} alt="FSP" className="ch-logo" />
      <p className="ch-kicker">Fantasy Sports Predictor</p>
      <p className="ch-title">Cricket</p>
      <p className="ch-user">Welcome back, {user?.name || "Player"} 🏏</p>

      {nothing && <p className="ch-empty">No cricket tournaments configured yet.</p>}

      {live.length > 0 && (
        <div className="ch-section">
          <p className="ch-section-label">Playing now</p>
          {live.map((t) => (
            <TournamentCard key={t.id} t={t} variant="live" onClick={onSelectTournament} />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="ch-section">
          <p className="ch-section-label">Coming up</p>
          {upcoming.map((t) => (
            <TournamentCard key={t.id} t={t} variant="upcoming" onClick={onSelectTournament} />
          ))}
        </div>
      )}

      {finished.length > 0 && (
        <div className="ch-section">
          <p className="ch-section-label">History</p>
          {finished.map((t) => (
            <TournamentCard key={t.id} t={t} variant="finished" onClick={onSelectTournament} />
          ))}
        </div>
      )}
    </div>
  );
}
