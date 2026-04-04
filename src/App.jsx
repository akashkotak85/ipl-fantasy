import * as React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const LOGOS={IPL:"https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",RCB:"https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",SRH:"https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",MI:"https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",KKR:"https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",CSK:"https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",RR:"https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",PBKS:"https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",GT:"https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",LSG:"https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",DC:"https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png"};
const TC={RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"}};
const TF={RCB:"Royal Challengers Bengaluru",SRH:"Sunrisers Hyderabad",MI:"Mumbai Indians",KKR:"Kolkata Knight Riders",CSK:"Chennai Super Kings",RR:"Rajasthan Royals",PBKS:"Punjab Kings",GT:"Gujarat Titans",LSG:"Lucknow Super Giants",DC:"Delhi Capitals"};
const TEAMS=Object.keys(TF);
const SQ={RCB:["Rajat Patidar","Virat Kohli","Devdutt Padikkal","Phil Salt","Jitesh Sharma","Krunal Pandya","Tim David","Venkatesh Iyer","Jacob Bethell","Josh Hazlewood","Bhuvneshwar Kumar","Yash Dayal","Rasikh Dar","Jacob Duffy"],SRH:["Pat Cummins","Travis Head","Ishan Kishan","Heinrich Klaasen","Abhishek Sharma","Nitish Kumar Reddy","Liam Livingstone","Harshal Patel","Brydon Carse","Jaydev Unadkat","Shivam Mavi","David Payne"],MI:["Rohit Sharma","Hardik Pandya","Suryakumar Yadav","Jasprit Bumrah","Trent Boult","Tilak Varma","Ryan Rickelton","Quinton de Kock","Deepak Chahar","Shardul Thakur","Mitchell Santner","Will Jacks"],KKR:["Ajinkya Rahane","Sunil Narine","Rinku Singh","Cameron Green","Rachin Ravindra","Finn Allen","Varun Chakaravarthy","Matheesha Pathirana","Blessing Muzarabani","Rovman Powell","Vaibhav Arora"],CSK:["Ruturaj Gaikwad","MS Dhoni","Sanju Samson","Shivam Dube","Ayush Mhatre","Dewald Brevis","Khaleel Ahmed","Noor Ahmad","Anshul Kamboj","Prashant Veer","Kartik Sharma","Akeal Hosein"],RR:["Riyan Parag","Yashasvi Jaiswal","Vaibhav Suryavanshi","Jofra Archer","Ravindra Jadeja","Dhruv Jurel","Shimron Hetmyer","Ravi Bishnoi","Sandeep Sharma","Adam Milne","Nandre Burger"],PBKS:["Shreyas Iyer","Arshdeep Singh","Shashank Singh","Marcus Stoinis","Prabhsimran Singh","Marco Jansen","Yuzvendra Chahal","Priyansh Arya","Musheer Khan","Lockie Ferguson","Xavier Bartlett"],GT:["Shubman Gill","Jos Buttler","Rashid Khan","Kagiso Rabada","Mohammed Siraj","Sai Sudharsan","Washington Sundar","Prasidh Krishna","Rahul Tewatia","Jayant Yadav","Jason Holder"],LSG:["Rishabh Pant","Mitchell Marsh","Nicholas Pooran","Aiden Markram","Mohammad Shami","Avesh Khan","Wanindu Hasaranga","Mayank Yadav","Anrich Nortje","Abdul Samad","Ayush Badoni"],DC:["Axar Patel","KL Rahul","Kuldeep Yadav","Mitchell Starc","T. Natarajan","Karun Nair","Prithvi Shaw","Abishek Porel","Sameer Rizvi","David Miller","Tristan Stubbs","Nitish Rana"]};

/* confirmed results M1–M7 only; today's matches entered via Admin */
const KNOWN_RESULTS={
  1:{toss:"SRH",win:"RCB",motm:"Phil Salt"},
  2:{toss:"MI",win:"MI",motm:"Suryakumar Yadav"},
  3:{toss:"CSK",win:"CSK",motm:"Ruturaj Gaikwad"},
  4:{toss:"GT",win:"PBKS",motm:"Priyansh Arya"},
  5:{toss:"DC",win:"LSG",motm:"Rishabh Pant"},
  6:{toss:"SRH",win:"SRH",motm:"Travis Head"},
  7:{toss:"PBKS",win:"CSK",motm:"Ayush Mhatre"},
};

const BASE_MATCHES=[
  {id:1,mn:"M1",home:"RCB",away:"SRH",date:"2026-03-28",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:2,mn:"M2",home:"MI",away:"KKR",date:"2026-03-29",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:3,mn:"M3",home:"CSK",away:"RR",date:"2026-03-30",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:4,mn:"M4",home:"GT",away:"PBKS",date:"2026-03-31",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:5,mn:"M5",home:"LSG",away:"DC",date:"2026-04-01",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:6,mn:"M6",home:"SRH",away:"KKR",date:"2026-04-02",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:7,mn:"M7",home:"PBKS",away:"CSK",date:"2026-04-03",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:8,mn:"M8",home:"DC",away:"MI",date:"2026-04-04",time:"15:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:9,mn:"M9",home:"GT",away:"RR",date:"2026-04-04",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:10,mn:"M10",home:"SRH",away:"LSG",date:"2026-04-05",time:"15:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:11,mn:"M11",home:"RCB",away:"CSK",date:"2026-04-05",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:12,mn:"M12",home:"KKR",away:"PBKS",date:"2026-04-06",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:13,mn:"M13",home:"RR",away:"MI",date:"2026-04-07",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:14,mn:"M14",home:"DC",away:"GT",date:"2026-04-08",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:15,mn:"M15",home:"KKR",away:"LSG",date:"2026-04-09",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:16,mn:"M16",home:"RCB",away:"RR",date:"2026-04-10",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:17,mn:"M17",home:"PBKS",away:"SRH",date:"2026-04-11",time:"15:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:18,mn:"M18",home:"CSK",away:"DC",date:"2026-04-11",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:19,mn:"M19",home:"LSG",away:"GT",date:"2026-04-12",time:"15:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:20,mn:"M20",home:"MI",away:"RCB",date:"2026-04-12",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:21,mn:"M21",home:"SRH",away:"GT",date:"2026-04-13",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:22,mn:"M22",home:"CSK",away:"KKR",date:"2026-04-14",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:23,mn:"M23",home:"RCB",away:"RR",date:"2026-04-15",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:24,mn:"M24",home:"MI",away:"PBKS",date:"2026-04-16",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:25,mn:"M25",home:"LSG",away:"KKR",date:"2026-04-17",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:26,mn:"M26",home:"RR",away:"GT",date:"2026-04-18",time:"15:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:27,mn:"M27",home:"SRH",away:"RCB",date:"2026-04-18",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:28,mn:"M28",home:"KKR",away:"DC",date:"2026-04-19",time:"15:30",venue:"Eden Gardens, Kolkata"},
  {id:29,mn:"M29",home:"PBKS",away:"LSG",date:"2026-04-19",time:"19:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:30,mn:"M30",home:"GT",away:"MI",date:"2026-04-20",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:31,mn:"M31",home:"DC",away:"SRH",date:"2026-04-21",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:32,mn:"M32",home:"RR",away:"LSG",date:"2026-04-22",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:33,mn:"M33",home:"CSK",away:"MI",date:"2026-04-23",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:34,mn:"M34",home:"RCB",away:"GT",date:"2026-04-24",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:35,mn:"M35",home:"DC",away:"PBKS",date:"2026-04-25",time:"15:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:36,mn:"M36",home:"RR",away:"SRH",date:"2026-04-25",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:37,mn:"M37",home:"CSK",away:"GT",date:"2026-04-26",time:"15:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:38,mn:"M38",home:"KKR",away:"LSG",date:"2026-04-26",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:39,mn:"M39",home:"RCB",away:"DC",date:"2026-04-27",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:40,mn:"M40",home:"PBKS",away:"RR",date:"2026-04-28",time:"19:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:41,mn:"M41",home:"MI",away:"LSG",date:"2026-04-29",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:42,mn:"M42",home:"GT",away:"RCB",date:"2026-04-30",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:43,mn:"M43",home:"RR",away:"DC",date:"2026-05-01",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:44,mn:"M44",home:"MI",away:"CSK",date:"2026-05-02",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:45,mn:"M45",home:"KKR",away:"SRH",date:"2026-05-03",time:"15:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:46,mn:"M46",home:"GT",away:"PBKS",date:"2026-05-03",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:47,mn:"M47",home:"MI",away:"KKR",date:"2026-05-04",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:48,mn:"M48",home:"CSK",away:"DC",date:"2026-05-05",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:49,mn:"M49",home:"PBKS",away:"SRH",date:"2026-05-06",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:50,mn:"M50",home:"RCB",away:"LSG",date:"2026-05-07",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:51,mn:"M51",home:"KKR",away:"DC",date:"2026-05-08",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:52,mn:"M52",home:"GT",away:"RR",date:"2026-05-09",time:"15:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:53,mn:"M53",home:"LSG",away:"CSK",date:"2026-05-10",time:"15:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:54,mn:"M54",home:"MI",away:"RCB",date:"2026-05-10",time:"19:30",venue:"SVNS Intl. Stadium, Raipur"},
  {id:55,mn:"M55",home:"SRH",away:"GT",date:"2026-05-11",time:"19:30",venue:"HPCA Stadium, Dharamshala"},
  {id:56,mn:"M56",home:"KKR",away:"RCB",date:"2026-05-12",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:57,mn:"M57",home:"MI",away:"SRH",date:"2026-05-13",time:"19:30",venue:"SVNS Intl. Stadium, Raipur"},
  {id:58,mn:"M58",home:"RCB",away:"MI",date:"2026-05-14",time:"19:30",venue:"HPCA Stadium, Dharamshala"},
  {id:59,mn:"M59",home:"LSG",away:"RR",date:"2026-05-15",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:60,mn:"M60",home:"GT",away:"KKR",date:"2026-05-16",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:61,mn:"M61",home:"RCB",away:"PBKS",date:"2026-05-17",time:"15:30",venue:"HPCA Stadium, Dharamshala"},
  {id:62,mn:"M62",home:"RR",away:"SRH",date:"2026-05-17",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:63,mn:"M63",home:"CSK",away:"LSG",date:"2026-05-18",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:64,mn:"M64",home:"RR",away:"MI",date:"2026-05-19",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:65,mn:"M65",home:"KKR",away:"GT",date:"2026-05-20",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:66,mn:"M66",home:"CSK",away:"MI",date:"2026-05-21",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:67,mn:"M67",home:"LSG",away:"PBKS",date:"2026-05-22",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:68,mn:"M68",home:"RR",away:"DC",date:"2026-05-23",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:69,mn:"M69",home:"CSK",away:"SRH",date:"2026-05-24",time:"15:30",venue:"Eden Gardens, Kolkata"},
  {id:70,mn:"M70",home:"RCB",away:"KKR",date:"2026-05-24",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:71,mn:"Q1",home:"TBD1",away:"TBD2",date:"2026-05-26",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:72,mn:"EL1",home:"TBD3",away:"TBD4",date:"2026-05-27",time:"19:30",venue:"TBD"},
  {id:73,mn:"Q2",home:"TBD",away:"TBD",date:"2026-05-29",time:"19:30",venue:"TBD"},
  {id:74,mn:"Final",home:"TBD",away:"TBD",date:"2026-05-31",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
];

const PTS={toss:10,win:20,motm:30,streak:15,season:200,top4:50};
const EMOJIK=["fire","cry","aim","rage","clap","boom"];
const EMOJIV={fire:"🔥",cry:"😭",aim:"🎯",rage:"😤",clap:"👏",boom:"🤯"};
const SUPER_ADMIN="akashkotak@gmail.com";
const PFX="ipl26_";
const CHAT_MAX=400;
const CHAT_CAP=500;
const REG_LIMIT=20;
const REG_WINDOW=10*60*1000;

/* ─── UTILS ─── */
const encodeEmail=e=>(e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const ek=e=>encodeEmail(e);
const normalizeEmail=e=>(e||"").trim().toLowerCase();
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only encode objects keyed by raw emails (u, ap). Everything else stored as-is.
function deepEncodeKeys(v){
  if(!v||typeof v!=="object"||Array.isArray(v))return v;
  const r={};
  Object.keys(v).forEach(k=>{
    const enc=k.includes("@")?ek(k):k;
    r[enc]=deepEncodeKeys(v[k]);
  });
  return r;
}

// Normalize a map whose keys might be raw emails, encoded emails, or double-encoded
function normalizeKeyMap(raw){
  if(!raw)return{};
  const out={};
  Object.keys(raw).forEach(k=>{
    // already encoded (_at_ present, no @) → use as-is
    // raw email (contains @) → encode
    // ambiguous (contains _dot_ but no _at_) → use as-is (encoded)
    const normalized=(k.includes("@"))?ek(k):k;
    out[normalized]=raw[k];
  });
  return out;
}

function validateEmail(e){if(!e?.trim())return"Email is required";if(!EMAIL_RE.test(e.trim()))return"Enter a valid email";return"";}
function validatePassword(p,mode="login"){if(!p)return"Password is required";if(mode==="register"){if(p.length<8)return"Min 8 characters";if(!/[A-Z]/.test(p))return"Add an uppercase letter";if(!/[0-9]/.test(p))return"Add a number";if(!/[^A-Za-z0-9]/.test(p))return"Add a special character";}return"";}
function validateName(n){if(!n||n.trim().length<2)return"Name must be at least 2 characters";return"";}
function capChat(arr){return arr.length>CHAT_CAP?arr.slice(arr.length-CHAT_CAP):arr;}
async function sha256(str){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");}

/* ─── FIREBASE ─── */
const firebaseConfig={apiKey:"AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",authDomain:"ipl2026-fantasy-20c9b.firebaseapp.com",databaseURL:"https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",projectId:"ipl2026-fantasy-20c9b",storageBucket:"ipl2026-fantasy-20c9b.firebasestorage.app",messagingSenderId:"973930153403",appId:"1:973930153403:web:872ce26072b07e1adf309e"};
const firebaseReady=(async()=>{
  const[app,db]=await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")]);
  const _app=app.getApps().length?app.getApp():app.initializeApp(firebaseConfig);
  return{app:_app,db:db.getDatabase(_app),dbMod:db};
})();

const DB={
  get:async k=>{try{const{db,dbMod}=await firebaseReady;const snap=await dbMod.get(dbMod.ref(db,PFX+k));return snap.exists()?snap.val():null;}catch(e){console.error("DB.get",k,e);return null;}},
  set:async(k,v)=>{
    try{
      const{db,dbMod}=await firebaseReady;
      // Only u and ap have raw-email keys that need encoding. Everything else stored as-is.
      const needsEncode=["u","ap"].includes(k);
      const sv=(needsEncode&&typeof v==="object"&&v!==null&&!Array.isArray(v))?deepEncodeKeys(v):v;
      if(sv===null||sv===undefined)await dbMod.remove(dbMod.ref(db,PFX+k));
      else await dbMod.set(dbMod.ref(db,PFX+k),sv);
    }catch(e){console.error("DB.set",k,e);}
  }
};

/* ─── MATCH HELPERS ─── */
function parseMatchDate(date,time){try{const t=(time||"00:00").trim(),p=t.length===4?"0"+t:t;const d=new Date(date+"T"+p+":00+05:30");return isNaN(d.getTime())?null:d;}catch{return null;}}
const cutoff=m=>{const d=parseMatchDate(m.date,m.time);return d?new Date(d-45*60*1000):new Date(0);};
const isMatchLocked=(m,lm={})=>{
  if(m.result)return true;
  const st=lm[m.id]??lm[String(m.id)];
  if(st==="unlocked")return false;
  if(st==="locked")return true;
  return new Date()>=cutoff(m);
};
const isToday=m=>m.date===new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});
const isTBD=m=>(m.home||"").startsWith("TBD")||(m.away||"").startsWith("TBD");
const motmMatch=(a,b)=>{if(!a||!b)return false;const n=s=>s.trim().toLowerCase();const na=n(a),nb=n(b);return na===nb||na.endsWith(" "+nb)||nb.endsWith(" "+na)||na.includes(nb)||nb.includes(na);};

function resolvePlayoffSlots(base,br){
  if(!br)return base;
  return base.map(m=>{
    let{home,away}={...m};
    if(m.mn==="Q1"&&br.q1?.length===2){[home,away]=[br.q1[0],br.q1[1]];}
    if(m.mn==="EL1"&&br.el?.length===2){[home,away]=[br.el[0],br.el[1]];}
    if(m.mn==="Q2"&&br.q2?.length===2){[home,away]=[br.q2[0],br.q2[1]];}
    if(m.mn==="Final"&&br.final?.length===2){[home,away]=[br.final[0],br.final[1]];}
    return{...m,home,away};
  });
}

/* ─── SCORING ─── */
function calcScore(uPicks,ms,dbl=null){
  let pts=0,ok=0,tot=0,ms2={};
  ms.forEach(m=>{
    if(!m.result)return;
    const p=uPicks[m.id]??uPicks[String(m.id)];
    if(!p)return;
    const mult=(dbl!=null&&Number(dbl)===Number(m.id))?2:1;
    tot++;let base=0,h=0;
    if(p.toss===m.result.toss){base+=PTS.toss;h++;}
    if(p.win===m.result.win){base+=PTS.win;h++;}
    if(motmMatch(p.motm,m.result.motm)){base+=PTS.motm;h++;}
    if(h===3)base+=PTS.streak;
    const mp=base*mult;if(h>0)ok++;pts+=mp;ms2[m.id]={pts:mp,h,perf:h===3};
  });
  const played=ms.filter(m=>m.result&&(uPicks[m.id]??uPicks[String(m.id)]));
  const last=played[played.length-1];
  return{pts,acc:tot?Math.round(ok/tot*100):0,ms2,hot:!!(last&&ms2[last.id]?.perf)};
}

function calcBadges(uPicks,ms,allP){
  const b=[];const{ms2}=calcScore(uPicks,ms);const done=ms.filter(m=>m.result);
  const perf=done.filter(m=>ms2[m.id]?.perf).length;
  if(perf>=1)b.push({id:"p1",ic:"🎯",lb:"Perfect Match"});
  if(perf>=3)b.push({id:"p3",ic:"🏅",lb:"Hat-Trick Hero"});
  let ud=0;
  done.forEach(m=>{
    const p=uPicks[m.id]??uPicks[String(m.id)];
    if(!p||p.win!==m.result.win)return;
    const allArr=Object.values(allP);const t2=allArr.filter(u=>u[m.id]||u[String(m.id)]).length||1;
    if(allArr.filter(u=>(u[m.id]??u[String(m.id)])?.win===m.result.win).length/t2<0.5)ud++;
  });
  if(ud>=1)b.push({id:"ud",ic:"🐉",lb:"Underdog King"});
  if(done.filter(m=>ms2[m.id]?.h>=2).length>=3)b.push({id:"con",ic:"💪",lb:"Consistent"});
  if(Object.keys(uPicks).length>=10)b.push({id:"act",ic:"⚡",lb:"Active Predictor"});
  return b;
}

/* ─── CSS ─── */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#F4F6FB;}
.app{font-family:'Barlow',sans-serif;background:#F4F6FB;min-height:100vh;color:#1a2540;max-width:430px;margin:0 auto;}
.C{font-family:'Barlow Condensed',sans-serif;}
.inp{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1px solid #e2e8f0;color:#1a2540;font-size:14px;font-family:'Barlow',sans-serif;outline:none;transition:border .2s;}
.inp:focus{border-color:#1D428A;box-shadow:0 0 0 3px rgba(29,66,138,.08);}
.inp.err{border-color:#ef4444;background:#fef2f2;}
.sel{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1px solid #e2e8f0;color:#1a2540;font-size:14px;font-family:'Barlow',sans-serif;outline:none;cursor:pointer;}
.pbtn{width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;}
.pbtn:disabled{opacity:.45;cursor:default;}
.lbtn{width:100%;padding:13px;border-radius:10px;background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;letter-spacing:1.5px;text-transform:uppercase;border:none;cursor:pointer;}
.dbtn{width:100%;padding:10px;border-radius:10px;background:#fef2f2;color:#dc2626;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;letter-spacing:1px;text-transform:uppercase;border:1px solid #fecaca;cursor:pointer;}
.tbtn{flex:1;padding:9px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:10px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
.tbtn.on{color:#1D428A;border-bottom:2px solid #1D428A;}
.mcard{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:12px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(29,66,138,.07);}
.mcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1D428A,#4A90D9,#D4AF37);}
.tmbtn{flex:1;padding:12px 6px;border-radius:12px;background:#f8faff;border:1.5px solid #e2e8f0;display:flex;flex-direction:column;align-items:center;gap:7px;cursor:pointer;transition:all .15s;}
.tmbtn.on{border-color:#1D428A;background:#EBF0FA;}
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid #e2e8f0;display:flex;padding:8px 0 10px;z-index:100;box-shadow:0 -4px 16px rgba(29,66,138,.08);}
.ni{flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:2px 0;}
.nl{font-size:9px;font-family:'Barlow',sans-serif;font-weight:600;letter-spacing:.4px;text-transform:uppercase;}
.st{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#1D428A;margin:0 0 10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;}
.cb{max-width:78%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word;}
.cm{background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}
.co{background:#fff;color:#1a2540;border:1px solid #e2e8f0;border-bottom-left-radius:4px;align-self:flex-start;}
.cs{background:#EBF0FA;color:#1D428A;border:1px solid #1D428A20;border-radius:10px;padding:8px 14px;font-size:11px;text-align:center;align-self:center;width:92%;font-weight:600;}
.bd{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;}
.bp{display:inline-flex;align-items:center;gap:4px;background:#EBF0FA;border:1px solid #bfdbfe;border-radius:20px;padding:3px 9px;font-size:11px;color:#1e40af;font-weight:600;margin:3px 3px 0 0;}
.ot{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 6px;border-radius:12px;border:2px solid #e2e8f0;background:#fff;cursor:pointer;width:76px;transition:all .15s;}
.ot.on{border-color:#1D428A;background:#EBF0FA;}
.ac{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:14px;}
.at{flex:1;padding:8px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:9px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
.at.on{color:#1D428A;border-bottom:2px solid #1D428A;}
.ctrl-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9;}
.ctrl-row:last-child{border-bottom:none;}
.tog{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
.tog-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.ferr{color:#ef4444;font-size:11px;margin-top:4px;font-weight:600;}
.rcard{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:12px;position:relative;overflow:hidden;}
.rcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FF822A,#D4AF37,#1D428A);}
.dd-wrap{position:relative;}
.dd-list{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1.5px solid #1D428A;border-radius:12px;max-height:220px;overflow-y:auto;z-index:200;box-shadow:0 8px 24px rgba(29,66,138,.15);}
.dd-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;}
.dd-item:last-child{border-bottom:none;}
.dd-item:hover,.dd-item.sel{background:#EBF0FA;}
.dd-trigger{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1.5px solid #e2e8f0;color:#1a2540;font-size:13px;font-family:'Barlow',sans-serif;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;}
.dd-trigger.open{border-color:#1D428A;}
.charcnt{font-size:10px;color:#94a3b8;text-align:right;margin-top:3px;}
@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fade-in{animation:fadeIn .4s ease forwards;}
.spin{animation:spin .8s linear infinite;}
`;

/* ─── SUB-COMPONENTS ─── */
function TLogo({t,sz=48}){
  const[err,setErr]=useState(false);
  const c=TC[t]||{bg:"#94a3b8",dk:"#fff"};
  if(err||!TC[t])return <span style={{width:sz,height:sz,borderRadius:8,background:c.bg,color:c.dk,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:sz*.34,flexShrink:0}}>{(t||"?").slice(0,3)}</span>;
  return <img src={LOGOS[t]} alt={t} width={sz} height={sz} onError={()=>setErr(true)} style={{objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.25))",maxWidth:sz,maxHeight:sz}}/>;
}
function Av({name,sz=32}){
  const ini=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const c=["#C8102E","#004BA0","#3A225D","#E91E8C","#FF822A","#1B3A6B","#166534"];
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:c[(name||"").charCodeAt(0)%c.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:sz*.38,color:"#fff",flexShrink:0}}>{ini}</div>;
}
function Tst({t}){
  const bg=t.type==="error"?"#fef2f2":t.type==="ok"?"#f0fdf4":"#EBF0FA";
  const cl=t.type==="error"?"#991b1b":t.type==="ok"?"#166534":"#1e40af";
  const br=t.type==="error"?"#fecaca":t.type==="ok"?"#bbf7d0":"#bfdbfe";
  return <div style={{position:"fixed",bottom:86,left:"50%",transform:"translateX(-50%)",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'Barlow',sans-serif",whiteSpace:"nowrap",zIndex:999,maxWidth:"90vw",overflow:"hidden",textOverflow:"ellipsis",background:bg,color:cl,border:"1px solid "+br,boxShadow:"0 8px 32px rgba(29,66,138,.15)"}}>{t.msg}</div>;
}
function Toggle({on,onChange}){return <button className="tog" onClick={()=>onChange(!on)} style={{background:on?"#1D428A":"#e2e8f0"}}><div className="tog-knob" style={{left:on?"23px":"3px"}}/></button>;}
function useCd(ts){
  const[tl,sT]=useState("");
  useEffect(()=>{
    const tick=()=>{const d=ts-Date.now();if(d<=0){sT("NOW");return;}const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);sT(h>0?h+"h "+m+"m":m>0?m+"m "+s+"s":s+"s");};
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[ts]);
  return tl;
}
function SBar({lbl,tA,tB,cA,cB,clA,clB}){
  const tot=cA+cB||1,pA=Math.round(cA/tot*100);
  return <div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:10,color:"#94a3b8"}}>{cA+cB} picks</span></div>
    <div style={{display:"flex",gap:4,alignItems:"center"}}>
      <span style={{fontSize:11,fontWeight:700,color:"#1a2540",minWidth:28,textAlign:"right"}}>{pA}%</span>
      <div style={{flex:1,height:7,borderRadius:4,overflow:"hidden",display:"flex"}}><div style={{width:pA+"%",background:clA,transition:"width .6s"}}/><div style={{flex:1,background:clB}}/></div>
      <span style={{fontSize:11,fontWeight:700,color:"#1a2540",minWidth:28}}>{100-pA}%</span>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}><span style={{fontSize:10,color:"#94a3b8"}}>{tA}</span><span style={{fontSize:10,color:"#94a3b8"}}>{tB}</span></div>
  </div>;
}
function PotmDropdown({homeTeam,awayTeam,value,onChange}){
  const[open,setOpen]=useState(false);const ref=useRef();
  const players=[...(SQ[homeTeam]||[]).map(p=>({p,t:homeTeam})),...(SQ[awayTeam]||[]).map(p=>({p,t:awayTeam}))];
  useEffect(()=>{
    const close=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",close);document.addEventListener("touchstart",close,{passive:true});
    return()=>{document.removeEventListener("mousedown",close);document.removeEventListener("touchstart",close);};
  },[]);
  return <div className="dd-wrap" ref={ref}>
    <button type="button" className={"dd-trigger"+(open?" open":"")} onClick={()=>setOpen(o=>!o)}>
      <span style={{color:value?"#1D428A":"#94a3b8",fontWeight:value?700:400}}>{value||"Select Player of the Match…"}</span>
      <span style={{fontSize:12,color:"#94a3b8"}}>{open?"▲":"▼"}</span>
    </button>
    {open&&<div className="dd-list">{players.map(({p,t})=>{const c=TC[t]||{bg:"#333",dk:"#fff"};return <div key={p} className={"dd-item"+(value===p?" sel":"")} onMouseDown={e=>{e.preventDefault();onChange(p);setOpen(false);}}><div style={{width:8,height:8,borderRadius:"50%",background:c.bg,flexShrink:0}}/><TLogo t={t} sz={18}/><span style={{flex:1,fontSize:13,color:value===p?"#1D428A":"#475569",fontWeight:value===p?600:400}}>{p}</span><span style={{background:c.bg,color:c.dk||"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,flexShrink:0}}>{t}</span></div>;})}
    </div>}
  </div>;
}

/* ─── MATCH CARD ─── */
function MCard({m,pred,myPicks,allPicks,rxns,reminders,doubleMatch,lockedMatches,matchPtsOverride,email,onPredict,onReminder,onReact}){
  const lk=isMatchLocked(m,lockedMatches);
  const mp=myPicks[m.id]??myPicks[String(m.id)];
  const ct=cutoff(m);
  const cStr=ct.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
  const cd=useCd(ct.getTime());
  const mr=rxns[m.id]||{};
  const hc=TC[m.home]||{bg:"#333"},ac=TC[m.away]||{bg:"#555"};
  const on=!!reminders?.[m.id];
  const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);
  const mult=isDouble?2:1;
  const mOv=((matchPtsOverride[email]||{})[m.id])??((matchPtsOverride[email]||{})[String(m.id)])??0;
  let earned=0;
  if(m.result&&mp){let base=0;if(mp.toss===m.result.toss)base+=PTS.toss;if(mp.win===m.result.win)base+=PTS.win;if(motmMatch(mp.motm,m.result.motm))base+=PTS.motm;if(mp.toss===m.result.toss&&mp.win===m.result.win&&motmMatch(mp.motm,m.result.motm))base+=PTS.streak;earned=base*mult;}
  const allArr=Object.values(allPicks);
  const tot=allArr.filter(u=>u[m.id]||u[String(m.id)]).length;
  const sp=lk&&tot>0?{tot,tA:allArr.filter(u=>(u[m.id]??u[String(m.id)])?.toss===m.home).length,tB:tot-allArr.filter(u=>(u[m.id]??u[String(m.id)])?.toss===m.home).length,wA:allArr.filter(u=>(u[m.id]??u[String(m.id)])?.win===m.home).length,wB:tot-allArr.filter(u=>(u[m.id]??u[String(m.id)])?.win===m.home).length}:null;
  return <div className="mcard fade-in">
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg,"+hc.bg+"10,transparent 50%,"+ac.bg+"10)",pointerEvents:"none",borderRadius:14}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {isDouble&&<span style={{background:"linear-gradient(135deg,#FF822A,#D4AF37)",color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:800}}>⚡ 2×</span>}
        {!lk&&!m.result&&onReminder&&<button onClick={()=>onReminder(m.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,padding:0}}>{on?"🔔":"🔕"}</button>}
        {m.result?<span style={{background:"#dbeafe",color:"#1e40af",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Done</span>:lk?<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Locked</span>:<span style={{background:"#dcfce7",color:"#166534",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Open till {cStr}</span>}
      </div>
    </div>
    {!lk&&!m.result&&<div style={{textAlign:"center",marginBottom:8}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#d97706"}}>Closes in {cd}</span></div>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"4px 0 10px"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1}}><TLogo t={m.home} sz={48}/><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home}</p><p style={{color:"#64748b",fontSize:9,textAlign:"center",margin:0}}>{TF[m.home]||""}</p></div>
      <p className="C" style={{color:"#cbd5e1",fontSize:18,fontWeight:800,letterSpacing:2,margin:"0 6px"}}>VS</p>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:1}}><TLogo t={m.away} sz={48}/><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.away}</p><p style={{color:"#64748b",fontSize:9,textAlign:"center",margin:0}}>{TF[m.away]||""}</p></div>
    </div>
    <p style={{color:"#94a3b8",fontSize:11,borderTop:"1px solid #f1f5f9",paddingTop:8,marginBottom:10}}>📍 {m.venue}</p>
    {m.result&&<div style={{background:"#F4F6FB",borderRadius:8,padding:"8px 12px",fontSize:12,marginBottom:8}}>
      <span style={{color:"#64748b"}}>Toss: </span><b>{m.result.toss}</b><span style={{color:"#94a3b8",margin:"0 6px"}}>·</span><span style={{color:"#64748b"}}>Win: </span><b style={{color:"#15803d"}}>{m.result.win}</b><span style={{color:"#94a3b8",margin:"0 6px"}}>·</span><span style={{color:"#64748b"}}>POTM: </span><b style={{color:"#B8860B"}}>{m.result.motm}</b>
      {mp&&<span style={{color:earned+mOv>0?"#15803d":"#94a3b8",fontWeight:700,float:"right",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14}}>+{earned+mOv}pts</span>}
    </div>}
    {/* partial toss info (toss saved but match not finalised) */}
    {!m.result&&m.toss&&<div style={{background:"#EBF0FA",borderRadius:8,padding:"6px 12px",fontSize:12,marginBottom:8,color:"#1e40af"}}>🪙 Toss: <b>{m.toss}</b> won{m.win?<span> · 🏆 <b>{m.win}</b> won</span>:null}</div>}
    {mp&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"7px 12px",fontSize:12,color:"#15803d",marginBottom:8}}>Locked: {mp.toss} toss · {mp.win} win · POTM: {mp.motm?.split(" ").slice(-1)[0]}</div>}
    {sp&&<div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
      <p style={{color:"#64748b",fontSize:11,fontWeight:600,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:.5}}>Group Split ({sp.tot} picks)</p>
      <SBar lbl="Toss" tA={m.home} tB={m.away} cA={sp.tA} cB={sp.tB} clA={hc.bg} clB={ac.bg}/>
      <SBar lbl="Winner" tA={m.home} tB={m.away} cA={sp.wA} cB={sp.wB} clA={hc.bg} clB={ac.bg}/>
    </div>}
    {m.result&&<div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:4,display:"flex",gap:6,flexWrap:"wrap"}}>
      {EMOJIK.map(k=>{const cnt=(mr[k]||[]).length,mine=(mr[k]||[]).includes(email);return <button key={k} onClick={()=>onReact(m.id,k)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,border:"1px solid "+(mine?"#1D428A":"#e2e8f0"),background:mine?"#EBF0FA":"#f8faff",cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif",fontWeight:mine?700:400,color:mine?"#1D428A":"#475569"}}>{EMOJIV[k]}{cnt>0&&<span style={{fontSize:11,fontWeight:700}}>{cnt}</span>}</button>;})}
    </div>}
    {pred&&!lk&&!mp&&<button className="pbtn" style={{marginTop:10}} onClick={()=>onPredict(m)}>Make Prediction</button>}
    {pred&&!lk&&mp&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#94a3b8",marginTop:4}}>✅ Locked — no changes allowed</div>}
    {pred&&lk&&!mp&&!m.result&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#991b1b",marginTop:4}}>🔒 Prediction window closed</div>}
  </div>;
}

/* ═══════════════════════ MAIN APP ═══════════════════════ */
export default function App(){
  /* AUTH */
  const[authMode,setAuthMode]=useState("login");
  const[authEmail,setAuthEmail]=useState("");const[authPw,setAuthPw]=useState("");const[authPw2,setAuthPw2]=useState("");const[authName,setAuthName]=useState("");
  const[authErrors,setAuthErrors]=useState({});const[authLoading,setAuthLoading]=useState(false);
  const[showPw,setShowPw]=useState(false);const[showPw2,setShowPw2]=useState(false);
  const[forgotStep,setForgotStep]=useState(1);const[forgotNewPw,setForgotNewPw]=useState("");const[forgotNewPw2,setForgotNewPw2]=useState("");
  const[showForgotPw,setShowForgotPw]=useState(false);const[showForgotPw2,setShowForgotPw2]=useState(false);
  const regAttempts=useRef([]);

  /* APP */
  const[sc,setSc]=useState("splash");
  const[email,setEmail]=useState("");const[user,setUser]=useState(null);const[isAdmin,setIsAdmin]=useState(false);
  const[users,setUsers]=useState({});const[myPicks,setMyPicks]=useState({});const[allPicks,setAllPicks]=useState({});

  const buildBaseMatches=useCallback(()=>BASE_MATCHES.map(m=>{const r=KNOWN_RESULTS[m.id];return r?{...m,result:r,status:"completed"}:{...m,result:null};}),[]);
  const[ms,setMs]=useState(()=>buildBaseMatches());

  const[spk,setSpk]=useState({});const[mySp,setMySp]=useState("");
  const[t4pk,setT4pk]=useState({});const[myT4,setMyT4]=useState([]);
  const[sw,setSw]=useState(null);
  const[bc,setBc]=useState([]);const[pinnedBc,setPinnedBc]=useState(null);
  const[chat,setChat]=useState([]);const[chatIn,setChatIn]=useState("");const[chatU,setChatU]=useState(0);
  const[onlineUsers,setOnlineUsers]=useState({});
  const[htab,setHtab]=useState("today");
  const[am,setAm]=useState(null);const[draft,setDraft]=useState({});
  const[admTab,setAdmTab]=useState("results");
  const[bcMsg,setBcMsg]=useState("");
  const[exU,setExU]=useState(null);const[anM,setAnM]=useState(null);
  const[rxns,setRxns]=useState({});
  const[obStep,setObStep]=useState(0);const[obSp,setObSp]=useState("");const[obT4,setObT4]=useState([]);
  const[toast,setToast]=useState(null);
  const[bracket,setBracket]=useState(null);
  const[maintenance,setMaintenance]=useState(false);
  const[manualPtsAdj,setManualPtsAdj]=useState({});
  const[lockedMatches,setLockedMatches]=useState({});
  const[manMatchForm,setManMatchForm]=useState({mn:"",home:"RCB",away:"MI",date:"",time:"19:30",venue:""});
  const[admResultForm,setAdmResultForm]=useState({});
  const[userSearch,setUserSearch]=useState("");
  const[doubleMatch,setDoubleMatch]=useState(null);
  const[chatMuted,setChatMuted]=useState(false);const[mutedUsers,setMutedUsers]=useState({});
  const[matchPtsOverride,setMatchPtsOverride]=useState({});
  const[sessionEmail,setSessionEmail]=useState(null);
  const[chatSeenTs,setChatSeenTs]=useState(()=>Date.now());
  const[bcSeenTs,setBcSeenTs]=useState(0);

  const tRef=useRef();const chatRef=useRef();const pollRef=useRef(null);const remTimers=useRef({});
  const toast2=useCallback((msg,type="info")=>{setToast({msg,type});clearTimeout(tRef.current);tRef.current=setTimeout(()=>setToast(null),3500);},[]);
  const myEk=useMemo(()=>ek(email),[email]);

  /* ONLINE PRESENCE */
  useEffect(()=>{
    if(!email||!user)return;
    const ping=async()=>{const now=Date.now();const ou=await DB.get("online")||{};ou[ek(email)]={name:user.name,ts:now};Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});await DB.set("online",ou);setOnlineUsers({...ou});};
    ping();const id=setInterval(ping,30000);return()=>clearInterval(id);
  },[email,user]);
  useEffect(()=>{
    if(!user)return;
    const id=setInterval(async()=>{const ou=await DB.get("online")||{};const now=Date.now();Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});setOnlineUsers({...ou});},15000);
    return()=>clearInterval(id);
  },[user]);

  /* RELOAD SHARED DATA */
  const reloadShared=useCallback(async(em)=>{
    const emk=ek(em);
    const[ap,u,rm,b,cm,sp,sw2,t4,rx,rms,br,mn,mnt,pts,lk,pbc,dm,cm2,mu,mpo]=await Promise.all([
      DB.get("ap"),DB.get("u"),DB.get("rm"),DB.get("bc"),DB.get("ch"),
      DB.get("sp"),DB.get("sw"),DB.get("t4"),DB.get("rx"),DB.get("rms"),
      DB.get("bracket"),DB.get("manmatches"),DB.get("maintenance"),DB.get("ptsadj"),DB.get("lockedm"),
      DB.get("pinnedbc"),DB.get("doublematch"),DB.get("chatmuted"),DB.get("mutedusers"),DB.get("matchptsoverride")
    ]);
    if(u&&Object.keys(u).length>0)setUsers(u);

    /* normalize allPicks — always encoded keys */
    const rawAP=ap||{};const freshAP={};
    Object.keys(rawAP).forEach(k=>{freshAP[k.includes("@")?ek(k):k]=rawAP[k];});
    setAllPicks(freshAP);
    if(em)setMyPicks(freshAP[emk]||{});

    /* build match list */
    let allMs=buildBaseMatches();
    if(rm)allMs=allMs.map(m=>{const r=rm[m.id]??rm[String(m.id)];return r?{...m,...r}:m;});
    if(br){setBracket(br);allMs=resolvePlayoffSlots(allMs,br);}else setBracket(null);
    const extraMs=(mn||[]).map(m=>{const mid=Number(m.id)||m.id;const r=rm&&(rm[mid]??rm[String(mid)]);return r?{...m,id:mid,...r}:{...m,id:mid};});
    setMs([...allMs,...extraMs]);

    if(b)setBc(b);if(cm)setChat(cm);

    /* FIX: normalize sp and t4 keys — repair any legacy double-encoded data */
    if(sp){const nsp=normalizeKeyMap(sp);setSpk(nsp);if(em)setMySp(nsp[emk]||"");}
    if(sw2!=null)setSw(sw2);
    if(t4){const nt4=normalizeKeyMap(t4);setT4pk(nt4);if(em)setMyT4(nt4[emk]||[]);}

    if(rx)setRxns(rx);if(rms)setReminders(rms);
    if(mnt!=null)setMaintenance(!!mnt);if(pts)setManualPtsAdj(pts);if(lk)setLockedMatches(lk);
    setPinnedBc(pbc||null);
    if(dm!=null)setDoubleMatch(dm);if(cm2!=null)setChatMuted(!!cm2);
    if(mu)setMutedUsers(mu);if(mpo)setMatchPtsOverride(mpo);
    return freshAP;
  },[buildBaseMatches]);

  /* STARTUP — always show login */
  useEffect(()=>{const t=setTimeout(()=>setSc("login"),800);return()=>clearTimeout(t);},[]);

  /* RELOAD ON SCREEN CHANGE */
  useEffect(()=>{if(["home","picks","lb","wof","adm","hist"].includes(sc)&&email)reloadShared(email);},[sc]);// eslint-disable-line

  /* REMINDER TIMERS */
  const[reminders,setReminders]=useState({});
  useEffect(()=>{
    Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));remTimers.current={};
    Object.keys(reminders).forEach(mid=>{
      if(!reminders[mid])return;const m=ms.find(x=>x.id===parseInt(mid)||x.id===mid);if(!m)return;
      const diff=cutoff(m).getTime()-30*60*1000-Date.now();
      if(diff>0&&diff<24*60*60*1000)remTimers.current[mid]=setTimeout(()=>toast2("⏰ "+m.home+" vs "+m.away+" locks in 30 mins!"),diff);
    });
    return()=>Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));
  },[reminders,ms,toast2]);

  /* CHAT POLL */
  useEffect(()=>{
    if(sc==="chat"){
      setChatU(0);setChatSeenTs(Date.now());
      const poll=async()=>{const[c,u2,ou]=await Promise.all([DB.get("ch"),DB.get("u"),DB.get("online")]);if(c)setChat(c);if(u2)setUsers(u2);if(ou){const now=Date.now();Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});setOnlineUsers({...ou});}};
      poll();if(pollRef.current)clearInterval(pollRef.current);pollRef.current=setInterval(poll,8000);
    }else{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}}
    return()=>{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}};
  },[sc]);
  useEffect(()=>{if(sc!=="chat")setChatU(chat.filter(m=>m.ts>chatSeenTs).length);},[chat,sc,chatSeenTs]);
  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[chat,sc]);

  /* SESSION — no persistence */
  async function persistSession(em){setSessionEmail(em);}

  /* COMPUTED */
  const done=useMemo(()=>ms.filter(m=>m.result),[ms]);
  const todayMs=useMemo(()=>ms.filter(isToday),[ms]);
  const upMs=useMemo(()=>ms.filter(m=>!m.result&&!isToday(m)&&!isTBD(m)),[ms]);
  const unbc=bc.filter(b=>b.ts>bcSeenTs).length;
  const getManualAdj=useCallback(em=>manualPtsAdj[ek(em)]||manualPtsAdj[em]||0,[manualPtsAdj]);
  const getMatchOverride=useCallback(em=>{const emk=ek(em);return Object.values({...matchPtsOverride[em]||{},...matchPtsOverride[emk]||{}}).reduce((a,b)=>a+b,0);},[matchPtsOverride]);
  const myS=useMemo(()=>calcScore(myPicks,ms,doubleMatch),[myPicks,ms,doubleMatch]);
  const myPts=useMemo(()=>myS.pts+((spk[myEk]&&sw&&spk[myEk]===sw)?PTS.season:0)+((sw&&myT4&&myT4.includes(sw))?PTS.top4:0)+getManualAdj(email)+getMatchOverride(email),[myS,spk,myEk,sw,myT4,getManualAdj,getMatchOverride,email]);

  /* LEADERBOARD — FIX: use encoded key for sp/t4 lookups */
  const lbScores=useMemo(()=>{
    const scores={};
    Object.values(users).forEach(u=>{
      if(!u?.email)return;
      const emk=ek(u.email);
      const up=allPicks[emk]||{};
      const st=calcScore(up,ms,doubleMatch);
      const userSp=spk[emk]||"";
      const userT4=t4pk[emk]||[];
      const sp2=(userSp&&sw&&userSp===sw)?PTS.season:0;
      const t4p=(sw&&userT4.includes(sw))?PTS.top4:0;
      scores[u.email]={pts:st.pts+sp2+t4p+getManualAdj(u.email)+getMatchOverride(u.email),acc:st.acc,hot:st.hot,bgs:calcBadges(up,ms,allPicks),userSp,userT4};
    });
    return scores;
  },[users,allPicks,ms,doubleMatch,spk,sw,t4pk,getManualAdj,getMatchOverride]);

  const getLb=useCallback(()=>Object.values(users).filter(u=>u?.email).map(u=>({...u,...(lbScores[u.email]||{pts:0,acc:0,hot:false,bgs:[],userSp:"",userT4:[]})})).sort((a,b)=>b.pts-a.pts),[users,lbScores]);
  const getWof=useCallback(()=>done.map(m=>{
    const perfs=Object.entries(allPicks).filter(([emk,up])=>{const p=up[m.id]??up[String(m.id)];return p&&m.result&&p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm);})
      .map(([emk])=>{const u=Object.values(users).find(u=>ek(u.email)===emk);return{name:u?.name||emk,email:emk};});
    return{...m,perfs};
  }),[done,allPicks,users]);

  /* AUTH */
  function clearAuthForm(){setAuthEmail("");setAuthPw("");setAuthPw2("");setAuthName("");setAuthErrors({});setShowPw(false);setShowPw2(false);setForgotStep(1);setForgotNewPw("");setForgotNewPw2("");setShowForgotPw(false);setShowForgotPw2(false);}

  async function doLogin(){
    setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};
    const eErr=validateEmail(em);if(eErr)errs.email=eErr;if(!authPw)errs.pw="Password is required";
    if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}
    try{
      const u2=await DB.get("u")||{};const storedHash=await DB.get("pw_"+ek(em));
      const userEntry=u2[em]||u2[ek(em)];
      if(!userEntry||storedHash==null){setAuthErrors({email:"No account found. Please create one."});setAuthLoading(false);return;}
      const inputHash=await sha256(authPw);const match=storedHash===inputHash||storedHash===authPw;
      if(!match){setAuthErrors({pw:"Incorrect password."});setAuthLoading(false);return;}
      if(storedHash===authPw)await DB.set("pw_"+ek(em),inputHash);
      setUsers(u2);await doSignIn(em,userEntry);
    }catch(e){console.error("login",e);setAuthErrors({email:"Something went wrong. Please try again."});}
    setAuthLoading(false);
  }

  async function doRegister(){
    const now=Date.now();regAttempts.current=regAttempts.current.filter(t=>now-t<REG_WINDOW);
    if(regAttempts.current.length>=REG_LIMIT){setAuthErrors({email:"Too many attempts. Try again later."});return;}
    regAttempts.current.push(now);setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};
    const eErr=validateEmail(em);if(eErr)errs.email=eErr;const nErr=validateName(authName);if(nErr)errs.name=nErr;
    const pErr=validatePassword(authPw,"register");if(pErr)errs.pw=pErr;if(authPw!==authPw2)errs.pw2="Passwords do not match";
    if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}
    try{
      const u2=await DB.get("u")||{};if(u2[em]||u2[ek(em)]){setAuthErrors({email:"Account already exists. Please sign in."});setAuthLoading(false);return;}
      const ex={email:em,name:authName.trim(),joined:new Date().toISOString()};
      await DB.set("u",{...u2,[em]:ex});await DB.set("pw_"+ek(em),await sha256(authPw));
      const verify=await DB.get("u")||{};const entry=verify[em]||verify[ek(em)];
      if(!entry){setAuthErrors({email:"Registration failed — please try again."});setAuthLoading(false);return;}
      setUsers(verify);await doSignIn(em,entry,true);
    }catch(err){console.error("register",err);setAuthErrors({email:"Registration failed. Please try again."});}
    setAuthLoading(false);
  }

  async function doForgotStep1(){setAuthLoading(true);const em=normalizeEmail(authEmail);const eErr=validateEmail(em);if(eErr){setAuthErrors({email:eErr});setAuthLoading(false);return;}const u2=await DB.get("u")||{};if(!u2[em]&&!u2[ek(em)]){setAuthErrors({email:"No account found."});setAuthLoading(false);return;}setAuthErrors({});setForgotStep(2);setAuthLoading(false);}
  async function doForgotStep2(){setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const pErr=validatePassword(forgotNewPw,"register");if(pErr)errs.pw=pErr;if(forgotNewPw!==forgotNewPw2)errs.pw2="Passwords do not match";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}await DB.set("pw_"+ek(em),await sha256(forgotNewPw));toast2("Password reset! Please sign in.","ok");const savedEmail=authEmail;clearAuthForm();setAuthMode("login");setAuthEmail(savedEmail);setAuthLoading(false);}

  async function doSignIn(em,ex,isNew=false){
    setMyPicks({});setMySp("");setMyT4([]);setObSp("");setObT4([]);setObStep(0);setAm(null);
    setUser(ex);setEmail(em);setIsAdmin(em===SUPER_ADMIN);await persistSession(em);
    const emk=ek(em);const freshAP=await reloadShared(em);
    setMyPicks(freshAP[emk]||{});setBcSeenTs(Date.now());setChatSeenTs(Date.now());
    if(isNew)setSc("onboard");else{setSc("home");toast2("Welcome back, "+ex.name+"! 👋","ok");}
  }

  async function logout(){
    Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));remTimers.current={};
    if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}clearTimeout(tRef.current);
    if(sessionEmail){try{const ou=await DB.get("online")||{};delete ou[ek(sessionEmail)];await DB.set("online",ou);}catch(e){console.error("logout",e);}}
    setSessionEmail(null);setUser(null);setEmail("");setMyPicks({});setMySp("");setMyT4([]);setIsAdmin(false);setAm(null);
    setAllPicks({});setSpk({});setT4pk({});setOnlineUsers({});setUsers({});setBcSeenTs(0);setChatSeenTs(Date.now());setChatU(0);setToast(null);clearAuthForm();setSc("login");
  }

  /* ONBOARDING */
  async function updateObStep(step,sp,t4){setObStep(step);if(email)await DB.set("ob_"+myEk,{step,sp,t4});}
  async function doneOnboard(){
    if(!obSp){toast2("Pick a champion first","error");return;}if(obT4.length!==4){toast2("Select exactly 4 teams","error");return;}
    /* FIX: pre-encode keys before saving so DB.set doesn't double-encode */
    const sp2={...spk,[myEk]:obSp};const t42={...t4pk,[myEk]:obT4};
    setSpk(sp2);setMySp(obSp);setT4pk(t42);setMyT4(obT4);
    await DB.set("sp",sp2);await DB.set("t4",t42);await DB.set("ob_"+myEk,null);
    setSc("home");toast2("Picks locked! Let the games begin! 🏏","ok");
  }

  /* PICK SUBMISSION */
  async function submitPick(){
    if(!am)return;
    const freshRm=await DB.get("rm")||{};const freshMatch={...am,...(freshRm[am.id]??freshRm[String(am.id)]??{})};
    if(KNOWN_RESULTS[am.id])freshMatch.result=KNOWN_RESULTS[am.id];
    if(isMatchLocked(freshMatch,lockedMatches)){toast2("Match is now locked","error");setAm(null);setSc("home");return;}
    if(!draft.toss||!draft.win){toast2("Pick toss and winner first","error");return;}if(!draft.motm){toast2("Select Player of the Match","error");return;}
    const np={...myPicks,[am.id]:draft};const na={...allPicks,[myEk]:np};
    setMyPicks(np);setAllPicks(na);await DB.set("ap",na);
    toast2("Prediction locked! 🎯","ok");setAm(null);setSc("home");
  }

  /* REACTIONS */
  async function reactFn(mid,key){const mr=rxns[mid]||{},list=mr[key]||[];const upd={...rxns,[mid]:{...mr,[key]:list.includes(email)?list.filter(e=>e!==email):[...list,email]}};setRxns(upd);await DB.set("rx",upd);}

  /* CHAT */
  async function sendChat(){
    if(!chatIn.trim()||!user)return;if(chatMuted){toast2("Chat is muted for everyone","error");return;}if((mutedUsers||{})[myEk]){toast2("You have been muted by admin","error");return;}
    const text=chatIn.trim().slice(0,CHAT_MAX);const latest=await DB.get("ch")||[];
    const nc=capChat([...latest,{id:Date.now(),email:user.email,name:user.name,text,ts:Date.now()}]);
    setChat(nc);setChatIn("");await DB.set("ch",nc);setChatSeenTs(Date.now());
  }
  async function delMsg(id){const latest=await DB.get("ch")||[];const nc=latest.filter(m=>m.id!==id);setChat(nc);await DB.set("ch",nc);}

  /* ADMIN: PARTIAL SAVE */
  async function savePartialResult(mid,field,value){
    const numMid=Number(mid)||mid;
    const rm=(await DB.get("rm"))||{};
    const existing=rm[numMid]||{};
    const updated={...existing,[field]:value};
    rm[numMid]=updated;
    await DB.set("rm",rm);
    setMs(prev=>prev.map(m=>Number(m.id)===Number(mid)?{...m,...updated}:m));
    toast2("Saved ✓","ok");
  }

  /* ADMIN: FINALISE RESULT */
  async function setManualResult(mid){
    const f=admResultForm[mid];
    if(!f?.toss||!f?.win||!f?.motm?.trim()){toast2("Fill all result fields","error");return;}
    const result={toss:f.toss,win:f.win,motm:f.motm.trim()};
    const numMid=Number(mid)||mid;
    const nm=ms.map(m=>Number(m.id)===Number(mid)?{...m,result,status:"completed"}:m);setMs(nm);
    const rm=(await DB.get("rm"))||{};rm[numMid]={result,status:"completed"};await DB.set("rm",rm);
    setAdmResultForm(prev=>{const n={...prev};delete n[mid];return n;});
    const freshAP=await DB.get("ap")||{};const cu=await DB.get("u")||{};
    const perfs=Object.entries(freshAP).filter(([emk,up])=>{const p=up[numMid]??up[String(numMid)];return p&&p.toss===result.toss&&p.win===result.win&&motmMatch(p.motm,result.motm);}).map(([emk])=>{const u=Object.values(cu).find(u=>ek(u.email)===emk);return u?.name||emk;});
    const matchObj=nm.find(x=>Number(x.id)===Number(mid));
    const latest=await DB.get("ch")||[];
    const newCh=capChat([...latest,{id:Date.now(),email:"__sys__",name:"IPL Bot",text:"Result: "+matchObj.home+" vs "+matchObj.away+"\nWinner: "+result.win+" · POTM: "+result.motm+(perfs.length?"\n🎯 Perfect: "+perfs.join(", "):"\nNo perfect picks this match"),ts:Date.now(),sys:true}]);
    setChat(newCh);await DB.set("ch",newCh);toast2("Result saved! ✅","ok");await reloadShared(email);
  }

  async function deleteUser(ue){
    if(!confirm("Delete "+users[ue]?.name+"? Cannot be undone."))return;const uek=ek(ue);
    const nu={...users};delete nu[ue];delete nu[uek];const na={...allPicks};delete na[uek];
    const ns={...spk};delete ns[uek];const nt={...t4pk};delete nt[uek];
    const np={...manualPtsAdj};delete np[uek];const nmpo={...matchPtsOverride};delete nmpo[uek];
    setUsers(nu);setAllPicks(na);setSpk(ns);setT4pk(nt);setManualPtsAdj(np);setMatchPtsOverride(nmpo);
    await Promise.all([DB.set("u",nu),DB.set("ap",na),DB.set("sp",ns),DB.set("t4",nt),DB.set("ptsadj",np),DB.set("pw_"+uek,null),DB.set("matchptsoverride",nmpo)]);
    setExU(null);toast2("User deleted","ok");
  }

  async function sendBc(pin=false){if(!bcMsg.trim())return;const nb=[...bc,{id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"}];setBc(nb);await DB.set("bc",nb);if(pin){setPinnedBc(bcMsg.trim());await DB.set("pinnedbc",bcMsg.trim());}setBcMsg("");toast2(pin?"📌 Pinned!":"Sent!","ok");}
  async function clearPin(){setPinnedBc(null);await DB.set("pinnedbc",null);toast2("Pin cleared");}
  async function addManualMatch(){
    const{mn,home,away,date,time,venue}=manMatchForm;if(!mn||!home||!away||!date||!time){toast2("Fill all fields","error");return;}if(home===away){toast2("Teams must differ","error");return;}
    const pt=time.length===4?"0"+time:time;const existing=await DB.get("manmatches")||[];
    const nm={id:Date.now(),mn:mn.trim(),home,away,date,time:pt,venue:venue||"Custom Venue",result:null,manual:true};
    await DB.set("manmatches",[...existing,nm]);setMs(prev=>[...prev,nm]);
    setManMatchForm({mn:"",home:"RCB",away:"MI",date:"",time:"19:30",venue:""});toast2("Match added!","ok");
  }
  async function toggleMatchLock(mid){const cur=lockedMatches[mid]??lockedMatches[String(mid)];const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";const upd={...lockedMatches};if(next===null)delete upd[mid];else upd[mid]=next;setLockedMatches(upd);await DB.set("lockedm",upd);toast2(next==="locked"?"🔒 Force locked":next==="unlocked"?"🔓 Force unlocked":"↩️ Back to auto");}
  async function adjustPts(em,delta){const emk=ek(em);const cur=manualPtsAdj[emk]||0;const upd={...manualPtsAdj,[emk]:cur+delta};setManualPtsAdj(upd);await DB.set("ptsadj",upd);toast2((delta>0?"+":"")+delta+" pts","ok");}
  async function setMatchPts(em,mid,delta){const emk=ek(em);const cur=((matchPtsOverride[emk]||{})[mid])||0;const upd={...matchPtsOverride,[emk]:{...(matchPtsOverride[emk]||{}),[mid]:cur+delta}};setMatchPtsOverride(upd);await DB.set("matchptsoverride",upd);toast2((delta>0?"+":"")+delta+" pts","ok");}
  async function setSeasonWinner(t){setSw(t);await DB.set("sw",t);toast2("Champion: "+t+" 🏆","ok");}
  async function toggleMaintenance(v){setMaintenance(v);await DB.set("maintenance",v);toast2(v?"🔒 App locked":"✅ App live","ok");}
  async function toggleReminder(mid){const on=!reminders[mid];const upd={...reminders,[mid]:on};setReminders(upd);await DB.set("rms",upd);toast2(on?"🔔 Reminder set":"🔕 Removed","ok");}
  function exportCSV(){const lb=getLb();const rows=[["Rank","Name","Email","Points","Accuracy","Champion","Top4"].join(","),...lb.map((u,i)=>[i+1,'"'+u.name+'"',u.email,u.pts,u.acc+"%",u.userSp||"",(u.userT4||[]).join("|")].join(","))];const blob=new Blob([rows.join("\n")],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ipl26_leaderboard.csv";a.click();URL.revokeObjectURL(url);toast2("CSV exported!","ok");}

  const cardProps={myPicks,allPicks,rxns,reminders,doubleMatch,lockedMatches,matchPtsOverride,email,onReminder:toggleReminder,onReact:reactFn,onPredict:(m)=>{setAm(m);setDraft({});setSc("picks");}};

  const navItems=isAdmin
    ?[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","Picks"],["hist","📜","History"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"],["adm","⚙️","Admin"]]
    :[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","Picks"],["hist","📜","History"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"]];

  function Nav(){return <nav className="nav">{navItems.map(([s,ic,lb2])=>(
    <button key={s} className="ni" onClick={()=>{if(s!=="picks")setAm(null);setSc(s);if(s==="chat"){setChatU(0);setChatSeenTs(Date.now());}if(s==="home")setBcSeenTs(Date.now());}}>
      <div style={{position:"relative",display:"inline-block"}}>
        <span style={{fontSize:15,opacity:sc===s?1:.4}}>{ic}</span>
        {s==="chat"&&chatU>0&&<span className="bd"/>}
      </div>
      <span className="nl" style={{color:sc===s?"#1D428A":"#334155"}}>{lb2}</span>
    </button>
  ))}</nav>;}

  const hdr=<div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"13px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <img src={LOGOS.IPL} alt="IPL" style={{height:28,filter:"brightness(0) invert(1)"}} onError={e=>e.target.style.display="none"}/>
      <div><p className="C" style={{color:"#FFE57F",fontSize:13,fontWeight:700,letterSpacing:1,margin:0,textTransform:"uppercase"}}>Fantasy Predictor{isAdmin?" · Admin":""}</p><p style={{color:"#bfdbfe",fontSize:10,margin:0}}>TATA IPL 2026{maintenance?" · 🔒 Maintenance":""}</p></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"5px 12px",textAlign:"center"}}>
        <p className="C" style={{color:"#FFE57F",fontSize:18,fontWeight:800,margin:0,letterSpacing:1}}>{myPts}</p>
        <p style={{color:"#bfdbfe",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>My Pts</p>
      </div>
      <button onClick={logout} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,color:"#bfdbfe",fontSize:11,padding:"5px 8px",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600}}>Out</button>
    </div>
  </div>;

  /* ══════════ SCREENS ══════════ */

  if(sc==="splash")return <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f2456,#1D428A,#2a5bbf)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px"}}>
    <style>{CSS}</style>
    <img src={LOGOS.IPL} alt="IPL" style={{width:90,marginBottom:16,filter:"drop-shadow(0 0 20px rgba(255,255,255,.25))"}} onError={e=>e.target.style.display="none"}/>
    <p className="C" style={{fontSize:30,fontWeight:800,color:"#fff",letterSpacing:3,margin:0}}>FANTASY PREDICTOR</p>
    <p style={{color:"#FFE57F",fontSize:12,letterSpacing:4,marginTop:6,marginBottom:28,textTransform:"uppercase"}}>TATA IPL 2026</p>
    <div style={{display:"flex",gap:14,marginBottom:14,justifyContent:"center"}}>{["RCB","MI","CSK","KKR","SRH"].map((t,i)=><div key={t} style={{animation:`fadeIn .4s ease ${i*.08}s both`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><TLogo t={t} sz={38}/></div><span style={{color:"rgba(255,255,255,.7)",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>{t}</span></div>)}</div>
    <div style={{display:"flex",gap:14,marginBottom:36,justifyContent:"center"}}>{["RR","PBKS","GT","LSG","DC"].map((t,i)=><div key={t} style={{animation:`fadeIn .4s ease ${(i+5)*.08}s both`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><TLogo t={t} sz={38}/></div><span style={{color:"rgba(255,255,255,.7)",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>{t}</span></div>)}</div>
    <div style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.6)",fontSize:12}}><span className="spin" style={{fontSize:16}}>⚙</span> Loading…</div>
  </div>;

  if(sc==="login")return <div className="app"><style>{CSS}</style>
    <div style={{background:"linear-gradient(160deg,#0f2456,#1D428A,#2a5bbf)",padding:"32px 24px 28px",textAlign:"center"}}>
      <img src={LOGOS.IPL} alt="IPL" style={{width:60,marginBottom:10}} onError={e=>e.target.style.display="none"}/>
      <p className="C" style={{fontSize:24,fontWeight:800,letterSpacing:2,color:"#fff",margin:0}}>FANTASY PREDICTOR</p>
      <p style={{color:"#FFE57F",fontSize:10,letterSpacing:3,marginTop:4,textTransform:"uppercase"}}>TATA IPL 2026</p>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>{TEAMS.map(t=><TLogo key={t} t={t} sz={22}/>)}</div>
      <div style={{display:"flex",gap:0,marginTop:16,background:"rgba(255,255,255,.1)",borderRadius:12,padding:3}}>
        {[["login","Sign In"],["register","Register"],["forgot","Reset PW"]].map(([m,l])=><button key={m} onClick={()=>{setAuthMode(m);clearAuthForm();}} style={{flex:1,padding:"8px 4px",borderRadius:9,background:authMode===m?"#fff":"transparent",color:authMode===m?"#1D428A":"rgba(255,255,255,.7)",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:10,border:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:.5}}>{l}</button>)}
      </div>
    </div>
    <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>
      {authMode==="login"&&<>
        <div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off" autoCorrect="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div>
        <div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showPw?"text":"password"} value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{paddingRight:48}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button></div>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div>
        <button className="pbtn" disabled={authLoading} onClick={doLogin}>{authLoading?"Signing in…":"Sign In"}</button>
        <p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>No account? <button onClick={()=>{setAuthMode("register");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:11,cursor:"pointer",fontWeight:600}}>Create one →</button></p>
      </>}
      {authMode==="register"&&<>
        <div><input className={"inp"+(authErrors.name?" err":"")} value={authName} onChange={e=>{setAuthName(e.target.value);setAuthErrors(p=>({...p,name:""}));}} placeholder="Full name"/>{authErrors.name&&<p className="ferr">{authErrors.name}</p>}</div>
        <div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off" autoCorrect="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div>
        <div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showPw?"text":"password"} value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="Password" style={{paddingRight:48}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button></div><p style={{color:"#94a3b8",fontSize:10,marginTop:4}}>Min 8 chars · uppercase · number · special char</p>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div>
        <div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw2?" err":"")} type={showPw2?"text":"password"} value={authPw2} onChange={e=>{setAuthPw2(e.target.value);setAuthErrors(p=>({...p,pw2:""}));}} placeholder="Confirm password" style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&doRegister()}/><button onClick={()=>setShowPw2(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw2?"🙈":"👁"}</button></div>{authErrors.pw2&&<p className="ferr">{authErrors.pw2}</p>}</div>
        <button className="pbtn" disabled={authLoading} onClick={doRegister}>{authLoading?"Creating…":"Create Account"}</button>
        <p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>Already registered? <button onClick={()=>{setAuthMode("login");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:11,cursor:"pointer",fontWeight:600}}>Sign in →</button></p>
      </>}
      {authMode==="forgot"&&<>
        {forgotStep===1&&<><div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#1e40af"}}>Enter your registered email to reset your password.</div>
          <div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div>
          <button className="pbtn" disabled={authLoading} onClick={doForgotStep1}>{authLoading?"Checking…":"Verify Email"}</button></>}
        {forgotStep===2&&<><div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#166534"}}>✅ Verified: <b>{authEmail}</b></div>
          <div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showForgotPw?"text":"password"} value={forgotNewPw} onChange={e=>{setForgotNewPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="New password" style={{paddingRight:48}}/><button onClick={()=>setShowForgotPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showForgotPw?"🙈":"👁"}</button></div>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div>
          <div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw2?" err":"")} type={showForgotPw2?"text":"password"} value={forgotNewPw2} onChange={e=>{setForgotNewPw2(e.target.value);setAuthErrors(p=>({...p,pw2:""}));}} placeholder="Confirm new password" style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&doForgotStep2()}/><button onClick={()=>setShowForgotPw2(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showForgotPw2?"🙈":"👁"}</button></div>{authErrors.pw2&&<p className="ferr">{authErrors.pw2}</p>}</div>
          <button className="pbtn" disabled={authLoading} onClick={doForgotStep2}>{authLoading?"Saving…":"Set New Password"}</button>
          <button onClick={()=>{setForgotStep(1);setForgotNewPw("");setForgotNewPw2("");setAuthErrors({});}} style={{background:"none",border:"none",color:"#94a3b8",fontSize:12,cursor:"pointer"}}>← Back</button></>}
        <button onClick={()=>{setAuthMode("login");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:13,cursor:"pointer",fontWeight:600,marginTop:4}}>← Back to Sign In</button>
      </>}
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  if(sc==="onboard")return <div className="app" style={{minHeight:"100vh"}}><style>{CSS}</style>
    <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"24px 20px 20px"}}>
      <p style={{color:"#bfdbfe",fontSize:12,margin:0}}>Welcome, {user?.name}! One-time setup</p>
      <p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:1,margin:"4px 0 0"}}>{obStep===0?"PICK YOUR CHAMPION":"PICK YOUR TOP 4"}</p>
      <div style={{display:"flex",gap:6,marginTop:12}}>{[0,1].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:obStep>=i?"#FFE57F":"rgba(255,255,255,.2)"}}/>)}</div>
    </div>
    <div style={{padding:"20px 16px"}}>
      {obStep===0&&<>
        <p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who will win IPL 2026?</p>
        <p style={{color:"#64748b",fontSize:13,margin:"0 0 16px"}}>Worth <b style={{color:"#1D428A"}}>{PTS.season}pts</b> if correct. Locked forever.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=><button key={t} className={"ot"+(obSp===t?" on":"")} onClick={()=>setObSp(t)}><TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:obSp===t?"#1D428A":"#475569"}}>{t}</span></button>)}</div>
        <button className="lbtn" disabled={!obSp} onClick={()=>updateObStep(1,obSp,obT4)} style={{opacity:obSp?1:.4}}>Next → Pick Top 4</button>
      </>}
      {obStep===1&&<>
        <p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who reaches the playoffs?</p>
        <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>Select exactly 4 teams · {obT4.length}/4 selected</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=>{const sel=obT4.includes(t);return <button key={t} className={"ot"+(sel?" on":"")} onClick={()=>{if(sel)setObT4(p=>p.filter(x=>x!==t));else if(obT4.length<4)setObT4(p=>[...p,t]);else toast2("Max 4 teams","error");}}><TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:sel?"#1D428A":"#475569"}}>{t}</span>{sel&&<span style={{fontSize:9,background:"#1D428A",color:"#fff",borderRadius:8,padding:"1px 6px"}}>{obT4.indexOf(t)+1}</span>}</button>;})}</div>
        <button style={{width:"100%",padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",marginBottom:10}} onClick={()=>updateObStep(0,obSp,obT4)}>← Back</button>
        <button className="lbtn" disabled={obT4.length!==4} onClick={doneOnboard} style={{opacity:obT4.length===4?1:.4}}>Lock Picks — Let's Play!</button>
      </>}
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  if(sc==="picks"&&am)return <div className="app" style={{paddingBottom:32}}><style>{CSS}</style>
    <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"16px",display:"flex",alignItems:"center",gap:14}}>
      <button onClick={()=>{setAm(null);setSc("home");}} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0}}>&#8592;</button>
      <TLogo t={am.home} sz={28}/>
      <div style={{flex:1}}><p className="C" style={{color:"#fff",fontSize:16,fontWeight:800,margin:0}}>{am.home} vs {am.away}</p><p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{am.date} · {am.time} IST</p></div>
      <TLogo t={am.away} sz={28}/>
    </div>
    <div style={{background:"#EBF0FA",padding:"8px 16px",borderBottom:"1px solid #dbeafe"}}><span style={{color:"#1D428A",fontSize:12}}>All 3 correct = +{PTS.streak}pts streak bonus · Predictions are final</span></div>
    <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:18}}>
      {[["TOSS WINNER","toss",PTS.toss],["MATCH WINNER","win",PTS.win]].map(([title,field,pts])=>(
        <div key={field}>
          <p className="st">{title} <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{pts}pts</span></p>
          <div style={{display:"flex",gap:10}}>{[am.home,am.away].map(t=><button key={t} className={"tmbtn"+(draft[field]===t?" on":"")} onClick={()=>setDraft(d=>({...d,[field]:t}))}><TLogo t={t} sz={50}/><p className="C" style={{color:draft[field]===t?"#1D428A":"#64748b",fontSize:14,fontWeight:700,margin:0}}>{t}</p>{draft[field]===t&&<span style={{background:"#1D428A",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:12}}>SELECTED</span>}</button>)}</div>
        </div>
      ))}
      <div>
        <p className="st">PLAYER OF THE MATCH <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.motm}pts</span></p>
        <PotmDropdown homeTeam={am.home} awayTeam={am.away} value={draft.motm||""} onChange={v=>setDraft(d=>({...d,motm:v}))}/>
      </div>
      {draft.toss&&draft.win&&draft.motm&&<div style={{background:"#EBF0FA",border:"1px solid #dbeafe",borderRadius:12,padding:"14px 16px"}}>
        <p className="st" style={{marginBottom:12}}>YOUR PREDICTION</p>
        {[["Toss",draft.toss,PTS.toss],["Winner",draft.win,PTS.win],["POTM",draft.motm,PTS.motm]].map(([l,v,p])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#64748b",fontSize:13}}>{l}</span><span style={{color:"#1a2540",fontSize:13,fontWeight:600}}>{v} <span className="C" style={{color:"#1D428A",fontSize:11}}>+{p}pts</span></span></div>)}
        <div style={{borderTop:"1px solid #dbeafe",paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{color:"#64748b",fontSize:12}}>Max with streak bonus</span><span className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800}}>+{PTS.toss+PTS.win+PTS.motm+PTS.streak}pts</span></div>
      </div>}
      <button className="lbtn" onClick={submitPick}>Lock Prediction 🔒</button>
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  if(maintenance&&!isAdmin)return <div className="app"><style>{CSS}</style>
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
      <span style={{fontSize:48,marginBottom:16}}>🔧</span>
      <p className="C" style={{color:"#1D428A",fontSize:26,fontWeight:800,letterSpacing:2}}>MAINTENANCE MODE</p>
      <p style={{color:"#64748b",fontSize:14,marginTop:8}}>The app is temporarily offline. Check back soon!</p>
      <button onClick={logout} style={{marginTop:24,padding:"10px 24px",borderRadius:10,background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13}}>← Sign Out</button>
    </div>
  </div>;

  /* ══════════ MAIN SHELL ══════════ */
  return <div className="app" style={{paddingBottom:68}}><style>{CSS}</style>
    {hdr}
    {pinnedBc&&<div style={{background:"#1D428A",padding:"8px 16px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>📌</span><p style={{color:"#fff",fontSize:12,fontWeight:600,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pinnedBc}</p></div>}
    {bc.length>0&&sc==="home"&&!pinnedBc&&(()=>{const lt=bc[bc.length-1];return <div style={{background:"#FFF9E6",borderBottom:"1px solid #FDE68A",padding:"8px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setBcSeenTs(Date.now())}><span style={{color:"#B8860B",fontSize:14}}>📢</span><p style={{color:"#92400E",fontSize:12,fontWeight:600,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lt.msg}</p>{unbc>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:12}}>{unbc} new</span>}</div>;})()}
    <div style={{background:"#fff",padding:"8px 16px",display:"flex",borderBottom:"1px solid #e2e8f0"}}>
      {[["🎯","Toss",PTS.toss],["🏆","Win",PTS.win],["⭐","POTM",PTS.motm],["🔥","Streak",PTS.streak]].map(([ic,l,p],i)=><div key={l} style={{flex:1,textAlign:"center",borderRight:i<3?"1px solid #e2e8f0":"none"}}><p style={{color:"#1D428A",fontWeight:700,fontSize:12,margin:0}}>{p}<span style={{fontSize:9,color:"#94a3b8",fontWeight:400}}> pts</span></p><p style={{color:"#64748b",fontSize:9,margin:"1px 0 0"}}>{ic} {l}</p></div>)}
    </div>

    {/* HOME */}
    {sc==="home"&&<>
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
        {[["today","Today ("+todayMs.length+")"],["done","Results ("+done.length+")"],["up","Schedule ("+upMs.length+")"],["season","Season"]].map(([t,l])=><button key={t} className={"tbtn"+(htab===t?" on":"")} onClick={()=>setHtab(t)}>{l}</button>)}
      </div>
      <div style={{padding:"14px 14px 0"}}>
        {htab==="today"&&(todayMs.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40,marginBottom:12}}>🏏</p><p className="C" style={{color:"#94a3b8",fontSize:18,fontWeight:700,letterSpacing:1}}>NO MATCHES TODAY</p><p style={{color:"#94a3b8",fontSize:12,marginTop:8}}>Check the Schedule tab for upcoming matches.</p></div>:todayMs.map(m=><MCard key={m.id} m={m} pred={true} {...cardProps}/>))}
        {htab==="done"&&(done.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40,marginBottom:12}}>⏳</p><p className="C" style={{color:"#94a3b8",fontSize:18,fontWeight:700,letterSpacing:1}}>NO RESULTS YET</p></div>:[...done].reverse().map(m=><MCard key={m.id} m={m} pred={false} {...cardProps}/>))}
        {htab==="up"&&(upMs.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700}}>ALL MATCHES DONE</p></div>:upMs.map(m=>(
          <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
              <span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Upcoming</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><TLogo t={m.home} sz={34}/><p className="C" style={{color:"#475569",fontSize:13,fontWeight:700,margin:0}}>{m.home}</p></div>
              <p className="C" style={{color:"#e2e8f0",fontSize:16,fontWeight:800,padding:"0 8px",margin:0}}>VS</p>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}><TLogo t={m.away} sz={34}/><p className="C" style={{color:"#475569",fontSize:13,fontWeight:700,margin:0}}>{m.away}</p></div>
            </div>
            <p style={{color:"#cbd5e1",fontSize:11,marginTop:10,borderTop:"1px solid #f1f5f9",paddingTop:8}}>📍 {m.venue}</p>
            {!isMatchLocked(m,lockedMatches)&&!(myPicks[m.id]??myPicks[String(m.id)])&&<button className="pbtn" style={{marginTop:10}} onClick={()=>cardProps.onPredict(m)}>Predict This Match</button>}
            {(myPicks[m.id]??myPicks[String(m.id)])&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#15803d",marginTop:4}}>✅ Predicted</div>}
          </div>
        )))}
        {htab==="season"&&<div>
          <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:2,margin:0}}>MY SEASON PICKS</p></div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
            <p className="st">IPL 2026 CHAMPION</p>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {mySp?<TLogo t={mySp} sz={50}/>:<div style={{width:50,height:50,borderRadius:10,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>?</div>}
              <div><p className="C" style={{color:"#1a2540",fontSize:18,fontWeight:800,margin:0}}>{mySp||"Not set"}</p>
              {sw&&mySp&&<p style={{color:mySp===sw?"#15803d":"#dc2626",fontSize:13,fontWeight:700,marginTop:6}}>{mySp===sw?"✅ Correct! +200pts":"❌ Better luck next time"}</p>}
              {!sw&&mySp&&<p style={{color:"#94a3b8",fontSize:11,marginTop:4}}>Worth +{PTS.season}pts at season end</p>}</div>
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px"}}>
            <p className="st">MY TOP 4 PICKS</p>
            {myT4&&myT4.length>0?<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:8,background:"#f8faff",borderRadius:10,padding:"8px 12px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:13,fontWeight:700}}>#{i+1}</span><TLogo t={t} sz={28}/><span className="C" style={{color:"#1D428A",fontSize:14,fontWeight:700}}>{t}</span>{sw&&<span style={{fontSize:13}}>{t===sw?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}
          </div>
        </div>}
      </div>
    </>}

    {/* LEADERBOARD */}
    {sc==="lb"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
        <p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>LEADERBOARD</p>
        <p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>{done.length} matches completed · {Object.keys(users).length} players</p>
      </div>
      {getLb().map((u,i)=>(
        <div key={u.email} style={{background:u.email===email?"#EBF0FA":"#fff",border:"1px solid "+(u.email===email?"#1D428A60":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10,boxShadow:"0 1px 4px rgba(29,66,138,.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:i===0?"#D4AF37":i===1?"#94a3b8":i===2?"#b45309":"#EBF0FA",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:i<3?"#fff":"#475569",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
            <Av name={u.name} sz={30}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}</p>{u.hot&&<span style={{fontSize:13}}>🔥</span>}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2,flexWrap:"wrap"}}><span style={{fontSize:10,color:"#64748b"}}>{u.acc}% accurate</span>{(u.bgs||[]).slice(0,2).map(b=><span key={b.id} className="bp">{b.ic} {b.lb}</span>)}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,margin:0,letterSpacing:1}}>{u.pts}</p>
              {(getManualAdj(u.email)+getMatchOverride(u.email))!==0&&<p style={{color:"#FF822A",fontSize:9,margin:0,fontWeight:600}}>{getManualAdj(u.email)+getMatchOverride(u.email)>0?"+":""}{getManualAdj(u.email)+getMatchOverride(u.email)} adj</p>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,borderTop:"1px solid #f1f5f9",paddingTop:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0"}}>
              <span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>🏆</span>
              {u.userSp?<><TLogo t={u.userSp} sz={16}/><span className="C" style={{fontSize:12,fontWeight:700,color:sw&&u.userSp===sw?"#15803d":"#1D428A"}}>{u.userSp}{sw&&u.userSp===sw?" ✅":""}</span></>:<span style={{fontSize:11,color:"#94a3b8"}}>—</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0",flex:1,flexWrap:"wrap"}}>
              <span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>Top4:</span>
              {(u.userT4||[]).length>0?(u.userT4||[]).map(t=><TLogo key={t} t={t} sz={16}/>):<span style={{fontSize:11,color:"#94a3b8"}}>—</span>}
            </div>
          </div>
        </div>
      ))}
      {getLb().length===0&&<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:36}}>👥</p><p style={{color:"#94a3b8",marginTop:12}}>No players yet.</p></div>}
    </div>}

    {/* MY PICKS */}
    {sc==="picks"&&!am&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"14px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>MY PICKS</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:2}}>{Object.keys(myPicks).length} predictions · {myS.acc}% accurate</p></div>
        <p className="C" style={{color:"#FFE57F",fontSize:26,fontWeight:800,margin:0}}>{myPts}</p>
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
        <p className="st">MY SEASON PICKS</p>
        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <div style={{flex:1,background:"#f8faff",border:"1px solid #dbeafe",borderRadius:10,padding:"10px 12px"}}>
            <span style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>🏆 Champion Pick</span>
            {mySp?<div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}><TLogo t={mySp} sz={32}/><div><p className="C" style={{color:"#1D428A",fontSize:16,fontWeight:800,margin:0}}>{mySp}</p><p style={{color:sw?(mySp===sw?"#15803d":"#dc2626"):"#94a3b8",fontSize:10,fontWeight:600,margin:0}}>{sw?(mySp===sw?"✅ +200pts":"❌ Wrong"):"Season pending"}</p></div></div>:<p style={{color:"#94a3b8",fontSize:12,margin:"6px 0 0"}}>Not set</p>}
          </div>
        </div>
        <div style={{background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 12px"}}>
          <span style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>🏅 Top 4 Playoff Picks</span>
          {myT4&&myT4.length>0?<div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:6,background:"#fff",borderRadius:10,padding:"6px 10px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:11,fontWeight:700}}>#{i+1}</span><TLogo t={t} sz={22}/><span className="C" style={{color:"#1D428A",fontSize:12,fontWeight:700}}>{t}</span>{sw&&<span style={{fontSize:11}}>{t===sw?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12,margin:"6px 0 0"}}>Not set</p>}
        </div>
      </div>
      <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#92400E",display:"flex",gap:8,alignItems:"center"}}><span>🔒</span><span>Picks lock 45 mins before each match. Predict from Today or Schedule tabs.</span></div>
      {ms.filter(m=>myPicks[m.id]??myPicks[String(m.id)]).length===0?<div style={{textAlign:"center",padding:"40px 16px"}}><p style={{fontSize:36}}>📋</p><p style={{color:"#94a3b8",marginTop:12}}>No predictions yet. Head to the Today tab!</p></div>
      :ms.filter(m=>myPicks[m.id]??myPicks[String(m.id)]).map(m=>{
        const p=myPicks[m.id]??myPicks[String(m.id)];const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);const mult=isDouble?2:1;
        let e=0;if(m.result){let base=0;if(p.toss===m.result.toss)base+=PTS.toss;if(p.win===m.result.win)base+=PTS.win;if(motmMatch(p.motm,m.result.motm))base+=PTS.motm;if(p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm))base+=PTS.streak;e=base*mult;}
        const mOv=((matchPtsOverride[email]||{})[m.id])??((matchPtsOverride[email]||{})[String(m.id)])??0;
        return <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>{m.mn} · {m.date}</span>{isDouble&&<span style={{fontSize:10,background:"linear-gradient(135deg,#FF822A,#D4AF37)",color:"#fff",borderRadius:10,padding:"1px 6px",fontWeight:700}}>2×</span>}</div>
            <div style={{textAlign:"right"}}>{m.result?<span style={{color:e+mOv>0?"#15803d":"#94a3b8",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15}}>+{e+mOv}pts</span>:<span style={{color:"#94a3b8",fontSize:11}}>Pending</span>}{mOv!==0&&<p style={{color:"#FF822A",fontSize:9,margin:0,fontWeight:600}}>{mOv>0?"+":""}{mOv} admin</p>}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[["Toss",p.toss,m.result&&p.toss===m.result.toss],["Win",p.win,m.result&&p.win===m.result.win],["POTM",p.motm,m.result&&motmMatch(p.motm,m.result.motm)]].map(([l,v,c])=><span key={l} style={{background:m.result?(c?"#f0fdf4":"#fef2f2"):"#f8faff",border:"1px solid "+(m.result?(c?"#bbf7d0":"#fecaca"):"#e2e8f0"),borderRadius:6,padding:"4px 10px",fontSize:12,color:m.result?(c?"#15803d":"#dc2626"):"#475569"}}>{l}: {v||"—"}</span>)}</div>
        </div>;
      })}
    </div>}

    {/* HISTORY */}
    {sc==="hist"&&(()=>{
      const played=ms.filter(m=>m.result&&(myPicks[m.id]??myPicks[String(m.id)]));
      const pending=ms.filter(m=>!m.result&&(myPicks[m.id]??myPicks[String(m.id)]));
      let totalPts=0,perfect=0,streakCur=0,streakBest=0;
      const rows=played.map(m=>{
        const p=myPicks[m.id]??myPicks[String(m.id)];const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);const mult=isDouble?2:1;
        const tossOk=p.toss===m.result.toss,winOk=p.win===m.result.win,motmOk=motmMatch(p.motm,m.result.motm),isPerfect=tossOk&&winOk&&motmOk;
        let base=0;if(tossOk)base+=PTS.toss;if(winOk)base+=PTS.win;if(motmOk)base+=PTS.motm;
        if(isPerfect){base+=PTS.streak;perfect++;streakCur++;streakBest=Math.max(streakBest,streakCur);}else streakCur=0;
        const mOv=((matchPtsOverride[email]||{})[m.id])??((matchPtsOverride[email]||{})[String(m.id)])??0;
        const pts=(base*mult)+mOv;totalPts+=pts;
        return{m,p,tossOk,winOk,motmOk,isPerfect,pts,mult,mOv};
      });
      const acc=rows.length?Math.round(rows.filter(r=>r.tossOk||r.winOk||r.motmOk).length/rows.length*100):0;
      return <div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:14}}>
          <p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:2,margin:"0 0 12px"}}>MY HISTORY</p>
          <div style={{display:"flex",gap:8}}>{[["🏏",rows.length,"Played"],["⭐",totalPts,"Pts Earned"],["🎯",perfect,"Perfect"],["📊",acc+"%","Accuracy"]].map(([ic,val,lbl])=><div key={lbl} style={{flex:1,background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 4px",textAlign:"center"}}><p style={{fontSize:14,margin:0}}>{ic}</p><p className="C" style={{color:"#FFE57F",fontSize:16,fontWeight:800,margin:"2px 0 0",letterSpacing:.5}}>{val}</p><p style={{color:"#bfdbfe",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>{lbl}</p></div>)}</div>
          {streakBest>=2&&<div style={{marginTop:10,background:"rgba(255,229,127,.15)",borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>🔥</span><span style={{color:"#FFE57F",fontSize:12,fontWeight:600}}>Best perfect streak: {streakBest} in a row</span></div>}
        </div>
        {pending.length>0&&<div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <p className="st" style={{color:"#92400E",borderColor:"#FDE68A",margin:"0 0 8px"}}>AWAITING RESULTS ({pending.length})</p>
          {pending.map(m=>{const p=myPicks[m.id]??myPicks[String(m.id)];const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);return <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #FDE68A40"}}><TLogo t={m.home} sz={20}/><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={20}/><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.home} vs {m.away}{isDouble?" ⚡":""}</p><p style={{color:"#92400E",fontSize:11,margin:"2px 0 0"}}>{p.toss} toss · {p.win} win · {p.motm?.split(" ").slice(-1)[0]}</p></div><span style={{background:"#FDE68A",color:"#92400E",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,flexShrink:0}}>Pending</span></div>;})}
        </div>}
        {rows.length===0?<div style={{textAlign:"center",padding:"40px 16px"}}><p style={{fontSize:36}}>📜</p><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700,letterSpacing:1,marginTop:12}}>NO RESULTS YET</p><p style={{color:"#94a3b8",fontSize:12,marginTop:8}}>Your history appears once matches complete.</p></div>
        :<>{<p className="st">MATCH BY MATCH</p>}{[...rows].reverse().map(({m,p,tossOk,winOk,motmOk,isPerfect,pts,mult,mOv})=>(
          <div key={m.id} style={{background:"#fff",border:"1px solid "+(isPerfect?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10,position:"relative",overflow:"hidden"}}>
            {isPerfect&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#22c55e,#16a34a)"}}/>}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date}</p><p style={{color:"#64748b",fontSize:11,margin:"1px 0 0"}}>Win: <b style={{color:"#15803d"}}>{m.result.win}</b> · POTM: <b style={{color:"#B8860B"}}>{m.result.motm}</b></p></div><div style={{textAlign:"right",flexShrink:0}}><p className="C" style={{color:pts>0?"#15803d":"#94a3b8",fontSize:20,fontWeight:800,margin:0}}>{pts>0?"+":""}{pts}</p><p style={{color:"#94a3b8",fontSize:9,margin:0,textTransform:"uppercase"}}>pts{mult>1?" (2×)":""}</p></div></div>
            <div style={{display:"flex",gap:6}}>{[["Toss",p.toss,tossOk,m.result.toss],["Winner",p.win,winOk,m.result.win],["POTM",p.motm?.split(" ").slice(-1)[0],motmOk,m.result.motm?.split(" ").slice(-1)[0]]].map(([lbl,val,ok,actual])=><div key={lbl} style={{flex:1,background:ok?"#f0fdf4":"#fef2f2",border:"1px solid "+(ok?"#bbf7d0":"#fecaca"),borderRadius:8,padding:"6px 8px",textAlign:"center"}}><p style={{color:"#94a3b8",fontSize:9,fontWeight:600,textTransform:"uppercase",margin:"0 0 3px"}}>{lbl}</p><p style={{color:ok?"#15803d":"#dc2626",fontSize:11,fontWeight:700,margin:0}}>{ok?"✓":"✗"} {val||"—"}</p>{!ok&&<p style={{color:"#94a3b8",fontSize:9,margin:"2px 0 0"}}>was {actual}</p>}</div>)}</div>
            {isPerfect&&<div style={{marginTop:8,background:"#f0fdf4",borderRadius:6,padding:"5px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12}}>🎯</span><span style={{color:"#15803d",fontSize:11,fontWeight:700}}>Perfect! +{PTS.streak}pts streak bonus</span></div>}
            {mOv!==0&&<p style={{color:"#FF822A",fontSize:10,fontWeight:600,margin:"6px 0 0"}}>Admin adjustment: {mOv>0?"+":""}{mOv} pts</p>}
          </div>
        ))}</>}
      </div>;
    })()}

    {/* CHAT */}
    {sc==="chat"&&<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 134px)"}}>
      <div style={{padding:"10px 16px 8px",borderBottom:"1px solid #e2e8f0",background:"#fff"}}>
        <p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,letterSpacing:1,margin:0}}>GROUP CHAT</p>
        <p style={{color:"#64748b",fontSize:11,margin:"2px 0 6px"}}>{Object.keys(users).length} players · <span style={{color:"#22c55e",fontWeight:600}}>{Object.keys(onlineUsers).length} online</span>{chatMuted?" · 🔇 Chat muted":""}</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.values(users).map(u=>{const isOnline=!!(onlineUsers[ek(u.email)]);return <div key={u.email} style={{display:"flex",alignItems:"center",gap:4,background:isOnline?"#f0fdf4":"#f8faff",border:"1px solid "+(isOnline?"#bbf7d0":"#e2e8f0"),borderRadius:20,padding:"3px 8px"}}><div style={{width:6,height:6,borderRadius:"50%",background:isOnline?"#22c55e":"#cbd5e1",flexShrink:0}}/><span style={{fontSize:10,fontWeight:600,color:isOnline?"#15803d":"#94a3b8"}}>{u.name.split(" ")[0]}</span></div>;})}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10,background:"#F4F6FB"}}>
        {chat.length===0&&<div style={{textAlign:"center",padding:"40px 16px"}}><span style={{fontSize:36}}>💬</span><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700,letterSpacing:1,marginTop:12}}>NO MESSAGES YET</p></div>}
        {chat.map(msg=>{const im=msg.email===email,is=msg.sys;return <div key={msg.id} style={{display:"flex",flexDirection:"column",alignSelf:is?"center":im?"flex-end":"flex-start",maxWidth:"88%",gap:3}}>
          {!im&&!is&&<div style={{display:"flex",alignItems:"center",gap:5,marginLeft:2}}><Av name={msg.name} sz={16}/><span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{msg.name}</span></div>}
          <div className={"cb "+(is?"cs":im?"cm":"co")} style={{whiteSpace:"pre-line"}}>{msg.text}{isAdmin&&!is&&<button onClick={()=>delMsg(msg.id)} style={{background:"none",border:"none",color:im?"rgba(255,255,255,.4)":"#94a3b8",fontSize:10,cursor:"pointer",marginLeft:8,padding:0}}>×</button>}</div>
          <span style={{color:"#94a3b8",fontSize:10,alignSelf:im?"flex-end":"flex-start"}}>{new Date(msg.ts).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}</span>
        </div>;})}
        <div ref={chatRef}/>
      </div>
      <div style={{padding:"10px 14px 12px",borderTop:"1px solid #e2e8f0",background:"#fff"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <input className="inp" value={chatIn} onChange={e=>setChatIn(e.target.value.slice(0,CHAT_MAX))} placeholder={chatMuted||(mutedUsers||{})[myEk]?"Chat is muted":"Type a message…"} disabled={chatMuted||(mutedUsers||{})[myEk]} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} style={{flex:1,padding:"10px 14px",borderRadius:24}}/>
          <button onClick={sendChat} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#1D428A,#2a5bbf)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>&#10148;</button>
        </div>
        {chatIn.length>CHAT_MAX*0.8&&<p className="charcnt">{chatIn.length}/{CHAT_MAX}</p>}
      </div>
    </div>}

    {/* WALL OF FAME */}
    {sc==="wof"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>WALL OF FAME</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>Perfect predictions hall of fame</p></div>
      {(()=>{
        const pc={};done.forEach(m=>{Object.entries(allPicks).forEach(([emk,up])=>{const p=up[m.id]??up[String(m.id)];if(p&&m.result&&p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm)){pc[emk]=(pc[emk]||0)+1;}});});
        const s=Object.entries(pc).sort((a,b)=>b[1]-a[1]);
        if(!s.length)return <p style={{color:"#94a3b8",textAlign:"center",marginTop:20,marginBottom:20}}>No perfect matches yet!</p>;
        return <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:16}}><p className="st">PERFECT MATCH HALL</p>{s.map(([emk,cnt],i)=>{const u=Object.values(users).find(u=>ek(u.email)===emk);if(!u)return null;return <div key={emk} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<s.length-1?"1px solid #f1f5f9":"none"}}><div style={{width:28,height:28,borderRadius:8,background:i===0?"#D4AF37":i===1?"#94a3b8":i===2?"#b45309":"#EBF0FA",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:i<3?"#fff":"#475569",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div><Av name={u.name} sz={30}/><div style={{flex:1}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{cnt} perfect match{cnt>1?"es":""}</p></div><span className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800}}>{cnt}×</span></div>;})} </div>;
      })()}
      {getWof().map(m=>(
        <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><TLogo t={m.home} sz={24}/><div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home} vs {m.away}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{m.mn} · {m.date}</p></div><TLogo t={m.away} sz={24}/></div>
          {m.result&&<div style={{background:"#F4F6FB",borderRadius:8,padding:"6px 10px",fontSize:11,marginBottom:10,color:"#64748b"}}>Win: <b style={{color:"#15803d"}}>{m.result.win}</b> · POTM: <b style={{color:"#B8860B"}}>{m.result.motm}</b></div>}
          {m.perfs.length>0?<div><p style={{color:"#1D428A",fontSize:11,fontWeight:700,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.5}}>🎯 Perfect Picks</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{m.perfs.map(p=><div key={p.email} style={{display:"flex",alignItems:"center",gap:6,background:"#EBF0FA",borderRadius:20,padding:"4px 10px"}}><Av name={p.name} sz={20}/><span style={{color:"#1D428A",fontSize:12,fontWeight:600}}>{p.name}</span></div>)}</div></div>:<p style={{color:"#94a3b8",fontSize:12,margin:0}}>No perfect picks this match</p>}
        </div>
      ))}
    </div>}

    {/* RULES */}
    {sc==="rules"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
        <p style={{fontSize:28,margin:"0 0 6px"}}>📖</p>
        <p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>HOW TO PLAY</p>
        <p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>TATA IPL 2026 Fantasy Predictor</p>
      </div>
      {[{icon:"🎯",title:"Making Predictions",color:"#EBF0FA",border:"#bfdbfe",tc:"#1e40af",items:["Before each match, predict: Toss Winner, Match Winner, and Player of the Match.","Predictions lock 45 minutes before the scheduled start time — no changes after that.","You can set reminders from the Schedule tab so you never miss the window."]},
        {icon:"⭐",title:"How Points Work",color:"#f0fdf4",border:"#bbf7d0",tc:"#166534",items:["Correct Toss → +10 pts","Correct Match Winner → +20 pts","Correct Player of the Match → +30 pts","All 3 correct in one match (Perfect Pick) → bonus +15 pts streak","Maximum per match: 75 pts (or 150 pts on a 2× Double Points match)"]},
        {icon:"🏆",title:"Season Picks (One-Time)",color:"#FFF9E6",border:"#FDE68A",tc:"#92400E",items:["At signup, pick your IPL 2026 Champion — worth +200 pts if correct at season end.","Also pick your Top 4 playoff teams. Each team that qualifies earns you +50 pts.","These picks are locked forever after onboarding — choose wisely!"]},
        {icon:"⚡",title:"Double Points Match",color:"#fff7ed",border:"#fed7aa",tc:"#9a3412",items:["Admin can designate any match as a 2× Double Points match.","All points earned in that match (including streak bonus) are doubled.","Watch for the ⚡ 2× badge on the match card — it's a big opportunity!"]},
        {icon:"🌟",title:"Wall of Fame",color:"#fdf4ff",border:"#e9d5ff",tc:"#6b21a8",items:["Every Perfect Pick (all 3 correct) earns you a spot on the Wall of Fame.","The Hall of Fame ranks players by total perfect matches across the season.","Perfect picks also unlock badges like Hat-Trick Hero (3+ perfects)."]},
        {icon:"🏅",title:"Badges",color:"#f8faff",border:"#e2e8f0",tc:"#1e40af",items:["🎯 Perfect Match — get your first perfect pick","🏅 Hat-Trick Hero — 3 or more perfect picks","🐉 Underdog King — correctly pick winners that less than 50% of the group picked","💪 Consistent — score at least 2/3 correct in 3+ matches","⚡ Active Predictor — make 10 or more predictions"]},
        {icon:"📋",title:"General Rules",color:"#fef2f2",border:"#fecaca",tc:"#991b1b",items:["This is a private game for your friend group — keep it fun and friendly!","Picks are final once locked — no edits or appeals after the cutoff.","Admin can adjust points manually in case of technical issues.","The leaderboard updates in real time as results are entered.","In case of a tie, the player with higher prediction accuracy ranks higher."]}
      ].map(({icon,title,color,border,tc,items})=>(
        <div key={title} style={{background:color,border:"1px solid "+border,borderRadius:12,padding:"14px 16px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:18}}>{icon}</span><p className="C" style={{color:tc,fontSize:15,fontWeight:800,letterSpacing:.5,margin:0,textTransform:"uppercase"}}>{title}</p></div>
          {items.map((item,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:i<items.length-1?8:0}}><span style={{color:tc,fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>•</span><p style={{color:tc,fontSize:13,margin:0,lineHeight:1.55,opacity:.9}}>{item}</p></div>)}
        </div>
      ))}
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:12,padding:"16px",marginTop:4,textAlign:"center"}}><p style={{color:"#FFE57F",fontSize:13,fontWeight:700,margin:"0 0 4px"}}>🏏 May the best predictor win!</p><p style={{color:"#bfdbfe",fontSize:11,margin:0}}>Questions? Ask in the Group Chat.</p></div>
    </div>}

    {/* ADMIN */}
    {sc==="adm"&&isAdmin&&<div style={{padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>ADMIN PANEL</p>
        <div style={{display:"flex",gap:6}}>{maintenance&&<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:700}}>🔒 Maintenance</span>}<span style={{background:"#dcfce7",color:"#166534",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600}}>Active</span></div>
      </div>
      <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,marginBottom:14,overflow:"hidden",border:"1px solid #e2e8f0",flexWrap:"wrap"}}>
        {[["results","📊 Results"],["users","👥 Users"],["matches","➕ Matches"],["analytics","📈 Stats"],["controls","🎛️ Controls"],["broadcast","📢 Broadcast"]].map(([t,l])=><button key={t} className={"at"+(admTab===t?" on":"")} onClick={()=>setAdmTab(t)} style={{minWidth:"33%",fontSize:9}}>{l}</button>)}
      </div>

      {/* RESULTS TAB */}
      {admTab==="results"&&<>
        <div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <p style={{color:"#1e40af",fontSize:12,fontWeight:600,margin:"0 0 4px"}}>💡 Partial saves supported</p>
          <p style={{color:"#3b82f6",fontSize:11,margin:0}}>Save Toss right after it happens. Add Winner + POTM after the match. Each field saves independently.</p>
        </div>
        <p className="st">IN PROGRESS / PENDING ({ms.filter(m=>!m.result&&!isTBD(m)).length})</p>
        {ms.filter(m=>!m.result&&!isTBD(m)).length===0&&<p style={{color:"#94a3b8",fontSize:12,textAlign:"center",padding:"20px 0"}}>All matches have full results entered ✅</p>}
        {ms.filter(m=>!m.result&&!isTBD(m)).map(m=>{
          const rf=admResultForm[m.id]||{};
          const prefill={toss:m.toss||"",win:m.win||"",motm:m.motm||"",...rf};
          const allFilled=prefill.toss&&prefill.win&&prefill.motm;
          return <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/>
              <div style={{flex:1}}>
                <p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date} · {m.time}</p>
                <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                  {prefill.toss&&<span style={{background:"#EBF0FA",color:"#1e40af",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>🪙 {prefill.toss} won toss</span>}
                  {prefill.win&&<span style={{background:"#f0fdf4",color:"#166534",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>🏆 {prefill.win} won</span>}
                  {prefill.motm&&<span style={{background:"#FFF9E6",color:"#92400E",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10}}>⭐ {prefill.motm}</span>}
                </div>
              </div>
            </div>
            {/* TOSS */}
            <div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
              <p style={{color:"#64748b",fontSize:10,fontWeight:700,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:.5}}>🪙 Toss Winner</p>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <select className="sel" style={{flex:1}} value={prefill.toss} onChange={e=>setAdmResultForm(f=>({...f,[m.id]:{...prefill,toss:e.target.value}}))}>
                  <option value="">— Select —</option><option value={m.home}>{m.home}</option><option value={m.away}>{m.away}</option>
                </select>
                <button onClick={async()=>{const val=(admResultForm[m.id]?.toss)||prefill.toss;if(!val){toast2("Select toss winner","error");return;}await savePartialResult(m.id,"toss",val);}} style={{padding:"10px 14px",borderRadius:8,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,flexShrink:0}}>Save Toss</button>
              </div>
            </div>
            {/* WINNER */}
            <div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
              <p style={{color:"#64748b",fontSize:10,fontWeight:700,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:.5}}>🏆 Match Winner</p>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <select className="sel" style={{flex:1}} value={prefill.win} onChange={e=>setAdmResultForm(f=>({...f,[m.id]:{...prefill,win:e.target.value}}))}>
                  <option value="">— Select —</option><option value={m.home}>{m.home}</option><option value={m.away}>{m.away}</option>
                </select>
                <button onClick={async()=>{const val=(admResultForm[m.id]?.win)||prefill.win;if(!val){toast2("Select match winner","error");return;}await savePartialResult(m.id,"win",val);}} style={{padding:"10px 14px",borderRadius:8,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,flexShrink:0}}>Save Win</button>
              </div>
            </div>
            {/* POTM */}
            <div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
              <p style={{color:"#64748b",fontSize:10,fontWeight:700,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:.5}}>⭐ Player of the Match</p>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{flex:1}}><PotmDropdown homeTeam={m.home} awayTeam={m.away} value={prefill.motm} onChange={v=>setAdmResultForm(f=>({...f,[m.id]:{...prefill,motm:v}}))}/></div>
                <button onClick={async()=>{const val=(admResultForm[m.id]?.motm)||prefill.motm;if(!val){toast2("Select POTM","error");return;}await savePartialResult(m.id,"motm",val);}} style={{padding:"10px 14px",borderRadius:8,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,flexShrink:0}}>Save</button>
              </div>
            </div>
            {/* FINALISE */}
            <button onClick={()=>{setAdmResultForm(f=>({...f,[m.id]:{...prefill,...f[m.id]}}));setTimeout(()=>setManualResult(m.id),0);}} disabled={!allFilled}
              style={{width:"100%",padding:"10px",borderRadius:8,background:allFilled?"linear-gradient(135deg,#15803d,#16a34a)":"#f1f5f9",color:allFilled?"#fff":"#94a3b8",border:"none",cursor:allFilled?"pointer":"default",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:.5}}>
              {allFilled?"✅ Finalise & Notify Group":"Fill all 3 fields to finalise"}
            </button>
          </div>;
        })}
        <p className="st" style={{marginTop:16}}>COMPLETED ({done.length})</p>
        {[...done].reverse().map(m=>{
          const allArr=Object.values(allPicks);const tot=allArr.filter(u=>u[m.id]||u[String(m.id)]).length;
          const tossCorrect=allArr.filter(u=>(u[m.id]??u[String(m.id)])?.toss===m.result.toss).length;
          const winCorrect=allArr.filter(u=>(u[m.id]??u[String(m.id)])?.win===m.result.win).length;
          const motmCorrect=allArr.filter(u=>motmMatch((u[m.id]??u[String(m.id)])?.motm,m.result.motm)).length;
          const perfects=allArr.filter(u=>{const p=u[m.id]??u[String(m.id)];return p&&p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm);}).length;
          const io=anM===m.id;
          const hc=TC[m.home]||{bg:"#1D428A"},ac=TC[m.away]||{bg:"#555"};
          return <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,marginBottom:10,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setAnM(io?null:m.id)}>
              <TLogo t={m.home} sz={20}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={20}/>
              <div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date}</p><p style={{color:"#64748b",fontSize:11,margin:"2px 0 0"}}>W: <b style={{color:"#15803d"}}>{m.result.win}</b> · POTM: <b style={{color:"#B8860B"}}>{m.result.motm}</b></p></div>
              <div style={{textAlign:"right"}}>{perfects>0&&<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,display:"block",marginBottom:2}}>🎯 {perfects} perfect</span>}<span style={{color:"#94a3b8",fontSize:11}}>{io?"▲":"▼"} {tot} picks</span></div>
            </div>
            {io&&tot>0&&<div style={{borderTop:"1px solid #f1f5f9",padding:"12px 14px",background:"#f8faff"}}>
              <p style={{color:"#64748b",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 10px"}}>{tot} predictions · accuracy breakdown</p>
              {[["🪙 Toss",tossCorrect,tot,hc.bg],["🏆 Winner",winCorrect,tot,hc.bg],["⭐ POTM",motmCorrect,tot,"#B8860B"]].map(([lbl,correct,total,clA])=>{const pct=total?Math.round(correct/total*100):0;return <div key={lbl} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:11,color:"#1a2540",fontWeight:700}}>{correct}/{total} correct ({pct}%)</span></div><div style={{height:7,borderRadius:4,overflow:"hidden",background:"#e2e8f0"}}><div style={{width:pct+"%",height:"100%",background:clA,transition:"width .6s"}}/></div></div>;})}
              <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                <div style={{flex:1,background:"#EBF0FA",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,margin:0}}>{perfects}</p><p style={{color:"#64748b",fontSize:10,margin:0}}>Perfect picks</p></div>
                <div style={{flex:1,background:"#f0fdf4",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><p className="C" style={{color:"#15803d",fontSize:18,fontWeight:800,margin:0}}>{tot?Math.round((tossCorrect+winCorrect+motmCorrect)/(tot*3)*100):0}%</p><p style={{color:"#64748b",fontSize:10,margin:0}}>Avg accuracy</p></div>
                <div style={{flex:1,background:"#FFF9E6",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><p className="C" style={{color:"#92400E",fontSize:18,fontWeight:800,margin:0}}>{tot-perfects}</p><p style={{color:"#64748b",fontSize:10,margin:0}}>Missed perfect</p></div>
              </div>
              {(()=>{const counts={};Object.values(allPicks).forEach(u=>{const p=u[m.id]??u[String(m.id)];if(p?.motm)counts[p.motm]=(counts[p.motm]||0)+1;});const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);if(!sorted.length)return null;return <div style={{marginTop:10}}><p style={{color:"#64748b",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>⭐ POTM Guesses</p>{sorted.map(([name,cnt])=>{const pct=Math.round(cnt/tot*100),isRight=motmMatch(name,m.result.motm);return <div key={name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:11,color:isRight?"#15803d":"#64748b",fontWeight:isRight?700:400,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isRight?"✓ ":""}{name}</span><div style={{width:80,height:5,borderRadius:3,background:"#e2e8f0",flexShrink:0}}><div style={{width:pct+"%",height:"100%",borderRadius:3,background:isRight?"#15803d":"#94a3b8"}}/></div><span style={{fontSize:10,color:"#94a3b8",minWidth:28,textAlign:"right"}}>{cnt}</span></div>;})}</div>;})()}
            </div>}
          </div>;
        })}
      </>}

      {/* USERS TAB */}
      {admTab==="users"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{color:"#64748b",fontSize:12,margin:0}}>{Object.keys(users).length} players registered</p>
          <button onClick={exportCSV} style={{padding:"6px 12px",borderRadius:8,background:"#EBF0FA",color:"#1D428A",border:"1px solid #bfdbfe",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase"}}>Export CSV</button>
        </div>
        <input className="inp" value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search by name or email…" style={{marginBottom:12,fontSize:13}}/>
        {Object.values(users).filter(u=>!userSearch||u.name?.toLowerCase().includes(userSearch.toLowerCase())||u.email?.toLowerCase().includes(userSearch.toLowerCase())).sort((a,b)=>(lbScores[b.email]?.pts||0)-(lbScores[a.email]?.pts||0)).map(u=>{
          const st=lbScores[u.email]||{pts:0,acc:0,userSp:"",userT4:[]};const up=allPicks[ek(u.email)]||{};const ex2=exU===u.email;const adj=getManualAdj(u.email);const mOv=getMatchOverride(u.email);
          return <div key={u.email} style={{background:"#fff",border:"1px solid "+(u.email===email?"#1D428A40":"#e2e8f0"),borderRadius:12,marginBottom:10,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setExU(ex2?null:u.email)}>
              <Av name={u.name} sz={34}/>
              <div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}{u.email===SUPER_ADMIN?" 👑":""}</p><p style={{color:"#94a3b8",fontSize:11,margin:"1px 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{Object.keys(up).length} picks · {st.acc}% · 🏆 {st.userSp||"—"}</p></div>
              <div style={{textAlign:"right"}}><p className="C" style={{color:"#1D428A",fontSize:17,fontWeight:800,margin:0}}>{st.pts}</p>{(adj+mOv)!==0&&<p style={{color:"#FF822A",fontSize:9,margin:0,fontWeight:600}}>{adj+mOv>0?"+":""}{adj+mOv} adj</p>}<p style={{color:"#94a3b8",fontSize:10,margin:"1px 0 0"}}>{ex2?"▲":"▼"}</p></div>
            </div>
            {ex2&&<div style={{padding:"0 14px 14px",borderTop:"1px solid #f1f5f9"}}>
              <p className="st" style={{marginTop:12}}>POINTS ADJUSTMENT</p>
              <div style={{display:"flex",gap:8,marginBottom:8}}>{[-50,-25,-10,10,25,50].map(d=><button key={d} onClick={()=>adjustPts(u.email,d)} style={{flex:1,padding:"7px 4px",borderRadius:8,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12}}>{d>0?"+":""}{d}</button>)}</div>
              {adj!==0&&<p style={{color:"#FF822A",fontSize:11,fontWeight:600,marginBottom:12}}>Current adj: {adj>0?"+":""}{adj} pts</p>}
              <p className="st">PER-MATCH OVERRIDE</p>
              {ms.filter(m=>up[m.id]||up[String(m.id)]).map(m=>{const emk=ek(u.email);const mOvM=((matchPtsOverride[emk]||{})[m.id])??0;return <div key={m.id} style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><TLogo t={m.home} sz={16}/><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={16}/><span style={{color:"#64748b",fontSize:11,flex:1}}>{m.mn}</span>{mOvM!==0&&<span style={{color:"#FF822A",fontSize:11,fontWeight:700}}>{mOvM>0?"+":""}{mOvM} pts</span>}</div><div style={{display:"flex",gap:6}}>{[-25,-10,-5,5,10,25].map(d=><button key={d} onClick={()=>setMatchPts(u.email,m.id,d)} style={{flex:1,padding:"5px 2px",borderRadius:6,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11}}>{d>0?"+":""}{d}</button>)}</div></div>;})}
              {u.email!==SUPER_ADMIN&&u.email!==email&&<button onClick={()=>deleteUser(u.email)} className="dbtn" style={{marginTop:12}}>🗑️ Delete Account</button>}
            </div>}
          </div>;
        })}
      </>}

      {/* MATCHES TAB */}
      {admTab==="matches"&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
        <p className="st">ADD CUSTOM MATCH</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div><p style={{color:"#64748b",fontSize:10,fontWeight:600,margin:"0 0 4px",textTransform:"uppercase"}}>Match Label</p><input className="inp" value={manMatchForm.mn} onChange={e=>setManMatchForm(f=>({...f,mn:e.target.value}))} placeholder="e.g. M75" style={{fontSize:13}}/></div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}><p style={{color:"#64748b",fontSize:10,fontWeight:600,margin:"0 0 4px",textTransform:"uppercase"}}>Home</p><select className="sel" value={manMatchForm.home} onChange={e=>setManMatchForm(f=>({...f,home:e.target.value}))}>{TEAMS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div style={{flex:1}}><p style={{color:"#64748b",fontSize:10,fontWeight:600,margin:"0 0 4px",textTransform:"uppercase"}}>Away</p><select className="sel" value={manMatchForm.away} onChange={e=>setManMatchForm(f=>({...f,away:e.target.value}))}>{TEAMS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}><p style={{color:"#64748b",fontSize:10,fontWeight:600,margin:"0 0 4px",textTransform:"uppercase"}}>Date</p><input className="inp" type="date" value={manMatchForm.date} onChange={e=>setManMatchForm(f=>({...f,date:e.target.value}))} style={{fontSize:13}}/></div>
            <div style={{flex:1}}><p style={{color:"#64748b",fontSize:10,fontWeight:600,margin:"0 0 4px",textTransform:"uppercase"}}>Time IST</p><input className="inp" value={manMatchForm.time} onChange={e=>setManMatchForm(f=>({...f,time:e.target.value}))} placeholder="19:30" style={{fontSize:13}}/></div>
          </div>
          <div><p style={{color:"#64748b",fontSize:10,fontWeight:600,margin:"0 0 4px",textTransform:"uppercase"}}>Venue</p><input className="inp" value={manMatchForm.venue} onChange={e=>setManMatchForm(f=>({...f,venue:e.target.value}))} placeholder="Stadium, City" style={{fontSize:13}}/></div>
          <button onClick={addManualMatch} className="pbtn">Add Match</button>
        </div>
      </div>}

      {/* ANALYTICS TAB */}
      {admTab==="analytics"&&<>{(()=>{const mwp=ms.filter(m=>Object.values(allPicks).some(u=>u[m.id]||u[String(m.id)]));if(!mwp.length)return <div style={{textAlign:"center",padding:"40px 16px"}}><p style={{fontSize:36}}>📊</p><p style={{color:"#94a3b8",marginTop:12}}>No picks yet</p></div>;return mwp.map(m=>{const allArr=Object.values(allPicks);const tot=allArr.filter(u=>u[m.id]||u[String(m.id)]).length;const sp2=tot?{tot,tA:allArr.filter(u=>(u[m.id]??u[String(m.id)])?.toss===m.home).length,tB:tot-allArr.filter(u=>(u[m.id]??u[String(m.id)])?.toss===m.home).length,wA:allArr.filter(u=>(u[m.id]??u[String(m.id)])?.win===m.home).length,wB:tot-allArr.filter(u=>(u[m.id]??u[String(m.id)])?.win===m.home).length}:null;const io=anM===m.id;const hc=TC[m.home]||{bg:"#1D428A"},ac=TC[m.away]||{bg:"#555"};return <div key={m.id} className="ac" style={{cursor:"pointer"}} onClick={()=>setAnM(io?null:m.id)}><div style={{display:"flex",alignItems:"center",gap:10}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home} vs {m.away}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{sp2?.tot||0} picks · {m.mn}</p></div><span style={{color:"#1D428A",fontSize:14}}>{io?"▲":"▼"}</span></div>{io&&sp2&&<div style={{marginTop:12,borderTop:"1px solid #f1f5f9",paddingTop:12}} onClick={e=>e.stopPropagation()}><SBar lbl="Toss" tA={m.home} tB={m.away} cA={sp2.tA} cB={sp2.tB} clA={hc.bg} clB={ac.bg}/><SBar lbl="Winner" tA={m.home} tB={m.away} cA={sp2.wA} cB={sp2.wB} clA={hc.bg} clB={ac.bg}/></div>}</div>;});})()}</>}

      {/* CONTROLS TAB */}
      {admTab==="controls"&&<div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">APP CONTROLS</p>
          <div className="ctrl-row"><div><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>🔧 Maintenance Mode</p><p style={{color:"#94a3b8",fontSize:11,margin:"2px 0 0"}}>Locks app for non-admins</p></div><Toggle on={maintenance} onChange={toggleMaintenance}/></div>
          <div className="ctrl-row"><div><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>📤 Export Leaderboard CSV</p></div><button onClick={exportCSV} style={{padding:"7px 14px",borderRadius:8,background:"#EBF0FA",color:"#1D428A",border:"1px solid #bfdbfe",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12}}>Export</button></div>
          <div className="ctrl-row"><div><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>🔇 Mute All Chat</p></div><Toggle on={!!chatMuted} onChange={async v=>{setChatMuted(v);await DB.set("chatmuted",v);toast2(v?"Chat muted":"Chat reopened");}}/></div>
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">⚡ DOUBLE POINTS MATCH</p>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:10}}>All predictions for this match count 2×</p>
          {ms.filter(m=>!m.result&&!isTBD(m)).slice(0,8).map(m=>{const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);return <div key={m.id} className="ctrl-row" style={{padding:"10px 0"}}><div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}><TLogo t={m.home} sz={16}/><span className="C" style={{fontSize:11,fontWeight:700}}>{m.home}</span><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={16}/><span className="C" style={{fontSize:11,fontWeight:700}}>{m.away}</span><span style={{color:"#94a3b8",fontSize:10,marginLeft:4}}>{m.mn}</span></div><button onClick={async()=>{const v=isDouble?null:m.id;setDoubleMatch(v);await DB.set("doublematch",v);toast2(v?"⚡ 2× set for "+m.mn:"2× removed");}} style={{padding:"5px 10px",borderRadius:8,background:isDouble?"linear-gradient(135deg,#FF822A,#D4AF37)":"#f8faff",color:isDouble?"#fff":"#64748b",border:"1px solid "+(isDouble?"#FF822A":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0}}>{isDouble?"2× ON":"Set 2×"}</button></div>;})}
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">SET IPL 2026 CHAMPION</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>{TEAMS.map(t=><button key={t} onClick={()=>setSeasonWinner(t)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:sw===t?"#1D428A":"#f8faff",border:"1.5px solid "+(sw===t?"#1D428A":"#e2e8f0"),cursor:"pointer"}}><TLogo t={t} sz={20}/><span className="C" style={{fontSize:12,fontWeight:700,color:sw===t?"#fff":"#475569"}}>{t}</span>{sw===t&&<span style={{fontSize:10}}>🏆</span>}</button>)}</div>
          {sw&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#15803d"}}>Champion: <b>{sw}</b></div>}
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">🔒 LOCK / UNLOCK MATCHES</p>
          <p style={{color:"#94a3b8",fontSize:11,marginBottom:10}}>Tap to cycle: Auto → Force Lock → Force Unlock</p>
          {ms.filter(m=>!m.result&&!isTBD(m)).map(m=>{const lstate=lockedMatches[m.id]??lockedMatches[String(m.id)];return <div key={m.id} className="ctrl-row"><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn}: {m.home} vs {m.away}</p><p style={{color:"#94a3b8",fontSize:11,margin:"1px 0 0"}}>{m.date} · {m.time}</p></div><button onClick={()=>toggleMatchLock(m.id)} style={{padding:"6px 12px",borderRadius:8,background:lstate==="locked"?"#fee2e2":lstate==="unlocked"?"#dcfce7":"#f1f5f9",color:lstate==="locked"?"#dc2626":lstate==="unlocked"?"#15803d":"#64748b",border:"1px solid "+(lstate==="locked"?"#fecaca":lstate==="unlocked"?"#bbf7d0":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0,textTransform:"uppercase",minWidth:90}}>{lstate==="locked"?"🔒 Locked":lstate==="unlocked"?"🔓 Unlocked":"⚙️ Auto"}</button></div>;})}
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">💬 MUTE USERS</p>
          {Object.values(users).filter(u=>u.email!==email).map(u=>{const isMuted=(mutedUsers||{})[ek(u.email)];return <div key={u.email} className="ctrl-row"><div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}><Av name={u.name} sz={24}/><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{u.name}</p></div><button onClick={async()=>{const upd={...(mutedUsers||{}),[ek(u.email)]:!isMuted};setMutedUsers(upd);await DB.set("mutedusers",upd);toast2((!isMuted?"🔇 Muted ":"🔊 Unmuted ")+u.name);}} style={{padding:"5px 10px",borderRadius:8,background:isMuted?"#fef2f2":"#f8faff",color:isMuted?"#dc2626":"#64748b",border:"1px solid "+(isMuted?"#fecaca":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0,textTransform:"uppercase"}}>{isMuted?"Unmute":"Mute"}</button></div>;})}
          {Object.values(users).filter(u=>u.email!==email).length===0&&<p style={{color:"#94a3b8",fontSize:12}}>No other users yet.</p>}
        </div>
        <div style={{background:"#fff",border:"1px solid #fecaca",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st" style={{color:"#dc2626",borderColor:"#fecaca"}}>⚠️ DANGER ZONE</p>
          <div className="ctrl-row">
            <div><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>🗑️ Reset Season</p><p style={{color:"#94a3b8",fontSize:11,margin:"2px 0 0"}}>Wipes all picks, results, pts — irreversible.</p></div>
            <button onClick={async()=>{if(!confirm("RESET entire season? Cannot be undone."))return;await Promise.all([DB.set("ap",{}),DB.set("rm",{}),DB.set("sp",{}),DB.set("t4",{}),DB.set("ptsadj",{}),DB.set("doublematch",null),DB.set("sw",null),DB.set("matchptsoverride",{}),DB.set("manmatches",[]),DB.set("bracket",null),DB.set("lockedm",{})]);setAllPicks({});setMyPicks({});setMs(buildBaseMatches());setManualPtsAdj({});setSw(null);setDoubleMatch(null);setMatchPtsOverride({});setBracket(null);setLockedMatches({});setSpk({});setT4pk({});setMySp("");setMyT4([]);toast2("Season reset","ok");}} style={{padding:"7px 10px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",flexShrink:0}}>Reset</button>
          </div>
        </div>
      </div>}

      {/* BROADCAST TAB */}
      {admTab==="broadcast"&&<>
        <div className="ac">
          <p className="st">SEND BROADCAST</p>
          <textarea className="inp" value={bcMsg} onChange={e=>setBcMsg(e.target.value)} placeholder="Message for everyone's Home tab…" rows={3} style={{resize:"none",marginBottom:12,lineHeight:1.5}}/>
          <div style={{display:"flex",gap:8}}><button onClick={()=>sendBc(false)} className="pbtn" style={{flex:2}}>Send</button><button onClick={()=>sendBc(true)} style={{flex:1,padding:"11px",borderRadius:10,background:"#1D428A",color:"#FFE57F",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,border:"none",cursor:"pointer"}}>📌 Pin</button></div>
          {pinnedBc&&<div style={{marginTop:12,background:"#1D428A",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#fff",fontSize:12,fontWeight:600}}>📌 {pinnedBc}</span><button onClick={clearPin} style={{background:"none",border:"none",color:"#bfdbfe",cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button></div>}
        </div>
        <p className="st" style={{marginTop:16}}>BROADCAST HISTORY</p>
        {bc.length===0&&<p style={{color:"#94a3b8",fontSize:12}}>No broadcasts yet</p>}
        {[...bc].reverse().map(b=><div key={b.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:15,flexShrink:0}}>📢</span><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:13,margin:"0 0 3px"}}>{b.msg}</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>{new Date(b.ts).toLocaleString("en-IN",{timeZone:"Asia/Kolkata",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true})}</p></div><button onClick={async()=>{const nb=bc.filter(x=>x.id!==b.id);setBc(nb);await DB.set("bc",nb);}} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14,padding:"2px 6px"}}>×</button></div>)}
      </>}
    </div>}

    <Nav/>
    {toast&&<Tst t={toast}/>}
  </div>;
}