// AdminHub.jsx
// Unified admin panel. Sits above the individual sport apps.
// Tabs:
//   👥 Users     — shared user registry (approve/reject/delete, works across all tournaments)
//   📢 Broadcast — send pinned or regular messages to Cricket, FIFA, or both
//   🎛️ System    — maintenance mode per app + tournament lifecycle (close / reopen)
//   🏏 Cricket   — IPL-specific admin (results, locks, score bands, bonus, double header)
//   ⚽  FIFA      — FIFA-specific admin (results, locks, season awards)
//
// Shared user registry uses ipl26_u as the canonical store (back-compat).
// All writes from here go directly to Firebase via createDB().

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { createDB } from "./firebase.js";
import { BASE_MATCHES, BONUS_QUESTIONS, SCORE_BANDS, PTS, TEAMS as C_TEAMS } from "./cricketData.js";

/* ─── DB connections ─────────────────────────────────────────── */
const CRICKET_DB = createDB("ipl26_");
const FIFA_DB    = createDB("fifa26_");
const NR = "NO_RESULT";

/* ─── FIFA teams (until fifaData.js exists) ─────────────────── */
const FIFA_TEAMS = [
  "Mexico","South Africa","South Korea","Czechia",
  "Canada","Bosnia and Herzegovina","Qatar","Switzerland",
  "Brazil","Morocco","Haiti","Scotland",
  "USA","Paraguay","Australia","Turkiye",
  "Germany","Curacao","Ivory Coast","Ecuador",
  "Netherlands","Japan","Sweden","Tunisia",
  "Belgium","Egypt","Iran","New Zealand",
  "Spain","Cape Verde","Saudi Arabia","Uruguay",
  "France","Senegal","Iraq","Norway",
  "Argentina","Algeria","Austria","Jordan",
  "Portugal","DR Congo","Uzbekistan","Colombia",
  "England","Croatia","Ghana","Panama",
];

/* ─── Helpers ─────────────────────────────────────────────────── */
const ek = e => (e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const isNR = v => !v || v === NR;

function Av({name,sz=32}){
  const n=(name||"?").trim();
  const ini=n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const hue=(n.charCodeAt(0)*137+(n.charCodeAt(n.length-1)||0)*53)%360;
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:`hsl(${hue},55%,42%)`,
    color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:sz*.38,fontWeight:700,flexShrink:0,fontFamily:"'Barlow',sans-serif"}}>{ini}</div>;
}

function Badge({label,color,bg}){
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:20,
    background:bg||"#f1f5f9",color:color||"#475569",letterSpacing:.3}}>{label}</span>;
}

function Section({title,children,accent="#1D428A"}){
  return(
    <div style={{marginBottom:20}}>
      <p style={{fontSize:10,fontWeight:700,color:accent,textTransform:"uppercase",
        letterSpacing:2,margin:"0 0 10px"}}>{title}</p>
      {children}
    </div>
  );
}

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
.ah-wrap{min-height:100vh;background:#f0f4f8;font-family:'Barlow',sans-serif;}
.ah-header{background:linear-gradient(135deg,#0a1628,#1a2f5e);padding:14px 16px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:40;}
.ah-tab-bar{display:flex;gap:4px;overflow-x:auto;padding:12px 16px 0;background:#fff;border-bottom:1px solid #e8edf5;scrollbar-width:none;position:sticky;top:56px;z-index:39;}
.ah-tab-bar::-webkit-scrollbar{display:none;}
.ah-tab{padding:7px 14px;border-radius:8px 8px 0 0;border:none;background:transparent;color:#64748b;font-size:12px;font-weight:700;font-family:'Barlow',sans-serif;cursor:pointer;white-space:nowrap;transition:all .15s;border-bottom:2px solid transparent;}
.ah-tab.on{background:#f0f4ff;color:#1D428A;border-bottom:2px solid #1D428A;}
.ah-body{padding:16px;max-width:600px;margin:0 auto;}
.ah-card{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.ah-input{width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;font-family:'Barlow',sans-serif;outline:none;box-sizing:border-box;}
.ah-input:focus{border-color:#1D428A;}
.ah-select{width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;font-family:'Barlow',sans-serif;background:#fff;outline:none;cursor:pointer;box-sizing:border-box;}
.ah-btn{padding:9px 18px;border-radius:10px;border:none;font-size:12px;font-weight:700;font-family:'Barlow',sans-serif;cursor:pointer;transition:opacity .15s;}
.ah-btn:disabled{opacity:.4;cursor:not-allowed;}
.ah-btn-primary{background:#1D428A;color:#fff;}
.ah-btn-danger{background:#fef2f2;color:#dc2626;border:1px solid #fecaca;}
.ah-btn-success{background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;}
.ah-btn-warning{background:#fffbeb;color:#d97706;border:1px solid #fde68a;}
.ah-btn-sm{padding:5px 12px;font-size:11px;border-radius:8px;}
.ah-divider{height:1px;background:#f1f5f9;margin:12px 0;}
.ah-stat{text-align:center;padding:10px;background:#f8faff;border-radius:10px;}
.ah-stat p:first-child{font-size:22px;font-weight:800;color:#1D428A;margin:0;}
.ah-stat p:last-child{font-size:10px;color:#94a3b8;margin:0;text-transform:uppercase;letter-spacing:.5px;}
.ah-user-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;}
.ah-user-row:last-child{border-bottom:none;}
.ah-toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 20px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.12);white-space:nowrap;max-width:90vw;pointer-events:none;}
`;

/* ─── Main component ──────────────────────────────────────────── */
export default function AdminHub({email,onBack}){
  const [tab,setTab]=useState("users");
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);

  /* shared */
  const [users,setUsers]=useState({});
  const [pending,setPending]=useState({});

  /* tournaments */
  const [statuses,setStatuses]=useState({ipl2026:"active",fifa2026:"active"});
  const [maintenance,setMaintenance]=useState({ipl2026:false,fifa2026:false});
  const [stats,setStats]=useState({});

  /* broadcast */
  const [bcMsg,setBcMsg]=useState("");
  const [bcTarget,setBcTarget]=useState("all");
  const [bcPin,setBcPin]=useState(false);
  const [bcSending,setBcSending]=useState(false);
  const [recentBc,setRecentBc]=useState([]);

  /* cricket admin */
  const [cRm,setCRm]=useState({});
  const [cLocked,setCLocked]=useState({});
  const [cDbl,setCDbl]=useState(null);
  const [cBonusAns,setCBonusAns]=useState({});
  const [cSbAns,setCSbAns]=useState({});
  const [cSelId,setCSelId]=useState("");
  const [cDraft,setCDraft]=useState({win:"",motm:"",score:"",sb:"",bonus:null});
  const [cSaving,setCSaving]=useState(false);
  const cMs=BASE_MATCHES;

  /* fifa admin */
  const [fRm,setFRm]=useState({});
  const [fLocked,setFLocked]=useState({});
  const [fSw,setFSw]=useState(null);
  const [fAt4,setFAt4]=useState([]);
  const [fDbl,setFDbl]=useState(null);
  const [fBonusAns,setFBonusAns]=useState({});
  const [fSelId,setFSelId]=useState("");
  const [fDraft,setFDraft]=useState({win:"",motm:"",score:""});
  const [fSaving,setFFSaving]=useState(false);
  const [fMs,setFMs]=useState([]);  // loaded from firebase rm keys

  const toast2=(msg,type="ok")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  /* ── Load all ─────────────────────────────────────────────── */
  const loadAll=useCallback(async()=>{
    setLoading(true);
    try{
      const [
        u,pu,
        cMnt,fMnt,
        cStatus,fStatus,
        cRmD,cLkD,cDblD,cBaD,cSbaD,
        fRmD,fLkD,fSwD,fAt4D,fBaD,fDblD,
        cBc,fBc,
        cAp,fAp,
      ]=await Promise.all([
        CRICKET_DB.get("u"), CRICKET_DB.get("pending"),
        CRICKET_DB.get("maintenance"), FIFA_DB.get("maintenance"),
        CRICKET_DB.get("tourneystatus"), FIFA_DB.get("tourneystatus"),
        CRICKET_DB.get("rm"), CRICKET_DB.get("lockedm"), CRICKET_DB.get("doublematch"),
        CRICKET_DB.get("bonusans"), CRICKET_DB.get("sbans"),
        FIFA_DB.get("rm"), FIFA_DB.get("lockedm"), FIFA_DB.get("sw"),
        FIFA_DB.get("actualtop4"), FIFA_DB.get("bonusans"), FIFA_DB.get("doublematch"),
        CRICKET_DB.get("bc"), FIFA_DB.get("bc"),
        CRICKET_DB.get("ap"), FIFA_DB.get("ap"),
      ]);

      /* users */
      if(u){
        const nu={};
        Object.keys(u).forEach(k=>{const e=u[k];if(e?.email)nu[ek(e.email)]={...e};});
        setUsers(nu);
      }
      setPending(pu||{});

      /* status */
      setMaintenance({ipl2026:!!cMnt,fifa2026:!!fMnt});
      setStatuses({ipl2026:cStatus||"active",fifa2026:fStatus||"active"});

      /* cricket */
      const cRmObj=cRmD||{};
      setCRm(cRmObj); setCLocked(cLkD||{}); setCDbl(cDblD);
      setCBonusAns(cBaD||{}); setCSbAns(cSbaD||{});

      /* fifa */
      const fRmObj=fRmD||{};
      setFRm(fRmObj); setFLocked(fLkD||{}); setFSw(fSwD||null);
      setFAt4(Array.isArray(fAt4D)?fAt4D:[]); setFBonusAns(fBaD||{}); setFDbl(fDblD);
      // Build FIFA match list from results (so we can show done matches)
      const fMatchIds=[...new Set([...Object.keys(fRmObj).map(Number)])].sort((a,b)=>a-b);
      setFMs(fMatchIds.map(id=>({id,...(fRmObj[id]||{})})));

      /* recent broadcasts */
      const cBcArr=Array.isArray(cBc)?cBc:[];
      const fBcArr=Array.isArray(fBc)?fBc:[];
      const all=[
        ...cBcArr.slice(-5).map(b=>({...b,_sport:"🏏 Cricket"})),
        ...fBcArr.slice(-5).map(b=>({...b,_sport:"⚽ FIFA"})),
      ].sort((a,b)=>b.ts-a.ts).slice(0,8);
      setRecentBc(all);

      /* stats */
      const totalPlayers=Object.keys(u||{}).length;
      const pendCount=Object.keys(pu||{}).length;
      const cPickCount=Object.values(cAp||{}).reduce((s,up)=>s+Object.keys(up||{}).length,0);
      const fPickCount=Object.values(fAp||{}).reduce((s,up)=>s+Object.keys(up||{}).length,0);
      setStats({
        totalPlayers,pendCount,
        ipl2026:{done:Object.keys(cRmObj).length,total:cMs.length,picks:cPickCount},
        fifa2026:{done:Object.keys(fRmObj).length,total:104,picks:fPickCount},
      });
    }catch(e){console.error("AdminHub.loadAll",e);}
    setLoading(false);
  },[cMs.length]);

  useEffect(()=>{loadAll();},[loadAll]);

  /* ── User management ─────────────────────────────────────── */
  async function approveUser(emk){
    const entry=pending[emk]; if(!entry) return;
    const u2=await CRICKET_DB.get("u")||{};
    u2[entry.email]={...entry,approved:true};
    const pu2=await CRICKET_DB.get("pending")||{};
    delete pu2[emk];
    await Promise.all([CRICKET_DB.set("u",u2),CRICKET_DB.set("pending",pu2)]);
    setUsers(p=>({...p,[emk]:{...entry,approved:true}}));
    const np={...pending}; delete np[emk]; setPending(np);
    toast2(`✅ ${entry.name} approved`);
  }

  async function rejectUser(emk){
    const entry=pending[emk];
    const pu2=await CRICKET_DB.get("pending")||{};
    delete pu2[emk];
    await CRICKET_DB.set("pending",pu2);
    const np={...pending}; delete np[emk]; setPending(np);
    toast2(`${entry?.name||"User"} rejected`,"error");
  }

  async function removeUser(emk){
    const u2=await CRICKET_DB.get("u")||{};
    const entry=users[emk];
    if(!entry||!window.confirm(`Remove ${entry.name} from the platform?`)) return;
    delete u2[entry.email];
    await CRICKET_DB.set("u",u2);
    const nu={...users}; delete nu[emk]; setUsers(nu);
    toast2(`🗑️ ${entry.name} removed`,"error");
  }

  /* ── Tournament lifecycle ─────────────────────────────────── */
  async function closeTournament(tid,tdb,tname){
    if(!window.confirm(`Close ${tname}?\n\nLeaderboard, picks and results will be frozen in read-only mode. You can reopen it if needed.`)) return;
    await tdb.set("tourneystatus","finished");
    setStatuses(p=>({...p,[tid]:"finished"}));
    toast2(`🏁 ${tname} closed — data frozen`);
  }

  async function reopenTournament(tid,tdb,tname){
    if(!window.confirm(`Reopen ${tname}?\nThis allows picks and result edits again.`)) return;
    await tdb.set("tourneystatus","active");
    setStatuses(p=>({...p,[tid]:"active"}));
    toast2(`🟢 ${tname} reopened`);
  }

  async function toggleMaintenance(tid,tdb,tname){
    const cur=maintenance[tid];
    await tdb.set("maintenance",!cur);
    setMaintenance(p=>({...p,[tid]:!cur}));
    toast2(!cur?`🔒 ${tname} locked for maintenance`:`🟢 ${tname} is live`);
  }

  /* ── Broadcast ───────────────────────────────────────────── */
  async function sendBroadcast(){
    if(!bcMsg.trim()) return;
    setBcSending(true);
    const msg={id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"};
    const targets=bcTarget==="all"?[CRICKET_DB,FIFA_DB]:bcTarget==="cricket"?[CRICKET_DB]:[FIFA_DB];
    for(const db of targets){
      const ex=await db.get("bc")||[];
      await db.set("bc",[...ex,msg]);
      if(bcPin) await db.set("pinnedbc",bcMsg.trim());
    }
    setBcMsg(""); setBcPin(false); setBcSending(false);
    toast2("📢 Broadcast sent!"); loadAll();
  }

  /* ── Cricket admin ───────────────────────────────────────── */
  function onSelectCricketMatch(id){
    setCSelId(id);
    const numId=Number(id);
    const existing=cRm[numId]||cRm[String(numId)];
    const sbAns=cSbAns[String(numId)]||"";
    const bonusAns=cBonusAns[String(numId)];
    setCDraft({
      win:existing?.win||"",
      motm:existing?.motm||"",
      score:existing?.score||"",
      sb:sbAns,
      bonus:bonusAns!=null?bonusAns:null,
    });
  }

  async function saveCricketResult(){
    if(!cSelId||!cDraft.win) return;
    setCSaving(true);
    const numId=Number(cSelId);
    const result={win:cDraft.win,motm:cDraft.motm||NR,score:cDraft.score||""};
    const newRm={...cRm,[numId]:result};
    await CRICKET_DB.set("rm",newRm); setCRm(newRm);
    if(cDraft.sb){
      const newSb={...cSbAns,[String(numId)]:cDraft.sb};
      await CRICKET_DB.set("sbans",newSb); setCSbAns(newSb);
    }
    if(cDraft.bonus!==null){
      const newBa={...cBonusAns,[String(numId)]:cDraft.bonus};
      await CRICKET_DB.set("bonusans",newBa); setCBonusAns(newBa);
    }
    setCSaving(false);
    toast2("✅ Cricket result saved");
  }

  async function clearCricketResult(){
    if(!cSelId) return;
    const numId=Number(cSelId);
    const newRm={...cRm}; delete newRm[numId]; delete newRm[String(numId)];
    await CRICKET_DB.set("rm",newRm); setCRm(newRm);
    setCDraft({win:"",motm:"",score:"",sb:"",bonus:null});
    toast2("↩️ Result cleared");
  }

  async function toggleCricketLock(mid){
    const cur=cLocked[mid]??cLocked[String(mid)];
    const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";
    const upd={...cLocked};
    if(next===null){delete upd[mid];delete upd[String(mid)];}
    else upd[mid]=next;
    setCLocked(upd);
    await CRICKET_DB.set("lockedm",upd);
    toast2(next==="locked"?"🔒 Locked":next==="unlocked"?"🔓 Unlocked":"⏱️ Auto");
  }

  async function setCricketDouble(val){
    const v=val===""?null:Number(val);
    setCDbl(v); await CRICKET_DB.set("doublematch",v);
    toast2(v!=null?`⚡ Double: M${v}`:"Double removed");
  }

  /* ── FIFA admin ──────────────────────────────────────────── */
  async function saveFifaResult(){
    if(!fSelId||!fDraft.win) return;
    setFFSaving(true);
    const numId=Number(fSelId);
    const result={win:fDraft.win,motm:fDraft.motm||NR,score:fDraft.score||""};
    const newRm={...fRm,[numId]:result};
    await FIFA_DB.set("rm",newRm); setFRm(newRm);
    setFFSaving(false);
    toast2("✅ FIFA result saved");
  }

  async function clearFifaResult(){
    if(!fSelId) return;
    const numId=Number(fSelId);
    const newRm={...fRm}; delete newRm[numId];
    await FIFA_DB.set("rm",newRm); setFRm(newRm);
    setFDraft({win:"",motm:"",score:""});
    toast2("↩️ FIFA result cleared");
  }

  async function toggleFifaLock(mid){
    const cur=fLocked[mid]??fLocked[String(mid)];
    const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";
    const upd={...fLocked};
    if(next===null){delete upd[mid];delete upd[String(mid)];}
    else upd[mid]=next;
    setFLocked(upd); await FIFA_DB.set("lockedm",upd);
    toast2(next==="locked"?"🔒 Locked":next==="unlocked"?"🔓 Unlocked":"⏱️ Auto");
  }

  async function saveFifaSw(t){
    setFSw(t); await FIFA_DB.set("sw",t);
    toast2(`🏆 Champion: ${t}`);
  }

  async function toggleFifaTop4(t){
    let upd;
    if(fAt4.includes(t)) upd=fAt4.filter(x=>x!==t);
    else if(fAt4.length<4) upd=[...fAt4,t];
    else{toast2("Max 4 teams","error");return;}
    setFAt4(upd); await FIFA_DB.set("actualtop4",upd);
    toast2(upd.length===4?"Top 4 saved":"Top 4 updated");
  }

  /* ── TABS definition ─────────────────────────────────────── */
  const TABS=[
    ["users","👥 Users"],
    ["broadcast","📢 Broadcast"],
    ["system","🎛️ System"],
  ];

  const cSelMatch=cMs.find(m=>m.id===Number(cSelId));
  const fSelResult=fDraft;
  const pendingList=Object.entries(pending);
  const userList=Object.values(users).sort((a,b)=>(a.name||"").localeCompare(b.name||""));

  /* ── Render ────────────────────────────────────────────────── */
  return(
    <div className="ah-wrap">
      <style>{CSS}</style>

      {/* Toast */}
      {toast&&<div className="ah-toast" style={{
        background:toast.type==="error"?"#fef2f2":toast.type==="ok"?"#f0fdf4":"#eff6ff",
        border:"1px solid "+(toast.type==="error"?"#fecaca":toast.type==="ok"?"#bbf7d0":"#bfdbfe"),
        color:toast.type==="error"?"#991b1b":toast.type==="ok"?"#166534":"#1e40af",
      }}>{toast.msg}</div>}

      {/* Header */}
      <div className="ah-header">
        <button onClick={onBack} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",
          color:"rgba(255,255,255,.7)",borderRadius:20,padding:"5px 14px",fontSize:12,
          fontWeight:600,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>← Back</button>
        <div>
          <p style={{color:"#C5A028",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
            fontSize:20,letterSpacing:2,margin:0,textTransform:"uppercase"}}>Admin Hub</p>
          <p style={{color:"rgba(255,255,255,.5)",fontSize:11,margin:0}}>
            {stats.totalPlayers||0} players · {pendingList.length} pending
          </p>
        </div>
        <button onClick={loadAll} style={{marginLeft:"auto",background:"rgba(255,255,255,.1)",
          border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.6)",borderRadius:8,
          padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>
          ↻ Refresh
        </button>
      </div>

      {/* Tab bar */}
      <div className="ah-tab-bar">
        {TABS.map(([id,label])=>(
          <button key={id} className={`ah-tab${tab===id?" on":""}`}
            onClick={()=>setTab(id)}>{label}
            {id==="users"&&pendingList.length>0&&
              <span style={{background:"#dc2626",color:"#fff",borderRadius:"50%",
                fontSize:9,padding:"1px 5px",marginLeft:5}}>{pendingList.length}</span>}
          </button>
        ))}
      </div>

      <div className="ah-body">
        {loading&&<div style={{textAlign:"center",padding:"48px",color:"#94a3b8"}}>Loading…</div>}

        {/* ── USERS TAB ────────────────────────────────────────── */}
        {!loading&&tab==="users"&&<>
          {/* Stats */}
          <div className="ah-card">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div className="ah-stat"><p>{stats.totalPlayers||0}</p><p>Total</p></div>
              <div className="ah-stat"><p style={{color:pendingList.length>0?"#dc2626":undefined}}>{pendingList.length}</p><p>Pending</p></div>
              <div className="ah-stat"><p>{userList.filter(u=>u.approved!==false).length}</p><p>Approved</p></div>
            </div>
          </div>

          {/* Pending approvals */}
          {pendingList.length>0&&(
            <div className="ah-card">
              <Section title="⏳ Pending Approval">
                {pendingList.map(([emk,u])=>(
                  <div key={emk} className="ah-user-row">
                    <Av name={u.name} sz={36}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:700,fontSize:13,margin:0,color:"#0a1628"}}>{u.name}</p>
                      <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{u.email}</p>
                      <p style={{fontSize:10,color:"#94a3b8",margin:0}}>
                        {u.joined?new Date(u.joined).toLocaleDateString():""}
                      </p>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button className="ah-btn ah-btn-success ah-btn-sm" onClick={()=>approveUser(emk)}>✅ Approve</button>
                      <button className="ah-btn ah-btn-danger ah-btn-sm" onClick={()=>rejectUser(emk)}>✗ Reject</button>
                    </div>
                  </div>
                ))}
              </Section>
            </div>
          )}

          {/* All users */}
          <div className="ah-card">
            <Section title="All Players">
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 10px"}}>
                Single shared account across Cricket and FIFA.
              </p>
              {userList.map(u=>{
                const emk=ek(u.email);
                return(
                  <div key={emk} className="ah-user-row">
                    <Av name={u.name} sz={32}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:600,fontSize:13,margin:0,color:"#0a1628"}}>{u.name}</p>
                      <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{u.email}</p>
                    </div>
                    <Badge
                      label={u.approved!==false?"Approved":"Pending"}
                      color={u.approved!==false?"#15803d":"#d97706"}
                      bg={u.approved!==false?"#f0fdf4":"#fffbeb"}
                    />
                    <button className="ah-btn ah-btn-danger ah-btn-sm" style={{marginLeft:6}}
                      onClick={()=>removeUser(emk)}>🗑️</button>
                  </div>
                );
              })}
              {userList.length===0&&<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"24px 0"}}>No users yet.</p>}
            </Section>
          </div>
        </>}

        {/* ── BROADCAST TAB ───────────────────────────────────── */}
        {!loading&&tab==="broadcast"&&<>
          <div className="ah-card">
            <Section title="New Broadcast">
              <textarea value={bcMsg} onChange={e=>setBcMsg(e.target.value)}
                placeholder="Write your message…"
                style={{width:"100%",height:90,padding:"10px 12px",border:"1px solid #e2e8f0",
                  borderRadius:10,fontSize:13,fontFamily:"'Barlow',sans-serif",resize:"vertical",
                  outline:"none",boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:10,alignItems:"center",marginTop:10,flexWrap:"wrap"}}>
                <select value={bcTarget} onChange={e=>setBcTarget(e.target.value)} className="ah-select"
                  style={{flex:1,minWidth:100}}>
                  <option value="all">📢 All apps</option>
                  <option value="cricket">🏏 Cricket only</option>
                  <option value="fifa">⚽ FIFA only</option>
                </select>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#475569",cursor:"pointer"}}>
                  <input type="checkbox" checked={bcPin} onChange={e=>setBcPin(e.target.checked)}/>
                  📌 Pin it
                </label>
                <button className="ah-btn ah-btn-primary" disabled={!bcMsg.trim()||bcSending}
                  onClick={sendBroadcast} style={{minWidth:80}}>
                  {bcSending?"Sending…":"📤 Send"}
                </button>
              </div>
            </Section>
          </div>

          <div className="ah-card">
            <Section title="Recent Broadcasts">
              {recentBc.length===0&&<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"20px 0"}}>No broadcasts yet.</p>}
              {recentBc.map((b,i)=>(
                <div key={b.id||i} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <Badge label={b._sport} bg="#f1f5f9" color="#475569"/>
                    <span style={{fontSize:10,color:"#94a3b8"}}>
                      {b.ts?new Date(b.ts).toLocaleString():""}
                    </span>
                  </div>
                  <p style={{fontSize:12,color:"#0a1628",margin:0}}>{b.msg}</p>
                </div>
              ))}
            </Section>
          </div>
        </>}

        {/* ── SYSTEM TAB ──────────────────────────────────────── */}
        {!loading&&tab==="system"&&<>
          {/* Maintenance toggles */}
          <div className="ah-card">
            <Section title="🔧 Maintenance Mode">
              <p style={{fontSize:12,color:"#94a3b8",margin:"0 0 12px"}}>
                Locks the app for all non-admin users. Use while entering bulk results or fixing data.
              </p>
              {[
                {id:"ipl2026",name:"IPL 2026 (Cricket)",db:CRICKET_DB,color:"#1D428A"},
                {id:"fifa2026",name:"FIFA World Cup 2026",db:FIFA_DB,color:"#004B87"},
              ].map(t=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,
                  padding:"10px 14px",background:"#f8faff",borderRadius:10,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",
                    background:maintenance[t.id]?"#dc2626":"#22c55e"}}/>
                  <p style={{flex:1,margin:0,fontWeight:600,fontSize:13,color:"#0a1628"}}>{t.name}</p>
                  <Badge
                    label={maintenance[t.id]?"🔒 Locked":"🟢 Live"}
                    color={maintenance[t.id]?"#991b1b":"#15803d"}
                    bg={maintenance[t.id]?"#fef2f2":"#f0fdf4"}
                  />
                  <button
                    className={`ah-btn ah-btn-sm ${maintenance[t.id]?"ah-btn-success":"ah-btn-danger"}`}
                    onClick={()=>toggleMaintenance(t.id,t.db,t.name)}>
                    {maintenance[t.id]?"Go Live":"Lock"}
                  </button>
                </div>
              ))}
            </Section>
          </div>

          {/* Tournament lifecycle */}
          <div className="ah-card">
            <Section title="🏁 Tournament Lifecycle">
              <p style={{fontSize:12,color:"#94a3b8",margin:"0 0 12px"}}>
                Closing a tournament freezes all data (picks, results, leaderboard) into read-only history.
                Nothing is deleted — data stays in Firebase forever.
              </p>
              {[
                {id:"ipl2026",name:"IPL 2026",sport:"Cricket",db:CRICKET_DB,
                  done:stats.ipl2026?.done,total:stats.ipl2026?.total,
                  players:stats.totalPlayers,picks:stats.ipl2026?.picks},
                {id:"fifa2026",name:"FIFA World Cup 2026",sport:"Football",db:FIFA_DB,
                  done:stats.fifa2026?.done,total:stats.fifa2026?.total,
                  players:stats.totalPlayers,picks:stats.fifa2026?.picks},
              ].map(t=>{
                const isFinished=statuses[t.id]==="finished";
                return(
                  <div key={t.id} style={{border:"1px solid #e8edf5",borderRadius:12,
                    padding:"14px",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{flex:1}}>
                        <p style={{fontWeight:700,fontSize:14,margin:0,color:"#0a1628"}}>{t.name}</p>
                        <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{t.sport}</p>
                      </div>
                      <Badge
                        label={isFinished?"🏁 Finished":"🟢 Active"}
                        color={isFinished?"#7c3aed":"#15803d"}
                        bg={isFinished?"#f5f3ff":"#f0fdf4"}
                      />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
                      <div className="ah-stat"><p>{t.done||0}/{t.total||"?"}</p><p>Matches Done</p></div>
                      <div className="ah-stat"><p>{t.players||0}</p><p>Players</p></div>
                      <div className="ah-stat"><p>{t.picks||0}</p><p>Picks Made</p></div>
                    </div>
                    {isFinished
                      ?<button className="ah-btn ah-btn-warning" style={{width:"100%"}}
                          onClick={()=>reopenTournament(t.id,t.db,t.name)}>
                          ↩️ Reopen Tournament
                        </button>
                      :<button className="ah-btn ah-btn-danger" style={{width:"100%"}}
                          onClick={()=>closeTournament(t.id,t.db,t.name)}>
                          🏁 Close Tournament (Freeze Data)
                        </button>
                    }
                  </div>
                );
              })}
            </Section>
          </div>
        </>}

      </div>
    </div>
  );
}
