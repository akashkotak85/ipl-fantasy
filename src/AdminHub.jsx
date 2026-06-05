// AdminHub.jsx — Full unified admin panel
// Tabs: 👥 Users · 📢 Broadcast · 🏏 Cricket · ⚽ FIFA · 🎛️ System
// Cricket tab supports ALL tournaments dynamically (IPL, WT20WC, future).
// Each tournament uses its own Firebase prefix via createDB().

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { createDB } from "./firebase.js";
import { CRICKET_TOURNAMENTS, SCORE_BANDS, PTS } from "./cricketData.js";

/* ─── Fixed DBs ───────────────────────────────────────────────── */
const SHARED_DB = createDB("ipl26_");   // user registry always ipl26_
const FIFA_DB   = createDB("fifa26_");
const NR = "NO_RESULT";

/* ─── FIFA teams ─────────────────────────────────────────────── */
const FIFA_TEAMS=[
  "Mexico","South Africa","South Korea","Czechia","Canada","Bosnia and Herzegovina",
  "Qatar","Switzerland","Brazil","Morocco","Haiti","Scotland","USA","Paraguay",
  "Australia","Turkiye","Germany","Curacao","Ivory Coast","Ecuador","Netherlands",
  "Japan","Sweden","Tunisia","Belgium","Egypt","Iran","New Zealand","Spain",
  "Cape Verde","Saudi Arabia","Uruguay","France","Senegal","Iraq","Norway",
  "Argentina","Algeria","Austria","Jordan","Portugal","DR Congo","Uzbekistan",
  "Colombia","England","Croatia","Ghana","Panama",
].sort();

/* ─── Helpers ────────────────────────────────────────────────── */
const ek=e=>(e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const isNR=v=>!v||v===NR;

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
function Section({title,children,accent="#1D428A",danger}){
  return(
    <div style={{marginBottom:20}}>
      <p style={{fontSize:10,fontWeight:700,color:danger?"#dc2626":accent,textTransform:"uppercase",
        letterSpacing:2,margin:"0 0 10px"}}>{title}</p>
      {children}
    </div>
  );
}
function Row({label,children}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
      <span style={{fontSize:11,color:"#64748b",fontWeight:600,minWidth:90}}>{label}</span>
      {children}
    </div>
  );
}

/* ─── CSS ────────────────────────────────────────────────────── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap');
.ah-wrap{min-height:100vh;background:#f0f4f8;font-family:'Barlow',sans-serif;}
.ah-header{background:linear-gradient(135deg,#0a1628,#1a2f5e);padding:14px 16px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:40;}
.ah-tab-bar{display:flex;gap:4px;overflow-x:auto;padding:12px 16px 0;background:#fff;border-bottom:1px solid #e8edf5;scrollbar-width:none;position:sticky;top:56px;z-index:39;}
.ah-tab-bar::-webkit-scrollbar{display:none;}
.ah-tab{padding:7px 14px;border-radius:8px 8px 0 0;border:none;background:transparent;color:#64748b;font-size:12px;font-weight:700;font-family:'Barlow',sans-serif;cursor:pointer;white-space:nowrap;transition:all .15s;border-bottom:2px solid transparent;}
.ah-tab.on{background:#f0f4ff;color:#1D428A;border-bottom:2px solid #1D428A;}
.ah-body{padding:16px;max-width:640px;margin:0 auto;}
.ah-card{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.ah-card-danger{background:#fff;border-radius:14px;padding:16px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid #fecaca;}
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
.ah-lock-row{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f8faff;border-radius:8px;font-size:12px;margin-bottom:4px;}
`;

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function AdminHub({email,onBack}){
  const [tab,setTab]=useState("users");
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);

  /* ── Shared state ─────────────────────────────────── */
  const [users,setUsers]=useState({});
  const [pending,setPending]=useState({});
  const [stats,setStats]=useState({});
  const [statuses,setStatuses]=useState({});
  const [maintenance,setMaintenance]=useState({});

  /* ── Broadcast ────────────────────────────────────── */
  const [bcMsg,setBcMsg]=useState("");
  const [bcTarget,setBcTarget]=useState("all");
  const [bcPin,setBcPin]=useState(false);
  const [bcSending,setBcSending]=useState(false);
  const [recentBc,setRecentBc]=useState([]);

  /* ── Cricket admin state ──────────────────────────── */
  const [cTId,setCTId]=useState(CRICKET_TOURNAMENTS[0]?.id||"");
  const cTournament=CRICKET_TOURNAMENTS.find(t=>t.id===cTId)||CRICKET_TOURNAMENTS[0];
  const cDB=cTournament?createDB(cTournament.dbPrefix):SHARED_DB;
  const cTeams=cTournament?.teams||[];
  const cSQ=cTournament?.SQ||{};
  const cMatches=cTournament?.matches||[];
  const cBQ=cTournament?.bonusQuestions||{};
  const cPQ=cTournament?.propQuestions||[];
  const cAllPlayers=cTournament?.allPlayers||[];

  const [cLoading,setCLoading]=useState(false);
  const [cRm,setCRm]=useState({});
  const [cLocked,setCLocked]=useState({});
  const [cDbl,setCDbl]=useState(null);
  const [cBonusAns,setCBonusAns]=useState({});
  const [cSbAns,setCSbAns]=useState({});
  const [cPropAns,setCPropAns]=useState({});
  const [cSw,setCSw]=useState(null);
  const [cAt4,setCAt4]=useState([]);
  const [cSelId,setCSelId]=useState("");
  const [cDraft,setCDraft]=useState({win:"",motm:"",score:"",sb:"",bonus:null});
  const [cSaving,setCSaving]=useState(false);
  const [cPtsOvr,setCPtsOvr]=useState({});
  const [cPtsEmail,setCPtsEmail]=useState("");
  const [cPtsVal,setCPtsVal]=useState("");

  /* ── FIFA admin state ─────────────────────────────── */
  const [fLoading,setFLoading]=useState(false);
  const [fRm,setFRm]=useState({});
  const [fLocked,setFLocked]=useState({});
  const [fSw,setFSw]=useState("");
  const [fAt4,setFAt4]=useState([]);
  const [fWs,setFWs]=useState("");
  const [fGb,setFGb]=useState("");
  const [fGg,setFGg]=useState([]);
  const [fGball,setFGball]=useState("");
  const [fDbl,setFDbl]=useState(null);
  const [fBonusAns,setFBonusAns]=useState({});
  const [fSelId,setFSelId]=useState("");
  const [fDraft,setFDraft]=useState({win:"",motm:"",score:""});
  const [fSaving,setFSaving]=useState(false);
  const [fPtsOvr,setFPtsOvr]=useState({});
  const [fPtsEmail,setFPtsEmail]=useState("");
  const [fPtsVal,setFPtsVal]=useState("");

  const toast2=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  /* ── Load shared (users, pending) ─────────────────── */
  const loadShared=useCallback(async()=>{
    try{
      const [u,pu]=await Promise.all([SHARED_DB.get("u"),SHARED_DB.get("pending")]);
      if(u){
        const nu={};
        Object.keys(u).forEach(k=>{const e=u[k];if(e?.email)nu[ek(e.email)]={...e};});
        setUsers(nu);
      }
      setPending(pu||{});
    }catch(e){console.error("loadShared",e);}
  },[]);

  /* ── Load cricket tournament data ─────────────────── */
  const loadCricket=useCallback(async(tId)=>{
    const t=CRICKET_TOURNAMENTS.find(x=>x.id===tId); if(!t) return;
    const db=createDB(t.dbPrefix);
    setCLoading(true);
    try{
      const [rm,lk,dbl,ba,sba,pa,sw,at4,mnt,status,ptsovr]=await Promise.all([
        db.get("rm"),db.get("lockedm"),db.get("doublematch"),
        db.get("bonusans"),db.get("sbans"),db.get("propanswers"),
        db.get("sw"),db.get("actualtop4"),
        db.get("maintenance"),db.get("tourneystatus"),db.get("ptsadj"),
      ]);
      setCRm(rm||{}); setCLocked(lk||{}); setCDbl(dbl??null);
      setCBonusAns(ba||{}); setCSbAns(sba||{}); setCPropAns(pa||{});
      setCSw(sw||""); setCAt4(Array.isArray(at4)?at4:[]);
      setCPtsOvr(ptsovr||{});
      setMaintenance(p=>({...p,[tId]:!!mnt}));
      setStatuses(p=>({...p,[tId]:status||"active"}));
      // pick stats
      const ap=await db.get("ap");
      const picks=Object.values(ap||{}).reduce((s,up)=>s+Object.keys(up||{}).length,0);
      setStats(p=>({...p,[tId]:{done:Object.keys(rm||{}).length,total:(t.matches||[]).length,picks}}));
    }catch(e){console.error("loadCricket",e);}
    setCLoading(false);
  },[]);

  /* ── Load FIFA data ───────────────────────────────── */
  const loadFifa=useCallback(async()=>{
    setFLoading(true);
    try{
      const [rm,lk,sw,at4,ws,gb,gg,gball,dbl,ba,mnt,status,ptsovr,ap]=await Promise.all([
        FIFA_DB.get("rm"),FIFA_DB.get("lockedm"),FIFA_DB.get("sw"),FIFA_DB.get("actualtop4"),
        FIFA_DB.get("actualws"),FIFA_DB.get("actualgb"),FIFA_DB.get("actualgoldenglov"),
        FIFA_DB.get("actualgoldenball"),FIFA_DB.get("doublematch"),FIFA_DB.get("bonusans"),
        FIFA_DB.get("maintenance"),FIFA_DB.get("tourneystatus"),FIFA_DB.get("ptsadj"),
        FIFA_DB.get("ap"),
      ]);
      setFRm(rm||{}); setFLocked(lk||{}); setFSw(sw||""); setFAt4(Array.isArray(at4)?at4:[]);
      setFWs(ws||""); setFGb(gb||""); setFGg(Array.isArray(gg)?gg:[]); setFGball(gball||"");
      setFDbl(dbl??null); setFBonusAns(ba||{}); setFPtsOvr(ptsovr||{});
      setMaintenance(p=>({...p,fifa2026:!!mnt}));
      setStatuses(p=>({...p,fifa2026:status||"active"}));
      const picks=Object.values(ap||{}).reduce((s,up)=>s+Object.keys(up||{}).length,0);
      setStats(p=>({...p,fifa2026:{done:Object.keys(rm||{}).length,total:104,picks}}));
    }catch(e){console.error("loadFifa",e);}
    setFLoading(false);
  },[]);

  /* ── Initial load ─────────────────────────────────── */
  useEffect(()=>{
    async function init(){
      setLoading(true);
      await Promise.all([
        loadShared(),
        loadCricket(CRICKET_TOURNAMENTS[0]?.id),
        loadFifa(),
      ]);
      // broadcasts
      try{
        const [cBc,fBc]=await Promise.all([SHARED_DB.get("bc"),FIFA_DB.get("bc")]);
        const all=[
          ...(Array.isArray(cBc)?cBc:[]).slice(-5).map(b=>({...b,_sport:"🏏 Cricket"})),
          ...(Array.isArray(fBc)?fBc:[]).slice(-5).map(b=>({...b,_sport:"⚽ FIFA"})),
        ].sort((a,b)=>b.ts-a.ts).slice(0,8);
        setRecentBc(all);
      }catch(e){}
      setLoading(false);
    }
    init();
  },[loadShared,loadCricket,loadFifa]);

  /* ── Reload cricket when tournament changes ───────── */
  useEffect(()=>{
    if(cTId) loadCricket(cTId);
    setCSelId(""); setCDraft({win:"",motm:"",score:"",sb:"",bonus:null});
  },[cTId,loadCricket]);

  /* ════════════════════ USER FUNCTIONS ═══════════════ */
  async function approveUser(emk){
    const entry=pending[emk]; if(!entry) return;
    const u2=await SHARED_DB.get("u")||{};
    u2[entry.email]={...entry,approved:true};
    const pu2=await SHARED_DB.get("pending")||{};
    delete pu2[emk];
    await Promise.all([SHARED_DB.set("u",u2),SHARED_DB.set("pending",pu2)]);
    setUsers(p=>({...p,[emk]:{...entry,approved:true}}));
    const np={...pending}; delete np[emk]; setPending(np);
    toast2(`✅ ${entry.name} approved`);
  }
  async function rejectUser(emk){
    const entry=pending[emk];
    const pu2=await SHARED_DB.get("pending")||{};
    delete pu2[emk]; await SHARED_DB.set("pending",pu2);
    const np={...pending}; delete np[emk]; setPending(np);
    toast2(`${entry?.name||"User"} rejected`,"error");
  }
  async function removeUser(emk){
    const entry=users[emk];
    if(!entry||!window.confirm(`Remove ${entry.name}?`)) return;
    const u2=await SHARED_DB.get("u")||{};
    delete u2[entry.email]; await SHARED_DB.set("u",u2);
    const nu={...users}; delete nu[emk]; setUsers(nu);
    toast2(`🗑️ ${entry.name} removed`,"error");
  }

  /* ════════════════════ BROADCAST ════════════════════ */
  async function sendBroadcast(){
    if(!bcMsg.trim()) return;
    setBcSending(true);
    const msg={id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"};
    const dbs=bcTarget==="all"
      ?[SHARED_DB,FIFA_DB,...CRICKET_TOURNAMENTS.filter(t=>t.id!==CRICKET_TOURNAMENTS[0]?.id).map(t=>createDB(t.dbPrefix))]
      :bcTarget==="cricket"?[SHARED_DB]:[FIFA_DB];
    for(const db of dbs){
      const ex=await db.get("bc")||[];
      await db.set("bc",[...ex,msg]);
      if(bcPin) await db.set("pinnedbc",bcMsg.trim());
    }
    setBcMsg(""); setBcPin(false); setBcSending(false);
    toast2("📢 Broadcast sent!"); loadShared();
  }

  /* ════════════════════ CRICKET ADMIN ════════════════ */
  function onCSelectMatch(id){
    setCSelId(id);
    const numId=Number(id);
    const existing=cRm[numId]||cRm[String(numId)]||{};
    setCDraft({
      win:existing.win||"",
      motm:existing.motm||"",
      score:existing.score||"",
      sb:cSbAns[String(numId)]||"",
      bonus:cBonusAns[String(numId)]??null,
    });
  }

  async function saveCricketResult(){
    if(!cSelId||!cDraft.win){toast2("Select match and winner first","error");return;}
    setCSaving(true);
    const numId=Number(cSelId);
    const result={win:cDraft.win,motm:cDraft.motm||NR,score:cDraft.score||""};
    const newRm={...cRm,[numId]:result};
    await cDB.set("rm",newRm); setCRm(newRm);
    if(cDraft.sb){
      const nb={...cSbAns,[String(numId)]:cDraft.sb};
      await cDB.set("sbans",nb); setCSbAns(nb);
    }
    if(cDraft.bonus!==null&&cDraft.bonus!==undefined){
      const nb={...cBonusAns,[String(numId)]:cDraft.bonus};
      await cDB.set("bonusans",nb); setCBonusAns(nb);
    }
    setCSaving(false); toast2("✅ Result saved");
  }

  async function clearCricketResult(){
    if(!cSelId) return;
    const numId=Number(cSelId);
    const newRm={...cRm}; delete newRm[numId]; delete newRm[String(numId)];
    await cDB.set("rm",newRm); setCRm(newRm);
    setCDraft({win:"",motm:"",score:"",sb:"",bonus:null});
    toast2("↩️ Result cleared","error");
  }

  async function toggleCricketLock(mid){
    const cur=cLocked[mid]??cLocked[String(mid)];
    const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";
    const upd={...cLocked};
    if(next===null){delete upd[mid];delete upd[String(mid)];}
    else upd[mid]=next;
    setCLocked(upd); await cDB.set("lockedm",upd);
    toast2(next==="locked"?"🔒 Locked":next==="unlocked"?"🔓 Unlocked":"⏱️ Auto");
  }

  async function saveCricketSeason(){
    if(cSw) await cDB.set("sw",cSw);
    if(cAt4.length>0) await cDB.set("actualtop4",cAt4);
    toast2("🏆 Season picks saved");
  }

  async function saveCricketProp(idx,val){
    const upd={...cPropAns,[`q${idx}`]:val};
    setCPropAns(upd); await cDB.set("propanswers",upd);
    toast2("Prop answer saved");
  }

  async function saveCricketPtsOverride(){
    if(!cPtsEmail||cPtsVal==="") return;
    const emk=ek(cPtsEmail);
    const upd={...cPtsOvr,[emk]:Number(cPtsVal)};
    setCPtsOvr(upd); await cDB.set("ptsadj",upd);
    setCPtsEmail(""); setCPtsVal("");
    toast2(`✅ Override saved for ${cPtsEmail}`);
  }

  async function resetCricketAll(what){
    if(!window.confirm(`⚠️ DANGER: Clear ALL ${what} for ${cTournament?.name}?\n\nThis cannot be undone.`)) return;
    if(what==="results"){await cDB.set("rm",null);setCRm({});toast2("All results cleared","error");}
    else if(what==="picks"){await cDB.set("ap",null);toast2("All picks cleared","error");}
    else if(what==="propbets"){await cDB.set("propbets",null);await cDB.set("propanswers",null);setCPropAns({});toast2("Prop bets cleared","error");}
    else if(what==="scorebands"){await cDB.set("sbans",null);setCSbAns({});toast2("Score band answers cleared","error");}
    else if(what==="bonus"){await cDB.set("bonusans",null);setCBonusAns({});toast2("Bonus answers cleared","error");}
    else if(what==="seasonpicks"){await cDB.set("sp",null);await cDB.set("t4",null);toast2("Season picks cleared","error");}
  }

  /* ════════════════════ FIFA ADMIN ═══════════════════ */
  async function saveFifaResult(){
    if(!fSelId||!fDraft.win){toast2("Enter match ID and winner","error");return;}
    setFSaving(true);
    const numId=Number(fSelId);
    const result={win:fDraft.win,motm:fDraft.motm||NR,score:fDraft.score||""};
    const newRm={...fRm,[numId]:result};
    await FIFA_DB.set("rm",newRm); setFRm(newRm);
    setFSaving(false); toast2("✅ FIFA result saved");
  }

  async function clearFifaResult(){
    if(!fSelId) return;
    const numId=Number(fSelId);
    const newRm={...fRm}; delete newRm[numId]; delete newRm[String(numId)];
    await FIFA_DB.set("rm",newRm); setFRm(newRm);
    setFDraft({win:"",motm:"",score:""}); toast2("↩️ Cleared","error");
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

  async function saveFifaAwards(){
    const ops=[];
    if(fSw) ops.push(FIFA_DB.set("sw",fSw));
    if(fAt4.length>0) ops.push(FIFA_DB.set("actualtop4",fAt4));
    if(fWs) ops.push(FIFA_DB.set("actualws",fWs));
    if(fGb) ops.push(FIFA_DB.set("actualgb",fGb));
    if(fGg.length>0) ops.push(FIFA_DB.set("actualgoldenglov",fGg));
    if(fGball) ops.push(FIFA_DB.set("actualgoldenball",fGball));
    await Promise.all(ops);
    toast2("🏆 FIFA awards saved");
  }

  async function saveFifaPtsOverride(){
    if(!fPtsEmail||fPtsVal==="") return;
    const emk=ek(fPtsEmail);
    const upd={...fPtsOvr,[emk]:Number(fPtsVal)};
    setFPtsOvr(upd); await FIFA_DB.set("ptsadj",upd);
    setFPtsEmail(""); setFPtsVal("");
    toast2(`✅ Override saved`);
  }

  async function resetFifaAll(what){
    if(!window.confirm(`⚠️ DANGER: Clear ALL ${what} for FIFA?\n\nThis cannot be undone.`)) return;
    if(what==="results"){await FIFA_DB.set("rm",null);setFRm({});toast2("FIFA results cleared","error");}
    else if(what==="picks"){await FIFA_DB.set("ap",null);toast2("FIFA picks cleared","error");}
    else if(what==="seasonpicks"){await FIFA_DB.set("sp",null);await FIFA_DB.set("t4",null);toast2("FIFA season picks cleared","error");}
    else if(what==="bonus"){await FIFA_DB.set("bonusans",null);setFBonusAns({});toast2("Bonus cleared","error");}
  }

  /* ═════════════ TOURNAMENT LIFECYCLE ════════════════ */
  async function closeTournament(tId,tdb,tname){
    if(!window.confirm(`Close ${tname}?\nLeaderboard and picks will be frozen.`)) return;
    await tdb.set("tourneystatus","finished");
    setStatuses(p=>({...p,[tId]:"finished"})); toast2(`🏁 ${tname} closed`);
  }
  async function reopenTournament(tId,tdb,tname){
    if(!window.confirm(`Reopen ${tname}?`)) return;
    await tdb.set("tourneystatus","active");
    setStatuses(p=>({...p,[tId]:"active"})); toast2(`🟢 ${tname} reopened`);
  }
  async function toggleMaintenance(tId,tdb,tname){
    const cur=maintenance[tId];
    await tdb.set("maintenance",!cur);
    setMaintenance(p=>({...p,[tId]:!cur}));
    toast2(!cur?`🔒 ${tname} locked`:`🟢 ${tname} live`);
  }

  /* ─── Derived ────────────────────────────────────── */
  const TABS=[
    ["users","👥 Users"],
    ["broadcast","📢 Broadcast"],
    ["cricket","🏏 Cricket"],
    ["fifa","⚽ FIFA"],
    ["system","🎛️ System"],
  ];
  const pendingList=Object.entries(pending);
  const userList=Object.values(users).sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  const cSelMatch=cMatches.find(m=>m.id===Number(cSelId));
  const cPlayable=cMatches.filter(m=>m.home!=="TBD"&&m.away!=="TBD");

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  return(
    <div className="ah-wrap">
      <style>{CSS}</style>

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
            {userList.length} players · {pendingList.length} pending
          </p>
        </div>
        <button onClick={()=>{loadShared();loadCricket(cTId);loadFifa();}}
          style={{marginLeft:"auto",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",
          color:"rgba(255,255,255,.6)",borderRadius:8,padding:"5px 12px",fontSize:11,cursor:"pointer",
          fontFamily:"'Barlow',sans-serif"}}>↻ Refresh</button>
      </div>

      {/* Tab bar */}
      <div className="ah-tab-bar">
        {TABS.map(([id,label])=>(
          <button key={id} className={`ah-tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>
            {label}
            {id==="users"&&pendingList.length>0&&
              <span style={{background:"#dc2626",color:"#fff",borderRadius:"50%",
                fontSize:9,padding:"1px 5px",marginLeft:5}}>{pendingList.length}</span>}
          </button>
        ))}
      </div>

      <div className="ah-body">
        {loading&&<div style={{textAlign:"center",padding:"48px",color:"#94a3b8"}}>Loading…</div>}

        {/* ══════════════ USERS TAB ══════════════════════ */}
        {!loading&&tab==="users"&&<>
          <div className="ah-card">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div className="ah-stat"><p>{userList.length}</p><p>Total</p></div>
              <div className="ah-stat"><p style={{color:pendingList.length>0?"#dc2626":undefined}}>{pendingList.length}</p><p>Pending</p></div>
              <div className="ah-stat"><p>{userList.filter(u=>u.approved!==false).length}</p><p>Approved</p></div>
            </div>
          </div>

          {pendingList.length>0&&(
            <div className="ah-card">
              <Section title="⏳ Pending Approval">
                {pendingList.map(([emk,u])=>(
                  <div key={emk} className="ah-user-row">
                    <Av name={u.name} sz={36}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:700,fontSize:13,margin:0}}>{u.name}</p>
                      <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{u.email}</p>
                    </div>
                    <button className="ah-btn ah-btn-success ah-btn-sm" onClick={()=>approveUser(emk)}>✅</button>
                    <button className="ah-btn ah-btn-danger ah-btn-sm" onClick={()=>rejectUser(emk)}>✗</button>
                  </div>
                ))}
              </Section>
            </div>
          )}

          <div className="ah-card">
            <Section title="All Players">
              {userList.map(u=>{
                const emk=ek(u.email);
                return(
                  <div key={emk} className="ah-user-row">
                    <Av name={u.name} sz={32}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:600,fontSize:13,margin:0}}>{u.name}</p>
                      <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{u.email}</p>
                    </div>
                    <Badge label={u.approved!==false?"Approved":"Pending"} color={u.approved!==false?"#15803d":"#d97706"} bg={u.approved!==false?"#f0fdf4":"#fffbeb"}/>
                    <button className="ah-btn ah-btn-danger ah-btn-sm" style={{marginLeft:4}} onClick={()=>removeUser(emk)}>🗑️</button>
                  </div>
                );
              })}
              {userList.length===0&&<p style={{color:"#94a3b8",textAlign:"center",padding:"24px 0"}}>No users yet.</p>}
            </Section>
          </div>
        </>}

        {/* ══════════════ BROADCAST TAB ══════════════════ */}
        {!loading&&tab==="broadcast"&&<>
          <div className="ah-card">
            <Section title="New Broadcast">
              <textarea value={bcMsg} onChange={e=>setBcMsg(e.target.value)}
                placeholder="Write your message…"
                style={{width:"100%",height:90,padding:"10px 12px",border:"1px solid #e2e8f0",
                  borderRadius:10,fontSize:13,fontFamily:"'Barlow',sans-serif",resize:"vertical",
                  outline:"none",boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:10,alignItems:"center",marginTop:10,flexWrap:"wrap"}}>
                <select value={bcTarget} onChange={e=>setBcTarget(e.target.value)} className="ah-select" style={{flex:1,minWidth:100}}>
                  <option value="all">📢 All apps</option>
                  <option value="cricket">🏏 Cricket only</option>
                  <option value="fifa">⚽ FIFA only</option>
                </select>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#475569",cursor:"pointer"}}>
                  <input type="checkbox" checked={bcPin} onChange={e=>setBcPin(e.target.checked)}/> 📌 Pin
                </label>
                <button className="ah-btn ah-btn-primary" disabled={!bcMsg.trim()||bcSending} onClick={sendBroadcast}>
                  {bcSending?"Sending…":"📤 Send"}
                </button>
              </div>
            </Section>
          </div>
          <div className="ah-card">
            <Section title="Recent Broadcasts">
              {recentBc.length===0&&<p style={{color:"#94a3b8",textAlign:"center",padding:"20px 0"}}>No broadcasts yet.</p>}
              {recentBc.map((b,i)=>(
                <div key={b.id||i} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                  <div style={{display:"flex",gap:6,marginBottom:3}}>
                    <Badge label={b._sport} bg="#f1f5f9" color="#475569"/>
                    <span style={{fontSize:10,color:"#94a3b8"}}>{b.ts?new Date(b.ts).toLocaleString():""}</span>
                  </div>
                  <p style={{fontSize:12,color:"#0a1628",margin:0}}>{b.msg}</p>
                </div>
              ))}
            </Section>
          </div>
        </>}

        {/* ══════════════ CRICKET TAB ════════════════════ */}
        {!loading&&tab==="cricket"&&<>
          {/* Tournament selector */}
          <div className="ah-card">
            <Section title="🏆 Tournament">
              <select value={cTId} onChange={e=>setCTId(e.target.value)} className="ah-select">
                {CRICKET_TOURNAMENTS.map(t=>(
                  <option key={t.id} value={t.id}>{t.name} ({t.dbPrefix})</option>
                ))}
              </select>
              {cTournament&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:10}}>
                  <div className="ah-stat"><p>{stats[cTId]?.done||0}/{stats[cTId]?.total||"?"}</p><p>Matches</p></div>
                  <div className="ah-stat"><p>{userList.length}</p><p>Players</p></div>
                  <div className="ah-stat"><p>{stats[cTId]?.picks||0}</p><p>Picks</p></div>
                </div>
              )}
            </Section>
          </div>

          {cLoading&&<div style={{textAlign:"center",padding:24,color:"#94a3b8"}}>Loading tournament data…</div>}

          {!cLoading&&<>
          {/* Match Result Entry */}
          <div className="ah-card">
            <Section title="📋 Enter Match Result">
              <select value={cSelId} onChange={e=>onCSelectMatch(e.target.value)} className="ah-select" style={{marginBottom:8}}>
                <option value="">— Select match —</option>
                {cPlayable.map(m=>(
                  <option key={m.id} value={m.id}>
                    {m.mn}: {m.home} vs {m.away} {cRm[m.id]?"✅":""}
                  </option>
                ))}
              </select>

              {cSelId&&<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>🏆 Winner *</p>
                    <select value={cDraft.win} onChange={e=>setCDraft(p=>({...p,win:e.target.value}))} className="ah-select">
                      <option value="">— Winner —</option>
                      <option value="NO_RESULT">🌧️ No Result</option>
                      {cTeams.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>⭐ MOTM</p>
                    <input list={`motm-list-${cSelId}`} value={cDraft.motm}
                      onChange={e=>setCDraft(p=>({...p,motm:e.target.value}))}
                      placeholder="Player name…" className="ah-input"/>
                    <datalist id={`motm-list-${cSelId}`}>
                      {cAllPlayers.map(({p})=><option key={p} value={p}/>)}
                    </datalist>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>📊 Score Band</p>
                    <select value={cDraft.sb} onChange={e=>setCDraft(p=>({...p,sb:e.target.value}))} className="ah-select">
                      <option value="">— Band —</option>
                      {(SCORE_BANDS||[]).map((band,i)=>(
                        <option key={i} value={String.fromCharCode(65+i)}>
                          {String.fromCharCode(65+i)}: {band.label||`${band.min}–${band.max}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>📈 Score</p>
                    <input value={cDraft.score} onChange={e=>setCDraft(p=>({...p,score:e.target.value}))}
                      placeholder="e.g. 185/6 (20)" className="ah-input"/>
                  </div>
                </div>

                {cBQ[cSelId]&&(
                  <div style={{marginBottom:8}}>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>🎁 Bonus: {cBQ[cSelId]}</p>
                    <div style={{display:"flex",gap:8}}>
                      {["Yes","No"].map(v=>(
                        <button key={v}
                          className={`ah-btn ah-btn-sm ${cDraft.bonus===v?"ah-btn-primary":"ah-btn-warning"}`}
                          onClick={()=>setCDraft(p=>({...p,bonus:p.bonus===v?null:v}))}>
                          {v}
                        </button>
                      ))}
                      {cDraft.bonus&&<span style={{fontSize:11,color:"#15803d",alignSelf:"center"}}>→ {cDraft.bonus}</span>}
                    </div>
                  </div>
                )}

                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button className="ah-btn ah-btn-primary" disabled={cSaving||!cDraft.win} onClick={saveCricketResult} style={{flex:1}}>
                    {cSaving?"Saving…":"💾 Save Result"}
                  </button>
                  {(cRm[Number(cSelId)]||cRm[cSelId])&&(
                    <button className="ah-btn ah-btn-danger" onClick={clearCricketResult}>↩️ Clear</button>
                  )}
                </div>
              </>}
            </Section>
          </div>

          {/* Match Controls */}
          <div className="ah-card">
            <Section title="🔒 Match Lock / Unlock">
              <Row label="Match ID">
                <input id="cLockId" type="number" placeholder="e.g. 5" className="ah-input" style={{maxWidth:100}}/>
                <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={()=>{
                  const id=Number(document.getElementById("cLockId").value); if(!id) return;
                  toggleCricketLock(id);
                }}>Toggle</button>
              </Row>
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                {Object.entries(cLocked).filter(([k])=>!isNaN(k)).map(([id,st])=>(
                  <div key={id} className="ah-lock-row">
                    <span style={{fontWeight:700,color:"#64748b",minWidth:30}}>M{id}</span>
                    <Badge label={st==="locked"?"🔒 Locked":"🔓 Unlocked"} color={st==="locked"?"#991b1b":"#15803d"} bg={st==="locked"?"#fef2f2":"#f0fdf4"}/>
                    <button className="ah-btn ah-btn-danger ah-btn-sm" style={{marginLeft:"auto"}} onClick={()=>toggleCricketLock(Number(id))}>Toggle</button>
                  </div>
                ))}
                {Object.keys(cLocked).length===0&&<p style={{fontSize:12,color:"#94a3b8"}}>No manual overrides.</p>}
              </div>
            </Section>

            <div className="ah-divider"/>
            <Section title="⚡ Double Header">
              <Row label="Match ID">
                <input type="number" placeholder="Match ID (blank to remove)"
                  value={cDbl??""} onChange={e=>e.target.value===""?null:null}
                  className="ah-input" style={{maxWidth:130}}
                  id="cDblInput"/>
                <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={()=>{
                  const v=document.getElementById("cDblInput").value;
                  const n=v===""?null:Number(v);
                  setCDbl(n); cDB.set("doublematch",n);
                  toast2(n!=null?`⚡ Double: M${n}`:"Double removed");
                }}>Set</button>
                {cDbl!=null&&<Badge label={`⚡ M${cDbl} is double`} color="#d97706" bg="#fffbeb"/>}
              </Row>
            </Section>
          </div>

          {/* Season Picks / Awards */}
          <div className="ah-card">
            <Section title="🏆 Season Awards">
              <Row label="Champion">
                <select value={cSw||""} onChange={e=>setCSw(e.target.value)} className="ah-select" style={{flex:1}}>
                  <option value="">— Select champion —</option>
                  {cTeams.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </Row>
              <div style={{marginBottom:8}}>
                <p style={{fontSize:11,color:"#64748b",margin:"0 0 6px"}}>🏅 Top 4 ({cAt4.length}/4 selected)</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {cTeams.map(t=>{
                    const on=cAt4.includes(t);
                    return(
                      <button key={t} onClick={()=>{
                        let upd; if(on) upd=cAt4.filter(x=>x!==t);
                        else if(cAt4.length<4) upd=[...cAt4,t];
                        else{toast2("Max 4 teams","error");return;}
                        setCAt4(upd);
                      }}
                      style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",
                        background:on?"#1D428A":"#f1f5f9",color:on?"#fff":"#475569",border:"none"}}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button className="ah-btn ah-btn-primary" onClick={saveCricketSeason}>💾 Save Season Awards</button>
            </Section>
          </div>

          {/* Prop Bets */}
          {cPQ.length>0&&(
            <div className="ah-card">
              <Section title="🎲 Prop Bet Answers">
                {cPQ.map((q,i)=>(
                  <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <p style={{fontSize:12,color:"#0a1628",margin:"0 0 6px"}}>{i+1}. {q.question||q}</p>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {(q.options||["Yes","No"]).map(opt=>(
                        <button key={opt}
                          className={`ah-btn ah-btn-sm ${cPropAns[`q${i}`]===opt?"ah-btn-primary":"ah-btn-warning"}`}
                          onClick={()=>saveCricketProp(i,opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    {cPropAns[`q${i}`]&&<p style={{fontSize:11,color:"#15803d",margin:"4px 0 0"}}>✅ Answer: {cPropAns[`q${i}`]}</p>}
                  </div>
                ))}
              </Section>
            </div>
          )}

          {/* Points Override */}
          <div className="ah-card">
            <Section title="🎯 Points Override">
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 10px"}}>Add or subtract bonus points for a specific player.</p>
              <Row label="Email">
                <input value={cPtsEmail} onChange={e=>setCPtsEmail(e.target.value)} placeholder="player@email.com" className="ah-input" style={{flex:1}}/>
              </Row>
              <Row label="Points">
                <input type="number" value={cPtsVal} onChange={e=>setCPtsVal(e.target.value)} placeholder="e.g. 50 or -20" className="ah-input" style={{flex:1}}/>
                <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={saveCricketPtsOverride}>Save</button>
              </Row>
              {Object.entries(cPtsOvr).length>0&&(
                <div style={{marginTop:8}}>
                  {Object.entries(cPtsOvr).map(([emk,pts])=>(
                    <div key={emk} className="ah-lock-row">
                      <span style={{flex:1,fontSize:12}}>{emk}</span>
                      <Badge label={`${pts>0?"+":""}${pts} pts`} color={pts>=0?"#15803d":"#dc2626"} bg={pts>=0?"#f0fdf4":"#fef2f2"}/>
                      <button className="ah-btn ah-btn-danger ah-btn-sm" onClick={async()=>{
                        const upd={...cPtsOvr}; delete upd[emk]; setCPtsOvr(upd); await cDB.set("ptsadj",upd); toast2("Removed","error");
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Danger Zone */}
          <div className="ah-card-danger">
            <Section title="⚠️ Danger Zone — Reset Options" danger>
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 12px"}}>These actions are permanent and cannot be undone.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {label:"Clear All Results",what:"results",icon:"📋"},
                  {label:"Clear All Picks",what:"picks",icon:"🗳️"},
                  {label:"Clear Season Picks",what:"seasonpicks",icon:"🏆"},
                  {label:"Clear Prop Bets",what:"propbets",icon:"🎲"},
                  {label:"Clear Score Bands",what:"scorebands",icon:"📊"},
                  {label:"Clear Bonus Answers",what:"bonus",icon:"🎁"},
                ].map(({label,what,icon})=>(
                  <button key={what} className="ah-btn ah-btn-danger" onClick={()=>resetCricketAll(what)}
                    style={{textAlign:"left",padding:"8px 12px"}}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            </Section>
          </div>
          </>}
        </>}

        {/* ══════════════ FIFA TAB ═══════════════════════ */}
        {!loading&&tab==="fifa"&&<>
          {fLoading&&<div style={{textAlign:"center",padding:24,color:"#94a3b8"}}>Loading FIFA data…</div>}

          {!fLoading&&<>
          {/* Stats */}
          <div className="ah-card">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div className="ah-stat"><p>{Object.keys(fRm).length}/104</p><p>Matches</p></div>
              <div className="ah-stat"><p>{userList.length}</p><p>Players</p></div>
              <div className="ah-stat"><p>{stats.fifa2026?.picks||0}</p><p>Picks</p></div>
            </div>
          </div>

          {/* Match Result Entry */}
          <div className="ah-card">
            <Section title="📋 Enter Match Result">
              <Row label="Match ID">
                <input type="number" value={fSelId} onChange={e=>{
                  setFSelId(e.target.value);
                  const numId=Number(e.target.value);
                  const ex=fRm[numId]||{};
                  setFDraft({win:ex.win||"",motm:ex.motm||"",score:ex.score||""});
                }} placeholder="e.g. 12" className="ah-input" style={{maxWidth:100}}/>
                {fRm[Number(fSelId)]&&<Badge label="✅ Has result" color="#15803d" bg="#f0fdf4"/>}
              </Row>

              {fSelId&&<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>🏆 Winner *</p>
                    <select value={fDraft.win} onChange={e=>setFDraft(p=>({...p,win:e.target.value}))} className="ah-select">
                      <option value="">— Winner —</option>
                      <option value="NO_RESULT">🌧️ No Result</option>
                      {FIFA_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>⭐ MOTM</p>
                    <input value={fDraft.motm} onChange={e=>setFDraft(p=>({...p,motm:e.target.value}))}
                      placeholder="Player name…" className="ah-input"/>
                  </div>
                </div>
                <Row label="Score">
                  <input value={fDraft.score} onChange={e=>setFDraft(p=>({...p,score:e.target.value}))}
                    placeholder="e.g. 3-1 (AET)" className="ah-input" style={{flex:1}}/>
                </Row>
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button className="ah-btn ah-btn-primary" disabled={fSaving||!fDraft.win} onClick={saveFifaResult} style={{flex:1}}>
                    {fSaving?"Saving…":"💾 Save Result"}
                  </button>
                  {fRm[Number(fSelId)]&&(
                    <button className="ah-btn ah-btn-danger" onClick={clearFifaResult}>↩️ Clear</button>
                  )}
                </div>
              </>}
            </Section>
          </div>

          {/* Match Controls */}
          <div className="ah-card">
            <Section title="🔒 Match Lock / Unlock">
              <Row label="Match ID">
                <input id="fLockId" type="number" placeholder="e.g. 12" className="ah-input" style={{maxWidth:100}}/>
                <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={()=>{
                  const id=Number(document.getElementById("fLockId").value); if(!id) return;
                  toggleFifaLock(id);
                }}>Toggle</button>
              </Row>
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                {Object.entries(fLocked).filter(([k])=>!isNaN(k)).map(([id,st])=>(
                  <div key={id} className="ah-lock-row">
                    <span style={{fontWeight:700,color:"#64748b",minWidth:30}}>M{id}</span>
                    <Badge label={st==="locked"?"🔒 Locked":"🔓 Unlocked"} color={st==="locked"?"#991b1b":"#15803d"} bg={st==="locked"?"#fef2f2":"#f0fdf4"}/>
                    <button className="ah-btn ah-btn-danger ah-btn-sm" style={{marginLeft:"auto"}} onClick={()=>toggleFifaLock(Number(id))}>Toggle</button>
                  </div>
                ))}
              </div>
            </Section>

            <div className="ah-divider"/>
            <Section title="⚡ Double Header">
              <Row label="Match ID">
                <input type="number" placeholder="Match ID (blank = none)" className="ah-input" style={{maxWidth:130}} id="fDblInput" defaultValue={fDbl??""}/>
                <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={()=>{
                  const v=document.getElementById("fDblInput").value;
                  const n=v===""?null:Number(v);
                  setFDbl(n); FIFA_DB.set("doublematch",n);
                  toast2(n!=null?`⚡ Double: M${n}`:"Double removed");
                }}>Set</button>
                {fDbl!=null&&<Badge label={`⚡ M${fDbl} is double`} color="#d97706" bg="#fffbeb"/>}
              </Row>
            </Section>
          </div>

          {/* Season Awards */}
          <div className="ah-card">
            <Section title="🏆 Season Awards">
              <Row label="🏆 Champion">
                <select value={fSw} onChange={e=>setFSw(e.target.value)} className="ah-select" style={{flex:1}}>
                  <option value="">— Select —</option>
                  {FIFA_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </Row>
              <Row label="🪵 Wooden Spoon">
                <select value={fWs} onChange={e=>setFWs(e.target.value)} className="ah-select" style={{flex:1}}>
                  <option value="">— Select —</option>
                  {FIFA_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </Row>
              <Row label="👟 Golden Boot">
                <input value={fGb} onChange={e=>setFGb(e.target.value)} placeholder="Player name" className="ah-input" style={{flex:1}}/>
              </Row>
              <Row label="🏅 Golden Ball">
                <input value={fGball} onChange={e=>setFGball(e.target.value)} placeholder="Player name" className="ah-input" style={{flex:1}}/>
              </Row>
              <div style={{marginBottom:8}}>
                <p style={{fontSize:11,color:"#64748b",margin:"0 0 6px"}}>🏅 Top 4 ({fAt4.length}/4)</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:140,overflowY:"auto"}}>
                  {FIFA_TEAMS.map(t=>{
                    const on=fAt4.includes(t);
                    return(
                      <button key={t} onClick={()=>{
                        let upd; if(on) upd=fAt4.filter(x=>x!==t);
                        else if(fAt4.length<4) upd=[...fAt4,t];
                        else{toast2("Max 4","error");return;}
                        setFAt4(upd);
                      }}
                      style={{padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",
                        background:on?"#004B87":"#f1f5f9",color:on?"#fff":"#475569",border:"none",marginBottom:4}}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button className="ah-btn ah-btn-primary" onClick={saveFifaAwards}>💾 Save All Awards</button>
            </Section>
          </div>

          {/* Points Override */}
          <div className="ah-card">
            <Section title="🎯 Points Override">
              <Row label="Email">
                <input value={fPtsEmail} onChange={e=>setFPtsEmail(e.target.value)} placeholder="player@email.com" className="ah-input" style={{flex:1}}/>
              </Row>
              <Row label="Points">
                <input type="number" value={fPtsVal} onChange={e=>setFPtsVal(e.target.value)} placeholder="e.g. 50 or -20" className="ah-input" style={{flex:1}}/>
                <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={saveFifaPtsOverride}>Save</button>
              </Row>
              {Object.entries(fPtsOvr).length>0&&(
                <div style={{marginTop:8}}>
                  {Object.entries(fPtsOvr).map(([emk,pts])=>(
                    <div key={emk} className="ah-lock-row">
                      <span style={{flex:1,fontSize:12}}>{emk}</span>
                      <Badge label={`${pts>0?"+":""}${pts} pts`} color={pts>=0?"#15803d":"#dc2626"} bg={pts>=0?"#f0fdf4":"#fef2f2"}/>
                      <button className="ah-btn ah-btn-danger ah-btn-sm" onClick={async()=>{
                        const upd={...fPtsOvr}; delete upd[emk]; setFPtsOvr(upd); await FIFA_DB.set("ptsadj",upd); toast2("Removed","error");
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* FIFA Danger Zone */}
          <div className="ah-card-danger">
            <Section title="⚠️ Danger Zone — Reset Options" danger>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {label:"Clear All Results",what:"results",icon:"📋"},
                  {label:"Clear All Picks",what:"picks",icon:"🗳️"},
                  {label:"Clear Season Picks",what:"seasonpicks",icon:"🏆"},
                  {label:"Clear Bonus Answers",what:"bonus",icon:"🎁"},
                ].map(({label,what,icon})=>(
                  <button key={what} className="ah-btn ah-btn-danger" onClick={()=>resetFifaAll(what)}
                    style={{textAlign:"left",padding:"8px 12px"}}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            </Section>
          </div>
          </>}
        </>}

        {/* ══════════════ SYSTEM TAB ═════════════════════ */}
        {!loading&&tab==="system"&&<>
          <div className="ah-card">
            <Section title="🔧 Maintenance Mode">
              {[
                ...CRICKET_TOURNAMENTS.map(t=>({
                  id:t.id, name:t.name, db:createDB(t.dbPrefix), color:"#1D428A",
                })),
                {id:"fifa2026",name:"FIFA World Cup 2026",db:FIFA_DB,color:"#004B87"},
              ].map(t=>(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,
                  padding:"10px 14px",background:"#f8faff",borderRadius:10,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",
                    background:maintenance[t.id]?"#dc2626":"#22c55e"}}/>
                  <p style={{flex:1,margin:0,fontWeight:600,fontSize:13}}>{t.name}</p>
                  <Badge label={maintenance[t.id]?"🔒 Locked":"🟢 Live"} color={maintenance[t.id]?"#991b1b":"#15803d"} bg={maintenance[t.id]?"#fef2f2":"#f0fdf4"}/>
                  <button className={`ah-btn ah-btn-sm ${maintenance[t.id]?"ah-btn-success":"ah-btn-danger"}`}
                    onClick={()=>toggleMaintenance(t.id,t.db,t.name)}>
                    {maintenance[t.id]?"Go Live":"Lock"}
                  </button>
                </div>
              ))}
            </Section>
          </div>

          <div className="ah-card">
            <Section title="🏁 Tournament Lifecycle">
              {[
                ...CRICKET_TOURNAMENTS.map(t=>({
                  id:t.id, name:t.name, sport:"Cricket", db:createDB(t.dbPrefix),
                  done:stats[t.id]?.done, total:stats[t.id]?.total, picks:stats[t.id]?.picks,
                })),
                {id:"fifa2026",name:"FIFA World Cup 2026",sport:"Football",db:FIFA_DB,
                  done:stats.fifa2026?.done,total:104,picks:stats.fifa2026?.picks},
              ].map(t=>{
                const isFinished=statuses[t.id]==="finished";
                return(
                  <div key={t.id} style={{border:"1px solid #e8edf5",borderRadius:12,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{flex:1}}>
                        <p style={{fontWeight:700,fontSize:14,margin:0}}>{t.name}</p>
                        <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{t.sport}</p>
                      </div>
                      <Badge label={isFinished?"🏁 Finished":"🟢 Active"} color={isFinished?"#7c3aed":"#15803d"} bg={isFinished?"#f5f3ff":"#f0fdf4"}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
                      <div className="ah-stat"><p>{t.done||0}/{t.total||"?"}</p><p>Done</p></div>
                      <div className="ah-stat"><p>{userList.length}</p><p>Players</p></div>
                      <div className="ah-stat"><p>{t.picks||0}</p><p>Picks</p></div>
                    </div>
                    {isFinished
                      ?<button className="ah-btn ah-btn-warning" style={{width:"100%"}} onClick={()=>reopenTournament(t.id,t.db,t.name)}>↩️ Reopen</button>
                      :<button className="ah-btn ah-btn-danger" style={{width:"100%"}} onClick={()=>closeTournament(t.id,t.db,t.name)}>🏁 Close Tournament (Freeze Data)</button>
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
