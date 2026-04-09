// src/MatchIntelPanel.jsx
import { useState, useCallback } from "react";
import { getH2H, VENUE_INTEL } from "./matchIntel.js";

const TC = {
  RCB:{bg:"#C8102E",dk:"#FFD700"}, SRH:{bg:"#FF822A",dk:"#1B1B1B"},
  MI:{bg:"#004BA0",dk:"#fff"},     KKR:{bg:"#3A225D",dk:"#FFD700"},
  CSK:{bg:"#F5C600",dk:"#003566"}, RR:{bg:"#2D0A6B",dk:"#E91E8C"},
  PBKS:{bg:"#ED1B24",dk:"#fff"},   GT:{bg:"#1B3A6B",dk:"#B5985A"},
  LSG:{bg:"#A72056",dk:"#fff"},    DC:{bg:"#00008B",dk:"#fff"}
};

const TABS = ["H2H","Toss","Venue","AI Pick"];

export default function MatchIntelPanel({ m }) {
  const [open, setOpen]   = useState(false);
  const [tab, setTab]     = useState("H2H");
  const [aiText, setAiText]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone]   = useState(false);

  const h2h   = getH2H(m.home, m.away);
  const venue = VENUE_INTEL[m.venue] || null;
  const hc    = TC[m.home] || { bg:"#333", dk:"#fff" };
  const ac    = TC[m.away] || { bg:"#555", dk:"#fff" };

  const loadAI = useCallback(async () => {
    if (aiDone || aiLoading) return;
    setAiLoading(true);
    try {
      const prompt = `You are a cricket analyst. Given this IPL match data, write a short 3-paragraph prediction insight (max 80 words total). Be specific and factual. Do not use bullet points.

Match: ${m.home} vs ${m.away}
Venue: ${m.venue}
H2H: ${m.home} ${h2h?.wA ?? "?"} wins, ${m.away} ${h2h?.wB ?? "?"} wins from ${h2h?.matches ?? "?"} matches
Home win %: ${h2h?.homeWinPct ?? "?"}% in favour of ${m.home}
Recent streak: ${h2h?.streak ?? "unknown"}
Venue chase win rate: ${venue?.chaseWin ?? "?"}%
Venue avg 1st innings: ${venue?.avgFirst ?? "?"}
Toss choice: teams opt to ${venue?.tossChoice ?? "bowl"} after winning toss

Paragraph 1: H2H summary and which team has the edge.
Paragraph 2: Toss — who is likely to win it and what they'll choose.
Paragraph 3: Match winner pick with reasoning.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Unable to generate insight.";
      setAiText(text);
      setAiDone(true);
    } catch (e) {
      setAiText("Could not load AI insight. Please try again.");
    }
    setAiLoading(false);
  }, [m, h2h, venue, aiDone, aiLoading]);

  const handleTab = (t) => {
    setTab(t);
    if (t === "AI Pick") loadAI();
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{ width:"100%", padding:"10px 14px", background:"var(--color-background-secondary, #f8faff)",
        border:"1px solid #e2e8f0", borderRadius:10, cursor:"pointer", display:"flex",
        justifyContent:"space-between", alignItems:"center", marginTop:8,
        fontFamily:"'Barlow',sans-serif" }}>
      <span style={{ fontSize:12, fontWeight:600, color:"#1a2540" }}>🔍 Match intel</span>
      <span style={{ fontSize:11, color:"#94a3b8" }}>Show ↓</span>
    </button>
  );

  return (
    <div style={{ marginTop:8 }}>
      <button onClick={() => setOpen(false)}
        style={{ width:"100%", padding:"10px 14px", background:"#EBF0FA",
          border:"1px solid #1D428A40", borderRadius:10, cursor:"pointer",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          marginBottom:8, fontFamily:"'Barlow',sans-serif" }}>
        <span style={{ fontSize:12, fontWeight:600, color:"#1D428A" }}>🔍 Match intel</span>
        <span style={{ fontSize:11, color:"#1D428A" }}>Hide ↑</span>
      </button>

      {/* Tab bar */}
      <div style={{ display:"flex", background:"#f1f5f9", borderRadius:8, padding:3, marginBottom:12 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => handleTab(t)}
            style={{ flex:1, padding:"7px 2px", border:"none", borderRadius:6, cursor:"pointer",
              fontFamily:"'Barlow',sans-serif", fontWeight:600, fontSize:10,
              textTransform:"uppercase", letterSpacing:.3,
              background: tab===t ? "#fff" : "transparent",
              color: tab===t ? "#1D428A" : "#94a3b8",
              boxShadow: tab===t ? "0 1px 3px rgba(0,0,0,.08)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* H2H */}
      {tab==="H2H" && h2h && (
        <div>
          <p style={secStyle}>Head to head · IPL 2008–2025</p>
          {/* H2H bar */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ textAlign:"center", minWidth:40 }}>
              <p style={{ fontSize:22, fontWeight:700, color:hc.bg, margin:0, fontFamily:"'Barlow Condensed',sans-serif" }}>{h2h.wA}</p>
              <p style={{ fontSize:9, color:"#94a3b8" }}>{m.home}</p>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden" }}>
                <div style={{ width:`${Math.round(h2h.wA/(h2h.matches||1)*100)}%`, background:hc.bg, borderRadius:"5px 0 0 5px" }}/>
                <div style={{ flex:1, background:ac.bg, borderRadius:"0 5px 5px 0" }}/>
              </div>
              <p style={{ textAlign:"center", fontSize:10, color:"#94a3b8", marginTop:4 }}>{h2h.matches} matches played</p>
            </div>
            <div style={{ textAlign:"center", minWidth:40 }}>
              <p style={{ fontSize:22, fontWeight:700, color:ac.bg, margin:0, fontFamily:"'Barlow Condensed',sans-serif" }}>{h2h.wB}</p>
              <p style={{ fontSize:9, color:"#94a3b8" }}>{m.away}</p>
            </div>
          </div>
          {[
            ["Last result", h2h.lastResult],
            [`At this venue`, `${m.home} ${h2h.homeWinPct}% win rate`],
            [`${m.home} best score`, h2h.highA],
            [`${m.away} best score`, h2h.highB],
            ["Current streak", h2h.streak],
          ].map(([l,v]) => <StatRow key={l} label={l} value={v}/>)}
        </div>
      )}
      {tab==="H2H" && !h2h && <p style={{ color:"#94a3b8", fontSize:12 }}>No H2H data for this fixture yet.</p>}

      {/* Toss */}
      {tab==="Toss" && venue && (
        <div>
          <p style={secStyle}>Toss stats · {m.venue.split(",")[0]}</p>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {[
              [`${m.home} toss win`, "~50%"],
              ["Prefer to", venue.tossChoice.split("(")[0].trim()],
              ["Chase wins", venue.chaseWin+"%"],
            ].map(([l,v]) => <MiniStat key={l} label={l} value={v}/>)}
          </div>
          {venue.facts.slice(0,4).map((f,i) => <FactItem key={i} icon={["🎯","🌙","🏏","📊"][i]} text={f}/>)}
        </div>
      )}
      {tab==="Toss" && !venue && <p style={{ color:"#94a3b8", fontSize:12 }}>No venue data available.</p>}

      {/* Venue */}
      {tab==="Venue" && venue && (
        <div>
          <p style={secStyle}>{m.venue.split(",")[0]} · IPL stats</p>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {[
              ["Avg 1st innings", venue.avgFirst],
              ["Chase win %", venue.chaseWin+"%"],
              ["Highest total", venue.highest.split(" ")[0]],
            ].map(([l,v]) => <MiniStat key={l} label={l} value={v}/>)}
          </div>
          {venue.facts.map((f,i) => <FactItem key={i} icon={["🏟️","🌿","📈","🎳"][i]} text={f}/>)}
        </div>
      )}
      {tab==="Venue" && !venue && <p style={{ color:"#94a3b8", fontSize:12 }}>No venue data available.</p>}

      {/* AI Pick */}
      {tab==="AI Pick" && (
        <div>
          <p style={secStyle}>AI prediction insight</p>
          {aiLoading && (
            <div style={{ background:"#f8faff", borderRadius:10, padding:12 }}>
              {[88,72,80,65,75].map((w,i) => (
                <div key={i} style={{ height:11, borderRadius:4, background:"#e2e8f0",
                  width:w+"%", marginBottom:7, opacity:.6 }}/>
              ))}
            </div>
          )}
          {!aiLoading && aiText && (
            <div style={{ background:"#f8faff", border:"1px solid #e2e8f0", borderRadius:10,
              padding:"12px 14px", fontSize:12, color:"#475569", lineHeight:1.65, marginBottom:12 }}>
              {aiText}
              <p style={{ fontSize:10, color:"#94a3b8", marginTop:8 }}>
                Based on IPL data 2008–2025 · Not a guarantee
              </p>
            </div>
          )}
          {/* Data-suggested picks */}
          {h2h && venue && (
            <div>
              <p style={secStyle}>Data-suggested picks</p>
              <div style={{ display:"flex", gap:8 }}>
                <SuggestedPick label="Toss" team={m.home} color={hc.bg} textColor={hc.dk}
                  note="~50% flip" />
                <SuggestedPick
                  label="Winner"
                  team={h2h.homeWinPct >= 50 ? m.home : m.away}
                  color={h2h.homeWinPct >= 50 ? hc.bg : ac.bg}
                  textColor={h2h.homeWinPct >= 50 ? hc.dk : ac.dk}
                  note={`${Math.max(h2h.homeWinPct, 100-h2h.homeWinPct)}% home H2H`}
                />
                <div style={{ flex:1, background:"#f8faff", borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                  <p style={{ fontSize:9, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, margin:"0 0 6px" }}>Confidence</p>
                  <p style={{ fontSize:18, fontWeight:700, color:"#1a2540", margin:"4px 0 2px",
                    fontFamily:"'Barlow Condensed',sans-serif" }}>
                    {Math.abs(h2h.wA - h2h.wB) <= 2 ? "Low" : Math.abs(h2h.wA - h2h.wB) <= 5 ? "Med" : "High"}
                  </p>
                  <p style={{ fontSize:9, color:"#d97706", marginTop:2 }}>{h2h.streak}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sub-components
const secStyle = {
  fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11,
  letterSpacing:2, textTransform:"uppercase", color:"#1D428A",
  margin:"0 0 10px", paddingBottom:6, borderBottom:"1px solid #e2e8f0"
};

function StatRow({ label, value }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"6px 0", borderBottom:"1px solid #f1f5f9" }}>
      <span style={{ fontSize:12, color:"#64748b" }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:600, color:"#1a2540", textAlign:"right", maxWidth:"55%" }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ flex:1, background:"#f8faff", borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
      <p style={{ fontSize:17, fontWeight:700, color:"#1a2540", margin:0,
        fontFamily:"'Barlow Condensed',sans-serif" }}>{value}</p>
      <p style={{ fontSize:9, color:"#94a3b8", marginTop:2 }}>{label}</p>
    </div>
  );
}

function FactItem({ icon, text }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:8,
      padding:"7px 0", borderBottom:"1px solid #f1f5f9" }}>
      <span style={{ fontSize:13, flexShrink:0, marginTop:1 }}>{icon}</span>
      <span style={{ fontSize:12, color:"#64748b", lineHeight:1.55 }}>{text}</span>
    </div>
  );
}

function SuggestedPick({ label, team, color, textColor, note }) {
  return (
    <div style={{ flex:1, background:"#f8faff", borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
      <p style={{ fontSize:9, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, margin:"0 0 6px" }}>{label}</p>
      <div style={{ width:30, height:30, borderRadius:7, background:color,
        display:"flex", alignItems:"center", justifyContent:"center",
        color:textColor, fontSize:9, fontWeight:700, margin:"0 auto 5px" }}>{team}</div>
      <p style={{ fontSize:11, fontWeight:600, color:"#1a2540" }}>{team}</p>
      <p style={{ fontSize:9, color:"#22c55e", marginTop:2 }}>{note}</p>
    </div>
  );
}
