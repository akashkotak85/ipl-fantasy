/*
  StockMarket.jsx — IPL Fantasy Stock Exchange v2
  Sub-tabs: Market | My Portfolio | Rankings | Admin(admin-only)
  All live inside the single "📈 Market" bottom-nav item.
  ─────────────────────────────────────────────────────────────
  FIREBASE PATHS (all prefixed with ipl26_):
    ipl26_stocks          { RCB:100, ... }
    ipl26_portfolios      { encodedEmail: { coins, shares, history, initialized } }
    ipl26_price_history   { RCB:[100,115,...] }  last 30 data points per team
    ipl26_market_payout   { done:true, ts, leaderboard }
*/

import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";

/* ─── constants ──────────────────────────────────────────────── */
const TEAMS = ["RCB","SRH","MI","KKR","CSK","RR","PBKS","GT","LSG","DC"];
const TF = { RCB:"Royal Challengers Bengaluru",SRH:"Sunrisers Hyderabad",MI:"Mumbai Indians",KKR:"Kolkata Knight Riders",CSK:"Chennai Super Kings",RR:"Rajasthan Royals",PBKS:"Punjab Kings",GT:"Gujarat Titans",LSG:"Lucknow Super Giants",DC:"Delhi Capitals" };
const TC = { RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"} };
const LOGOS = { RCB:"https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",SRH:"https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",MI:"https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",KKR:"https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",CSK:"https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",RR:"https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",PBKS:"https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",GT:"https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",LSG:"https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",DC:"https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png" };

const STARTING_COINS = 1000;
const STARTING_PRICE = 100;
const WIN_DELTA      = 15;
const LOSS_DELTA     = -10;
const PRICE_FLOOR    = 50;
const PRICE_CEIL     = 300;
const TOTAL_MATCHES  = 74;
const PAYOUT_PTS     = [500, 300, 150, 75, 75];

const PFX = "ipl26_";
const ek  = e => (e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");

/* ─── Firebase (reuses same app instance as App.jsx) ─────────── */
const firebaseConfig = { apiKey:"AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",authDomain:"ipl2026-fantasy-20c9b.firebaseapp.com",databaseURL:"https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",projectId:"ipl2026-fantasy-20c9b",storageBucket:"ipl2026-fantasy-20c9b.firebasestorage.app",messagingSenderId:"973930153403",appId:"1:973930153403:web:872ce26072b07e1adf309e" };
const firebaseReady = (async()=>{
  const [app,db] = await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")]);
  const _app = app.getApps().length ? app.getApp() : app.initializeApp(firebaseConfig);
  return { db:db.getDatabase(_app), dbMod:db };
})();
const MDB = {
  get:  async k     => { try{ const{db,dbMod}=await firebaseReady; const s=await dbMod.get(dbMod.ref(db,PFX+k)); return s.exists()?s.val():null; }catch(e){ console.error("MDB.get",k,e); return null; } },
  set:  async(k,v)  => { try{ const{db,dbMod}=await firebaseReady; if(v==null) await dbMod.remove(dbMod.ref(db,PFX+k)); else await dbMod.set(dbMod.ref(db,PFX+k),v); }catch(e){ console.error("MDB.set",k,e); } },
  path: async(p,v)  => { try{ const{db,dbMod}=await firebaseReady; await dbMod.set(dbMod.ref(db,PFX+p),v); }catch(e){ console.error("MDB.path",p,e); } },
};

/* ─── Pure helpers ───────────────────────────────────────────── */
const clamp       = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const fmt         = n => Number(n).toLocaleString("en-IN");
const initPrices  = () => Object.fromEntries(TEAMS.map(t=>[t,STARTING_PRICE]));
const initPort    = () => ({ coins:STARTING_COINS, shares:Object.fromEntries(TEAMS.map(t=>[t,0])), history:[], initialized:true });
const portVal     = (port,prices) => { if(!port||!prices) return 0; return (port.coins||0)+TEAMS.reduce((s,t)=>s+(port.shares?.[t]||0)*(prices[t]||STARTING_PRICE),0); };

/* ─── TLogo ──────────────────────────────────────────────────── */
function TLogo({t,sz=36}){
  const [err,setErr]=useState(false);
  const c=TC[t]||{bg:"#94a3b8",dk:"#fff"};
  if(err||!TC[t]) return <span style={{width:sz,height:sz,borderRadius:6,background:c.bg,color:c.dk,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:sz*.34,flexShrink:0}}>{(t||"?").slice(0,3)}</span>;
  return <img src={LOGOS[t]} alt={t} width={sz} height={sz} onError={()=>setErr(true)} style={{objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 1px 4px rgba(0,0,0,.18))",maxWidth:sz,maxHeight:sz}}/>;
}

/* ─── Delta badge ────────────────────────────────────────────── */
function Delta({v}){
  if(!v) return <span style={{fontSize:10,color:"#94a3b8"}}>—</span>;
  const up=v>0;
  return <span style={{fontSize:10,fontWeight:700,color:up?"#15803d":"#dc2626",background:up?"#f0fdf4":"#fef2f2",borderRadius:5,padding:"1px 5px"}}>{up?"+":""}{v}</span>;
}

/* ─── Mini sparkline ─────────────────────────────────────────── */
function Spark({data,color}){
  if(!data||data.length<2) return null;
  const W=56,H=22,mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-mn)/rng)*(H-4)-2}`).join(" ");
  return <svg width={W} height={H} style={{display:"block"}}><polyline points={pts} fill="none" stroke={color||"#1D428A"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/* ─── WinnerLoserPicker — must be a real component, not IIFE ─── */
function WinnerLoserPicker({onApply}){
  const [winner,setWinner]=useState("");
  const [loser, setLoser] =useState("");
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,color:"#475569",margin:"0 0 6px"}}>1. Winner team:</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
        {TEAMS.map(t=>(
          <button key={t} onClick={()=>setWinner(w=>w===t?"":t)}
            style={{padding:"4px 9px",borderRadius:8,background:winner===t?(TC[t]?.bg||"#1D428A"):"#f8faff",color:winner===t?"#fff":"#475569",border:"1px solid "+(winner===t?"transparent":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:700}}>
            {t}
          </button>
        ))}
      </div>
      <p style={{fontSize:11,fontWeight:600,color:"#475569",margin:"0 0 6px"}}>2. Loser team:</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
        {TEAMS.filter(t=>t!==winner).map(t=>(
          <button key={t} onClick={()=>setLoser(l=>l===t?"":t)}
            style={{padding:"4px 9px",borderRadius:8,background:loser===t?"#dc2626":"#f8faff",color:loser===t?"#fff":"#475569",border:"1px solid "+(loser===t?"#dc2626":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:700}}>
            {t}
          </button>
        ))}
      </div>
      <button style={{width:"100%",padding:"11px",borderRadius:10,background:winner&&loser?"linear-gradient(135deg,#1D428A,#2a5bbf)":"#94a3b8",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,letterSpacing:1,textTransform:"uppercase",border:"none",cursor:winner&&loser?"pointer":"not-allowed",opacity:winner&&loser?1:.5}}
        disabled={!winner||!loser}
        onClick={()=>{ onApply(winner,loser); setWinner(""); setLoser(""); }}>
        Apply: {winner||"?"} +{WIN_DELTA} · {loser||"?"} {LOSS_DELTA}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════════════════ */
export default function StockMarket({ email, users, ms, isAdmin, toast2, onPayout }) {
  const [prices,        setPrices]        = useState(null);
  const [portfolio,     setPortfolio]     = useState(null);
  const [allPortfolios, setAllPortfolios] = useState({});
  const [priceHistory,  setPriceHistory]  = useState({});
  const [payoutDone,    setPayoutDone]    = useState(false);
  const [tab,           setTab]           = useState("market");
  const [selectedTeam,  setSelectedTeam]  = useState(null);
  const [tradeQty,      setTradeQty]      = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [busy,          setBusy]          = useState(false);
  const [adminTab,      setAdminTab]      = useState("prices");
  const [adminDelta,    setAdminDelta]    = useState({});

  const myEk = useMemo(()=>ek(email),[email]);

  /* ── Load all market data ──────────────────────────────────── */
  const loadData = useCallback(async()=>{
    setLoading(true);
    try{
      const [rawP,rawPort,rawHist,rawPayout] = await Promise.all([
        MDB.get("stocks"), MDB.get("portfolios"), MDB.get("price_history"), MDB.get("market_payout"),
      ]);
      const p = rawP||initPrices();
      if(!rawP) await MDB.set("stocks",p);
      setPrices(p);
      setPriceHistory(rawHist||{});
      const allP = rawPort||{};
      setAllPortfolios(allP);
      let myP = allP[myEk];
      if(!myP){ myP=initPort(); await MDB.path(`portfolios/${myEk}`,myP); }
      setPortfolio(myP);
      setPayoutDone(!!(rawPayout?.done));
    }catch(e){ console.error("SM loadData",e); }
    setLoading(false);
  },[myEk]);

  useEffect(()=>{ loadData(); },[loadData]);

  /* ── Trading lock (35 min before any today match) ──────────── */
  const tradingBlocked = useMemo(()=>{
    const today = new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});
    return ms.filter(m=>m.date===today&&!m.result).some(m=>{
      const t=(m.time||"00:00").trim(), p=t.length===4?"0"+t:t;
      const d=new Date(m.date+"T"+p+":00+05:30");
      return !isNaN(d.getTime()) && new Date()>=new Date(d-35*60*1000);
    });
  },[ms]);

  /* ── Buy ───────────────────────────────────────────────────── */
  async function handleBuy(team){
    if(tradingBlocked){toast2("Trading paused — match locked 🔒","error");return;}
    if(!portfolio||!prices||busy) return;
    const price=prices[team], qty=Math.max(1,tradeQty), total=price*qty;
    if(portfolio.coins<total){toast2(`Need ₹${fmt(total)}, have ₹${fmt(Math.round(portfolio.coins))}`,"error");return;}
    setBusy(true);
    try{
      const fresh=(await MDB.get(`portfolios/${myEk}`))||initPort();
      if(fresh.coins<total){toast2("Not enough coins","error");setBusy(false);return;}
      const upd={...fresh,coins:fresh.coins-total,shares:{...fresh.shares,[team]:(fresh.shares?.[team]||0)+qty},history:[...(fresh.history||[]),{type:"buy",team,qty,price,total,ts:Date.now()}].slice(-50)};
      await MDB.path(`portfolios/${myEk}`,upd);
      setPortfolio(upd);
      toast2(`Bought ${qty}× ${team} @ ₹${fmt(price)} ✅`,"ok");
      setTradeQty(1); setSelectedTeam(null);
    }catch(e){console.error("buy",e);toast2("Trade failed","error");}
    setBusy(false);
  }

  /* ── Sell ──────────────────────────────────────────────────── */
  async function handleSell(team){
    if(tradingBlocked){toast2("Trading paused — match locked 🔒","error");return;}
    if(!portfolio||!prices||busy) return;
    const price=prices[team], qty=Math.max(1,tradeQty), held=portfolio.shares?.[team]||0;
    if(held<qty){toast2(`Only ${held} share${held===1?"":"s"} of ${team}`,"error");return;}
    setBusy(true);
    try{
      const fresh=(await MDB.get(`portfolios/${myEk}`))||initPort();
      const heldFresh=fresh.shares?.[team]||0;
      if(heldFresh<qty){toast2("Not enough shares","error");setBusy(false);return;}
      const total=price*qty;
      const upd={...fresh,coins:fresh.coins+total,shares:{...fresh.shares,[team]:heldFresh-qty},history:[...(fresh.history||[]),{type:"sell",team,qty,price,total,ts:Date.now()}].slice(-50)};
      await MDB.path(`portfolios/${myEk}`,upd);
      setPortfolio(upd);
      toast2(`Sold ${qty}× ${team} @ ₹${fmt(price)} ✅`,"ok");
      setTradeQty(1); setSelectedTeam(null);
    }catch(e){console.error("sell",e);toast2("Trade failed","error");}
    setBusy(false);
  }

  /* ── Admin: apply match result prices ──────────────────────── */
  async function applyPriceUpdate(winner,loser){
    if(!prices) return;
    const np={...prices};
    if(winner&&TEAMS.includes(winner)) np[winner]=clamp(np[winner]+WIN_DELTA,PRICE_FLOOR,PRICE_CEIL);
    if(loser &&TEAMS.includes(loser))  np[loser] =clamp(np[loser]+LOSS_DELTA,PRICE_FLOOR,PRICE_CEIL);
    const nh={...priceHistory};
    TEAMS.forEach(t=>{ if(!nh[t]) nh[t]=[STARTING_PRICE]; nh[t]=[...nh[t],np[t]].slice(-30); });
    await MDB.set("stocks",np); await MDB.set("price_history",nh);
    setPrices(np); setPriceHistory(nh);
    toast2(`Prices: ${winner} +${WIN_DELTA} / ${loser} ${LOSS_DELTA}`,"ok");
  }

  /* ── Admin: apply manual deltas ────────────────────────────── */
  async function applyManualDelta(){
    if(!prices) return;
    const np={...prices}, nh={...priceHistory}; let changed=0;
    TEAMS.forEach(t=>{ const d=Number(adminDelta[t]||0); if(d!==0){ np[t]=clamp(np[t]+d,PRICE_FLOOR,PRICE_CEIL); if(!nh[t]) nh[t]=[STARTING_PRICE]; nh[t]=[...nh[t],np[t]].slice(-30); changed++; } });
    if(!changed){toast2("No deltas set","error");return;}
    await MDB.set("stocks",np); await MDB.set("price_history",nh);
    setPrices(np); setPriceHistory(nh); setAdminDelta({});
    toast2(`${changed} price${changed!==1?"s":""} updated ✅`,"ok");
  }

  /* ── Admin: reset prices ───────────────────────────────────── */
  async function resetPrices(){
    if(!confirm("Reset ALL prices to ₹100? Cannot be undone.")) return;
    const p=initPrices(), h=Object.fromEntries(TEAMS.map(t=>[t,[STARTING_PRICE]]));
    await MDB.set("stocks",p); await MDB.set("price_history",h);
    setPrices(p); setPriceHistory(h); toast2("Prices reset to ₹100 ✅","ok");
  }

  /* ── Admin: grant coins ────────────────────────────────────── */
  async function grantStartingCoins(){
    if(!confirm(`Grant ₹${fmt(STARTING_COINS)} to users without a portfolio?`)) return;
    const allP=(await MDB.get("portfolios"))||{};
    const approved=Object.values(users).filter(u=>u?.email&&u.approved!==false);
    let granted=0;
    for(const u of approved){ const emk2=ek(u.email); if(!allP[emk2]){ allP[emk2]=initPort(); await MDB.path(`portfolios/${emk2}`,allP[emk2]); granted++; } }
    setAllPortfolios({...allP});
    toast2(`Granted to ${granted} user${granted===1?"":"s"} ✅`,"ok");
  }

  /* ── Season payout ─────────────────────────────────────────── */
  async function triggerSeasonPayout(force=false){
    const done=ms.filter(m=>m.result).length;
    if(!force&&done<TOTAL_MATCHES) return;
    if(force&&!confirm("Trigger season-end stock market payout now?")) return;
    const [fp,fpr]=await Promise.all([MDB.get("portfolios"),MDB.get("stocks")]);
    const pr=fpr||initPrices();
    const lb=Object.entries(fp||{}).map(([emk2,port])=>({emk:emk2,value:portVal(port,pr)})).sort((a,b)=>b.value-a.value);
    const map={};
    lb.forEach(({emk:emk2},i)=>{ const pts=PAYOUT_PTS[i]||0; if(pts>0) map[emk2]=pts; });
    await MDB.set("market_payout",{done:true,ts:Date.now(),leaderboard:lb.slice(0,10)});
    if(onPayout&&Object.keys(map).length) onPayout(map);
    setPayoutDone(true);
    toast2(`🏆 Payout done! ${Object.keys(map).length} players rewarded`,"ok");
  }

  /* ── Auto-payout trigger ───────────────────────────────────── */
  useEffect(()=>{
    if(payoutDone) return;
    if(ms.filter(m=>m.result).length>=TOTAL_MATCHES){
      MDB.get("market_payout").then(r=>{ if(!r?.done) triggerSeasonPayout(false); });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ms,payoutDone]);

  /* ── Derived ───────────────────────────────────────────────── */
  const myCoins   = portfolio?.coins??0;
  const myShares  = portfolio?.shares??{};
  const myValue   = prices ? portVal(portfolio,prices) : 0;
  const myHistory = portfolio?.history??[];
  const myPL      = myValue - STARTING_COINS;

  const leaderboard = useMemo(()=>{
    if(!prices) return [];
    return Object.values(users).filter(u=>u?.email&&u.approved!==false)
      .map(u=>{ const port=allPortfolios[ek(u.email)]||initPort(); return {...u,value:portVal(port,prices),port}; })
      .sort((a,b)=>b.value-a.value);
  },[users,allPortfolios,prices]);

  const sortedTeams = prices ? [...TEAMS].sort((a,b)=>(prices[b]||STARTING_PRICE)-(prices[a]||STARTING_PRICE)) : TEAMS;

  /* ── CSS ───────────────────────────────────────────────────── */
  const CSS=`
    .sm-stab{flex:1;padding:9px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:10px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
    .sm-stab.on{color:#1D428A;border-bottom:2px solid #1D428A;}
    .sm-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:12px;}
    .sm-pbtn{width:100%;padding:11px;border-radius:10px;background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;}
    .sm-pbtn:disabled{opacity:.4;cursor:default;}
    .sm-dbtn{width:100%;padding:10px;border-radius:10px;background:#fef2f2;color:#dc2626;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;letter-spacing:1px;text-transform:uppercase;border:1px solid #fecaca;cursor:pointer;}
    .sm-atab{flex:1;padding:8px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:9px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
    .sm-atab.on{color:#1D428A;border-bottom:2px solid #1D428A;}
    @keyframes smfi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .smfi{animation:smfi .3s ease forwards;}
    .sm-tcard{background:#fff;border:2px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:10px;cursor:pointer;transition:border-color .15s;}
    .sm-tcard:hover{border-color:#1D428A40;}
    .sm-tcard.sel{border-color:#1D428A;background:#EBF0FA;}
  `;

  if(loading) return (
    <div style={{padding:32,textAlign:"center"}}>
      <style>{CSS}</style>
      <p style={{color:"#94a3b8",fontSize:13}}>Loading market…</p>
    </div>
  );

  const subTabs=[["market","📊 Market"],["portfolio","💼 Portfolio"],["rankings","🏆 Rankings"],...(isAdmin?[["admin","⚙️ Admin"]]:[])] ;

  return (
    <div style={{paddingBottom:16}}>
      <style>{CSS}</style>

      {/* ── Hero header ───────────────────────────────────────── */}
      <div style={{background:"linear-gradient(135deg,#0f2456,#1D428A)",padding:"16px 16px 14px"}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:2,margin:0}}>📈 IPL STOCK EXCHANGE</p>
        <p style={{color:"#bfdbfe",fontSize:11,margin:"3px 0 12px"}}>TATA IPL 2026 · Buy &amp; sell team shares</p>
        <div style={{display:"flex",gap:8}}>
          {[["💰 Coins",`₹${fmt(Math.round(myCoins))}`],["🏦 Portfolio",`₹${fmt(Math.round(myValue))}`],[myPL>=0?"📈 Gain":"📉 Loss",`${myPL>=0?"+":""}₹${fmt(Math.round(Math.abs(myPL)))}`]].map(([l,v])=>(
            <div key={l} style={{flex:1,background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 6px",textAlign:"center"}}>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#FFE57F",fontSize:15,fontWeight:800,margin:0}}>{v}</p>
              <p style={{color:"rgba(255,255,255,.55)",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>{l}</p>
            </div>
          ))}
        </div>
        {tradingBlocked&&<div style={{marginTop:10,background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"6px 12px",fontSize:11,color:"#fca5a5",fontWeight:600}}>🔒 Trading paused — match about to start</div>}
        {payoutDone&&<div style={{marginTop:10,background:"rgba(255,215,0,.15)",border:"1px solid rgba(255,215,0,.3)",borderRadius:8,padding:"6px 12px",fontSize:11,color:"#FFE57F",fontWeight:600}}>🏆 Season over — final payouts awarded!</div>}
      </div>

      {/* ── Sub-tab bar ───────────────────────────────────────── */}
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
        {subTabs.map(([t,l])=>(
          <button key={t} className={`sm-stab${tab===t?" on":""}`} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>

      <div style={{padding:"14px 14px 0"}}>

        {/* ════════ MARKET ════════ */}
        {tab==="market"&&(
          <div className="smfi">
            <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"9px 13px",marginBottom:14,fontSize:11,color:"#92400E",lineHeight:1.5}}>
              💡 <b>Win</b> +{WIN_DELTA} · <b>Loss</b> {LOSS_DELTA} · Floor ₹{PRICE_FLOOR} · Ceiling ₹{PRICE_CEIL} · Whole shares only
            </div>

            {sortedTeams.map(team=>{
              const price = prices?.[team]??STARTING_PRICE;
              const hist  = priceHistory[team]||[STARTING_PRICE];
              const delta = hist.length>=2 ? price-hist[hist.length-2] : 0;
              const held  = myShares[team]||0;
              const sel   = selectedTeam===team;
              const tc    = TC[team]||{bg:"#333"};
              const canBuy  = !tradingBlocked && myCoins>=price*tradeQty && !busy;
              const canSell = !tradingBlocked && held>=tradeQty && !busy;

              return (
                <div key={team} className={`sm-tcard${sel?" sel":""}`}
                  onClick={()=>{ setSelectedTeam(sel?null:team); setTradeQty(1); }}>
                  {/* Row */}
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <TLogo t={team} sz={42}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:"#1a2540",margin:0}}>{team}</p>
                      <p style={{fontSize:10,color:"#64748b",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{TF[team]}</p>
                      {held>0&&<p style={{fontSize:10,color:"#1D428A",fontWeight:700,margin:"2px 0 0"}}>{held} share{held!==1?"s":""} · ₹{fmt(held*price)}</p>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <Spark data={hist} color={tc.bg}/>
                      <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1a2540",fontSize:18,fontWeight:800,margin:0}}>₹{fmt(price)}</p>
                      <Delta v={delta}/>
                    </div>
                  </div>

                  {/* Trade panel (expands on tap) */}
                  {sel&&(
                    <div style={{marginTop:14,borderTop:"1px solid #e2e8f0",paddingTop:14}} onClick={e=>e.stopPropagation()}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                        <span style={{fontSize:12,color:"#64748b",fontWeight:600,flexShrink:0}}>Qty</span>
                        <button onClick={()=>setTradeQty(q=>Math.max(1,q-1))} style={{width:32,height:32,borderRadius:8,border:"1px solid #e2e8f0",background:"#f8faff",cursor:"pointer",fontSize:18,lineHeight:1,color:"#1a2540",fontWeight:700}}>−</button>
                        <input type="number" min="1" max="999" value={tradeQty}
                          onChange={e=>setTradeQty(Math.max(1,parseInt(e.target.value)||1))}
                          onClick={e=>e.stopPropagation()}
                          style={{width:56,textAlign:"center",padding:"6px 4px",borderRadius:8,border:"1px solid #e2e8f0",background:"#f8faff",fontSize:14,fontFamily:"'Barlow',sans-serif",outline:"none"}}/>
                        <button onClick={()=>setTradeQty(q=>q+1)} style={{width:32,height:32,borderRadius:8,border:"1px solid #e2e8f0",background:"#f8faff",cursor:"pointer",fontSize:18,lineHeight:1,color:"#1a2540",fontWeight:700}}>+</button>
                        <span style={{fontSize:12,color:"#64748b",marginLeft:4}}>= <b style={{color:"#1D428A"}}>₹{fmt(price*tradeQty)}</b></span>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={()=>handleBuy(team)} disabled={!canBuy}
                          style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:canBuy?"pointer":"not-allowed",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,letterSpacing:1,textTransform:"uppercase",background:canBuy?"#15803d":"#cbd5e1",color:"#fff"}}>
                          {busy?"…":`Buy ₹${fmt(price*tradeQty)}`}
                        </button>
                        <button onClick={()=>handleSell(team)} disabled={!canSell}
                          style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:canSell?"pointer":"not-allowed",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,letterSpacing:1,textTransform:"uppercase",background:canSell?"#dc2626":"#cbd5e1",color:"#fff"}}>
                          {busy?"…":`Sell ₹${fmt(price*tradeQty)}`}
                        </button>
                      </div>
                      <p style={{fontSize:10,color:"#94a3b8",marginTop:6,textAlign:"center"}}>
                        ₹{fmt(Math.round(myCoins))} coins · {held} {team} share{held!==1?"s":""}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════ MY PORTFOLIO ════════ */}
        {tab==="portfolio"&&(
          <div className="smfi">
            {/* Summary */}
            <div className="sm-card" style={{background:"linear-gradient(135deg,#EBF0FA,#f4f7ff)",border:"1px solid #bfdbfe"}}>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1D428A",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:1,margin:"0 0 12px"}}>My Portfolio Summary</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  ["💰 Cash",         `₹${fmt(Math.round(myCoins))}`],
                  ["📈 Shares Value",  `₹${fmt(Math.round(myValue-myCoins))}`],
                  ["🏦 Total Value",   `₹${fmt(Math.round(myValue))}`],
                  [myPL>=0?"📊 Gain":"📊 Loss", `${myPL>=0?"+":""}₹${fmt(Math.round(Math.abs(myPL)))}`],
                ].map(([l,v])=>(
                  <div key={l} style={{background:"rgba(255,255,255,.75)",borderRadius:10,padding:"8px 10px"}}>
                    <p style={{fontSize:9,color:"#64748b",margin:0,textTransform:"uppercase",letterSpacing:.3}}>{l}</p>
                    <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1D428A",fontSize:15,fontWeight:800,margin:"2px 0 0"}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Holdings */}
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"4px 0 8px"}}>Holdings</p>
            {TEAMS.filter(t=>(myShares[t]||0)>0).length===0
              ? <div className="sm-card" style={{textAlign:"center",padding:"28px"}}><p style={{fontSize:32,margin:0}}>📭</p><p style={{color:"#94a3b8",fontSize:12,marginTop:8}}>No shares yet — open Market tab to buy!</p></div>
              : TEAMS.filter(t=>(myShares[t]||0)>0).map(team=>{
                  const held=myShares[team], price=prices?.[team]??STARTING_PRICE;
                  const hist=priceHistory[team]||[STARTING_PRICE];
                  const delta=hist.length>=2?price-hist[hist.length-2]:0;
                  const tc=TC[team]||{bg:"#333"};
                  return (
                    <div key={team} className="sm-card" style={{display:"flex",alignItems:"center",gap:12}}>
                      <TLogo t={team} sz={38}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:"#1a2540",margin:0}}>{team}</p>
                          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:"#1D428A",margin:0}}>₹{fmt(Math.round(held*price))}</p>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                          <p style={{fontSize:10,color:"#64748b",margin:0}}>{held} share{held!==1?"s":""} @ ₹{fmt(price)}</p>
                          <Delta v={delta}/>
                        </div>
                        <div style={{marginTop:5}}><Spark data={hist} color={tc.bg}/></div>
                      </div>
                    </div>
                  );
                })
            }

            {/* Trade history */}
            {myHistory.length>0&&(
              <>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"8px 0 8px"}}>Trade History</p>
                <div className="sm-card" style={{padding:"8px 14px"}}>
                  {[...myHistory].reverse().slice(0,30).map((h,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<Math.min(myHistory.length,30)-1?"1px solid #f1f5f9":"none"}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:h.type==="buy"?"#15803d":"#dc2626",flexShrink:0,display:"block"}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:12,fontWeight:600,color:"#1a2540",margin:0}}>{h.type==="buy"?"Bought":"Sold"} {h.qty}× {h.team}</p>
                        <p style={{fontSize:10,color:"#94a3b8",margin:0}}>@ ₹{fmt(h.price)} · {new Date(h.ts).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:h.type==="sell"?"#15803d":"#dc2626",flexShrink:0}}>
                        {h.type==="sell"?"+":"-"}₹{fmt(h.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════ RANKINGS ════════ */}
        {tab==="rankings"&&(
          <div className="smfi">
            <div style={{background:"linear-gradient(135deg,#D4AF37,#F0C060)",borderRadius:14,padding:"14px",marginBottom:14,textAlign:"center"}}>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1a2540",fontSize:22,fontWeight:800,letterSpacing:2,margin:0}}>MARKET RANKINGS</p>
              <p style={{color:"#5a4000",fontSize:11,margin:"4px 0 0"}}>Season payout: 1st +{PAYOUT_PTS[0]}pts · 2nd +{PAYOUT_PTS[1]}pts · 3rd +{PAYOUT_PTS[2]}pts · 4th/5th +{PAYOUT_PTS[3]}pts</p>
            </div>

            {leaderboard.map((u,i)=>{
              const isMe=u.email===email;
              const payout=PAYOUT_PTS[i]||0;
              const pl=u.value-STARTING_COINS;
              return (
                <div key={u.email} style={{background:isMe?"#EBF0FA":"#fff",border:"1px solid "+(isMe?"#1D428A60":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:i<3?20:13,minWidth:28,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:600,color:"#1a2540",margin:0}}>{u.name}{isMe?" (You)":""}</p>
                      <div style={{display:"flex",gap:8,marginTop:2,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,color:"#64748b"}}>₹{fmt(Math.round(u.value))}</span>
                        <span style={{fontSize:10,color:pl>=0?"#15803d":"#dc2626",fontWeight:700}}>{pl>=0?"+":""}₹{fmt(Math.round(Math.abs(pl)))} {pl>=0?"gain":"loss"}</span>
                      </div>
                      <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                        {TEAMS.filter(t=>(u.port?.shares?.[t]||0)>0).slice(0,5).map(t=>(
                          <span key={t} style={{fontSize:9,background:"#f1f5f9",color:"#475569",borderRadius:5,padding:"1px 5px",fontWeight:600}}>{t}: {u.port.shares[t]}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1D428A",fontSize:18,fontWeight:800,margin:0}}>₹{fmt(Math.round(u.value))}</p>
                      {payout>0&&!payoutDone&&<p style={{fontSize:10,color:"#15803d",fontWeight:700,margin:"2px 0 0"}}>+{payout}pts at end</p>}
                      {payout>0&&payoutDone&&<p style={{fontSize:10,color:"#15803d",fontWeight:700,margin:"2px 0 0"}}>✅ +{payout}pts</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════ ADMIN ════════ */}
        {tab==="admin"&&isAdmin&&(
          <div className="smfi">
            <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:14,overflow:"hidden"}}>
              {[["prices","💰 Prices"],["tools","🔧 Tools"]].map(([t,l])=>(
                <button key={t} className={`sm-atab${adminTab===t?" on":""}`} onClick={()=>setAdminTab(t)}>{l}</button>
              ))}
            </div>

            {adminTab==="prices"&&(
              <>
                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 12px"}}>Current Prices &amp; Manual Overrides</p>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,tableLayout:"fixed"}}>
                      <colgroup><col style={{width:"23%"}}/><col style={{width:"14%"}}/><col style={{width:"13%"}}/><col style={{width:"50%"}}/></colgroup>
                      <thead>
                        <tr style={{borderBottom:"2px solid #e2e8f0"}}>
                          {["Team","Price","Δ","Override"].map(h=><th key={h} style={{textAlign:"left",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:9,textTransform:"uppercase"}}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {TEAMS.map(team=>{
                          const price=prices?.[team]??STARTING_PRICE;
                          const hist=priceHistory[team]||[STARTING_PRICE];
                          const delta=hist.length>=2?price-hist[hist.length-2]:0;
                          return (
                            <tr key={team} style={{borderBottom:"1px solid #f1f5f9"}}>
                              <td style={{padding:"7px 6px"}}>
                                <div style={{display:"flex",alignItems:"center",gap:5}}>
                                  <TLogo t={team} sz={18}/>
                                  <span style={{fontWeight:600}}>{team}</span>
                                </div>
                              </td>
                              <td style={{padding:"7px 6px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:"#1D428A"}}>₹{fmt(price)}</td>
                              <td style={{padding:"7px 6px"}}><Delta v={delta}/></td>
                              <td style={{padding:"7px 6px"}}>
                                <div style={{display:"flex",alignItems:"center",gap:3,flexWrap:"wrap"}}>
                                  {[-15,-10,-5,5,10,15].map(d=>(
                                    <button key={d} onClick={()=>setAdminDelta(prev=>({...prev,[team]:(prev[team]||0)+d}))}
                                      style={{padding:"2px 5px",borderRadius:5,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontSize:10,fontWeight:700}}>
                                      {d>0?"+":""}{d}
                                    </button>
                                  ))}
                                  {adminDelta[team]?<span style={{fontSize:11,fontWeight:700,color:"#1D428A",marginLeft:2}}>→{adminDelta[team]>0?"+":""}{adminDelta[team]}</span>:null}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {Object.keys(adminDelta).length>0&&(
                    <button className="sm-pbtn" style={{marginTop:12}} onClick={applyManualDelta}>
                      Apply {Object.keys(adminDelta).length} Override{Object.keys(adminDelta).length!==1?"s":""}
                    </button>
                  )}
                </div>

                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Quick — Match Result Price Update</p>
                  <p style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>Applies +{WIN_DELTA} to winner, {LOSS_DELTA} to loser. Use after each match result.</p>
                  <WinnerLoserPicker onApply={applyPriceUpdate}/>
                </div>
              </>
            )}

            {adminTab==="tools"&&(
              <>
                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Grant Starting Coins</p>
                  <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>Give ₹{fmt(STARTING_COINS)} to all approved users who haven't opened the Market yet.</p>
                  <button className="sm-pbtn" onClick={grantStartingCoins}>💰 Grant Coins to New Users</button>
                </div>

                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Season End Payout</p>
                  <p style={{fontSize:12,color:"#64748b",marginBottom:8}}>Awards bonus prediction points by final portfolio rank. Auto-fires when all {TOTAL_MATCHES} matches complete.</p>
                  <div style={{background:"#f8faff",borderRadius:8,padding:"8px 12px",marginBottom:10}}>
                    {PAYOUT_PTS.map((pts,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:i<PAYOUT_PTS.length-1?"1px solid #f1f5f9":"none"}}>
                        <span style={{fontSize:11,color:"#475569"}}>{["🥇 1st","🥈 2nd","🥉 3rd","4th","5th"][i]}</span>
                        <span style={{fontSize:11,fontWeight:700,color:"#1D428A"}}>+{pts}pts</span>
                      </div>
                    ))}
                  </div>
                  {!payoutDone
                    ?<button className="sm-pbtn" style={{background:"linear-gradient(135deg,#D4AF37,#F0C060)",color:"#1a2540"}} onClick={()=>triggerSeasonPayout(true)}>🏆 Force Season Payout Now</button>
                    :<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"10px",textAlign:"center"}}><p style={{color:"#15803d",fontWeight:700,fontSize:13,margin:0}}>✅ Payout already completed</p></div>
                  }
                </div>

                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>Reset All Prices</p>
                  <p style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>Resets every team to ₹{STARTING_PRICE}. Does NOT touch portfolios or coins.</p>
                  <button className="sm-dbtn" onClick={resetPrices}>⚠️ Reset All Prices to ₹{STARTING_PRICE}</button>
                </div>

                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>All Portfolios Overview</p>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead>
                        <tr style={{borderBottom:"2px solid #e2e8f0"}}>
                          {["Player","Cash","Shares","Total"].map(h=><th key={h} style={{textAlign:h==="Player"?"left":"right",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:9,textTransform:"uppercase"}}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(users).filter(u=>u?.email&&u.approved!==false).map(u=>{
                          const port=allPortfolios[ek(u.email)]||null;
                          const val=port&&prices?portVal(port,prices):0;
                          const sv=port&&prices?TEAMS.reduce((s,t)=>s+(port.shares?.[t]||0)*(prices[t]||STARTING_PRICE),0):0;
                          return (
                            <tr key={u.email} style={{borderBottom:"1px solid #f1f5f9"}}>
                              <td style={{padding:"6px"}}><p style={{fontSize:11,fontWeight:600,margin:0}}>{u.name}</p></td>
                              <td style={{textAlign:"right",padding:"6px",color:"#64748b"}}>₹{fmt(Math.round(port?.coins||0))}</td>
                              <td style={{textAlign:"right",padding:"6px",color:"#475569"}}>₹{fmt(Math.round(sv))}</td>
                              <td style={{textAlign:"right",padding:"6px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,color:"#1D428A",fontSize:13}}>₹{fmt(Math.round(val))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
