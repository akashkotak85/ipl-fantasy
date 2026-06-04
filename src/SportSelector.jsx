/*
  SportSelector.jsx
  Shown after login — user picks Cricket or Football.
  Admin can toggle sport visibility via ipl26_sports in Firebase.
*/
import * as React from "react";
import { useState, useEffect } from "react";
import AdminHub from "./AdminHub.jsx";

const FSP_LOGO = "/fsp_logo.png";

const LOGOS = {
  IPL: "https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",
  FIFA: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/2026_FIFA_World_Cup_emblem.svg/200px-2026_FIFA_World_Cup_emblem.svg.png",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.ss-wrap{min-height:100vh;background:linear-gradient(160deg,#0a0f1e,#0f1f45,#0a2060);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:'Barlow',sans-serif;position:relative;overflow:hidden;}
.ss-wrap::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(29,66,138,.3) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(0,100,200,.2) 0%,transparent 50%);pointer-events:none;}
.ss-stars{position:absolute;inset:0;pointer-events:none;}
.ss-trophy{font-size:52px;margin-bottom:8px;text-align:center;filter:drop-shadow(0 4px 16px rgba(255,215,0,.3));}
.ss-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:13px;letter-spacing:6px;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:4px;text-align:center;}
.ss-subtitle{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:28px;letter-spacing:2px;color:#fff;text-transform:uppercase;margin-bottom:2px;text-align:center;}
.ss-subtitle2{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;letter-spacing:2px;color:#fff;text-transform:uppercase;margin-bottom:4px;text-align:center;}
.ss-tagline{font-size:10px;color:rgba(255,255,255,.35);letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;text-align:center;}
.ss-user{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:36px;text-align:center;}
.ss-cards{display:flex;flex-direction:column;gap:16px;width:100%;max-width:360px;}
.ss-card{position:relative;border-radius:20px;padding:24px;cursor:pointer;overflow:hidden;transition:transform .2s,box-shadow .2s;border:1px solid rgba(255,255,255,.1);}
.ss-card:hover{transform:translateY(-3px);}
.ss-card:active{transform:scale(.98);}
.ss-card-ipl{background:linear-gradient(135deg,#1D428A,#2a5bbf);box-shadow:0 8px 32px rgba(29,66,138,.4);}
.ss-card-ipl:hover{box-shadow:0 16px 48px rgba(29,66,138,.6);}
.ss-card-fifa{background:linear-gradient(135deg,#004B87,#006BB6);box-shadow:0 8px 32px rgba(0,75,135,.4);}
.ss-card-fifa:hover{box-shadow:0 16px 48px rgba(0,75,135,.6);}
.ss-card-disabled{opacity:.4;cursor:not-allowed;filter:grayscale(.5);}
.ss-card-disabled:hover{transform:none;}
.ss-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 60%);pointer-events:none;}
.ss-card-inner{display:flex;align-items:center;gap:16px;}
.ss-card-logo-wrap{width:64px;height:64px;border-radius:12px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:34px;flex-shrink:0;}
.ss-card-logo{width:64px;height:64px;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(0,0,0,.3));flex-shrink:0;}
.ss-card-text{flex:1;}
.ss-card-sport{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;letter-spacing:1px;color:#fff;text-transform:uppercase;margin:0 0 2px;}
.ss-card-name{font-size:12px;color:rgba(255,255,255,.7);font-weight:600;margin:0 0 8px;}
.ss-card-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.5px;}
.ss-card-badge.live{background:rgba(34,197,94,.2);border-color:rgba(34,197,94,.4);color:#86efac;}
.ss-card-badge.soon{background:rgba(251,191,36,.2);border-color:rgba(251,191,36,.4);color:#fde68a;}
.ss-card-arrow{font-size:20px;color:rgba(255,255,255,.4);flex-shrink:0;}
.ss-logout{margin-top:32px;background:none;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.4);font-size:12px;font-family:'Barlow',sans-serif;font-weight:600;padding:8px 20px;border-radius:20px;cursor:pointer;letter-spacing:.5px;transition:all .2s;}
.ss-logout:hover{border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.7);}
.ss-coming{position:absolute;top:12px;right:12px;background:rgba(251,191,36,.2);border:1px solid rgba(251,191,36,.4);border-radius:8px;padding:3px 8px;font-size:9px;font-weight:700;color:#fde68a;letter-spacing:1px;text-transform:uppercase;}
.ss-admin-row{display:flex;gap:8px;margin-top:16px;justify-content:center;flex-wrap:wrap;}
.ss-admin-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);font-size:11px;font-family:'Barlow',sans-serif;font-weight:600;padding:6px 14px;border-radius:20px;cursor:pointer;transition:all .2s;}
.ss-admin-btn:hover{background:rgba(255,255,255,.15);color:#fff;}
.ss-admin-btn.on{background:rgba(34,197,94,.2);border-color:rgba(34,197,94,.4);color:#86efac;}
.ss-admin-btn.off{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.3);color:#fca5a5;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.ss-cards{animation:fadeUp .5s ease forwards;}
`;

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.4 + 0.1,
  }));
  return (
    <div className="ss-stars">
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {stars.map((s) => (
          <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size} fill="white" opacity={s.opacity} />
        ))}
      </svg>
    </div>
  );
}

function SportCard({ sport, config, onClick, disabled }) {
  const [logoErr, setLogoErr] = useState(false);
  const isIPL = sport === "ipl";
  const logo = isIPL ? LOGOS.IPL : LOGOS.FIFA;
  const cardClass = `ss-card ${isIPL ? "ss-card-ipl" : "ss-card-fifa"}${disabled ? " ss-card-disabled" : ""}`;

  return (
    <div className={cardClass} onClick={disabled ? undefined : onClick}>
      {!config?.enabled && <span className="ss-coming">Coming Soon</span>}
      <div className="ss-card-inner">
        {logoErr ? (
          <div className="ss-card-logo-wrap">{isIPL ? "🏏" : "⚽"}</div>
        ) : (
          <img
            src={logo}
            alt={sport}
            className="ss-card-logo"
            onError={() => setLogoErr(true)}
            style={{ filter: isIPL ? "brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,.3))" : "drop-shadow(0 4px 12px rgba(0,0,0,.3))" }}
          />
        )}
        <div className="ss-card-text">
          <p className="ss-card-sport">{isIPL ? "Cricket" : "Football"}</p>
          <p className="ss-card-name">{isIPL ? "IPL 2026 & More" : "FIFA World Cup 2026 & More"}</p>
          <span className={`ss-card-badge ${config?.enabled ? "live" : "soon"}`}>
            {config?.enabled
              ? isIPL
                ? "🏏 Cricket"
                : "⚽ Football"
              : "⏳ Coming Soon"}
          </span>
        </div>
        {!disabled && <span className="ss-card-arrow">›</span>}
      </div>
    </div>
  );
}

export default function SportSelector({ user, isAdmin, sportsConfig, onSelect, onLogout, onToggleSport }) {
  const ipl = sportsConfig?.ipl !== false;
  const fifa = sportsConfig?.fifa === true;
  const [showAdmin, setShowAdmin] = useState(false);
  if (showAdmin) return <AdminHub email={user?.email} onBack={() => setShowAdmin(false)} />;

  return (
    <div className="ss-wrap">
      <style>{CSS}</style>
      <StarField />

      <img src={FSP_LOGO} alt="FSP" style={{width:90,height:90,objectFit:"contain",marginBottom:8,filter:"drop-shadow(0 6px 20px rgba(255,215,0,.3))"}}/>
      <p className="ss-title">Fantasy Sports Predictor</p>
      <p className="ss-subtitle">Choose Your</p>
      <p className="ss-subtitle2">Sport</p>
      <p className="ss-tagline">Cricket · Football · More</p>
      <p className="ss-user">Welcome back, {user?.name || "Player"} 👋</p>

      <div className="ss-cards">
        <SportCard
          sport="ipl"
          config={{ enabled: ipl }}
          onClick={() => onSelect("ipl")}
          disabled={!ipl}
        />
        <SportCard
          sport="fifa"
          config={{ enabled: fifa }}
          onClick={() => onSelect("fifa")}
          disabled={!fifa}
        />
      </div>

      {isAdmin && (
        <div style={{
          marginTop: 24,
          width: "100%",
          maxWidth: 360,
          background: "rgba(255,255,255,.05)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 16,
          padding: "14px 16px",
        }}>
          <p style={{
            fontSize: 9,
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,.3)",
            marginBottom: 12,
            textAlign: "center",
          }}>
            Admin · Sport Visibility
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { key: "ipl", label: "Cricket", sub: "IPL 2026 & More", icon: "🏏", enabled: ipl },
              { key: "fifa", label: "Football", sub: "FIFA World Cup 2026 & More", icon: "⚽", enabled: fifa },
            ].map(({ key, label, sub, icon, enabled }) => (
              <div key={key} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,255,255,.05)",
                borderRadius: 12,
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,.08)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,.4)", margin: 0 }}>{sub}</p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleSport(key, !enabled)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "'Barlow',sans-serif",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    background: enabled ? "rgba(34,197,94,.25)" : "rgba(239,68,68,.2)",
                    color: enabled ? "#86efac" : "#fca5a5",
                    transition: "all .2s",
                  }}
                >
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: enabled ? "#22c55e" : "#ef4444",
                    display: "inline-block",
                    flexShrink: 0,
                  }}/>
                  {enabled ? "ON" : "OFF"}
                </button>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: 10,
            color: "rgba(255,255,255,.25)",
            textAlign: "center",
            marginTop: 10,
            fontStyle: "italic",
          }}>
            Both sports can be ON at the same time
          </p>
          <button
            onClick={() => setShowAdmin(true)}
            style={{width:"100%",marginTop:12,padding:"10px",borderRadius:12,
              background:"rgba(197,160,40,.15)",border:"1px solid rgba(197,160,40,.3)",
              color:"#C5A028",fontSize:12,fontFamily:"'Barlow',sans-serif",
              fontWeight:700,cursor:"pointer",letterSpacing:.5}}>
            🛠️ Admin Hub
          </button>
          </div>
      )}

      <button className="ss-logout" onClick={onLogout}>
        Sign Out
      </button>
    </div>
  );
}
