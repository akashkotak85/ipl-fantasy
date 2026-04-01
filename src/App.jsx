import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const LOGOS={IPL:"https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",RCB:"https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",SRH:"https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",MI:"https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",KKR:"https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",CSK:"https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",RR:"https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",PBKS:"https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",GT:"https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",LSG:"https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",DC:"https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png"};
const TC={RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"}};
const TF={RCB:"Royal Challengers Bengaluru",SRH:"Sunrisers Hyderabad",MI:"Mumbai Indians",KKR:"Kolkata Knight Riders",CSK:"Chennai Super Kings",RR:"Rajasthan Royals",PBKS:"Punjab Kings",GT:"Gujarat Titans",LSG:"Lucknow Super Giants",DC:"Delhi Capitals"};
const TEAMS=Object.keys(TF);
const SQ={RCB:["Rajat Patidar","Virat Kohli","Devdutt Padikkal","Phil Salt","Jitesh Sharma","Krunal Pandya","Tim David","Venkatesh Iyer","Jacob Bethell","Josh Hazlewood","Bhuvneshwar Kumar","Yash Dayal","Rasikh Dar","Jacob Duffy"],SRH:["Pat Cummins","Travis Head","Ishan Kishan","Heinrich Klaasen","Abhishek Sharma","Nitish Kumar Reddy","Liam Livingstone","Harshal Patel","Brydon Carse","Jaydev Unadkat","Shivam Mavi","David Payne"],MI:["Rohit Sharma","Hardik Pandya","Suryakumar Yadav","Jasprit Bumrah","Trent Boult","Tilak Varma","Ryan Rickelton","Quinton de Kock","Deepak Chahar","Shardul Thakur","Mitchell Santner","Will Jacks"],KKR:["Ajinkya Rahane","Sunil Narine","Rinku Singh","Cameron Green","Rachin Ravindra","Finn Allen","Varun Chakaravarthy","Matheesha Pathirana","Blessing Muzarabani","Rovman Powell","Vaibhav Arora"],CSK:["Ruturaj Gaikwad","MS Dhoni","Sanju Samson","Shivam Dube","Ayush Mhatre","Dewald Brevis","Khaleel Ahmed","Noor Ahmad","Anshul Kamboj","Prashant Veer","Kartik Sharma","Akeal Hosein"],RR:["Riyan Parag","Yashasvi Jaiswal","Vaibhav Suryavanshi","Jofra Archer","Ravindra Jadeja","Dhruv Jurel","Shimron Hetmyer","Ravi Bishnoi","Sandeep Sharma","Adam Milne","Nandre Burger"],PBKS:["Shreyas Iyer","Arshdeep Singh","Shashank Singh","Marcus Stoinis","Prabhsimran Singh","Marco Jansen","Yuzvendra Chahal","Priyansh Arya","Musheer Khan","Lockie Ferguson","Xavier Bartlett"],GT:["Shubman Gill","Jos Buttler","Rashid Khan","Kagiso Rabada","Mohammed Siraj","Sai Sudharsan","Washington Sundar","Prasidh Krishna","Rahul Tewatia","Jayant Yadav","Jason Holder"],LSG:["Rishabh Pant","Mitchell Marsh","Nicholas Pooran","Aiden Markram","Mohammad Shami","Avesh Khan","Wanindu Hasaranga","Mayank Yadav","Anrich Nortje","Abdul Samad","Ayush Badoni"],DC:["Axar Patel","KL Rahul","Kuldeep Yadav","Mitchell Starc","T. Natarajan","Karun Nair","Prithvi Shaw","Abishek Porel","Sameer Rizvi","David Miller","Tristan Stubbs","Nitish Rana"]};

const MATCHES=[
  {id:1,mn:"M1",home:"RCB",away:"SRH",date:"2026-03-28",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:2,mn:"M2",home:"MI",away:"KKR",date:"2026-03-29",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:3,mn:"M3",home:"RR",away:"CSK",date:"2026-03-30",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:4,mn:"M4",home:"PBKS",away:"GT",date:"2026-03-31",time:"19:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:5,mn:"M5",home:"LSG",away:"DC",date:"2026-04-01",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:6,mn:"M6",home:"KKR",away:"SRH",date:"2026-04-02",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:7,mn:"M7",home:"CSK",away:"PBKS",date:"2026-04-03",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:8,mn:"M8",home:"DC",away:"RCB",date:"2026-04-04",time:"10:00",venue:"Arun Jaitley Stadium, Delhi"},
  {id:9,mn:"M9",home:"SRH",away:"CSK",date:"2026-04-04",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:10,mn:"M10",home:"MI",away:"RR",date:"2026-04-05",time:"15:30",venue:"Wankhede Stadium, Mumbai"},
  {id:11,mn:"M11",home:"PBKS",away:"LSG",date:"2026-04-05",time:"19:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:12,mn:"M12",home:"GT",away:"KKR",date:"2026-04-06",time:"15:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:13,mn:"M13",home:"RCB",away:"MI",date:"2026-04-08",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:14,mn:"M14",home:"GT",away:"DC",date:"2026-04-07",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:15,mn:"M15",home:"LSG",away:"KKR",date:"2026-04-09",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:16,mn:"M16",home:"RR",away:"SRH",date:"2026-04-10",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:17,mn:"M17",home:"CSK",away:"GT",date:"2026-04-11",time:"15:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:18,mn:"M18",home:"DC",away:"MI",date:"2026-04-11",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:19,mn:"M19",home:"KKR",away:"PBKS",date:"2026-04-12",time:"15:30",venue:"Eden Gardens, Kolkata"},
  {id:20,mn:"M20",home:"RCB",away:"LSG",date:"2026-04-12",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:21,mn:"M21",home:"SRH",away:"RR",date:"2026-04-13",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:22,mn:"M22",home:"MI",away:"CSK",date:"2026-04-14",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:23,mn:"M23",home:"GT",away:"RCB",date:"2026-04-15",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:24,mn:"M24",home:"DC",away:"KKR",date:"2026-04-16",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:25,mn:"M25",home:"LSG",away:"SRH",date:"2026-04-17",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:26,mn:"M26",home:"PBKS",away:"RR",date:"2026-04-18",time:"15:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:27,mn:"M27",home:"CSK",away:"RCB",date:"2026-04-18",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:28,mn:"M28",home:"MI",away:"GT",date:"2026-04-19",time:"15:30",venue:"Wankhede Stadium, Mumbai"},
  {id:29,mn:"M29",home:"KKR",away:"LSG",date:"2026-04-19",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:30,mn:"M30",home:"SRH",away:"DC",date:"2026-04-20",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:31,mn:"M31",home:"RR",away:"PBKS",date:"2026-04-21",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:32,mn:"M32",home:"RCB",away:"KKR",date:"2026-04-22",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:33,mn:"M33",home:"GT",away:"LSG",date:"2026-04-23",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:34,mn:"M34",home:"DC",away:"CSK",date:"2026-04-24",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:35,mn:"M35",home:"MI",away:"SRH",date:"2026-04-25",time:"15:30",venue:"Wankhede Stadium, Mumbai"},
  {id:36,mn:"M36",home:"PBKS",away:"RCB",date:"2026-04-25",time:"19:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:37,mn:"M37",home:"KKR",away:"RR",date:"2026-04-26",time:"15:30",venue:"Eden Gardens, Kolkata"},
  {id:38,mn:"M38",home:"LSG",away:"GT",date:"2026-04-26",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:39,mn:"M39",home:"CSK",away:"DC",date:"2026-04-27",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:40,mn:"M40",home:"SRH",away:"MI",date:"2026-04-28",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:41,mn:"M41",home:"RR",away:"GT",date:"2026-04-29",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:42,mn:"M42",home:"RCB",away:"DC",date:"2026-04-30",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:43,mn:"M43",home:"PBKS",away:"KKR",date:"2026-05-01",time:"19:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:44,mn:"M44",home:"LSG",away:"CSK",date:"2026-05-02",time:"15:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:45,mn:"M45",home:"GT",away:"SRH",date:"2026-05-02",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:46,mn:"M46",home:"MI",away:"DC",date:"2026-05-03",time:"15:30",venue:"Wankhede Stadium, Mumbai"},
  {id:47,mn:"M47",home:"KKR",away:"CSK",date:"2026-05-03",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:48,mn:"M48",home:"RR",away:"RCB",date:"2026-05-04",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:49,mn:"M49",home:"PBKS",away:"SRH",date:"2026-05-05",time:"19:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:50,mn:"M50",home:"GT",away:"MI",date:"2026-05-06",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:51,mn:"M51",home:"DC",away:"LSG",date:"2026-05-07",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:52,mn:"M52",home:"CSK",away:"KKR",date:"2026-05-08",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:53,mn:"M53",home:"SRH",away:"RCB",date:"2026-05-09",time:"15:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:54,mn:"M54",home:"RR",away:"MI",date:"2026-05-09",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:55,mn:"M55",home:"PBKS",away:"DC",date:"2026-05-10",time:"15:30",venue:"Mullanpur Stadium, Chandigarh"},
  {id:56,mn:"M56",home:"GT",away:"CSK",date:"2026-05-10",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:57,mn:"M57",home:"KKR",away:"RCB",date:"2026-05-11",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:58,mn:"M58",home:"LSG",away:"RR",date:"2026-05-12",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:59,mn:"M59",home:"MI",away:"PBKS",date:"2026-05-13",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:60,mn:"M60",home:"DC",away:"SRH",date:"2026-05-14",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:61,mn:"M61",home:"RCB",away:"GT",date:"2026-05-15",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:62,mn:"M62",home:"CSK",away:"LSG",date:"2026-05-16",time:"15:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:63,mn:"M63",home:"KKR",away:"MI",date:"2026-05-16",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:64,mn:"M64",home:"RR",away:"DC",date:"2026-05-17",time:"15:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:65,mn:"M65",home:"SRH",away:"PBKS",date:"2026-05-17",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:66,mn:"M66",home:"GT",away:"RR",date:"2026-05-18",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:67,mn:"M67",home:"MI",away:"LSG",date:"2026-05-19",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:68,mn:"M68",home:"DC",away:"PBKS",date:"2026-05-20",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:69,mn:"M69",home:"RCB",away:"CSK",date:"2026-05-21",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:70,mn:"M70",home:"KKR",away:"GT",date:"2026-05-22",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:71,mn:"M71",home:"SRH",away:"LSG",date:"2026-05-23",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:72,mn:"M72",home:"RR",away:"KKR",date:"2026-05-24",time:"15:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:73,mn:"M73",home:"CSK",away:"MI",date:"2026-05-24",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:74,mn:"Q1",home:"TBD1",away:"TBD2",date:"2026-05-27",time:"19:30",venue:"TBD"},
  {id:75,mn:"EL1",home:"TBD3",away:"TBD4",date:"2026-05-28",time:"19:30",venue:"TBD"},
  {id:76,mn:"EL2",home:"TBD",away:"TBD",date:"2026-05-30",time:"19:30",venue:"TBD"},
  {id:77,mn:"Q2",home:"TBD",away:"TBD",date:"2026-05-31",time:"19:30",venue:"TBD"},
  {id:78,mn:"Final",home:"TBD",away:"TBD",date:"2026-06-03",time:"19:30",venue:"TBD"},
];

const PTS={toss:10,win:20,motm:30,streak:15,season:200,top4:50,bonus:25};
const EMOJIK=["fire","cry","aim","rage","clap","boom"];
const EMOJIV={fire:"🔥",cry:"😭",aim:"🎯",rage:"😤",clap:"👏",boom:"🤯"};
const ADMIN_PW="ipl2026admin";
const SESSION_KEY="ipl26_session";

// ─── FIX #6: API helper — key passed via header properly ─────────────────────
async function claudeCall(prompt, useSearch=false){
  try{
    const body={model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:prompt}]};
    if(useSearch) body.tools=[{type:"web_search_20250305",name:"web_search"}];
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json"}
      ,body:JSON.stringify(body)
    });
    if(!r.ok) return "";
    const d=await r.json();
    return (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
  }catch{ return ""; }
}
function parseJ(txt,arr){
  try{const s=txt.indexOf(arr?"[":"{"),e=txt.lastIndexOf(arr?"]":"}");if(s>=0&&e>s)return JSON.parse(txt.slice(s,e+1));}catch{}return null;
}

// ─── FIX #2: Storage — all keys prefixed, reads always re-fetched ─────────────
const PFX="ipl26_";
const DB={
  get:async k=>{
    try{const r=await window.storage.get(PFX+k);return r?JSON.parse(r.value):null;}catch{return null;}
  },
  set:async(k,v)=>{
    try{await window.storage.set(PFX+k,JSON.stringify(v));}catch{}
  }
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const cutoff=m=>{const d=new Date(m.date+"T"+m.time+":00+05:30");return new Date(d-45*60*1000);};
const locked=m=>!!(m.result||new Date()>=cutoff(m));
const isToday=m=>m.date===new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});
const isTBD=m=>m.home.startsWith("TBD")||m.away.startsWith("TBD");

function calcScore(uPicks,ms){
  let pts=0,ok=0,tot=0,ms2={};
  ms.forEach(m=>{
    if(!m.result)return;
    const p=uPicks[m.id];if(!p)return;
    tot++;let mp=0,h=0;
    if(p.toss===m.result.toss){mp+=PTS.toss;h++;}
    if(p.win===m.result.win){mp+=PTS.win;h++;}
    if(p.motm&&m.result.motm&&p.motm===m.result.motm){mp+=PTS.motm;h++;}
    if(h===3)mp+=PTS.streak;
    if(h>0)ok++;
    pts+=mp;ms2[m.id]={pts:mp,h,perf:h===3};
  });
  const lastDone=ms.filter(m=>m.result&&uPicks[m.id]).pop();
  return{pts,acc:tot?Math.round(ok/tot*100):0,ms2,hot:!!(lastDone&&ms2[lastDone.id]?.perf)};
}
function calcBadges(uPicks,ms,allP){
  const b=[],{ms2}=calcScore(uPicks,ms),done=ms.filter(m=>m.result);
  const perf=done.filter(m=>ms2[m.id]?.perf).length;
  if(perf>=1)b.push({id:"p1",ic:"🎯",lb:"Perfect Match",ds:"All 3 correct in one match"});
  if(perf>=3)b.push({id:"p3",ic:"🏅",lb:"Hat-Trick Hero",ds:"3 perfect matches"});
  let ud=0;
  done.forEach(m=>{
    const p=uPicks[m.id];if(!p||p.win!==m.result.win)return;
    const tot2=Object.values(allP).filter(u=>u[m.id]).length||1;
    if(Object.values(allP).filter(u=>u[m.id]?.win===m.result.win).length/tot2<0.5)ud++;
  });
  if(ud>=1)b.push({id:"ud",ic:"🐉",lb:"Underdog King",ds:"Backed the unexpected winner"});
  if(done.filter(m=>ms2[m.id]?.h>=2).length>=3)b.push({id:"con",ic:"💪",lb:"Consistent",ds:"2+ correct in 3 matches"});
  if(Object.keys(uPicks).length>=10)b.push({id:"act",ic:"⚡",lb:"Active Predictor",ds:"Predicted 10+ matches"});
  return b;
}
function calcBonusPts(email,bPicks,bQs,ms){
  let pts=0;
  ms.forEach(m=>{const q=bQs[m.id];if(!q?.answer)return;const p=(bPicks[email]||{})[m.id];if(p===q.answer)pts+=PTS.bonus;});
  return pts;
}
async function fetchResults(cands){
  const list=cands.map(m=>m.mn+": "+m.home+" vs "+m.away+" on "+m.date).join(", ");
  const t=await claudeCall("Find IPL 2026 results for: "+list+". Today "+new Date().toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata",day:"2-digit",month:"short",year:"numeric"})+". Return ONLY JSON array [{\"id\":1,\"toss\":\"RCB\",\"win\":\"RCB\",\"motm\":\"Virat Kohli\"}]. Only completed matches. Return [] if none.",true);
  return parseJ(t,true)||[];
}

// Fetch IPL 2026 playoff qualifiers and update TBD slots
async function fetchPlayoffTeams(){
  const t=await claudeCall(
    "IPL 2026 playoffs: which 4 teams have qualified for the playoffs (top 4 of points table)? "+
    "Also if known, which teams play Qualifier 1 (1st vs 2nd), Eliminator (3rd vs 4th), and the Final? "+
    "Today is "+new Date().toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata",day:"2-digit",month:"short",year:"numeric"})+". "+
    "Return ONLY JSON: {\"top4\":[\"CSK\",\"MI\",\"RCB\",\"KKR\"],\"q1\":[\"CSK\",\"MI\"],\"el\":[\"RCB\",\"KKR\"],\"q2\":null,\"final\":null}. "+
    "Use null for any bracket not yet determined. Teams must be from: RCB,SRH,MI,KKR,CSK,RR,PBKS,GT,LSG,DC.",
    true
  );
  return parseJ(t,false);
}

// Resolve TBD slots in MATCHES based on playoff bracket info
function resolvePlayoffSlots(currentMs, bracket){
  if(!bracket)return currentMs;
  return currentMs.map(m=>{
    let {home,away}={...m};
    // Q1: 1st vs 2nd
    if(m.mn==="Q1"&&bracket.q1?.length===2){home=bracket.q1[0];away=bracket.q1[1];}
    // EL1: 3rd vs 4th
    if(m.mn==="EL1"&&bracket.el?.length===2){home=bracket.el[0];away=bracket.el[1];}
    // EL2 / Q2 / Final stay TBD until decided — but if bracket has them, fill in
    if(m.mn==="EL2"&&bracket.el2?.length===2){home=bracket.el2[0];away=bracket.el2[1];}
    if(m.mn==="Q2"&&bracket.q2?.length===2){home=bracket.q2[0];away=bracket.q2[1];}
    if(m.mn==="Final"&&bracket.final?.length===2){home=bracket.final[0];away=bracket.final[1];}
    return {...m,home,away};
  });
}
async function genBonus(m){
  const hp=(SQ[m.home]||[]).slice(0,4).join(", "),ap=(SQ[m.away]||[]).slice(0,4).join(", ");
  const t=await claudeCall("ONE bonus prediction question for IPL: "+m.home+" vs "+m.away+" on "+m.date+". Players: "+hp+", "+ap+". Return ONLY JSON {\"question\":\"...\",\"optA\":\"Yes\",\"optB\":\"No\"}. Under 60 chars.",false);
  return parseJ(t,false);
}
async function checkBonus(q,optA,optB,res,home,away){
  const t=await claudeCall("IPL "+home+" vs "+away+". Result toss="+res.toss+",winner="+res.win+",POTM="+res.motm+". Bonus: \""+q+"\". Options \""+optA+"\" or \""+optB+"\". Return ONLY JSON {\"answer\":\""+optA+"\"}.",true);
  return parseJ(t,false)?.answer||null;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#F4F6FB;}
.app{font-family:'Barlow',sans-serif;background:#F4F6FB;min-height:100vh;color:#1a2540;max-width:430px;margin:0 auto;}
.C{font-family:'Barlow Condensed',sans-serif;}
.inp{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1px solid #e2e8f0;color:#1a2540;font-size:14px;font-family:'Barlow',sans-serif;outline:none;}
.inp:focus{border-color:#1D428A;}
.pbtn{width:100%;padding:11px;border-radius:10px;background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;}
.lbtn{width:100%;padding:13px;border-radius:10px;background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;letter-spacing:1.5px;text-transform:uppercase;border:none;cursor:pointer;}
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
.lrow{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;margin-bottom:10px;box-shadow:0 1px 4px rgba(29,66,138,.06);}
.lrow.me{border-color:#1D428A60;background:#EBF0FA;}
.cb{max-width:78%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word;}
.cm{background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}
.co{background:#fff;color:#1a2540;border:1px solid #e2e8f0;border-bottom-left-radius:4px;align-self:flex-start;}
.cs{background:#EBF0FA;color:#1D428A;border:1px solid #1D428A20;border-radius:10px;padding:8px 14px;font-size:11px;text-align:center;align-self:center;width:92%;font-weight:600;}
.bd{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;}
.bp{display:inline-flex;align-items:center;gap:4px;background:#EBF0FA;border:1px solid #bfdbfe;border-radius:20px;padding:3px 9px;font-size:11px;color:#1e40af;font-weight:600;margin:3px 3px 0 0;}
.rc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:12px;}
.ot{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 6px;border-radius:12px;border:2px solid #e2e8f0;background:#fff;cursor:pointer;width:76px;transition:all .15s;}
.ot.on{border-color:#1D428A;background:#EBF0FA;}
.ac{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:14px;box-shadow:0 1px 4px rgba(29,66,138,.06);}
.at{flex:1;padding:8px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:10px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
.at.on{color:#1D428A;border-bottom:2px solid #1D428A;}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}
.bell-on{animation:pulse 1.4s infinite;}
.rcard{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:12px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(29,66,138,.07);}
.rcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#FF822A,#D4AF37,#1D428A);}
/* FIX #5: POTM dropdown */
.dd-wrap{position:relative;}
.dd-list{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1.5px solid #1D428A;border-radius:12px;max-height:220px;overflow-y:auto;z-index:200;box-shadow:0 8px 24px rgba(29,66,138,.15);}
.dd-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;transition:background .1s;}
.dd-item:last-child{border-bottom:none;}
.dd-item:hover,.dd-item.sel{background:#EBF0FA;}
.dd-trigger{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1.5px solid #e2e8f0;color:#1a2540;font-size:13px;font-family:'Barlow',sans-serif;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;}
.dd-trigger.open{border-color:#1D428A;}
`;

// ─── Sub-components ───────────────────────────────────────────────────────────
function TLogo({t,sz=48}){
  const[e,sE]=useState(false);
  const c=TC[t]||{bg:"#94a3b8",dk:"#fff"};
  if(e||!TC[t])return <span style={{width:sz,height:sz,borderRadius:8,background:c.bg,color:c.dk,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:sz*.34,flexShrink:0}}>{(t||"?").slice(0,3)}</span>;
  return <img src={LOGOS[t]} alt={t} width={sz} height={sz} onError={()=>sE(true)} style={{objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.25))",maxWidth:sz,maxHeight:sz}}/>;
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

// FIX #5: Proper scrollable dropdown for POTM
function PotmDropdown({homeTeam, awayTeam, value, onChange}){
  const[open,setOpen]=useState(false);
  const ref=useRef();
  const players=[...(SQ[homeTeam]||[]).map(p=>({p,t:homeTeam})),...(SQ[awayTeam]||[]).map(p=>({p,t:awayTeam}))];
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  return <div className="dd-wrap" ref={ref}>
    <button type="button" className={"dd-trigger"+(open?" open":"")} onClick={()=>setOpen(o=>!o)}>
      <span style={{color:value?"#1D428A":"#94a3b8",fontWeight:value?700:400}}>{value||"Select Player of the Match…"}</span>
      <span style={{fontSize:12,color:"#94a3b8"}}>{open?"▲":"▼"}</span>
    </button>
    {open&&<div className="dd-list">
      {players.map(({p,t})=>{
        const c=TC[t]||{bg:"#333",dk:"#fff"};
        return <div key={p} className={"dd-item"+(value===p?" sel":"")} onClick={()=>{onChange(p);setOpen(false);}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:c.bg,flexShrink:0}}/>
          <TLogo t={t} sz={18}/>
          <span style={{flex:1,fontSize:13,color:value===p?"#1D428A":"#475569",fontWeight:value===p?600:400}}>{p}</span>
          <span style={{background:c.bg,color:c.dk||"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,flexShrink:0}}>{t}</span>
        </div>;
      })}
    </div>}
  </div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[sc,setSc]=useState("splash");
  // FIX #1: session persisted to localStorage
  const[email,setEmail]=useState(()=>localStorage.getItem(SESSION_KEY)||"");
  const[password,setPassword]=useState("");
  const[showPw,setShowPw]=useState(false);
  const[forgotMode,setForgotMode]=useState(false);
  const[user,setUser]=useState(null);
  // FIX #3: users/allPicks loaded fresh from DB on every relevant action
  const[users,setUsers]=useState({});
  const[myPicks,setMyPicks]=useState({});
  const[allPicks,setAllPicks]=useState({});
  const[ms,setMs]=useState(MATCHES.map(m=>({...m,result:null})));
  const[spk,setSpk]=useState({});
  const[mySp,setMySp]=useState("");
  const[t4pk,setT4pk]=useState({});
  const[myT4,setMyT4]=useState([]);
  const[sw,setSw]=useState(null);
  const[bc,setBc]=useState([]);
  const[chat,setChat]=useState([]);
  const[chatIn,setChatIn]=useState("");
  const[chatU,setChatU]=useState(0);
  const[htab,setHtab]=useState("today");
  const[am,setAm]=useState(null);
  const[draft,setDraft]=useState({});
  const[isAdm,setIsAdm]=useState(false);
  const[admPw,setAdmPw]=useState("");
  const[admTab,setAdmTab]=useState("results");
  const[bcMsg,setBcMsg]=useState("");
  const[exU,setExU]=useState(null);
  const[anM,setAnM]=useState(null);
  const[fetching,setFetching]=useState(false);
  const[lastF,setLastF]=useState(0);
  const[bqs,setBqs]=useState({});
  const[bpk,setBpk]=useState({});
  const[rxns,setRxns]=useState({});
  const[obStep,setObStep]=useState(0);
  const[obSp,setObSp]=useState("");
  const[obT4,setObT4]=useState([]);
  const[toast,setToast]=useState(null);
  const[reminders,setReminders]=useState({});
  const[remTab,setRemTab]=useState("upcoming");
  const[bracket,setBracket]=useState(null);
  const[lastBracketF,setLastBracketF]=useState(0);
  const tRef=useRef();const chatRef=useRef();const pollRef=useRef();const remTimers=useRef({});

  const toast2=(msg,type="info")=>{setToast({msg,type});clearTimeout(tRef.current);tRef.current=setTimeout(()=>setToast(null),3500);};

  // FIX #3: helper to reload all shared state from DB
  const reloadShared=useCallback(async()=>{
    const[ap,u,rm,b,cm,sp,sw2,t4,bq,bp,rx,rms]=await Promise.all([
      DB.get("ap"),DB.get("u"),DB.get("rm"),DB.get("bc"),DB.get("ch"),
      DB.get("sp"),DB.get("sw"),DB.get("t4"),DB.get("bq"),DB.get("bp"),DB.get("rx"),DB.get("rms")
    ]);
    if(u){setUsers(u);}
    const br=await DB.get("bracket");if(br){setBracket(br);setMs(prev=>resolvePlayoffSlots(prev,br));}
    // always get fresh allPicks
    const freshAP=ap||{};
    setAllPicks(freshAP);
    if(rm)setMs(prev=>prev.map(m=>rm[m.id]?{...m,...rm[m.id]}:m));
    if(b)setBc(b);if(cm)setChat(cm);if(sp)setSpk(sp);if(sw2)setSw(sw2);if(t4)setT4pk(t4);
    if(bq)setBqs(bq);if(bp)setBpk(bp);if(rx)setRxns(rx);if(rms)setReminders(rms);
    return freshAP;
  },[]);

  // FIX #1: on mount, check saved session and auto-login
  useEffect(()=>{
    (async()=>{
      const savedEmail=localStorage.getItem(SESSION_KEY);
      if(savedEmail){
        const freshAP=await reloadShared();
        const u2=await DB.get("u")||{};
        const ex=u2[savedEmail];
        if(ex){
          setUser(ex);setEmail(savedEmail);
          setMyPicks(freshAP[savedEmail]||{});
          const sp=await DB.get("sp")||{};setMySp(sp[savedEmail]||"");
          const t4=await DB.get("t4")||{};setMyT4(t4[savedEmail]||[]);
          setTimeout(()=>setSc("home"),1400);
          return;
        }
      }
      setTimeout(()=>setSc("login"),1600);
    })();
  },[]);

  // reminder timers
  useEffect(()=>{
    Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));
    remTimers.current={};
    Object.keys(reminders).forEach(mid=>{
      if(!reminders[mid])return;
      const m=MATCHES.find(x=>x.id===parseInt(mid));if(!m)return;
      const alertAt=cutoff(m).getTime()-30*60*1000;
      const diff=alertAt-Date.now();
      if(diff>0&&diff<24*60*60*1000){
        remTimers.current[mid]=setTimeout(()=>toast2("⏰ "+m.home+" vs "+m.away+" locks in 30 mins!","info"),diff);
      }
    });
    return()=>Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));
  },[reminders]);

  // Auto-fetch playoff bracket once league phase is nearly done (after M65+)
  useEffect(()=>{
    const leagueDone=ms.filter(m=>!isTBD(m)&&m.result).length;
    // Start checking once 60+ league matches have results, every 2h
    if(leagueDone<60)return;
    const run=async()=>{
      const now=Date.now();
      if(now-lastBracketF<7200000)return; // 2h throttle
      // Only run if any playoff slot is still TBD
      const hasTbd=ms.some(m=>isTBD(m)&&!m.result);
      if(!hasTbd)return;
      try{
        const br=await fetchPlayoffTeams();
        if(br?.top4?.length===4){
          setBracket(br);
          setMs(prev=>resolvePlayoffSlots(prev,br));
          await DB.set("bracket",br);
          setLastBracketF(now);
          toast2("🏆 Playoff bracket updated!","ok");
        }
      }catch{}
    };
    run();
    const id=setInterval(run,7200000);
    return()=>clearInterval(id);
  },[ms,lastBracketF]);

  // bonus question generation
  useEffect(()=>{
    if(!user)return;
    const toGen=ms.filter(m=>isToday(m)&&!bqs[m.id]&&!isTBD(m));
    if(!toGen.length)return;
    toGen.forEach(async m=>{
      setBqs(prev=>({...prev,[m.id]:{loading:true}}));
      const q=await genBonus(m);
      const upd={...bqs,[m.id]:q?{...q,loading:false,answer:null}:{loading:false,failed:true}};
      setBqs(upd);await DB.set("bq",upd);
    });
  },[user,ms]);

  // auto result fetch
  useEffect(()=>{
    const run=async()=>{
      const now=Date.now();if(now-lastF<600000)return;
      const cands=ms.filter(m=>{if(m.result||isTBD(m))return false;const s=new Date(m.date+"T"+m.time+":00+05:30");return now>s.getTime()+210*60*1000;});
      if(!cands.length)return;
      setFetching(true);
      try{
        const res=await fetchResults(cands);
        if(res.length){
          const nm=ms.map(m=>{const r=res.find(x=>x.id===m.id);return r?{...m,result:{toss:r.toss,win:r.win,motm:r.motm},status:"completed"}:m;});
          setMs(nm);
          const saved={};nm.forEach(m=>{if(m.result)saved[m.id]={result:m.result,status:"completed"};});
          await DB.set("rm",saved);
          // FIX #3: reload allPicks fresh before computing perfects
          const freshAP=(await DB.get("ap"))||{};setAllPicks(freshAP);
          let ubq={...bqs};
          for(const r of res){
            const m=nm.find(x=>x.id===r.id);const q=ubq[m?.id];
            if(m&&q&&!q.answer&&!q.loading&&!q.failed){
              const ans=await checkBonus(q.question,q.optA,q.optB,{toss:r.toss,win:r.win,motm:r.motm},m.home,m.away);
              if(ans)ubq={...ubq,[m.id]:{...q,answer:ans}};
            }
          }
          setBqs(ubq);await DB.set("bq",ubq);
          const cu=await DB.get("u")||{};
          const newCh=[...chat];
          res.forEach(r=>{
            const m=nm.find(x=>x.id===r.id);if(!m)return;
            const perfs=Object.entries(freshAP).filter(([,up])=>{const p=up[r.id];return p&&p.toss===r.toss&&p.win===r.win&&p.motm===r.motm;}).map(([em])=>cu[em]?.name||em);
            newCh.push({id:Date.now()+r.id,email:"__sys__",name:"IPL Bot",text:"Result: "+m.home+" vs "+m.away+"\nWinner: "+r.win+" · POTM: "+r.motm+(perfs.length?"\nPerfect: "+perfs.join(", "):"\nNo perfect picks"),ts:Date.now(),sys:true});
          });
          setChat(newCh);await DB.set("ch",newCh);
          setLastF(now);toast2(res.length+" result(s) fetched!","ok");
        }
      }catch(err){console.error(err);}
      setFetching(false);
    };
    run();const id=setInterval(run,600000);return()=>clearInterval(id);
  },[ms,lastF]);

  // chat polling
  useEffect(()=>{
    if(sc==="chat"){
      setChatU(0);
      const poll=async()=>{
        // FIX #3: also reload users when polling chat
        const[c,u2]=await Promise.all([DB.get("ch"),DB.get("u")]);
        if(c)setChat(c);if(u2)setUsers(u2);
      };
      poll();pollRef.current=setInterval(poll,8000);
    } else clearInterval(pollRef.current);
    return()=>clearInterval(pollRef.current);
  },[sc]);

  // FIX #3: reload allPicks + users whenever navigating to lb, picks, wof, adm
  useEffect(()=>{
    if(["lb","wof","adm"].includes(sc)){
      (async()=>{
        const[u2,ap]=await Promise.all([DB.get("u"),DB.get("ap")]);
        if(u2)setUsers(u2);
        if(ap){setAllPicks(ap);if(email)setMyPicks(ap[email]||{});}
      })();
    }
  },[sc]);

  useEffect(()=>{if(sc!=="chat"){const ls=parseInt(localStorage.getItem("cs")||"0");setChatU(chat.filter(m=>m.ts>ls).length);}},[chat,sc]);
  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[chat,sc]);

  const done=ms.filter(m=>m.result);
  const todayMs=ms.filter(isToday);
  const upMs=ms.filter(m=>!m.result&&!isToday(m)&&!isTBD(m));
  const unbc=bc.filter(b=>b.ts>(parseInt(localStorage.getItem("bs")||"0"))).length;

  function t4pts(ut4){if(!sw||!ut4?.length)return 0;return ut4.includes(sw)?PTS.top4:0;}
  const myS=calcScore(myPicks,ms);
  const myPts=myS.pts+((mySp&&sw&&mySp===sw)?PTS.season:0)+t4pts(myT4)+calcBonusPts(email,bpk,bqs,ms);

  // FIX #3: getLb reads from state which is always reloaded
  function getLb(){
    return Object.values(users).map(u=>{
      const up=allPicks[u.email]||{},st=calcScore(up,ms);
      const sp2=(spk[u.email]&&sw&&spk[u.email]===sw)?PTS.season:0;
      return{...u,pts:st.pts+sp2+t4pts(t4pk[u.email])+calcBonusPts(u.email,bpk,bqs,ms),acc:st.acc,hot:st.hot,bgs:calcBadges(up,ms,allPicks)};
    }).sort((a,b)=>b.pts-a.pts);
  }
  function getSplit(m){
    const all=Object.values(allPicks),tot=all.filter(u=>u[m.id]).length;
    if(!tot)return null;
    const tA=all.filter(u=>u[m.id]?.toss===m.home).length,wA=all.filter(u=>u[m.id]?.win===m.home).length;
    return{tot,tA,tB:tot-tA,wA,wB:tot-wA};
  }
  function getWof(){
    return done.map(m=>{
      const perfs=Object.entries(allPicks).filter(([,up])=>{const p=up[m.id];return p&&m.result&&p.toss===m.result.toss&&p.win===m.result.win&&p.motm===m.result.motm;}).map(([em])=>({name:users[em]?.name||em,email:em}));
      return{...m,perfs};
    });
  }

  async function toggleReminder(mid){
    const on=!reminders[mid];
    const upd={...reminders,[mid]:on};
    setReminders(upd);await DB.set("rms",upd);
    const m=MATCHES.find(x=>x.id===mid);
    toast2(on?"🔔 Reminder set for "+m.home+" vs "+m.away:"🔕 Reminder removed","ok");
  }

  async function doSignIn(em){
    const isNew=!users[em];
    const ex=users[em]||{email:em,name:em.split("@")[0],joined:new Date().toISOString()};
    const nu={...users,[em]:ex};setUsers(nu);await DB.set("u",nu);
    setUser(ex);setEmail(em);
    // FIX #1: persist session
    localStorage.setItem(SESSION_KEY,em);
    const freshAP=(await DB.get("ap"))||{};
    setMyPicks(freshAP[em]||{});setAllPicks(freshAP);
    const sp=(await DB.get("sp"))||{};setSpk(sp);setMySp(sp[em]||"");
    const t4=(await DB.get("t4"))||{};setT4pk(t4);setMyT4(t4[em]||[]);
    const bp=(await DB.get("bp"))||{};setBpk(bp);
    if(isNew){setSc("onboard");setObStep(0);}else{setSc("home");toast2("Welcome back, "+ex.name+"!","ok");}
  }
  async function login(){
    if(!email.includes("@")){toast2("Enter a valid email","error");return;}
    if(!password||password.length<6){toast2("Password must be at least 6 characters","error");return;}
    const stored=await DB.get("pw_"+email);
    if(!stored){await DB.set("pw_"+email,password);await doSignIn(email);}
    else if(stored===password){await doSignIn(email);}
    else{toast2("Incorrect password","error");}
  }
  function logout(){
    localStorage.removeItem(SESSION_KEY);
    setUser(null);setEmail("");setPassword("");setSc("login");toast2("Logged out","info");
  }
  async function handleForgotPassword(){
    if(!email.includes("@")){toast2("Enter your email first","error");return;}
    const stored=await DB.get("pw_"+email);
    if(!stored){toast2("No account found for this email","error");return;}
    const np=prompt("Enter your new password (min 6 characters):");
    if(!np||np.length<6){toast2("Password too short","error");return;}
    await DB.set("pw_"+email,np);
    toast2("Password updated! Please log in.","ok");
    setForgotMode(false);setPassword("");
  }
  async function doneOnboard(){
    const sp2={...spk,[email]:obSp},t42={...t4pk,[email]:obT4};
    setSpk(sp2);setMySp(obSp);setT4pk(t42);setMyT4(obT4);
    await DB.set("sp",sp2);await DB.set("t4",t42);
    setSc("home");toast2("Picks locked! Let the games begin!","ok");
  }
  async function submitPick(){
    if(!draft.toss||!draft.win){toast2("Pick toss and match winner","error");return;}
    if(!draft.motm){toast2("Select Player of the Match","error");return;}
    const np={...myPicks,[am.id]:draft};
    const na={...allPicks,[email]:np};
    setMyPicks(np);setAllPicks(na);
    await DB.set("ap",na);
    toast2("Prediction locked!","ok");setSc("home");
  }
  async function bonusPick(mid,choice){
    if((bpk[email]||{})[mid])return;
    const upd={...bpk,[email]:{...(bpk[email]||{}),[mid]:choice}};
    setBpk(upd);await DB.set("bp",upd);toast2("Bonus: "+choice+" locked!","ok");
  }
  async function react(mid,key){
    const mr=rxns[mid]||{},list=mr[key]||[];
    const upd={...rxns,[mid]:{...mr,[key]:list.includes(email)?list.filter(e=>e!==email):[...list,email]}};
    setRxns(upd);await DB.set("rx",upd);
  }
  async function sendChat(){
    if(!chatIn.trim()||!user)return;
    const msg={id:Date.now(),email:user.email,name:user.name,text:chatIn.trim(),ts:Date.now()};
    const nc=[...chat,msg];setChat(nc);setChatIn("");await DB.set("ch",nc);localStorage.setItem("cs",Date.now().toString());
  }
  async function delMsg(id){const nc=chat.filter(m=>m.id!==id);setChat(nc);await DB.set("ch",nc);}
  async function sendBc(){
    if(!bcMsg.trim())return;
    const nb=[...bc,{id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"}];
    setBc(nb);await DB.set("bc",nb);setBcMsg("");toast2("Broadcast sent!","ok");
  }
  async function removeUser(ue){
    const nu={...users};delete nu[ue];const na={...allPicks};delete na[ue];
    setUsers(nu);setAllPicks(na);await DB.set("u",nu);await DB.set("ap",na);setExU(null);toast2("User removed","ok");
  }
  async function manualFetch(){
    const now=Date.now();
    const cands=ms.filter(m=>{if(m.result||isTBD(m))return false;const s=new Date(m.date+"T"+m.time+":00+05:30");return now>s.getTime()+60*60*1000;});
    if(!cands.length){toast2("No matches ready yet","info");return;}
    setFetching(true);
    try{
      const res=await fetchResults(cands);
      if(!res.length){toast2("No new results found","info");setFetching(false);return;}
      const nm=ms.map(m=>{const r=res.find(x=>x.id===m.id);return r?{...m,result:{toss:r.toss,win:r.win,motm:r.motm},status:"completed"}:m;});
      setMs(nm);const saved={};nm.forEach(m=>{if(m.result)saved[m.id]={result:m.result,status:"completed"};});
      await DB.set("rm",saved);toast2(res.length+" result(s) fetched!","ok");setLastF(now);
    }catch{toast2("Fetch failed","error");}
    setFetching(false);
  }

  // ─── MCard ────────────────────────────────────────────────────────────────
  function MCard({m,pred}){
    const lk=locked(m),mp=myPicks[m.id],ct=cutoff(m);
    const cStr=ct.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
    const cd=useCd(ct.getTime());
    const sp=lk?getSplit(m):null;
    const bq=bqs[m.id],mbp=(bpk[email]||{})[m.id],mr=rxns[m.id]||{};
    const hc=TC[m.home]||{bg:"#333"},ac=TC[m.away]||{bg:"#555"};
    const on=!!reminders[m.id];
    let earned=0;
    if(m.result&&mp){
      if(mp.toss===m.result.toss)earned+=PTS.toss;if(mp.win===m.result.win)earned+=PTS.win;
      if(mp.motm&&m.result.motm&&mp.motm===m.result.motm)earned+=PTS.motm;
      if(mp.toss===m.result.toss&&mp.win===m.result.win&&mp.motm===m.result.motm)earned+=PTS.streak;
    }
    if(m.result&&bq?.answer&&mbp===bq.answer)earned+=PTS.bonus;
    return <div className="mcard">
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg,"+hc.bg+"10,transparent 50%,"+ac.bg+"10)",pointerEvents:"none",borderRadius:14}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {!lk&&!m.result&&<button onClick={()=>toggleReminder(m.id)} className={on?"bell-on":""} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,padding:0,lineHeight:1}}>{on?"🔔":"🔕"}</button>}
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
        <span style={{color:"#64748b"}}>Toss: </span><b style={{color:"#1a2540"}}>{m.result.toss}</b>
        <span style={{color:"#94a3b8",margin:"0 6px"}}>·</span><span style={{color:"#64748b"}}>Win: </span><b style={{color:"#15803d"}}>{m.result.win}</b>
        <span style={{color:"#94a3b8",margin:"0 6px"}}>·</span><span style={{color:"#64748b"}}>POTM: </span><b style={{color:"#B8860B"}}>{m.result.motm}</b>
        {mp&&<span style={{color:earned>0?"#15803d":"#94a3b8",fontWeight:700,float:"right",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14}}>+{earned}pts</span>}
      </div>}
      {mp&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"7px 12px",fontSize:12,color:"#15803d",marginBottom:8}}>Locked: {mp.toss} toss · {mp.win} win · POTM: {mp.motm?.split(" ").slice(-1)[0]}</div>}
      {lk&&sp&&sp.tot>0&&<div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
        <p style={{color:"#64748b",fontSize:11,fontWeight:600,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:.5}}>Group Split ({sp.tot} picks)</p>
        <SBar lbl="Toss" tA={m.home} tB={m.away} cA={sp.tA} cB={sp.tB} clA={hc.bg} clB={ac.bg}/>
        <SBar lbl="Winner" tA={m.home} tB={m.away} cA={sp.wA} cB={sp.wB} clA={hc.bg} clB={ac.bg}/>
      </div>}
      {bq&&!bq.failed&&<div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
        <p style={{color:"#92400E",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 6px"}}>Bonus · +{PTS.bonus}pts</p>
        {bq.loading?<p style={{color:"#B8860B",fontSize:12,margin:0}}>Generating…</p>:bq.question?<div>
          <p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:"0 0 8px",lineHeight:1.4}}>{bq.question}</p>
          {bq.answer?<div style={{display:"flex",gap:8}}>{[bq.optA,bq.optB].map(opt=>{const ic=opt===bq.answer,ip=mbp===opt;return <div key={opt} style={{flex:1,padding:"8px",borderRadius:8,textAlign:"center",background:ic?"#f0fdf4":ip?"#fef2f2":"#f8faff",border:"1px solid "+(ic?"#bbf7d0":ip?"#fecaca":"#e2e8f0")}}><p style={{color:ic?"#15803d":ip?"#dc2626":"#64748b",fontSize:12,fontWeight:700,margin:0}}>{opt}</p><p style={{color:"#94a3b8",fontSize:10,margin:"2px 0 0"}}>{ic?"Correct":ip?"Wrong":""}</p></div>;})}
          </div>:mbp?<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px",fontSize:12,color:"#15803d"}}>Locked: {mbp} · Pending</div>
          :!lk?<div style={{display:"flex",gap:8}}>{[bq.optA,bq.optB].map(opt=><button key={opt} onClick={()=>bonusPick(m.id,opt)} style={{flex:1,padding:"8px",borderRadius:8,border:"1px solid #FDE68A",background:"#FFFBF0",color:"#92400E",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>{opt}</button>)}</div>
          :<p style={{color:"#94a3b8",fontSize:11,margin:0}}>Bonus window closed</p>}
        </div>:null}
      </div>}
      {m.result&&<div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:4,display:"flex",gap:6,flexWrap:"wrap"}}>
        {EMOJIK.map(k=>{const cnt=(mr[k]||[]).length,mine=(mr[k]||[]).includes(email);return <button key={k} onClick={()=>react(m.id,k)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,border:"1px solid "+(mine?"#1D428A":"#e2e8f0"),background:mine?"#EBF0FA":"#f8faff",cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif",fontWeight:mine?700:400,color:mine?"#1D428A":"#475569"}}>{EMOJIV[k]}{cnt>0&&<span style={{fontSize:11,fontWeight:700}}>{cnt}</span>}</button>;})}
      </div>}
      {pred&&!lk&&!mp&&<button className="pbtn" style={{marginTop:10}} onClick={()=>{setAm(m);setDraft({});setSc("picks");}}>Make Prediction</button>}
      {pred&&!lk&&mp&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#94a3b8",marginTop:4}}>Locked · no changes allowed</div>}
    </div>;
  }

  const remCount=Object.values(reminders).filter(Boolean).length;

  function Nav(){
    return <nav className="nav">
      {[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","Picks"],["remind","⏰","Remind"],["chat","💬","Chat"],["wof","🌟","Fame"],["adm","⚙️","Admin"]].map(([s,ic,lb2])=>(
        <button key={s} className="ni" onClick={()=>{setSc(s);if(s==="chat"){setChatU(0);localStorage.setItem("cs",Date.now().toString());}if(s==="home")localStorage.setItem("bs",Date.now().toString());}}>
          <div style={{position:"relative",display:"inline-block"}}>
            <span style={{fontSize:15,opacity:sc===s?1:.4}}>{ic}</span>
            {s==="chat"&&chatU>0&&<span className="bd"/>}
            {s==="remind"&&remCount>0&&<span className="bd" style={{background:"#FF822A"}}/>}
          </div>
          <span className="nl" style={{color:sc===s?"#1D428A":"#334155"}}>{lb2}</span>
        </button>
      ))}
    </nav>;
  }

  const hdr=<div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"13px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <img src={LOGOS.IPL} alt="IPL" style={{height:28,filter:"brightness(0) invert(1)"}} onError={e=>e.target.style.display="none"}/>
      <div><p className="C" style={{color:"#FFE57F",fontSize:13,fontWeight:700,letterSpacing:1,margin:0,textTransform:"uppercase"}}>Fantasy Predictor</p><p style={{color:"#bfdbfe",fontSize:10,margin:0}}>TATA IPL 2026{fetching?" · Fetching…":""}</p></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"5px 12px",textAlign:"center"}}>
        <p className="C" style={{color:"#FFE57F",fontSize:18,fontWeight:800,margin:0,letterSpacing:1}}>{myPts}</p>
        <p style={{color:"#bfdbfe",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>My Pts</p>
      </div>
      <button onClick={logout} title="Log out" style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,color:"#bfdbfe",fontSize:11,padding:"5px 8px",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600}}>Out</button>
    </div>
  </div>;

  // ─── Screens ────────────────────────────────────────────────────────────────
  if(sc==="splash")return <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#1D428A,#2a5bbf,#4A90D9)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
    <style>{CSS}</style>
    <img src={LOGOS.IPL} alt="IPL" style={{width:100,filter:"drop-shadow(0 0 20px rgba(255,255,255,.3))"}} onError={e=>e.target.style.display="none"}/>
    <div style={{textAlign:"center"}}><p className="C" style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:2,margin:0}}>FANTASY PREDICTOR</p><p style={{color:"#FFE57F",fontSize:13,letterSpacing:3,marginTop:4,textTransform:"uppercase"}}>TATA IPL 2026</p></div>
    <div style={{display:"flex",gap:20,marginTop:8}}>{["RCB","MI","CSK","KKR","SRH"].map(t=><TLogo key={t} t={t} sz={32}/>)}</div>
  </div>;

  if(sc==="login")return <div className="app"><style>{CSS}</style>
    <div style={{background:"linear-gradient(160deg,#1D428A,#2a5bbf)",padding:"44px 24px 32px",textAlign:"center"}}>
      <img src={LOGOS.IPL} alt="IPL" style={{width:80,marginBottom:16,filter:"drop-shadow(0 0 16px rgba(255,255,255,.25))"}} onError={e=>e.target.style.display="none"}/>
      <p className="C" style={{fontSize:28,fontWeight:800,letterSpacing:2,color:"#fff",margin:0}}>FANTASY PREDICTOR</p>
      <p style={{color:"#FFE57F",fontSize:12,letterSpacing:3,marginTop:6,textTransform:"uppercase"}}>TATA IPL 2026</p>
      <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:20}}>{[["🎯","Toss +"+PTS.toss],["🏆","Win +"+PTS.win],["⭐","POTM +"+PTS.motm],["🔥","Streak +"+PTS.streak]].map(([ic,l])=><div key={l} style={{textAlign:"center"}}><span style={{fontSize:18}}>{ic}</span><p style={{color:"#bfdbfe",fontSize:10,marginTop:4,fontWeight:600}}>{l}</p></div>)}</div>
    </div>
    <div style={{padding:"28px 24px",display:"flex",flexDirection:"column",gap:14}}>
      {!forgotMode?<>
        <p style={{color:"#64748b",fontSize:13,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Sign In / Register</p>
        <input className="inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&login()}/>
        <div style={{position:"relative"}}>
          <input className="inp" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6 characters)" onKeyDown={e=>e.key==="Enter"&&login()} style={{paddingRight:48}}/>
          <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button>
        </div>
        <button className="pbtn" onClick={login}>Sign In / Create Account</button>
        <button onClick={()=>setForgotMode(true)} style={{background:"none",border:"none",color:"#1D428A",fontSize:13,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600}}>Forgot password?</button>
        <p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>New? Enter email + new password to register.</p>
      </>:<>
        <p style={{color:"#64748b",fontSize:13,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Reset Password</p>
        <input className="inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
        <button className="pbtn" onClick={handleForgotPassword}>Reset Password</button>
        <button onClick={()=>setForgotMode(false)} style={{background:"none",border:"none",color:"#1D428A",fontSize:13,cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600}}>Back to Sign In</button>
      </>}
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  if(sc==="onboard")return <div className="app" style={{minHeight:"100vh"}}><style>{CSS}</style>
    <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"24px 20px 20px"}}>
      <p style={{color:"#bfdbfe",fontSize:12,margin:0}}>Welcome, {user?.name}! First time setup</p>
      <p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:1,margin:"4px 0 0"}}>{obStep===0?"PICK YOUR CHAMPION":"PICK YOUR TOP 4"}</p>
      <div style={{display:"flex",gap:6,marginTop:12}}>{[0,1].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:obStep>=i?"#FFE57F":"rgba(255,255,255,.2)"}}/>)}</div>
    </div>
    <div style={{padding:"20px 16px"}}>
      {obStep===0&&<><p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who will win IPL 2026?</p>
        <p style={{color:"#64748b",fontSize:13,margin:"0 0 16px"}}>Worth <b style={{color:"#1D428A"}}>{PTS.season}pts</b> if correct. Locked forever.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=><button key={t} className={"ot"+(obSp===t?" on":"")} onClick={()=>setObSp(t)}><TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:obSp===t?"#1D428A":"#475569"}}>{t}</span></button>)}</div>
        <button className="lbtn" disabled={!obSp} onClick={()=>setObStep(1)} style={{opacity:obSp?1:.4}}>Next: Pick Top 4</button>
      </>}
      {obStep===1&&<><p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who reaches the playoffs?</p>
        <p style={{color:"#64748b",fontSize:13,margin:"0 0 4px"}}>Pick exactly <b style={{color:"#1D428A"}}>4 teams</b>.</p>
        <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>{obT4.length}/4 selected</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=>{const sel=obT4.includes(t);return <button key={t} className={"ot"+(sel?" on":"")} onClick={()=>{if(sel)setObT4(p=>p.filter(x=>x!==t));else if(obT4.length<4)setObT4(p=>[...p,t]);else toast2("Max 4 teams","error");}}>
          <TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:sel?"#1D428A":"#475569"}}>{t}</span>
          {sel&&<span style={{fontSize:9,background:"#1D428A",color:"#fff",borderRadius:8,padding:"1px 6px"}}>{obT4.indexOf(t)+1}</span>}
        </button>;})}</div>
        <button className="pbtn" style={{marginBottom:10}} onClick={()=>setObStep(0)}>Back</button>
        <button className="lbtn" disabled={obT4.length!==4} onClick={doneOnboard} style={{marginTop:8,opacity:obT4.length===4?1:.4}}>Lock Picks and Start Playing</button>
      </>}
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  // FIX #5: picks screen uses PotmDropdown, no search
  if(sc==="picks"&&am)return <div className="app" style={{paddingBottom:32}}><style>{CSS}</style>
    <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"16px",display:"flex",alignItems:"center",gap:14}}>
      <button onClick={()=>setSc("home")} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0,lineHeight:1}}>&#8592;</button>
      <TLogo t={am.home} sz={28}/><div style={{flex:1}}><p className="C" style={{color:"#fff",fontSize:16,fontWeight:800,margin:0}}>{am.home} vs {am.away}</p><p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{am.date} · {am.time} IST</p></div>
      <TLogo t={am.away} sz={28}/>
    </div>
    <div style={{background:"#EBF0FA",padding:"8px 16px",borderBottom:"1px solid #dbeafe"}}><span style={{color:"#1D428A",fontSize:12}}>Predictions are final once submitted · All 3 correct = +{PTS.streak}pts bonus</span></div>
    <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:18}}>
      {[["TOSS WINNER","toss",PTS.toss],["MATCH WINNER","win",PTS.win]].map(([title,field,pts])=><div key={field}>
        <p className="st">{title} <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{pts}pts</span></p>
        <div style={{display:"flex",gap:10}}>
          {[am.home,am.away].map(t=><button key={t} className={"tmbtn"+(draft[field]===t?" on":"")} onClick={()=>setDraft(d=>({...d,[field]:t}))}>
            <TLogo t={t} sz={50}/><p className="C" style={{color:draft[field]===t?"#1D428A":"#64748b",fontSize:14,fontWeight:700,margin:0}}>{t}</p>
            <p style={{color:"#94a3b8",fontSize:9,textAlign:"center",margin:0}}>{TF[t]||""}</p>
            {draft[field]===t&&<span style={{background:"#1D428A",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:12}}>SELECTED</span>}
          </button>)}
        </div>
      </div>)}
      <div>
        <p className="st">PLAYER OF THE MATCH <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.motm}pts</span></p>
        <PotmDropdown homeTeam={am.home} awayTeam={am.away} value={draft.motm||""} onChange={v=>setDraft(d=>({...d,motm:v}))}/>
      </div>
      {draft.toss&&draft.win&&draft.motm&&<div style={{background:"#EBF0FA",border:"1px solid #dbeafe",borderRadius:12,padding:"14px 16px"}}>
        <p className="st" style={{marginBottom:12}}>YOUR PREDICTION</p>
        {[["Toss winner",draft.toss,PTS.toss],["Match winner",draft.win,PTS.win],["POTM",draft.motm,PTS.motm]].map(([l,v,pts])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#64748b",fontSize:13}}>{l}</span><span style={{color:"#1a2540",fontSize:13,fontWeight:600}}>{v} <span className="C" style={{color:"#1D428A",fontSize:11}}>+{pts}pts</span></span></div>)}
        <div style={{borderTop:"1px solid #dbeafe",paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{color:"#64748b",fontSize:12}}>Max with streak</span><span className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800}}>+{PTS.toss+PTS.win+PTS.motm+PTS.streak}pts</span></div>
      </div>}
      <button className="lbtn" onClick={submitPick}>Lock Prediction</button>
      <div style={{height:16}}/>
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  return <div className="app" style={{paddingBottom:68}}><style>{CSS}</style>
    {hdr}
    {bc.length>0&&sc==="home"&&(()=>{const lt=bc[bc.length-1];return <div style={{background:"#FFF9E6",borderBottom:"1px solid #FDE68A",padding:"8px 16px",display:"flex",alignItems:"center",gap:10}} onClick={()=>localStorage.setItem("bs",Date.now().toString())}><span style={{color:"#B8860B",fontSize:14,flexShrink:0}}>📢</span><p style={{color:"#92400E",fontSize:12,fontWeight:600,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lt.msg}</p>{unbc>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:12,flexShrink:0}}>{unbc} new</span>}</div>;})()}
    <div style={{background:"#fff",padding:"8px 16px",display:"flex",borderBottom:"1px solid #e2e8f0"}}>
      {[["🎯","Toss",PTS.toss],["🏆","Win",PTS.win],["⭐","POTM",PTS.motm],["🔥","Streak",PTS.streak],["⚡","Bonus",PTS.bonus]].map(([ic,l,p],i)=><div key={l} style={{flex:1,textAlign:"center",borderRight:i<4?"1px solid #e2e8f0":"none"}}><p style={{color:"#1D428A",fontWeight:700,fontSize:12,margin:0}}>{p}<span style={{fontSize:9,color:"#94a3b8",fontWeight:400}}> pts</span></p><p style={{color:"#64748b",fontSize:9,margin:"1px 0 0"}}>{ic} {l}</p></div>)}
    </div>

    {sc==="home"&&<>
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
        {[["today","Today ("+todayMs.length+")"],["done","Results ("+done.length+")"],["up","Schedule ("+upMs.length+")"],["season","Season"]].map(([t,l])=><button key={t} className={"tbtn"+(htab===t?" on":"")} onClick={()=>setHtab(t)}>{l}</button>)}
      </div>
      <div style={{padding:"14px 14px 0"}}>
        {htab==="today"&&(todayMs.length===0
          ?<div style={{textAlign:"center",padding:"48px 16px"}}><p className="C" style={{color:"#94a3b8",fontSize:18,fontWeight:700,letterSpacing:1}}>NO MATCHES TODAY</p></div>
          :todayMs.map(m=><MCard key={m.id} m={m} pred={true}/>))}
        {htab==="done"&&(done.length===0?<p style={{color:"#94a3b8",textAlign:"center",marginTop:40}}>No results yet</p>:done.map(m=><MCard key={m.id} m={m}/>))}
        {htab==="up"&&<>
          <div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"8px 12px",marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
            <span>⏰</span><span style={{color:"#1e40af",fontSize:12}}>Tap 🔕 on any match to set a reminder. Predictions open on match day.</span>
          </div>
          {upMs.map(m=>{const on=!!reminders[m.id];return <div key={m.id} style={{background:"#fff",border:"1px solid "+(on?"#FF822A40":"#e2e8f0"),borderRadius:14,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>toggleReminder(m.id)} className={on?"bell-on":""} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:0,lineHeight:1}}>{on?"🔔":"🔕"}</button>
                <span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Upcoming</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><TLogo t={m.home} sz={34}/><div><p className="C" style={{color:"#475569",fontSize:13,fontWeight:700,margin:0}}>{m.home}</p></div></div>
              <p className="C" style={{color:"#e2e8f0",fontSize:16,fontWeight:800,padding:"0 8px",margin:0}}>VS</p>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}><TLogo t={m.away} sz={34}/><div style={{textAlign:"right"}}><p className="C" style={{color:"#475569",fontSize:13,fontWeight:700,margin:0}}>{m.away}</p></div></div>
            </div>
            <p style={{color:"#cbd5e1",fontSize:11,marginTop:10,borderTop:"1px solid #f1f5f9",paddingTop:8}}>📍 {m.venue}</p>
          </div>;})}
        </>}
        {htab==="season"&&<div>
          <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:2,margin:0}}>MY SEASON PICKS</p></div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
            <p className="st">IPL 2026 CHAMPION</p>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {mySp?<TLogo t={mySp} sz={50}/>:<div style={{width:50,height:50,borderRadius:10,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>?</div>}
              <div><p className="C" style={{color:"#1a2540",fontSize:18,fontWeight:800,margin:0}}>{mySp||"Not set"}</p>
              {mySp&&<p style={{color:"#64748b",fontSize:12,margin:"2px 0 0"}}>{TF[mySp]||""}</p>}
              {sw&&<p style={{color:mySp===sw?"#15803d":"#dc2626",fontSize:13,fontWeight:700,marginTop:6}}>{mySp===sw?"Correct! +"+PTS.season+"pts":"Better luck next time"}</p>}
              {!sw&&mySp&&<p style={{color:"#94a3b8",fontSize:11,marginTop:4}}>Worth +{PTS.season}pts at final</p>}</div>
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
            <p className="st">MY TOP 4</p>
            {myT4.length>0?<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:8,background:"#f8faff",borderRadius:10,padding:"8px 12px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:13,fontWeight:700}}>#{i+1}</span><TLogo t={t} sz={28}/><span className="C" style={{color:"#1D428A",fontSize:14,fontWeight:700}}>{t}</span>{sw&&<span style={{fontSize:13}}>{t===sw?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12}}>Not set yet</p>}
          </div>
          <p className="st">GROUP SEASON PICKS</p>
          {Object.entries(spk).map(([ue,t])=>{const u=users[ue];if(!u)return null;return <div key={ue} style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",marginBottom:8}}><Av name={u.name} sz={30}/><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>{u.name}</p><div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>{(t4pk[ue]||[]).map(x=><span key={x} style={{fontSize:10,background:"#EBF0FA",color:"#1e40af",padding:"2px 6px",borderRadius:6,fontWeight:600}}>{x}</span>)}</div></div><TLogo t={t} sz={30}/><span className="C" style={{color:"#1D428A",fontSize:14,fontWeight:700}}>{t}</span>{sw&&<span style={{fontSize:14}}>{t===sw?"✅":"❌"}</span>}</div>;})}
        </div>}
      </div>
    </>}

    {sc==="lb"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>LEADERBOARD</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>{done.length} of 73 matches · {Object.keys(users).length} players</p></div>
      {getLb().map((u,i)=><div key={u.email} className={"lrow"+(u.email===email?" me":"")}>
        <div style={{width:30,height:30,borderRadius:8,background:i===0?"#D4AF37":i===1?"#94a3b8":i===2?"#b45309":"#EBF0FA",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:i<3?"#fff":"#475569",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
        <Av name={u.name} sz={30}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}</p>{u.hot&&<span>🔥</span>}</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2,flexWrap:"wrap"}}><span style={{fontSize:10,color:"#64748b"}}>{u.acc}% accurate</span>{u.bgs.slice(0,2).map(b=><span key={b.id} className="bp">{b.ic} {b.lb}</span>)}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}><p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,margin:0,letterSpacing:1}}>{u.pts}</p><p style={{color:"#94a3b8",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>pts</p></div>
      </div>)}
      {getLb().length===0&&<p style={{color:"#94a3b8",textAlign:"center",marginTop:40}}>No players yet</p>}
    </div>}

    {/* FIX #4: Picks tab is read-only — no edit buttons */}
    {sc==="picks"&&!am&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>MY PICKS</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:2}}>{Object.keys(myPicks).length} predictions · {myS.acc}% accurate</p></div>
        <div style={{textAlign:"right"}}><p className="C" style={{color:"#FFE57F",fontSize:26,fontWeight:800,margin:0}}>{myPts}</p><p style={{color:"#bfdbfe",fontSize:10,margin:0,textTransform:"uppercase",letterSpacing:.5}}>total pts</p></div>
      </div>
      {calcBadges(myPicks,ms,allPicks).length>0&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <p className="st">MY BADGES</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{calcBadges(myPicks,ms,allPicks).map(b=><div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:12,padding:"10px 12px",gap:4,minWidth:76}}><span style={{fontSize:22}}>{b.ic}</span><span style={{color:"#1e40af",fontSize:10,fontWeight:700,textAlign:"center"}}>{b.lb}</span><span style={{color:"#64748b",fontSize:9,textAlign:"center"}}>{b.ds}</span></div>)}</div>
      </div>}
      {/* read-only banner */}
      <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#92400E",display:"flex",gap:8,alignItems:"center"}}><span>🔒</span><span>Picks are read-only. Go to Today's matches to make new predictions.</span></div>
      {ms.filter(m=>myPicks[m.id]).length===0&&<p style={{color:"#94a3b8",textAlign:"center",marginTop:40}}>No predictions yet</p>}
      {ms.filter(m=>myPicks[m.id]).map(m=>{
        const p=myPicks[m.id];let e=0;
        if(m.result){if(p.toss===m.result.toss)e+=PTS.toss;if(p.win===m.result.win)e+=PTS.win;if(p.motm&&m.result.motm&&p.motm===m.result.motm)e+=PTS.motm;if(p.toss===m.result.toss&&p.win===m.result.win&&p.motm===m.result.motm)e+=PTS.streak;}
        const bq=bqs[m.id],mbp=(bpk[email]||{})[m.id];if(bq?.answer&&mbp===bq.answer)e+=PTS.bonus;
        return <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>{m.mn} · {m.date}</span></div>
            {m.result?<span style={{color:e>0?"#15803d":"#94a3b8",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15}}>+{e}pts</span>:<span style={{color:"#94a3b8",fontSize:11}}>Pending</span>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["Toss",p.toss,m.result&&p.toss===m.result.toss],["Win",p.win,m.result&&p.win===m.result.win],["POTM",p.motm,m.result&&p.motm&&m.result.motm&&p.motm===m.result.motm]].map(([l,v,c])=><span key={l} style={{background:m.result?(c?"#f0fdf4":"#fef2f2"):"#f8faff",border:"1px solid "+(m.result?(c?"#bbf7d0":"#fecaca"):"#e2e8f0"),borderRadius:6,padding:"4px 10px",fontSize:12,color:m.result?(c?"#15803d":"#dc2626"):"#475569"}}>{l}: {v||"—"}</span>)}
            {mbp&&<span style={{background:bq?.answer?(mbp===bq.answer?"#f0fdf4":"#fef2f2"):"#FFF9E6",border:"1px solid "+(bq?.answer?(mbp===bq.answer?"#bbf7d0":"#fecaca"):"#FDE68A"),borderRadius:6,padding:"4px 10px",fontSize:12,color:bq?.answer?(mbp===bq.answer?"#15803d":"#dc2626"):"#92400E"}}>Bonus: {mbp}</span>}
          </div>
        </div>;})}
    </div>}

    {sc==="remind"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#FF822A,#D4AF37)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:4}}>⏰</div>
        <p className="C" style={{color:"#fff",fontSize:22,fontWeight:800,letterSpacing:2,margin:0}}>MATCH REMINDERS</p>
        <p style={{color:"rgba(255,255,255,.85)",fontSize:12,marginTop:4}}>{remCount} reminder{remCount!==1?"s":""} set · alerts 30 mins before lock</p>
      </div>
      <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:16,flexShrink:0}}>💡</span>
        <p style={{color:"#92400E",fontSize:12,margin:0,lineHeight:1.6}}>Tap the <b>🔔 bell</b> to set a reminder. You'll get an in-app alert <b>30 minutes before predictions lock</b>.</p>
      </div>
      <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,marginBottom:14,overflow:"hidden",border:"1px solid #e2e8f0"}}>
        {[["upcoming","All Upcoming"],["mine","My Reminders ("+remCount+")"]].map(([t,l])=><button key={t} className={"at"+(remTab===t?" on":"")} onClick={()=>setRemTab(t)}>{l}</button>)}
      </div>
      {(()=>{
        const upcoming=ms.filter(m=>!m.result&&!isTBD(m));
        const list=remTab==="mine"?upcoming.filter(m=>reminders[m.id]):upcoming;
        if(!list.length)return <div style={{textAlign:"center",padding:"40px 16px"}}><span style={{fontSize:36}}>{remTab==="mine"?"🔕":"📅"}</span><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700,letterSpacing:1,marginTop:12}}>{remTab==="mine"?"NO REMINDERS SET":"NO UPCOMING MATCHES"}</p></div>;
        return list.map(m=>{
          const on=!!reminders[m.id];
          const mp=myPicks[m.id];
          const lk=locked(m);
          return <div key={m.id} className="rcard" style={{borderColor:on?"#FF822A40":"#e2e8f0",background:on?"#FFFAF5":"#fff"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flex:1}}><TLogo t={m.home} sz={32}/><span className="C" style={{color:"#1a2540",fontSize:12,fontWeight:700}}>{m.home}</span></div>
              <div style={{textAlign:"center",flex:2}}><span className="C" style={{color:"#cbd5e1",fontSize:14,fontWeight:800,letterSpacing:2}}>VS</span><div style={{color:"#64748b",fontSize:10,marginTop:2,fontWeight:600}}>{m.mn} · {m.date}</div><div style={{color:"#94a3b8",fontSize:10}}>{m.time} IST</div></div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flex:1}}><TLogo t={m.away} sz={32}/><span className="C" style={{color:"#1a2540",fontSize:12,fontWeight:700}}>{m.away}</span></div>
            </div>
            <div style={{height:1,background:"#f1f5f9",margin:"10px 0"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div style={{flex:1,textAlign:"center"}}>
                {mp?<span style={{background:"#f0fdf4",color:"#15803d",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,border:"1px solid #bbf7d0"}}>✅ Picked</span>
                :lk?<span style={{background:"#f1f5f9",color:"#94a3b8",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20}}>Locked</span>
                :<button onClick={()=>{setAm(m);setDraft({});setSc("picks");}} style={{background:"#EBF0FA",color:"#1D428A",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,border:"1px solid #bfdbfe",cursor:"pointer",fontFamily:"'Barlow',sans-serif"}}>Predict →</button>}
              </div>
              <button onClick={()=>toggleReminder(m.id)} className={on?"bell-on":""} style={{width:44,height:44,borderRadius:12,background:on?"linear-gradient(135deg,#FF822A,#D4AF37)":"#f8faff",border:"1.5px solid "+(on?"#FF822A":"#e2e8f0"),cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,flexShrink:0,transition:"all .2s"}}>
                <span style={{fontSize:18}}>{on?"🔔":"🔕"}</span>
                <span style={{fontSize:8,color:on?"#fff":"#94a3b8",fontWeight:700,fontFamily:"'Barlow',sans-serif",textTransform:"uppercase",letterSpacing:.3}}>{on?"ON":"OFF"}</span>
              </button>
            </div>
            {on&&<div style={{marginTop:8,background:"rgba(255,130,42,.08)",border:"1px solid #FFD5A0",borderRadius:8,padding:"6px 10px",fontSize:11,color:"#92400E",textAlign:"center"}}>🔔 Alert 30 mins before lock · {m.date} {m.time} IST</div>}
          </div>;
        });
      })()}
      <div style={{height:8}}/>
    </div>}

    {sc==="chat"&&<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 134px)"}}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid #e2e8f0",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,letterSpacing:1,margin:0}}>GROUP CHAT</p><p style={{color:"#64748b",fontSize:11,margin:"2px 0 0"}}>{Object.keys(users).length} players</p></div>
        <div style={{display:"flex",gap:5}}>{Object.values(users).slice(0,4).map(u=><Av key={u.email} name={u.name} sz={24}/>)}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10,background:"#F4F6FB"}}>
        {chat.length===0&&<div style={{textAlign:"center",padding:"40px 16px"}}><span style={{fontSize:36}}>💬</span><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700,letterSpacing:1,marginTop:12}}>NO MESSAGES YET</p></div>}
        {chat.map(msg=>{const im=msg.email===email;const is=msg.sys;return <div key={msg.id} style={{display:"flex",flexDirection:"column",alignSelf:is?"center":im?"flex-end":"flex-start",maxWidth:"88%",gap:3}}>
          {!im&&!is&&<div style={{display:"flex",alignItems:"center",gap:5,marginLeft:2}}><Av name={msg.name} sz={16}/><span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{msg.name}</span></div>}
          <div className={"cb "+(is?"cs":im?"cm":"co")} style={{whiteSpace:"pre-line"}}>{msg.text}{isAdm&&!is&&<button onClick={()=>delMsg(msg.id)} style={{background:"none",border:"none",color:im?"rgba(255,255,255,.4)":"#94a3b8",fontSize:10,cursor:"pointer",marginLeft:8,padding:0}}>x</button>}</div>
          <span style={{color:"#94a3b8",fontSize:10,alignSelf:im?"flex-end":"flex-start"}}>{new Date(msg.ts).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}</span>
        </div>;})}
        <div ref={chatRef}/>
      </div>
      <div style={{padding:"10px 14px 12px",borderTop:"1px solid #e2e8f0",display:"flex",gap:10,alignItems:"flex-end",background:"#fff"}}>
        <input className="inp" value={chatIn} onChange={e=>setChatIn(e.target.value)} placeholder="Type a message…" onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} style={{flex:1,padding:"10px 14px",borderRadius:24}}/>
        <button onClick={sendChat} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#1D428A,#2a5bbf)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>&#10148;</button>
      </div>
    </div>}

    {sc==="wof"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>WALL OF FAME</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>Perfect matches and all-time heroes</p></div>
      {(()=>{
        const pc={};done.forEach(m=>{Object.entries(allPicks).forEach(([em,up])=>{const p=up[m.id];if(p&&m.result&&p.toss===m.result.toss&&p.win===m.result.win&&p.motm===m.result.motm)pc[em]=(pc[em]||0)+1;});});
        const s=Object.entries(pc).sort((a,b)=>b[1]-a[1]);
        if(!s.length)return <p style={{color:"#94a3b8",textAlign:"center",marginTop:20,marginBottom:20}}>No perfect matches yet</p>;
        return <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:16}}>
          <p className="st">PERFECT MATCH HALL</p>
          {s.map(([em,cnt],i)=>{const u=users[em];if(!u)return null;return <div key={em} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<s.length-1?"1px solid #f1f5f9":"none"}}>
            <div style={{width:28,height:28,borderRadius:8,background:i===0?"#D4AF37":i===1?"#94a3b8":i===2?"#b45309":"#EBF0FA",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:i<3?"#fff":"#475569",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
            <Av name={u.name} sz={30}/><div style={{flex:1}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{em===email?" (You)":""}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{cnt} perfect match{cnt>1?"es":""}</p></div>
            <span className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800}}>{cnt}x</span>
          </div>;})}
        </div>;
      })()}
      <p className="st">MATCH BY MATCH</p>
      {getWof().map(m=><div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><TLogo t={m.home} sz={24}/><div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home} vs {m.away}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{m.mn} · {m.date}</p></div><TLogo t={m.away} sz={24}/></div>
        {m.result&&<div style={{background:"#F4F6FB",borderRadius:8,padding:"6px 10px",fontSize:11,marginBottom:10,color:"#64748b"}}>Win: <b style={{color:"#15803d"}}>{m.result.win}</b> · POTM: <b style={{color:"#B8860B"}}>{m.result.motm}</b></div>}
        {m.perfs.length>0?<div><p style={{color:"#1D428A",fontSize:11,fontWeight:700,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.5}}>Perfect Picks</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{m.perfs.map(p=><div key={p.email} style={{display:"flex",alignItems:"center",gap:6,background:"#EBF0FA",borderRadius:20,padding:"4px 10px"}}><Av name={p.name} sz={20}/><span style={{color:"#1D428A",fontSize:12,fontWeight:600}}>{p.name}</span></div>)}</div></div>:<p style={{color:"#94a3b8",fontSize:12,margin:0}}>No perfect picks this match</p>}
      </div>)}
    </div>}

    {sc==="adm"&&!isAdm&&<div style={{padding:"28px 16px",display:"flex",flexDirection:"column",gap:14}}>
      <p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>ADMIN PANEL</p>
      <input type="password" className="inp" value={admPw} onChange={e=>setAdmPw(e.target.value)} placeholder="Admin password" onKeyDown={e=>e.key==="Enter"&&(admPw===ADMIN_PW?(setIsAdm(true),toast2("Access granted","ok")):toast2("Wrong password","error"))}/>
      <button className="pbtn" onClick={()=>{if(admPw===ADMIN_PW){setIsAdm(true);toast2("Access granted","ok");}else toast2("Wrong password","error");}}>Enter Admin</button>
    </div>}
    {sc==="adm"&&isAdm&&<div style={{padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>ADMIN PANEL</p><span style={{background:"#dcfce7",color:"#166534",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600}}>Active</span></div>
      <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,marginBottom:14,overflow:"hidden",border:"1px solid #e2e8f0"}}>
        {[["results","Results"],["users","Users ("+Object.keys(users).length+")"],["analytics","Analytics"],["broadcast","Broadcast"]].map(([t,l])=><button key={t} className={"at"+(admTab===t?" on":"")} onClick={()=>setAdmTab(t)}>{l}</button>)}
      </div>
      {admTab==="results"&&<>
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{color:"#15803d",fontSize:12,fontWeight:600,margin:0}}>Auto-fetch every 10 mins</p></div>
          <button onClick={manualFetch} disabled={fetching} style={{padding:"7px 12px",borderRadius:8,background:fetching?"#e2e8f0":"#dcfce7",color:fetching?"#94a3b8":"#166534",border:"1px solid #bbf7d0",cursor:fetching?"default":"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase"}}>{fetching?"Fetching…":"Fetch Now"}</button>
        </div>
        <p className="st">COMPLETED ({done.length})</p>
        {done.length===0&&<p style={{color:"#94a3b8",fontSize:12,marginBottom:14}}>No results yet</p>}
        {done.map(m=><div key={m.id} style={{background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date}</p><p style={{color:"#64748b",fontSize:11,margin:"2px 0 0"}}>W: {m.result.win} · POTM: {m.result.motm}</p></div></div>)}
        <p className="st" style={{marginTop:12}}>PENDING</p>
        {ms.filter(m=>!m.result).map(m=><div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date} · {m.time}</p></div><span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"2px 8px",borderRadius:12,fontWeight:600}}>Pending</span></div>)}
      </>}
      {admTab==="users"&&<>
        {/* FIX #3: show live count from state */}
        <p style={{color:"#64748b",fontSize:12,margin:"0 0 14px"}}>{Object.keys(users).length} registered players · {Object.keys(allPicks).length} with picks</p>
        {Object.values(users).sort((a,b)=>calcScore(allPicks[b.email]||{},ms).pts-calcScore(allPicks[a.email]||{},ms).pts).map(u=>{
          const st=calcScore(allPicks[u.email]||{},ms),up=allPicks[u.email]||{},ex=exU===u.email;
          return <div key={u.email} style={{background:"#fff",border:"1px solid "+(u.email===email?"#1D428A40":"#e2e8f0"),borderRadius:12,marginBottom:10,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setExU(ex?null:u.email)}>
              <Av name={u.name} sz={34}/><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}</p><p style={{color:"#94a3b8",fontSize:11,margin:"1px 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{Object.keys(up).length} picks · {st.acc}% acc</p></div>
              <div style={{textAlign:"right"}}><p className="C" style={{color:"#1D428A",fontSize:17,fontWeight:800,margin:0}}>{st.pts}</p></div>
            </div>
            {ex&&<div style={{padding:"0 14px 14px",borderTop:"1px solid #f1f5f9"}}>
              <p className="st" style={{marginTop:12}}>PREDICTIONS ({Object.keys(up).length})</p>
              {Object.keys(up).length===0?<p style={{color:"#94a3b8",fontSize:12}}>No predictions yet</p>:ms.filter(m=>up[m.id]).map(m=>{const p=up[m.id];return <div key={m.id} style={{background:"#f8faff",borderRadius:8,padding:"7px 12px",marginBottom:7,fontSize:12}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}><TLogo t={m.home} sz={16}/><span style={{color:"#94a3b8"}}>vs</span><TLogo t={m.away} sz={16}/><span style={{color:"#64748b",fontSize:11}}>{m.mn}</span></div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{[["T",p.toss],["W",p.win],["P",p.motm]].map(([l,v])=><span key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:5,padding:"3px 7px",fontSize:10,color:"#475569"}}>{l}: {v}</span>)}</div></div>;})}
              {u.email!==email&&<button onClick={()=>removeUser(u.email)} style={{marginTop:10,width:"100%",padding:"9px",borderRadius:8,background:"#fef2f2",color:"#dc2626",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,border:"1px solid #fecaca",cursor:"pointer",textTransform:"uppercase",letterSpacing:.5}}>Remove User</button>}
            </div>}
          </div>;})}
      </>}
      {/* FIX #7: analytics reads from allPicks state which is always reloaded */}
      {admTab==="analytics"&&<>
        <p style={{color:"#64748b",fontSize:12,margin:"0 0 4px"}}>Showing cumulative picks from all {Object.keys(allPicks).length} players</p>
        <p style={{color:"#94a3b8",fontSize:11,margin:"0 0 14px"}}>Tap a match to expand splits</p>
        {(()=>{
          // FIX #7: gather ALL matches that ANY user has picks for
          const matchesWithPicks=ms.filter(m=>Object.values(allPicks).some(u=>u[m.id]));
          if(!matchesWithPicks.length)return <p style={{color:"#94a3b8",textAlign:"center",marginTop:40}}>No picks yet</p>;
          return matchesWithPicks.map(m=>{
            const sp=getSplit(m),io=anM===m.id;
            const hc=TC[m.home]||{bg:"#1D428A"},ac=TC[m.away]||{bg:"#555"};
            return <div key={m.id} className="ac" style={{cursor:"pointer"}} onClick={()=>setAnM(io?null:m.id)}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/>
                <div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home} vs {m.away}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{sp?.tot||0} picks · {m.mn} {m.date}</p></div>
                <span style={{color:"#1D428A",fontSize:14}}>{io?"▲":"▼"}</span>
              </div>
              {io&&sp&&<div style={{marginTop:12,borderTop:"1px solid #f1f5f9",paddingTop:12}} onClick={e=>e.stopPropagation()}>
                <SBar lbl="Toss" tA={m.home} tB={m.away} cA={sp.tA} cB={sp.tB} clA={hc.bg} clB={ac.bg}/>
                <SBar lbl="Winner" tA={m.home} tB={m.away} cA={sp.wA} cB={sp.wB} clA={hc.bg} clB={ac.bg}/>
                {(()=>{
                  const mc={};
                  Object.values(allPicks).forEach(u=>{const p=u[m.id];if(p?.motm)mc[p.motm]=(mc[p.motm]||0)+1;});
                  const top=Object.entries(mc).sort((a,b)=>b[1]-a[1]).slice(0,5);
                  if(!top.length)return null;
                  return <div><p className="st" style={{marginTop:12}}>TOP POTM PICKS</p>{top.map(([n,c])=><div key={n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}><span style={{color:"#475569",fontSize:12}}>{n}</span><span style={{color:"#1D428A",fontSize:12,fontWeight:700}}>{c} picks ({Math.round(c/sp.tot*100)}%)</span></div>)}</div>;
                })()}
              </div>}
            </div>;
          });
        })()}
      </>}
      {admTab==="broadcast"&&<>
        <div className="ac"><p className="st">SEND BROADCAST</p><textarea className="inp" value={bcMsg} onChange={e=>setBcMsg(e.target.value)} placeholder="e.g. Match starts in 1 hour!" rows={3} style={{resize:"none",marginBottom:12,lineHeight:1.5}}/><button onClick={sendBc} className="pbtn">Send to All Users</button></div>
        <p className="st" style={{marginTop:16}}>HISTORY</p>
        {bc.length===0&&<p style={{color:"#94a3b8",fontSize:12}}>No broadcasts yet</p>}
        {[...bc].reverse().map(b=><div key={b.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:15,flexShrink:0}}>📢</span><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:13,margin:"0 0 3px"}}>{b.msg}</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>{new Date(b.ts).toLocaleString("en-IN",{timeZone:"Asia/Kolkata",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true})}</p></div><button onClick={async()=>{const nb=bc.filter(x=>x.id!==b.id);setBc(nb);await DB.set("bc",nb);}} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14}}>x</button></div>)}
      </>}
    </div>}

    <Nav/>
    {toast&&<Tst t={toast}/>}
  </div>;
}
