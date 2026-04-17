/*
  StockMarket.jsx — IPL Fantasy Stock Exchange v3
  Sub-tabs: Market | My Portfolio | Rankings | Rules | Admin(admin-only)

  NEW in v3:
  ─ Rules tab with full examples
  ─ Auto price update: whenever ms prop contains a newly finalised
    match result that hasn't been processed yet, prices update
    automatically — no admin button tap needed.
    Processed match IDs are stored at ipl26_stock_processed_matches
    so each result is applied exactly once.

  FIREBASE PATHS (all prefixed ipl26_):
    ipl26_stocks                  { RCB:100, ... }
    ipl26_portfolios              { encodedEmail: { coins, shares, history } }
    ipl26_price_history           { RCB:[100,115,...] }
    ipl26_market_payout           { done:true, ts, leaderboard }
    ipl26_stock_processed_matches { "1":true, "7":true, ... }  ← NEW
*/

import * as React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ─── constants ──────────────────────────────────────────────── */
const TEAMS  = ["RCB","SRH","MI","KKR","CSK","RR","PBKS","GT","LSG","DC"];
const TF = { RCB:"Royal Challengers Bengaluru",SRH:"Sunrisers Hyderabad",MI:"Mumbai Indians",KKR:"Kolkata Knight Riders",CSK:"Chennai Super Kings",RR:"Rajasthan Royals",PBKS:"Punjab Kings",GT:"Gujarat Titans",LSG:"Lucknow Super Giants",DC:"Delhi Capitals" };
const TC = { RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"} };
const LOGOS  = { RCB:"https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",SRH:"https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",MI:"https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",KKR:"https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",CSK:"https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",RR:"https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",PBKS:"https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",GT:"https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",LSG:"https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",DC:"https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png" };

const STARTING_COINS = 1000;
const STARTING_PRICE = 100;
const WIN_DELTA      = 15;
const LOSS_DELTA     = -10;
const PRICE_FLOOR    = 50;
const PRICE_CEIL     = 300;
const TOTAL_MATCHES  = 74;
const PAYOUT_PTS     = [500, 300, 150, 75, 75];
const NR             = "NO_RESULT";

const PFX = "ipl26_";
const ek  = e => (e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const isNR = v => !v || v === NR;

/* ─── Firebase ───────────────────────────────────────────────── */
const firebaseConfig = { apiKey:"AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",authDomain:"ipl2026-fantasy-20c9b.firebaseapp.com",databaseURL:"https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",projectId:"ipl2026-fantasy-20c9b",storageBucket:"ipl2026-fantasy-20c9b.firebasestorage.app",messagingSenderId:"973930153403",appId:"1:973930153403:web:872ce26072b07e1adf309e" };
const firebaseReady = (async()=>{
  const [app,db] = await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")]);
  const _app = app.getApps().length ? app.getApp() : app.initializeApp(firebaseConfig);
  return { db:db.getDatabase(_app), dbMod:db };
})();
const MDB = {
  get:  async k    => { try{ const{db,dbMod}=await firebaseReady; const s=await dbMod.get(dbMod.ref(db,PFX+k)); return s.exists()?s.val():null; }catch(e){ console.error("MDB.get",k,e); return null; } },
  set:  async(k,v) => { try{ const{db,dbMod}=await firebaseReady; if(v==null) await dbMod.remove(dbMod.ref(db,PFX+k)); else await dbMod.set(dbMod.ref(db,PFX+k),v); }catch(e){ console.error("MDB.set",k,e); } },
  path: async(p,v) => { try{ const{db,dbMod}=await firebaseReady; await dbMod.set(dbMod.ref(db,PFX+p),v); }catch(e){ console.error("MDB.path",p,e); } },
};

/* ─── Pure helpers ───────────────────────────────────────────── */
const clamp      = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const fmt        = n => Number(n).toLocaleString("en-IN");
const initPrices = () => Object.fromEntries(TEAMS.map(t=>[t,STARTING_PRICE]));
const initPort   = () => ({ coins:STARTING_COINS, shares:Object.fromEntries(TEAMS.map(t=>[t,0])), history:[], initialized:true });
const portVal    = (port,prices) => { if(!port||!prices) return 0; return (port.coins||0)+TEAMS.reduce((s,t)=>s+(port.shares?.[t]||0)*(prices[t]||STARTING_PRICE),0); };

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

/* ─── Rules tab content ──────────────────────────────────────── */
function RulesTab(){
  const rules=[
    {
      icon:"💰",title:"Starting Balance",
      body:"Every player starts with ₹1,000 coins when they first open the Market. This is your seed capital — use it wisely!",
      example:"You open the Market → you immediately have ₹1,000 to invest.",
    },
    {
      icon:"📈",title:"Buying Shares",
      body:`Pick any IPL team and buy whole shares at the current market price. You can buy multiple shares at once. Your coins are deducted immediately.`,
      example:"RCB is priced at ₹115. You buy 3 shares → ₹345 deducted. You now hold 3 RCB shares worth ₹345.",
    },
    {
      icon:"📉",title:"Selling Shares",
      body:"Sell any shares you hold at the current price. Coins are returned to your wallet instantly. You can sell anytime the market is open.",
      example:"You hold 3 RCB shares. RCB climbed to ₹130. You sell all 3 → get ₹390 back. Profit: ₹45.",
    },
    {
      icon:"🏆",title:"How Prices Move — Win",
      body:`When a team wins a match, their share price rises by +₹${WIN_DELTA} automatically the moment admin finalises the result. No manual action needed.`,
      example:`CSK beats MI. CSK was at ₹100 → jumps to ₹115. If you held 5 CSK shares, your holding is now worth ₹575 instead of ₹500.`,
    },
    {
      icon:"💀",title:"How Prices Move — Loss",
      body:`When a team loses, their share price drops by ₹${Math.abs(LOSS_DELTA)} automatically. Prices can't fall below the floor of ₹${PRICE_FLOOR}.`,
      example:`MI loses to CSK. MI was at ₹95 → drops to ₹85. If you held 4 MI shares, your holding drops from ₹380 to ₹340.`,
    },
    {
      icon:"🌧",title:"Washout / No Result",
      body:"If a match has no result (rain, abandonment), neither team's price changes. The match is simply skipped in the price calculation.",
      example:"RCB vs SRH gets washed out. Both teams' prices stay exactly where they were.",
    },
    {
      icon:"🔒",title:"Trading Window — When You Can Trade",
      body:"You can buy and sell freely at any time EXCEPT during the 35-minute window before a match starts (same as the prediction lock). Trading reopens once the match starts.",
      example:"M25 starts at 7:30 PM. Trading is blocked from 6:55 PM. Once the match begins, trading reopens for all other teams.",
    },
    {
      icon:"📊",title:"Price Limits",
      body:`Share prices are bounded. The floor is ₹${PRICE_FLOOR} (a team can't go below this no matter how many losses) and the ceiling is ₹${PRICE_CEIL} (a team can't rise above this).`,
      example:`A team on a 10-match winning streak can't go above ₹${PRICE_CEIL}. A team in terrible form can't fall below ₹${PRICE_FLOOR}.`,
    },
    {
      icon:"🏅",title:"Season End Payout — Bonus Prediction Points",
      body:"When all 74 matches are done, final portfolio values are ranked. Top 5 portfolios earn bonus prediction points added to the main leaderboard.",
      example:`1st place portfolio → +${PAYOUT_PTS[0]}pts · 2nd → +${PAYOUT_PTS[1]}pts · 3rd → +${PAYOUT_PTS[2]}pts · 4th & 5th → +${PAYOUT_PTS[3]}pts each.`,
    },
    {
      icon:"🧠",title:"Strategy Tips",
      body:"Buy teams early in the season before they go on winning streaks. Sell after a big win (price is high). Don't hold a team through a tough stretch of fixtures. Diversify — don't put all your coins in one team.",
      example:"GT faces 3 weak opponents in a row. You buy 10 GT shares at ₹100. They win all 3 → price reaches ₹145. You sell for ₹1,450. Profit: +₹450.",
    },
  ];

  return(
    <div className="smfi">
      <div style={{background:"linear-gradient(135deg,#0f2456,#1D428A)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:2,margin:0}}>📖 HOW TO PLAY</p>
        <p style={{color:"#bfdbfe",fontSize:11,margin:"4px 0 0"}}>IPL Stock Exchange — Rules &amp; Examples</p>
      </div>

      {/* Quick reference card */}
      <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:14,padding:"14px",marginBottom:14}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#92400E",textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>⚡ Quick Reference</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            ["Starting Coins",`₹${fmt(STARTING_COINS)}`,"#1D428A"],
            ["Starting Price",`₹${STARTING_PRICE}/share`,"#1D428A"],
            ["Win = Price ↑",`+₹${WIN_DELTA} per win`,"#15803d"],
            ["Loss = Price ↓",`−₹${Math.abs(LOSS_DELTA)} per loss`,"#dc2626"],
            ["Price Floor",`₹${PRICE_FLOOR} min`,"#92400E"],
            ["Price Ceiling",`₹${PRICE_CEIL} max`,"#92400E"],
            ["Trade Lock","35 min before match","#7c3aed"],
            ["Whole shares","No fractions","#475569"],
          ].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,.75)",borderRadius:8,padding:"8px 10px"}}>
              <p style={{fontSize:9,color:"#92400E",fontWeight:600,textTransform:"uppercase",letterSpacing:.3,margin:0}}>{l}</p>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:c,margin:"2px 0 0"}}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Season payout table */}
      <div style={{background:"linear-gradient(135deg,#FFF9E6,#FFFBF0)",border:"1px solid #FDE68A",borderRadius:14,padding:"14px",marginBottom:14}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#92400E",textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>🏅 Season-End Bonus Points</p>
        {[["🥇 1st","Highest portfolio value",PAYOUT_PTS[0]],["🥈 2nd","",PAYOUT_PTS[1]],["🥉 3rd","",PAYOUT_PTS[2]],["4th","",PAYOUT_PTS[3]],["5th","",PAYOUT_PTS[4]]].map(([rank,note,pts])=>(
          <div key={rank} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(253,230,138,.5)"}}>
            <span style={{fontSize:12,color:"#92400E",fontWeight:600}}>{rank} {note&&<span style={{fontSize:10,color:"#B45309",fontWeight:400}}>— {note}</span>}</span>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,color:"#1D428A"}}>+{pts}pts</span>
          </div>
        ))}
        <p style={{fontSize:10,color:"#B45309",margin:"8px 0 0",lineHeight:1.5}}>These bonus points are added to your main fantasy leaderboard score at the end of the season.</p>
      </div>

      {/* Detailed rules */}
      {rules.map((r,i)=>(
        <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:20}}>{r.icon}</span>
            <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"#1a2540",margin:0}}>{r.title}</p>
          </div>
          <p style={{fontSize:12,color:"#475569",lineHeight:1.6,margin:"0 0 10px"}}>{r.body}</p>
          <div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 12px"}}>
            <p style={{fontSize:9,fontWeight:700,color:"#1e40af",textTransform:"uppercase",letterSpacing:.5,margin:"0 0 4px"}}>💡 Example</p>
            <p style={{fontSize:11,color:"#1e40af",lineHeight:1.5,margin:0,fontStyle:"italic"}}>{r.example}</p>
          </div>
        </div>
      ))}
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
  const [processed,     setProcessed]     = useState({});  // { "matchId": true }
  const [payoutDone,    setPayoutDone]    = useState(false);
  const [tab,           setTab]           = useState("market");
  const [selectedTeam,  setSelectedTeam]  = useState(null);
  const [tradeQty,      setTradeQty]      = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [busy,          setBusy]          = useState(false);
  const [adminTab,      setAdminTab]      = useState("prices");
  const [adminDelta,    setAdminDelta]    = useState({});
  const autoRunning     = useRef(false); // prevents concurrent auto-update runs

  const myEk = useMemo(()=>ek(email),[email]);

  /* ── Load all market data ──────────────────────────────────── */
  const loadData = useCallback(async()=>{
    setLoading(true);
    try{
      const [rawP,rawPort,rawHist,rawPayout,rawProc] = await Promise.all([
        MDB.get("stocks"), MDB.get("portfolios"), MDB.get("price_history"),
        MDB.get("market_payout"), MDB.get("stock_processed_matches"),
      ]);
      const p = rawP||initPrices();
      if(!rawP) await MDB.set("stocks",p);
      setPrices(p);
      setPriceHistory(rawHist||{});
      setProcessed(rawProc||{});
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

  /* ────────────────────────────────────────────────────────────
     AUTO PRICE UPDATE
     Runs whenever ms changes (i.e. whenever admin finalises a
     match result in the Results tab). Finds any match that:
       1. Has a result with a valid winner (not a washout)
       2. Has NOT already been processed (tracked in Firebase)
     Then applies +WIN_DELTA to the winner and +LOSS_DELTA to the
     loser, marks the match as processed, and shows a toast.
     Uses autoRunning ref to prevent concurrent runs.
  ──────────────────────────────────────────────────────────────*/
  useEffect(()=>{
    if(!ms||ms.length===0) return;

    async function runAutoUpdate(){
      if(autoRunning.current) return;
      autoRunning.current = true;
      try{
        // Re-fetch processed map fresh from DB to avoid stale closure
        const freshProc = (await MDB.get("stock_processed_matches")) || {};
        const freshPrices = (await MDB.get("stocks")) || initPrices();
        const freshHist = (await MDB.get("price_history")) || {};

        const toProcess = ms.filter(m=>{
          if(!m.result) return false;
          if(isNR(m.result.win)) return false; // skip washouts
          const sid = String(m.id);
          return !freshProc[sid];
        });

        if(toProcess.length === 0){ autoRunning.current=false; return; }

        let np = {...freshPrices};
        let nh = {...freshHist};
        const newProc = {...freshProc};

        for(const m of toProcess){
          const winner = m.result.win;
          // Loser is the other team in the match
          const loser  = TEAMS.includes(m.home) && m.home !== winner ? m.home
                       : TEAMS.includes(m.away) && m.away !== winner ? m.away
                       : null;

          if(TEAMS.includes(winner)){
            np[winner] = clamp((np[winner]||STARTING_PRICE)+WIN_DELTA, PRICE_FLOOR, PRICE_CEIL);
            if(!nh[winner]) nh[winner]=[STARTING_PRICE];
            nh[winner] = [...nh[winner], np[winner]].slice(-30);
          }
          if(loser && TEAMS.includes(loser)){
            np[loser] = clamp((np[loser]||STARTING_PRICE)+LOSS_DELTA, PRICE_FLOOR, PRICE_CEIL);
            if(!nh[loser]) nh[loser]=[STARTING_PRICE];
            nh[loser] = [...nh[loser], np[loser]].slice(-30);
          }
          newProc[String(m.id)] = true;
        }

        await MDB.set("stocks", np);
        await MDB.set("price_history", nh);
        await MDB.set("stock_processed_matches", newProc);

        setPrices(np);
        setPriceHistory(nh);
        setProcessed(newProc);

        if(toProcess.length === 1){
          const m = toProcess[0];
          toast2(`📈 Market updated: ${m.result.win} +₹${WIN_DELTA}`,"ok");
        } else {
          toast2(`📈 Market updated for ${toProcess.length} matches`,"ok");
        }
      }catch(e){ console.error("SM autoUpdate",e); }
      autoRunning.current = false;
    }

    runAutoUpdate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ms]);

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

  /* ── Admin: manual price delta override ────────────────────── */
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

  /* ── Admin: reset processed matches (re-run all auto-updates) ── */
  async function resetProcessed(){
    if(!confirm("This will re-process all match results and re-apply price changes. Only use if prices got corrupted.")) return;
    await MDB.set("stock_processed_matches",null);
    await MDB.set("stocks",initPrices());
    await MDB.set("price_history",null);
    setProcessed({});
    setPrices(initPrices());
    setPriceHistory({});
    toast2("Processed matches cleared — prices will recalculate","ok");
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

  // Count auto-processed matches for admin display
  const processedCount = Object.keys(processed).length;
  const totalDone = ms.filter(m=>m.result&&!isNR(m.result.win)).length;

  /* ── CSS ───────────────────────────────────────────────────── */
  const CSS=`
    .sm-stab{flex:1;padding:8px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:9px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
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

  const subTabs=[["market","📊 Market"],["portfolio","💼 Mine"],["rankings","🏆 Ranks"],["rules","📖 Rules"],...(isAdmin?[["admin","⚙️ Admin"]]:[])] ;

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
              💡 <b>Win</b> +₹{WIN_DELTA} · <b>Loss</b> −₹{Math.abs(LOSS_DELTA)} · Floor ₹{PRICE_FLOOR} · Ceiling ₹{PRICE_CEIL} · Prices update automatically after each match result
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
            <div className="sm-card" style={{background:"linear-gradient(135deg,#EBF0FA,#f4f7ff)",border:"1px solid #bfdbfe"}}>
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1D428A",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:1,margin:"0 0 12px"}}>My Portfolio Summary</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  ["💰 Cash",`₹${fmt(Math.round(myCoins))}`],
                  ["📈 Shares Value",`₹${fmt(Math.round(myValue-myCoins))}`],
                  ["🏦 Total Value",`₹${fmt(Math.round(myValue))}`],
                  [myPL>=0?"📊 Gain":"📊 Loss",`${myPL>=0?"+":""}₹${fmt(Math.round(Math.abs(myPL)))}`],
                ].map(([l,v])=>(
                  <div key={l} style={{background:"rgba(255,255,255,.75)",borderRadius:10,padding:"8px 10px"}}>
                    <p style={{fontSize:9,color:"#64748b",margin:0,textTransform:"uppercase",letterSpacing:.3}}>{l}</p>
                    <p style={{fontFamily:"'Barlow Condensed',sans-serif",color:"#1D428A",fontSize:15,fontWeight:800,margin:"2px 0 0"}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

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

        {/* ════════ RULES ════════ */}
        {tab==="rules"&&<RulesTab/>}

        {/* ════════ ADMIN ════════ */}
        {tab==="admin"&&isAdmin&&(
          <div className="smfi">
            {/* Auto-update status banner */}
            <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:14}}>⚡</span>
                <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#15803d",textTransform:"uppercase",letterSpacing:.5,margin:0}}>Auto Price Updates Active</p>
              </div>
              <p style={{fontSize:12,color:"#166534",margin:"0 0 6px",lineHeight:1.5}}>
                Prices update automatically when you finalise a match result in the Results tab. No manual action needed.
              </p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:"#15803d",fontWeight:600}}>{processedCount}/{totalDone} match results processed</span>
                {processedCount<totalDone&&<span style={{fontSize:10,color:"#15803d",background:"#dcfce7",padding:"2px 8px",borderRadius:10,fontWeight:700}}>⏳ {totalDone-processedCount} pending</span>}
                {processedCount===totalDone&&totalDone>0&&<span style={{fontSize:10,color:"#15803d",background:"#dcfce7",padding:"2px 8px",borderRadius:10,fontWeight:700}}>✅ All up to date</span>}
              </div>
            </div>

            <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:14,overflow:"hidden"}}>
              {[["prices","💰 Prices"],["tools","🔧 Tools"]].map(([t,l])=>(
                <button key={t} className={`sm-atab${adminTab===t?" on":""}`} onClick={()=>setAdminTab(t)}>{l}</button>
              ))}
            </div>

            {adminTab==="prices"&&(
              <>
                {/* Current prices table with manual delta option */}
                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>Current Prices</p>
                  <p style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>Prices update automatically from match results. Use manual overrides only to correct errors.</p>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,tableLayout:"fixed"}}>
                      <colgroup><col style={{width:"23%"}}/><col style={{width:"14%"}}/><col style={{width:"13%"}}/><col style={{width:"50%"}}/></colgroup>
                      <thead>
                        <tr style={{borderBottom:"2px solid #e2e8f0"}}>
                          {["Team","Price","Δ","Manual Override"].map(h=><th key={h} style={{textAlign:"left",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:9,textTransform:"uppercase"}}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {TEAMS.map(team=>{
                          const price=prices?.[team]??STARTING_PRICE;
                          const hist=priceHistory[team]||[STARTING_PRICE];
                          const delta=hist.length>=2?price-hist[hist.length-2]:0;
                          const wasProcessed=ms.filter(m=>m.result&&!isNR(m.result.win)&&(m.result.win===team||(m.home===team&&m.result.win!==team)||(m.away===team&&m.result.win!==team))).some(m=>processed[String(m.id)]);
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

                {/* Processed matches log */}
                <div className="sm-card">
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>Auto-Processed Match Log</p>
                  <div style={{maxHeight:200,overflowY:"auto"}}>
                    {ms.filter(m=>m.result&&!isNR(m.result.win)).sort((a,b)=>Number(b.id)-Number(a.id)).map(m=>{
                      const done2=!!processed[String(m.id)];
                      return(
                        <div key={m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9"}}>
                          <div>
                            <p style={{fontSize:12,fontWeight:600,color:"#1a2540",margin:0}}>{m.mn}: {m.home} vs {m.away}</p>
                            <p style={{fontSize:10,color:"#94a3b8",margin:0}}>Winner: <b style={{color:"#15803d"}}>{m.result.win}</b></p>
                          </div>
                          <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:done2?"#f0fdf4":"#fef2f2",color:done2?"#15803d":"#dc2626"}}>
                            {done2?"✅ Applied":"⏳ Pending"}
                          </span>
                        </div>
                      );
                    })}
                    {ms.filter(m=>m.result&&!isNR(m.result.win)).length===0&&(
                      <p style={{fontSize:12,color:"#94a3b8",textAlign:"center",padding:"16px 0",margin:0}}>No match results yet.</p>
                    )}
                  </div>
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

                <div className="sm-card" style={{border:"1px solid #fecaca",background:"#fff7f7"}}>
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,color:"#dc2626",textTransform:"uppercase",letterSpacing:1,margin:"0 0 8px"}}>🔁 Reset & Reprocess All Results</p>
                  <p style={{fontSize:12,color:"#94a3b8",marginBottom:10,lineHeight:1.5}}>Clears processed match log and resets all prices to ₹{STARTING_PRICE}. The auto-update will then reapply all existing match results from scratch. Use only if prices got corrupted.</p>
                  <button className="sm-dbtn" onClick={resetProcessed}>⚠️ Reset Prices &amp; Reprocess All</button>
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
