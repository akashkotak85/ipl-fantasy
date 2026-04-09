import * as React from "react";
import{useState,useEffect,useRef,useCallback,useMemo}from"react";
import MatchIntelPanel from"./MatchIntelPanel.jsx";
import Best11Picker from"./components/Best11Picker.jsx";
import{saveB11Pick}from"./utils/b11Firebase.js";

const LOGOS={IPL:"https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",RCB:"https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",SRH:"https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",MI:"https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",KKR:"https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",CSK:"https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",RR:"https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",PBKS:"https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",GT:"https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",LSG:"https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",DC:"https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png"};
const TC={RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"}};
const TF={RCB:"Royal Challengers Bengaluru",SRH:"Sunrisers Hyderabad",MI:"Mumbai Indians",KKR:"Kolkata Knight Riders",CSK:"Chennai Super Kings",RR:"Rajasthan Royals",PBKS:"Punjab Kings",GT:"Gujarat Titans",LSG:"Lucknow Super Giants",DC:"Delhi Capitals"};
const TEAMS=Object.keys(TF);
const SQ={
  RCB:["Virat Kohli","Rajat Patidar","Phil Salt","Devdutt Padikkal","Liam Livingstone","Jitesh Sharma","Tim David","Krunal Pandya","Swapnil Singh","Jacob Bethell","Romario Shepherd","Nuwan Thushara","Josh Hazlewood","Bhuvneshwar Kumar","Yash Dayal","Rasikh Dar","Jacob Duffy","Suyash Sharma","Lungi Ngidi","Mohit Rathee","Abhinandan Singh"],
  SRH:["Travis Head","Abhishek Sharma","Ishan Kishan","Heinrich Klaasen","Nitish Kumar Reddy","Pat Cummins","Harshal Patel","Brydon Carse","Liam Livingstone","Adam Zampa","Jaydev Unadkat","Simarjeet Singh","Zak Crawley","Atharva Taide","Kamindu Mendis","Aniket Verma","Rahul Chahar","Eshan Malinga","Shreyas Gopal","Abhinav Manohar","Sachin Baby"],
  MI:["Rohit Sharma","Suryakumar Yadav","Hardik Pandya","Jasprit Bumrah","Tilak Varma","Ryan Rickelton","Naman Dhir","Robin Minz","Bevon Jacobs","Will Jacks","Mitchell Santner","Raj Angad Bawa","Reece Topley","Trent Boult","Deepak Chahar","Shardul Thakur","Arjun Tendulkar","Vignesh Puthur","Allah Ghazanfar","Satyanarayana Raju","Marcus Stoinis"],
  KKR:["Ajinkya Rahane","Quinton de Kock","Angkrish Raghuvanshi","Rinku Singh","Venkatesh Iyer","Rovman Powell","Moeen Ali","Sunil Narine","Andre Russell","Varun Chakaravarthy","Harshit Rana","Vaibhav Arora","Spencer Johnson","Anrich Nortje","Umran Malik","Mayank Markande","Luvnith Sisodia","Manish Pandey","Ramandeep Singh","Anukul Roy","Rahmanullah Gurbaz"],
  CSK:["Ruturaj Gaikwad","Devon Conway","Ayush Mhatre","Shaik Rasheed","Shivam Dube","Ravindra Jadeja","MS Dhoni","Sameer Rizvi","Deepak Hooda","Jamie Overton","Rachin Ravindra","Khaleel Ahmed","Noor Ahmad","Anshul Kamboj","Mukesh Choudhary","Nathan Ellis","Gurjapneet Singh","Vijay Shankar","Kamlesh Nagarkoti","Dewald Brevis","Prashant Solanki"],
  RR:["Yashasvi Jaiswal","Vaibhav Suryavanshi","Sanju Samson","Riyan Parag","Shimron Hetmyer","Dhruv Jurel","Nitish Rana","Shubham Dubey","Kumar Kartikeya","Ravichandran Ashwin","Ravindra Jadeja","Jofra Archer","Trent Boult","Sandeep Sharma","Tushar Deshpande","Fazalhaq Farooqi","Adam Milne","Nandre Burger","Ravi Bishnoi","Wanindu Hasaranga","Maheesh Theekshana"],
  PBKS:["Shreyas Iyer","Prabhsimran Singh","Priyansh Arya","Shashank Singh","Nehal Wadhera","Marcus Stoinis","Azmatullah Omarzai","Marco Jansen","Arshdeep Singh","Yuzvendra Chahal","Lockie Ferguson","Xavier Bartlett","Musheer Khan","Harnoor Pannu","Suryansh Shedge","Vishnu Vinod","Kuldeep Sen","Harpreet Brar","Pravin Dubey","Pyla Avinash","Glenn Maxwell"],
  GT:["Shubman Gill","Jos Buttler","Sai Sudharsan","Shahrukh Khan","Anuj Rawat","Washington Sundar","Rahul Tewatia","Rashid Khan","Kagiso Rabada","Mohammed Siraj","Prasidh Krishna","Arshad Khan","Gerald Coetzee","Jayant Yadav","Nishant Sindhu","Manav Suthar","Kulwant Khejroliya","Gurnoor Brar","Sai Kishore","Sherfane Rutherford","Matthew Wade"],
  LSG:["Rishabh Pant","Mitchell Marsh","Nicholas Pooran","Aiden Markram","David Miller","Abdul Samad","Ayush Badoni","Himmat Singh","Aryan Juyal","Shahbaz Ahmed","Digvesh Singh","Akash Deep","Mohammad Shami","Avesh Khan","Yash Thakur","Mayank Yadav","Anrich Nortje","Wanindu Hasaranga","Matheesha Pathirana","Ravi Bishnoi","Akash Singh"],
  DC:["KL Rahul","Faf du Plessis","Abhishek Porel","Tristan Stubbs","Axar Patel","Ashutosh Sharma","Karun Nair","Donovan Ferreira","Sameer Rizvi","Jake Fraser-McGurk","Kuldeep Yadav","Mitchell Starc","Khaleel Ahmed","T. Natarajan","Mukesh Kumar","Mohit Sharma","Darshan Nalkande","Vipraj Nigam","Tripurana Vijay","Dushmantha Chameera","Ravichandran Ashwin"]
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
const NR="NO_RESULT";

/* ─── UTILS ─── */
const encodeEmail=e=>(e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const ek=e=>encodeEmail(e);
const normalizeEmail=e=>(e||"").trim().toLowerCase();
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const decodeKey=k=>{let d=k;for(let i=0;i<8;i++){const n=d.replace(/_at_/g,"@").replace(/_dot_/g,".");if(n===d)break;d=n;}return d;};
const canonicalKey=k=>ek(decodeKey(k));
function normalizeKeyMap(raw){if(!raw)return{};const out={};Object.keys(raw).forEach(k=>{out[canonicalKey(k)]=raw[k];});return out;}
function deepEncodeKeys(v){if(!v||typeof v!=="object"||Array.isArray(v))return v;const r={};Object.keys(v).forEach(k=>{const isEmailKey=k.includes("@")||k.includes("_at_");r[isEmailKey?ek(k):k]=deepEncodeKeys(v[k]);});return r;}
function normalizeAP(raw){if(!raw)return{};const out={};Object.keys(raw).forEach(k=>{const ck=canonicalKey(k);const userPicks=raw[k];if(!userPicks||typeof userPicks!=="object"||Array.isArray(userPicks)){out[ck]={};return;}const normalized={};Object.keys(userPicks).forEach(mid=>{const pick=userPicks[mid];const smid=String(mid);if(pick&&typeof pick==="object"&&pick.toss&&pick.win&&pick.motm){if(!normalized[smid]||typeof mid==="string"){normalized[smid]=pick;}}});out[ck]=normalized;});return out;}
function validateEmail(e){if(!e?.trim())return"Email is required";if(!EMAIL_RE.test(e.trim()))return"Enter a valid email";return"";}
function validatePassword(p,mode="login"){if(!p)return"Password is required";if(mode==="register"){if(p.length<8)return"Min 8 characters";if(!/[A-Z]/.test(p))return"Add an uppercase letter";if(!/[0-9]/.test(p))return"Add a number";if(!/[^A-Za-z0-9]/.test(p))return"Add a special character";}return"";}
function validateName(n){if(!n||n.trim().length<2)return"Name must be at least 2 characters";return"";}
function capChat(arr){return arr.length>CHAT_CAP?arr.slice(arr.length-CHAT_CAP):arr;}
async function sha256(str){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");}
const isNR=v=>!v||v===NR;
const showVal=(v,fallback="—")=>isNR(v)?"🌧 No Result":(v||fallback);
const pickKey=id=>String(id);
const getP=(picks,id)=>{if(!picks||typeof picks!=="object")return null;return picks[pickKey(id)]??null;};

/* ─── FORM HELPER ─── */
function getTeamForm(team,matches,n=5){
  return matches
    .filter(m=>m.result&&(m.home===team||m.away===team))
    .slice(-n)
    .map(m=>{
      if(isNR(m.result.win))return"NR";
      if(m.result.win===team)return"W";
      return"L";
    });
}

/* ─── FIREBASE ─── */
const firebaseConfig={apiKey:"AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",authDomain:"ipl2026-fantasy-20c9b.firebaseapp.com",databaseURL:"https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",projectId:"ipl2026-fantasy-20c9b",storageBucket:"ipl2026-fantasy-20c9b.firebasestorage.app",messagingSenderId:"973930153403",appId:"1:973930153403:web:872ce26072b07e1adf309e"};
const firebaseReady=(async()=>{const[app,db]=await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")]);const _app=app.getApps().length?app.getApp():app.initializeApp(firebaseConfig);return{app:_app,db:db.getDatabase(_app),dbMod:db};})();
const DB={
  get:async k=>{try{const{db,dbMod}=await firebaseReady;const snap=await dbMod.get(dbMod.ref(db,PFX+k));return snap.exists()?snap.val():null;}catch(e){console.error("DB.get",k,e);return null;}},
  set:async(k,v)=>{try{const{db,dbMod}=await firebaseReady;const sv=(k==="ap"&&typeof v==="object"&&v!==null&&!Array.isArray(v))?deepEncodeKeys(v):v;if(sv===null||sv===undefined)await dbMod.remove(dbMod.ref(db,PFX+k));else await dbMod.set(dbMod.ref(db,PFX+k),sv);}catch(e){console.error("DB.set",k,e);}}
};

/* ─── MATCH HELPERS ─── */
function parseMatchDate(date,time){try{const t=(time||"00:00").trim(),p=t.length===4?"0"+t:t;const d=new Date(date+"T"+p+":00+05:30");return isNaN(d.getTime())?null:d;}catch{return null;}}
const cutoff=m=>{const d=parseMatchDate(m.date,m.time);return d?new Date(d-35*60*1000):new Date(0);};
const isMatchLocked=(m,lm={})=>{if(m.result)return true;const st=lm[m.id]??lm[String(m.id)];if(st==="unlocked")return false;if(st==="locked")return true;return new Date()>=cutoff(m);};
const isToday=m=>m.date===new Date().toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});
const isTBD=m=>(m.home||"").startsWith("TBD")||(m.away||"").startsWith("TBD");
const motmMatch=(a,b)=>{if(!a||!b||isNR(a)||isNR(b))return false;const n=s=>s.trim().toLowerCase();const na=n(a),nb=n(b);return na===nb||na.endsWith(" "+nb)||nb.endsWith(" "+na)||na.includes(nb)||nb.includes(na);};
function resolvePlayoffSlots(base,br){if(!br)return base;return base.map(m=>{let{home,away}={...m};if(m.mn==="Q1"&&br.q1?.length===2){[home,away]=[br.q1[0],br.q1[1]];}if(m.mn==="EL1"&&br.el?.length===2){[home,away]=[br.el[0],br.el[1]];}if(m.mn==="Q2"&&br.q2?.length===2){[home,away]=[br.q2[0],br.q2[1]];}if(m.mn==="Final"&&br.final?.length===2){[home,away]=[br.final[0],br.final[1]];}return{...m,home,away};});}

function applyRmEntry(base,r){
  if(!r)return base;
  if(r.result&&typeof r.result==="object"){return{...base,...r,result:r.result,_partial:null};}
  const partialResult={};
  if(r.toss!=null)partialResult.toss=r.toss;
  if(r.win!=null)partialResult.win=r.win;
  if(r.motm!=null)partialResult.motm=r.motm;
  const hasPartial=Object.keys(partialResult).length>0;
  if(r.status==="completed"&&hasPartial){return{...base,...r,result:partialResult,_partial:null};}
  return{...base,...r,result:null,_partial:hasPartial?partialResult:null};
}

/* ─── SCORING ─── */
function calcScore(uPicks,ms,dbl=null){
  let pts=0,ok=0,tot=0,ms2={};
  ms.forEach(m=>{
    if(!m.result)return;
    const p=getP(uPicks,m.id);if(!p)return;
    const mult=(dbl!=null&&Number(dbl)===Number(m.id))?2:1;
    tot++;let base=0,h=0;
    const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
    if(tA&&p.toss===m.result.toss){base+=PTS.toss;h++;}
    if(wA&&p.win===m.result.win){base+=PTS.win;h++;}
    if(mA&&motmMatch(p.motm,m.result.motm)){base+=PTS.motm;h++;}
    if(tA&&wA&&mA&&h===3)base+=PTS.streak;
    const mp=base*mult;if(h>0)ok++;pts+=mp;
    ms2[m.id]={pts:mp,h,perf:tA&&wA&&mA&&h===3};
  });
  const played=ms.filter(m=>m.result&&getP(uPicks,m.id));
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
    const p=getP(uPicks,m.id);if(!p||isNR(m.result.win)||p.win!==m.result.win)return;
    const ae=Object.values(allP);const t2=ae.filter(u=>getP(u,m.id)).length||1;
    if(ae.filter(u=>getP(u,m.id)?.win===m.result.win).length/t2<0.5)ud++;
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
.chat-row{display:flex;flex-direction:column;gap:3px;max-width:82%;word-break:break-word;}
.chat-row.me{align-self:flex-end;align-items:flex-end;}
.chat-row.them{align-self:flex-start;align-items:flex-start;}
.chat-row.sys{align-self:center;align-items:center;max-width:94%;}
.bubble{display:inline-block;padding:9px 13px;border-radius:18px;font-size:13px;line-height:1.5;white-space:pre-wrap;}
.bubble.me{background:linear-gradient(135deg,#1D428A,#2a5bbf);color:#fff;border-bottom-right-radius:4px;}
.bubble.them{background:#fff;color:#1a2540;border:1px solid #e2e8f0;border-bottom-left-radius:4px;}
.bubble.sys{background:#EBF0FA;color:#1D428A;border:1px solid #1D428A20;border-radius:10px;padding:8px 14px;font-size:11px;text-align:center;font-weight:600;}
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
.dd-wrap{position:relative;}
.dd-list{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1.5px solid #1D428A;border-radius:12px;max-height:220px;overflow-y:auto;z-index:200;box-shadow:0 8px 24px rgba(29,66,138,.15);}
.dd-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;}
.dd-item:last-child{border-bottom:none;}
.dd-item:hover,.dd-item.sel{background:#EBF0FA;}
.dd-trigger{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1.5px solid #e2e8f0;color:#1a2540;font-size:13px;font-family:'Barlow',sans-serif;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;}
.dd-trigger.open{border-color:#1D428A;}
.charcnt{font-size:10px;color:#94a3b8;text-align:right;margin-top:3px;}
.stat-mini{flex:1;background:rgba(255,255,255,.12);border-radius:10px;padding:8px 4px;text-align:center;}
.bar-bg{height:7px;border-radius:4px;background:#e2e8f0;overflow:hidden;}
.bar-fill{height:100%;border-radius:4px;transition:width .6s;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fade-in{animation:fadeIn .4s ease forwards;}
.spin{animation:spin .8s linear infinite;}
`;

/* ─── SUB-COMPONENTS ─── */
function TLogo({t,sz=48}){const[e,sE]=useState(false);const c=TC[t]||{bg:"#94a3b8",dk:"#fff"};if(e||!TC[t])return<span style={{width:sz,height:sz,borderRadius:8,background:c.bg,color:c.dk,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:sz*.34,flexShrink:0}}>{(t||"?").slice(0,3)}</span>;return<img src={LOGOS[t]} alt={t} width={sz} height={sz} onError={()=>sE(true)} style={{objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.25))",maxWidth:sz,maxHeight:sz}}/>;}
function Av({name,sz=32}){const ini=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();const c=["#C8102E","#004BA0","#3A225D","#E91E8C","#FF822A","#1B3A6B","#166534"];return<div style={{width:sz,height:sz,borderRadius:"50%",background:c[(name||"").charCodeAt(0)%c.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:sz*.38,color:"#fff",flexShrink:0}}>{ini}</div>;}
function Tst({t}){const bg=t.type==="error"?"#fef2f2":t.type==="ok"?"#f0fdf4":"#EBF0FA";const cl=t.type==="error"?"#991b1b":t.type==="ok"?"#166534":"#1e40af";const br=t.type==="error"?"#fecaca":t.type==="ok"?"#bbf7d0":"#bfdbfe";return<div style={{position:"fixed",bottom:86,left:"50%",transform:"translateX(-50%)",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'Barlow',sans-serif",whiteSpace:"nowrap",zIndex:999,maxWidth:"90vw",overflow:"hidden",textOverflow:"ellipsis",background:bg,color:cl,border:"1px solid "+br,boxShadow:"0 8px 32px rgba(29,66,138,.15)"}}>{t.msg}</div>;}
function Toggle({on,onChange}){return<button className="tog" onClick={()=>onChange(!on)} style={{background:on?"#1D428A":"#e2e8f0"}}><div className="tog-knob" style={{left:on?"23px":"3px"}}/></button>;}
function useCd(ts){const[tl,sT]=useState("");useEffect(()=>{const tick=()=>{const d=ts-Date.now();if(d<=0){sT("NOW");return;}const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);sT(h>0?h+"h "+m+"m":m>0?m+"m "+s+"s":s+"s");};tick();const id=setInterval(tick,1000);return()=>clearInterval(id);},[ts]);return tl;}
function SBar({lbl,tA,tB,cA,cB,clA,clB}){const tot=cA+cB||1,pA=Math.round(cA/tot*100);return<div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:10,color:"#94a3b8"}}>{cA+cB} picks</span></div><div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:"#1a2540",minWidth:28,textAlign:"right"}}>{pA}%</span><div className="bar-bg" style={{flex:1,display:"flex"}}><div className="bar-fill" style={{width:pA+"%",background:clA}}/><div style={{flex:1,background:clB}}/></div><span style={{fontSize:11,fontWeight:700,color:"#1a2540",minWidth:28}}>{100-pA}%</span></div><div style={{display:"flex",justifyContent:"space-between",marginTop:2}}><span style={{fontSize:10,color:"#94a3b8"}}>{tA}</span><span style={{fontSize:10,color:"#94a3b8"}}>{tB}</span></div></div>;}
function PotmDropdown({homeTeam,awayTeam,value,onChange}){const[open,setOpen]=useState(false);const ref=useRef();const players=[...(SQ[homeTeam]||[]).map(p=>({p,t:homeTeam})),...(SQ[awayTeam]||[]).map(p=>({p,t:awayTeam}))];useEffect(()=>{const close=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",close);document.addEventListener("touchstart",close,{passive:true});return()=>{document.removeEventListener("mousedown",close);document.removeEventListener("touchstart",close);};},[]);return<div className="dd-wrap" ref={ref}><button type="button" className={"dd-trigger"+(open?" open":"")} onClick={()=>setOpen(o=>!o)}><span style={{color:value?"#1D428A":"#94a3b8",fontWeight:value?700:400}}>{value||"Select Player of the Match…"}</span><span style={{fontSize:12,color:"#94a3b8"}}>{open?"▲":"▼"}</span></button>{open&&<div className="dd-list">{players.map(({p,t})=>{const c=TC[t]||{bg:"#333",dk:"#fff"};return<div key={p} className={"dd-item"+(value===p?" sel":"")} onMouseDown={e=>{e.preventDefault();onChange(p);setOpen(false);}}><div style={{width:8,height:8,borderRadius:"50%",background:c.bg,flexShrink:0}}/><TLogo t={t} sz={18}/><span style={{flex:1,fontSize:13,color:value===p?"#1D428A":"#475569",fontWeight:value===p?600:400}}>{p}</span><span style={{background:c.bg,color:c.dk||"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:4,flexShrink:0}}>{t}</span></div>;})}
</div>}</div>;}

function FormDots({form,align="left"}){
  if(!form||form.length===0)return null;
  return(
    <div style={{display:"flex",gap:3,alignItems:"center",justifyContent:align==="right"?"flex-end":"flex-start"}}>
      {form.map((r,i)=>(
        <div key={i} style={{width:9,height:9,borderRadius:"50%",flexShrink:0,
          background:r==="W"?"#22c55e":r==="NR"?"#94a3b8":"#ef4444"}}/>
      ))}
    </div>
  );
}

/* ─── MATCH CARD ─── */
function MCard({m,pred,myPicks,allPicks,rxns,doubleMatch,lockedMatches,matchPtsOverride,email,allMs,onPredict,onReact}){
  const[lk,setLk]=useState(()=>isMatchLocked(m,lockedMatches));
  useEffect(()=>{
    if(m.result){setLk(true);return;}
    const tick=()=>setLk(isMatchLocked(m,lockedMatches));
    tick();
    const id=setInterval(tick,1000);
    return()=>clearInterval(id);
  },[m,lockedMatches]);
  const mp=getP(myPicks,m.id);
  const ct=cutoff(m);
  const cStr=ct.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
  const cd=useCd(ct.getTime());
  const mr=rxns[m.id]||{};
  const hc=TC[m.home]||{bg:"#333"},ac=TC[m.away]||{bg:"#555"};
  const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);
  const mult=isDouble?2:1;
  const myEmk=ek(email);
  const mOv=((matchPtsOverride[myEmk]||{})[m.id])??((matchPtsOverride[myEmk]||{})[String(m.id)])??0;
  const isWashout=m.result&&(isNR(m.result.win)||isNR(m.result.motm));

  const homeForm=getTeamForm(m.home,allMs||[],5);
  const awayForm=getTeamForm(m.away,allMs||[],5);
  const hasForm=homeForm.length>0||awayForm.length>0;

  let earned=0;
  if(m.result&&mp){
    let base=0;
    const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
    if(tA&&mp.toss===m.result.toss)base+=PTS.toss;
    if(wA&&mp.win===m.result.win)base+=PTS.win;
    if(mA&&motmMatch(mp.motm,m.result.motm))base+=PTS.motm;
    if(tA&&wA&&mA&&[tA&&mp.toss===m.result.toss,wA&&mp.win===m.result.win,mA&&motmMatch(mp.motm,m.result.motm)].every(Boolean))base+=PTS.streak;
    earned=base*mult;
  }

  const ae=Object.entries(allPicks);
  const tot=ae.filter(([,up])=>getP(up,m.id)!=null).length;

  const autoLocked=new Date()>=cutoff(m);
  const hints=!m.result&&(lk||autoLocked)&&tot>0?{
    tot,
    tA:ae.filter(([,up])=>getP(up,m.id)?.toss===m.home).length,
    tB:ae.filter(([,up])=>getP(up,m.id)?.toss===m.away).length,
    wA:ae.filter(([,up])=>getP(up,m.id)?.win===m.home).length,
    wB:ae.filter(([,up])=>getP(up,m.id)?.win===m.away).length,
  }:null;

  const sp=m.result&&!isNR(m.result.toss)&&tot>0?{
    tot,
    tA:ae.filter(([,up])=>getP(up,m.id)?.toss===m.home).length,
    tB:ae.filter(([,up])=>getP(up,m.id)?.toss===m.away).length,
    wA:ae.filter(([,up])=>getP(up,m.id)?.win===m.home).length,
    wB:ae.filter(([,up])=>getP(up,m.id)?.win===m.away).length,
  }:null;

  const showIntel=!isTBD(m);

  return(
    <div className="mcard fade-in">
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg,"+hc.bg+"10,transparent 50%,"+ac.bg+"10)",pointerEvents:"none",borderRadius:14}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {isDouble&&<span style={{background:"linear-gradient(135deg,#FF822A,#D4AF37)",color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:800}}>⚡ 2×</span>}
          {isWashout&&<span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🌧 Washout</span>}
          {m.result&&!isWashout
            ?<span style={{background:"#dbeafe",color:"#1e40af",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Done</span>
            :!m.result&&lk
            ?<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🔒 Locked</span>
            :!m.result
            ?<span style={{background:"#dcfce7",color:"#166534",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🟢 Open</span>
            :null}
        </div>
      </div>
      {!m.result&&!lk&&cd&&cd!=="NOW"&&(
        <div style={{background:"linear-gradient(135deg,#FFF9E6,#FEF3C7)",border:"1px solid #FDE68A",borderRadius:10,padding:"8px 14px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>⏱</span>
            <span style={{fontFamily:"'Barlow',sans-serif",fontSize:12,fontWeight:600,color:"#92400E"}}>Locks at {cStr}</span>
          </div>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:cd.includes("m")&&!cd.includes("h")&&parseInt(cd)<6?"#dc2626":"#d97706",letterSpacing:1}}>{cd}</span>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"4px 0 6px"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
          <TLogo t={m.home} sz={48}/>
          <p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home}</p>
          <p style={{color:"#64748b",fontSize:9,textAlign:"center",margin:0}}>{TF[m.home]||""}</p>
          <FormDots form={homeForm} align="left"/>
        </div>
        <p className="C" style={{color:"#cbd5e1",fontSize:18,fontWeight:800,letterSpacing:2,margin:"0 6px"}}>VS</p>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
          <TLogo t={m.away} sz={48}/>
          <p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.away}</p>
          <p style={{color:"#64748b",fontSize:9,textAlign:"center",margin:0}}>{TF[m.away]||""}</p>
          <FormDots form={awayForm} align="right"/>
        </div>
      </div>
      {hasForm&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/><span style={{color:"#94a3b8",fontSize:9}}>W</span></div>
          <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:6,height:6,borderRadius:"50%",background:"#ef4444"}}/><span style={{color:"#94a3b8",fontSize:9}}>L</span></div>
          <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:6,height:6,borderRadius:"50%",background:"#94a3b8"}}/><span style={{color:"#94a3b8",fontSize:9}}>NR</span></div>
          <span style={{color:"#94a3b8",fontSize:9}}>· last {Math.max(homeForm.length,awayForm.length)} (oldest→newest)</span>
        </div>
      )}
      <p style={{color:"#94a3b8",fontSize:11,borderTop:"1px solid #f1f5f9",paddingTop:8,marginBottom:10}}>📍 {m.venue}</p>
      {m.result&&(
        <div style={{background:"#F4F6FB",borderRadius:8,padding:"8px 12px",fontSize:12,marginBottom:8}}>
          <span style={{color:"#64748b"}}>Toss: </span><b>{showVal(m.result.toss)}</b>
          <span style={{color:"#94a3b8",margin:"0 6px"}}>·</span>
          <span style={{color:"#64748b"}}>Win: </span><b style={{color:isNR(m.result.win)?"#64748b":"#15803d"}}>{showVal(m.result.win)}</b>
          <span style={{color:"#94a3b8",margin:"0 6px"}}>·</span>
          <span style={{color:"#64748b"}}>POTM: </span><b style={{color:isNR(m.result.motm)?"#64748b":"#B8860B"}}>{showVal(m.result.motm)}</b>
          {mp&&<span style={{color:earned+mOv>0?"#15803d":"#94a3b8",fontWeight:700,float:"right",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14}}>+{earned+mOv}pts</span>}
        </div>
      )}
      {!m.result&&m._partial&&(
        <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:8,padding:"8px 12px",fontSize:12,marginBottom:8}}>
          <span style={{color:"#92400E",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:6}}>📊 Results</span>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {m._partial.toss&&<span style={{color:"#92400E"}}><b>Toss:</b> {m._partial.toss}</span>}
            {m._partial.win&&<span style={{color:"#92400E"}}><b>Win:</b> {m._partial.win}</span>}
            {m._partial.motm&&<span style={{color:"#92400E"}}><b>POTM:</b> {m._partial.motm?.split(" ").slice(-1)[0]}</span>}
          </div>
        </div>
      )}
      {mp&&(
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"7px 12px",fontSize:12,color:"#15803d",marginBottom:8}}>
          My pick: {mp.toss} toss · {mp.win} win · POTM: {mp.motm?.split(" ").slice(-1)[0]}
        </div>
      )}
      {hints&&(
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
          <p style={{color:"#92400E",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>
            💡 Group Leans · {hints.tot} pick{hints.tot!==1?"s":""}
          </p>
          {[["Toss",hints.tA,hints.tB],["Winner",hints.wA,hints.wB]].map(([lbl,cA,cB])=>{
            const tot2=cA+cB||1,pA=Math.round(cA/tot2*100),pB=100-pA;
            return(
              <div key={lbl} style={{marginBottom:lbl==="Toss"?8:0}}>
                <span style={{fontSize:10,fontWeight:600,color:"#92400E",display:"block",marginBottom:3}}>{lbl}</span>
                <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:2}}>
                  <span style={{fontSize:10,fontWeight:700,color:hc.bg,minWidth:32}}>{m.home}</span>
                  <div style={{flex:1,height:8,borderRadius:4,overflow:"hidden",background:"#e2e8f0",display:"flex"}}>
                    <div style={{width:pA+"%",background:hc.bg,transition:"width .6s",borderRadius:"4px 0 0 4px"}}/>
                    <div style={{width:pB+"%",background:ac.bg,borderRadius:"0 4px 4px 0"}}/>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:ac.bg,minWidth:32,textAlign:"right"}}>{m.away}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"0 36px"}}>
                  <span style={{fontSize:10,color:"#92400E",fontWeight:600}}>{pA}%</span>
                  <span style={{fontSize:10,color:"#92400E",fontWeight:600}}>{pB}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {sp&&(
        <div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
          <p style={{color:"#64748b",fontSize:11,fontWeight:600,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:.5}}>Group Split ({sp.tot} picks)</p>
          <SBar lbl="Toss" tA={m.home} tB={m.away} cA={sp.tA} cB={sp.tB} clA={hc.bg} clB={ac.bg}/>
          <SBar lbl="Winner" tA={m.home} tB={m.away} cA={sp.wA} cB={sp.wB} clA={hc.bg} clB={ac.bg}/>
        </div>
      )}
      {showIntel&&<MatchIntelPanel m={m}/>}
      {m.result&&(
        <div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:4,display:"flex",gap:6,flexWrap:"wrap"}}>
          {EMOJIK.map(k=>{
            const cnt=(mr[k]||[]).length,mine=(mr[k]||[]).includes(email);
            return(
              <button key={k} onClick={()=>onReact(m.id,k)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,border:"1px solid "+(mine?"#1D428A":"#e2e8f0"),background:mine?"#EBF0FA":"#f8faff",cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif",fontWeight:mine?700:400,color:mine?"#1D428A":"#475569"}}>
                {EMOJIV[k]}{cnt>0&&<span style={{fontSize:11,fontWeight:700}}>{cnt}</span>}
              </button>
            );
          })}
        </div>
      )}
      {pred&&!lk&&!mp&&<button className="pbtn" style={{marginTop:10}} onClick={()=>onPredict(m)}>Make Prediction</button>}
      {pred&&lk&&!mp&&!m.result&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#991b1b",marginTop:4}}>🔒 Prediction window closed</div>}
    </div>
  );
}

/* ════════ MAIN APP ════════ */
export default function App(){
  const[authMode,setAuthMode]=useState("login");
  const[authEmail,setAuthEmail]=useState("");const[authPw,setAuthPw]=useState("");const[authPw2,setAuthPw2]=useState("");const[authName,setAuthName]=useState("");
  const[authErrors,setAuthErrors]=useState({});const[authLoading,setAuthLoading]=useState(false);
  const[showPw,setShowPw]=useState(false);const[showPw2,setShowPw2]=useState(false);
  const[forgotStep,setForgotStep]=useState(1);const[forgotNewPw,setForgotNewPw]=useState("");const[forgotNewPw2,setForgotNewPw2]=useState("");
  const[showForgotPw,setShowForgotPw]=useState(false);const[showForgotPw2,setShowForgotPw2]=useState(false);
  const regAttempts=useRef([]);
  const[sc,setSc]=useState("splash");
  const[email,setEmail]=useState("");const[user,setUser]=useState(null);const[isAdmin,setIsAdmin]=useState(false);
  const[users,setUsers]=useState({});const[myPicks,setMyPicks]=useState({});const[allPicks,setAllPicks]=useState({});
  const buildBaseMatches=useCallback(()=>BASE_MATCHES.map(m=>({...m,result:null,_partial:null})),[]);
  const[ms,setMs]=useState(()=>buildBaseMatches());
  const[spk,setSpk]=useState({});const[mySp,setMySp]=useState("");
  const[t4pk,setT4pk]=useState({});const[myT4,setMyT4]=useState([]);
  const[sw,setSw]=useState(null);
  const[bc,setBc]=useState([]);const[pinnedBc,setPinnedBc]=useState(null);
  const[chat,setChat]=useState([]);const[chatIn,setChatIn]=useState("");const[chatU,setChatU]=useState(0);
  const[onlineUsers,setOnlineUsers]=useState({});
  const[htab,setHtab]=useState("today");
  const[homeMode,setHomeMode]=useState("predict"); // ← NEW: "predict" | "best11"
  const[b11Match,setB11Match]=useState(null);       // ← NEW: selected match for Best XI
  const[ptab,setPtab]=useState("pending");
  const[am,setAm]=useState(null);const[draft,setDraft]=useState({});
  const[admTab,setAdmTab]=useState("approvals");
  const[bcMsg,setBcMsg]=useState("");
  const[exU,setExU]=useState(null);const[anM,setAnM]=useState(null);
  const[rxns,setRxns]=useState({});
  const[obStep,setObStep]=useState(0);const[obSp,setObSp]=useState("");const[obT4,setObT4]=useState([]);
  const[toast,setToast]=useState(null);
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
  const[pendingUsers,setPendingUsers]=useState({});
  const[reminders,setReminders]=useState({});
  const[bracket,setBracket]=useState(null);
  const[dbRaw,setDbRaw]=useState(null);
  const[dbLoading,setDbLoading]=useState(false);
  const[fixLoading,setFixLoading]=useState(false);
  const[expandUser,setExpandUser]=useState(null);

  const tRef=useRef();const chatRef=useRef();const pollRef=useRef(null);const remTimers=useRef({});
  const lastPendingCount=useRef(0);
  const toast2=useCallback((msg,type="info")=>{setToast({msg,type});clearTimeout(tRef.current);tRef.current=setTimeout(()=>setToast(null),3500);},[]);
  const myEk=useMemo(()=>ek(email),[email]);

  useEffect(()=>{if(!email||!user)return;const ping=async()=>{const now=Date.now();const ou=await DB.get("online")||{};ou[ek(email)]={name:user.name,ts:now};Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});await DB.set("online",ou);setOnlineUsers({...ou});};ping();const id=setInterval(ping,30000);return()=>clearInterval(id);},[email,user]);
  useEffect(()=>{if(!user)return;const id=setInterval(async()=>{const ou=await DB.get("online")||{};const now=Date.now();Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});setOnlineUsers({...ou});},15000);return()=>clearInterval(id);},[user]);
  useEffect(()=>{
    if(!isAdmin||!user)return;
    const poll=async()=>{const pu=await DB.get("pending")||{};const cnt=Object.keys(pu).length;setPendingUsers(pu);if(cnt>lastPendingCount.current)toast2("🔔 New registration pending approval","info");lastPendingCount.current=cnt;};
    poll();const id=setInterval(poll,20000);return()=>clearInterval(id);
  },[isAdmin,user]);// eslint-disable-line

  const forceRepair=useCallback(async()=>{try{const[sp,t4,ap]=await Promise.all([DB.get("sp"),DB.get("t4"),DB.get("ap")]);const cleanAP=normalizeAP(ap);await Promise.all([DB.set("sp",normalizeKeyMap(sp)),DB.set("t4",normalizeKeyMap(t4)),DB.set("ap",cleanAP)]);}catch(e){console.error("repair",e);}},[]);

  const reloadShared=useCallback(async(em)=>{
    const emk=ek(em);
    const[ap,u,rm,b,cm,sp,sw2,t4,rx,rms,br,mn,mnt,pts,lk,pbc,dm,cm2,mu,mpo,pu]=await Promise.all([
      DB.get("ap"),DB.get("u"),DB.get("rm"),DB.get("bc"),DB.get("ch"),
      DB.get("sp"),DB.get("sw"),DB.get("t4"),DB.get("rx"),DB.get("rms"),
      DB.get("bracket"),DB.get("manmatches"),DB.get("maintenance"),DB.get("ptsadj"),DB.get("lockedm"),
      DB.get("pinnedbc"),DB.get("doublematch"),DB.get("chatmuted"),DB.get("mutedusers"),DB.get("matchptsoverride"),
      DB.get("pending")
    ]);
    if(u)setUsers(u);
    if(pu)setPendingUsers(pu);else setPendingUsers({});
    const freshAP=normalizeAP(ap);setAllPicks(freshAP);if(em)setMyPicks(freshAP[emk]||{});
    let allMs=buildBaseMatches();
    if(rm)allMs=allMs.map(m=>{
      const r=rm[m.id]??rm[String(m.id)];
      return applyRmEntry(m,r);
    });
    if(br){setBracket(br);allMs=resolvePlayoffSlots(allMs,br);}else setBracket(null);
    const extraMs=(mn||[]).map(m=>{
      const mid=Number(m.id)||m.id;
      const r=rm&&(rm[mid]??rm[String(mid)]);
      return applyRmEntry({...m,id:mid},r);
    });
    setMs([...allMs,...extraMs]);
    if(b)setBc(b);if(cm)setChat(cm);
    const nsp=normalizeKeyMap(sp);setSpk(nsp);if(em)setMySp(nsp[emk]||"");
    if(sw2!=null)setSw(sw2);
    const nt4=normalizeKeyMap(t4);setT4pk(nt4);if(em)setMyT4(nt4[emk]||[]);
    if(rx)setRxns(rx);if(rms)setReminders(rms);
    if(mnt!=null)setMaintenance(!!mnt);
    if(pts)setManualPtsAdj(normalizeKeyMap(pts));
    if(lk)setLockedMatches(lk);
    setPinnedBc(pbc||null);
    if(dm!=null)setDoubleMatch(dm);
    if(cm2!=null)setChatMuted(!!cm2);
    if(mu)setMutedUsers(normalizeKeyMap(mu));
    if(mpo)setMatchPtsOverride(normalizeKeyMap(mpo));
    return{freshAP,hasOnboarded:!!(nsp[emk])};
  },[buildBaseMatches]);

  useEffect(()=>{
    let cancelled=false;
    const go=async()=>{
      try{
        const saved=await DB.get("session");
        if(!saved?.email||!saved?.token){if(!cancelled)setSc("login");return;}
        const storedToken=await DB.get("token_"+ek(saved.email));
        if(!storedToken||storedToken!==saved.token){await DB.set("session",null);if(!cancelled)setSc("login");return;}
        const u2=await DB.get("u")||{};const ex=u2[saved.email]||null;
        if(!ex||ex.approved===false){await DB.set("session",null);if(!cancelled)setSc("login");return;}
        await forceRepair();if(cancelled)return;
        setUser(ex);setEmail(saved.email);setIsAdmin(saved.email===SUPER_ADMIN);setSessionEmail(saved.email);
        const{freshAP,hasOnboarded}=await reloadShared(saved.email);if(cancelled)return;
        setMyPicks(freshAP[ek(saved.email)]||{});
        setBcSeenTs(Date.now());setChatSeenTs(Date.now());
        setSc(hasOnboarded?"home":"onboard");
      }catch(e){console.error("auto-login",e);if(!cancelled)setSc("login");}
    };
    const t=setTimeout(()=>{if(!cancelled)setSc("login");},7000);
    go().finally(()=>clearTimeout(t));
    return()=>{cancelled=true;clearTimeout(t);};
  // eslint-disable-next-line
  },[]);

  useEffect(()=>{if(["home","picks","lb","wof","adm"].includes(sc)&&email)reloadShared(email);},[sc]);// eslint-disable-line

  useEffect(()=>{
    Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));remTimers.current={};
    Object.keys(reminders).forEach(mid=>{if(!reminders[mid])return;const m=ms.find(x=>x.id===parseInt(mid)||x.id===mid);if(!m)return;const diff=cutoff(m).getTime()-30*60*1000-Date.now();if(diff>0&&diff<24*60*60*1000)remTimers.current[mid]=setTimeout(()=>toast2("⏰ "+m.home+" vs "+m.away+" locks in 30 mins!"),diff);});
    return()=>Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));
  },[reminders,ms,toast2]);

  useEffect(()=>{
    if(sc==="chat"){setChatU(0);setChatSeenTs(Date.now());const poll=async()=>{const[c,u2,ou]=await Promise.all([DB.get("ch"),DB.get("u"),DB.get("online")]);if(c)setChat(c);if(u2)setUsers(u2);if(ou){const now=Date.now();Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});setOnlineUsers({...ou});}};poll();if(pollRef.current)clearInterval(pollRef.current);pollRef.current=setInterval(poll,8000);}
    else{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}}
    return()=>{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}};
  },[sc]);
  useEffect(()=>{if(sc!=="chat")setChatU(chat.filter(m=>m.ts>chatSeenTs).length);},[chat,sc,chatSeenTs]);
  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[chat,sc]);

  async function persistSession(em){const token=Math.random().toString(36).slice(2)+Date.now().toString(36);await DB.set("token_"+ek(em),token);await DB.set("session",{email:em,token});setSessionEmail(em);}

  /* COMPUTED */
  const done=useMemo(()=>ms.filter(m=>m.result),[ms]);
  const todayMs=useMemo(()=>ms.filter(isToday),[ms]);
  const upMs=useMemo(()=>ms.filter(m=>!m.result&&!isToday(m)&&!isTBD(m)),[ms]);
  const unbc=bc.filter(b=>b.ts>bcSeenTs).length;
  const pendingCount=Object.keys(pendingUsers).length;
  const getManualAdj=useCallback(em=>manualPtsAdj[ek(em)]||0,[manualPtsAdj]);
  const getMatchOverride=useCallback(em=>Object.values(matchPtsOverride[ek(em)]||{}).reduce((a,b)=>a+b,0),[matchPtsOverride]);
  const myS=useMemo(()=>calcScore(myPicks,ms,doubleMatch),[myPicks,ms,doubleMatch]);
  const myPts=useMemo(()=>myS.pts+((spk[myEk]&&sw&&spk[myEk]===sw)?PTS.season:0)+((sw&&myT4&&myT4.includes(sw))?PTS.top4:0)+getManualAdj(email)+getMatchOverride(email),[myS,spk,myEk,sw,myT4,getManualAdj,getMatchOverride,email]);
  const lbScores=useMemo(()=>{
    const scores={};
    Object.values(users).forEach(u=>{
      if(!u?.email||u.approved===false)return;
      const emk=ek(u.email);const up=allPicks[emk]||{};
      const st=calcScore(up,ms,doubleMatch);
      const userSp=spk[emk]||"";const userT4=t4pk[emk]||[];
      const sp2=(userSp&&sw&&userSp===sw)?PTS.season:0;
      const t4p=(sw&&userT4.includes(sw))?PTS.top4:0;
      scores[u.email]={pts:st.pts+sp2+t4p+getManualAdj(u.email)+getMatchOverride(u.email),acc:st.acc,hot:st.hot,bgs:calcBadges(up,ms,allPicks),userSp,userT4};
    });
    return scores;
  },[users,allPicks,ms,doubleMatch,spk,sw,t4pk,getManualAdj,getMatchOverride]);
  const getLb=useCallback(()=>Object.values(users).filter(u=>u?.email&&u.approved!==false).map(u=>({...u,...(lbScores[u.email]||{pts:0,acc:0,hot:false,bgs:[],userSp:"",userT4:[]})})).sort((a,b)=>b.pts-a.pts),[users,lbScores]);

  /* AUTH */
  function clearAuthForm(){setAuthEmail("");setAuthPw("");setAuthPw2("");setAuthName("");setAuthErrors({});setShowPw(false);setShowPw2(false);setForgotStep(1);setForgotNewPw("");setForgotNewPw2("");setShowForgotPw(false);setShowForgotPw2(false);}
  async function doLogin(){setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const eErr=validateEmail(em);if(eErr)errs.email=eErr;if(!authPw)errs.pw="Password is required";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}try{const u2=await DB.get("u")||{};const storedHash=await DB.get("pw_"+ek(em));const userEntry=u2[em]||u2[ek(em)];if(!userEntry||storedHash==null){setAuthErrors({email:"No account found."});setAuthLoading(false);return;}if(userEntry.approved===false){setAuthErrors({email:"Account pending admin approval."});setAuthLoading(false);return;}const inputHash=await sha256(authPw);const match=storedHash===inputHash||storedHash===authPw;if(!match){setAuthErrors({pw:"Incorrect password."});setAuthLoading(false);return;}if(storedHash===authPw)await DB.set("pw_"+ek(em),inputHash);await forceRepair();setUsers(u2);await doSignIn(em,userEntry);}catch(e){console.error("login",e);setAuthErrors({email:"Something went wrong."});}setAuthLoading(false);}
  async function doRegister(){const now=Date.now();regAttempts.current=regAttempts.current.filter(t=>now-t<REG_WINDOW);if(regAttempts.current.length>=REG_LIMIT){setAuthErrors({email:"Too many attempts."});return;}regAttempts.current.push(now);setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const eErr=validateEmail(em);if(eErr)errs.email=eErr;const nErr=validateName(authName);if(nErr)errs.name=nErr;const pErr=validatePassword(authPw,"register");if(pErr)errs.pw=pErr;if(authPw!==authPw2)errs.pw2="Passwords do not match";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}try{const u2=await DB.get("u")||{};if(u2[em]||u2[ek(em)]){setAuthErrors({email:"Account already exists."});setAuthLoading(false);return;}const existingPending=await DB.get("pending")||{};if(existingPending[ek(em)]){setAuthErrors({email:"Registration already pending."});setAuthLoading(false);return;}const isFirstUser=Object.keys(u2).length===0||em===SUPER_ADMIN;if(isFirstUser){const ex={email:em,name:authName.trim(),joined:new Date().toISOString(),approved:true};await DB.set("u",{...u2,[em]:ex});await DB.set("pw_"+ek(em),await sha256(authPw));const verify=await DB.get("u")||{};const entry=verify[em]||verify[ek(em)];if(!entry){setAuthErrors({email:"Registration failed."});setAuthLoading(false);return;}setUsers(verify);await doSignIn(em,entry,true);}else{await DB.set("pw_"+ek(em),await sha256(authPw));const pending=await DB.get("pending")||{};pending[ek(em)]={email:em,name:authName.trim(),joined:new Date().toISOString()};await DB.set("pending",pending);setSc("pending_approval");}}catch(err){console.error("register",err);setAuthErrors({email:"Registration failed."});}setAuthLoading(false);}
  async function doForgotStep1(){setAuthLoading(true);const em=normalizeEmail(authEmail);const eErr=validateEmail(em);if(eErr){setAuthErrors({email:eErr});setAuthLoading(false);return;}const u2=await DB.get("u")||{};if(!u2[em]&&!u2[ek(em)]){setAuthErrors({email:"No account found."});setAuthLoading(false);return;}setAuthErrors({});setForgotStep(2);setAuthLoading(false);}
  async function doForgotStep2(){setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const pErr=validatePassword(forgotNewPw,"register");if(pErr)errs.pw=pErr;if(forgotNewPw!==forgotNewPw2)errs.pw2="Passwords do not match";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}await DB.set("pw_"+ek(em),await sha256(forgotNewPw));toast2("Password reset! Please sign in.","ok");const se=authEmail;clearAuthForm();setAuthMode("login");setAuthEmail(se);setAuthLoading(false);}
  async function doSignIn(em,ex,isNew=false){setMyPicks({});setMySp("");setMyT4([]);setObSp("");setObT4([]);setObStep(0);setAm(null);setUser(ex);setEmail(em);setIsAdmin(em===SUPER_ADMIN);await persistSession(em);const{freshAP,hasOnboarded}=await reloadShared(em);setMyPicks(freshAP[ek(em)]||{});setBcSeenTs(Date.now());setChatSeenTs(Date.now());if(isNew||!hasOnboarded)setSc("onboard");else{setSc("home");toast2("Welcome back, "+ex.name+"! 👋","ok");}}
  async function logout(){Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));remTimers.current={};if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}clearTimeout(tRef.current);if(sessionEmail){try{const ou=await DB.get("online")||{};delete ou[ek(sessionEmail)];await DB.set("online",ou);await DB.set("token_"+ek(sessionEmail),null);await DB.set("session",null);}catch(e){console.error(e);}}setSessionEmail(null);setUser(null);setEmail("");setMyPicks({});setMySp("");setMyT4([]);setIsAdmin(false);setAm(null);setAllPicks({});setSpk({});setT4pk({});setOnlineUsers({});setUsers({});setBcSeenTs(0);setChatSeenTs(Date.now());setChatU(0);setToast(null);clearAuthForm();setSc("login");}
  async function approveUser(emk){const pu=await DB.get("pending")||{};const entry=pu[emk];if(!entry)return;delete pu[emk];const u2=await DB.get("u")||{};u2[entry.email]={...entry,approved:true};await DB.set("u",u2);await DB.set("pending",pu);setUsers({...users,[entry.email]:{...entry,approved:true}});setPendingUsers({...pu});toast2(entry.name+" approved! ✅","ok");const latest=await DB.get("ch")||[];const nc=capChat([...latest,{id:Date.now(),email:"__sys__",name:"IPL Bot",text:"🎉 "+entry.name+" has joined! Welcome!",ts:Date.now(),sys:true}]);setChat(nc);await DB.set("ch",nc);}
  async function rejectUser(emk){const pu=await DB.get("pending")||{};const entry=pu[emk];if(!entry)return;delete pu[emk];await DB.set("pending",pu);await DB.set("pw_"+emk,null);setPendingUsers({...pu});toast2(entry.name+" rejected","error");}
  async function updateObStep(step,sp,t4){setObStep(step);if(email)await DB.set("ob_"+myEk,{step,sp,t4});}
  async function doneOnboard(){if(!obSp){toast2("Pick a champion first","error");return;}if(obT4.length!==4){toast2("Select exactly 4 teams","error");return;}const sp2={...spk,[myEk]:obSp};const t42={...t4pk,[myEk]:obT4};setSpk(sp2);setMySp(obSp);setT4pk(t42);setMyT4(obT4);await DB.set("sp",sp2);await DB.set("t4",t42);await DB.set("ob_"+myEk,null);setSc("home");toast2("Picks locked! Let the games begin! 🏏","ok");}
  async function submitPick(){if(!am)return;if(getP(myPicks,am.id)){toast2("Prediction already locked!","error");return;}const freshRm=await DB.get("rm")||{};const freshMatch={...am,...(freshRm[am.id]??freshRm[String(am.id)]??{})};if(isMatchLocked(freshMatch,lockedMatches)){toast2("Match is now locked","error");setAm(null);setSc("home");return;}if(!draft.toss||!draft.win||!draft.motm){toast2("Fill all 3 fields","error");return;}const np={...myPicks,[pickKey(am.id)]:draft};const na={...allPicks,[myEk]:np};setMyPicks(np);setAllPicks(na);await DB.set("ap",na);toast2("Prediction locked! 🎯","ok");setAm(null);setSc("home");}
  async function reactFn(mid,key){const mr=rxns[mid]||{},list=mr[key]||[];const upd={...rxns,[mid]:{...mr,[key]:list.includes(email)?list.filter(e=>e!==email):[...list,email]}};setRxns(upd);await DB.set("rx",upd);}
  async function sendChat(){if(!chatIn.trim()||!user)return;if(chatMuted){toast2("Chat is muted","error");return;}if((mutedUsers||{})[myEk]){toast2("You have been muted","error");return;}const text=chatIn.trim().slice(0,CHAT_MAX);const latest=await DB.get("ch")||[];const nc=capChat([...latest,{id:Date.now(),email:user.email,name:user.name,text,ts:Date.now()}]);setChat(nc);setChatIn("");await DB.set("ch",nc);setChatSeenTs(Date.now());}
  async function delMsg(id){const latest=await DB.get("ch")||[];const nc=latest.filter(m=>m.id!==id);setChat(nc);await DB.set("ch",nc);}
  async function savePartialResult(mid,field,value){const numMid=Number(mid)||mid;const rm=(await DB.get("rm"))||{};const existing=rm[numMid]||{};const{result:_r,...existingFlat}=existing;const updated={...existingFlat,[field]:value};rm[numMid]=updated;await DB.set("rm",rm);setMs(prev=>prev.map(m=>Number(m.id)===Number(mid)?applyRmEntry(m,updated):m));toast2("Saved ✓","ok");}
  async function setManualResult(mid){const f=admResultForm[mid];if(!f?.toss||!f?.win||!f?.motm){toast2("Fill all result fields","error");return;}const result={toss:f.toss,win:f.win,motm:f.motm};const numMid=Number(mid)||mid;const rm=(await DB.get("rm"))||{};rm[numMid]={toss:result.toss,win:result.win,motm:result.motm,status:"completed"};await DB.set("rm",rm);const nm=ms.map(m=>Number(m.id)===Number(mid)?{...m,result,_partial:null,status:"completed"}:m);setMs(nm);setAdmResultForm(prev=>{const n={...prev};delete n[mid];return n;});const freshAP=normalizeAP(await DB.get("ap")||{});const cu=await DB.get("u")||{};const sidStr=String(numMid);const tA=!isNR(result.toss),wA=!isNR(result.win),mA=!isNR(result.motm);const avail=[tA,wA,mA].filter(Boolean).length;const perfs=Object.entries(freshAP).filter(([,up])=>{const p=up[sidStr];if(!p)return false;const correct=[tA&&p.toss===result.toss,wA&&p.win===result.win,mA&&motmMatch(p.motm,result.motm)].filter(Boolean).length;return avail>0&&correct===avail;}).map(([emk])=>{const u=Object.values(cu).find(u=>ek(u.email)===emk);return u?.name||emk;});const matchObj=nm.find(x=>Number(x.id)===Number(mid));const isWR=isNR(result.win)||isNR(result.motm);const latest=await DB.get("ch")||[];const newCh=capChat([...latest,{id:Date.now(),email:"__sys__",name:"IPL Bot",text:(isWR?"🌧 Washout: ":"Result: ")+matchObj.home+" vs "+matchObj.away+"\nToss: "+showVal(result.toss)+" · Win: "+showVal(result.win)+" · POTM: "+showVal(result.motm)+(perfs.length?"\n🎯 All correct: "+perfs.join(", "):"\nNo all-correct picks"),ts:Date.now(),sys:true}]);setChat(newCh);await DB.set("ch",newCh);toast2("Result saved! ✅","ok");await reloadShared(email);}
  async function deleteUser(ue){if(!confirm("Delete "+users[ue]?.name+"?"))return;const uek=ek(ue);const nu={...users};delete nu[ue];delete nu[uek];const na={...allPicks};delete na[uek];const ns={...spk};delete ns[uek];const nt={...t4pk};delete nt[uek];const np={...manualPtsAdj};delete np[uek];const nmpo={...matchPtsOverride};delete nmpo[uek];setUsers(nu);setAllPicks(na);setSpk(ns);setT4pk(nt);setManualPtsAdj(np);setMatchPtsOverride(nmpo);await Promise.all([DB.set("u",nu),DB.set("ap",na),DB.set("sp",ns),DB.set("t4",nt),DB.set("ptsadj",np),DB.set("pw_"+uek,null),DB.set("token_"+uek,null),DB.set("matchptsoverride",nmpo)]);setExU(null);toast2("User deleted","ok");}
  async function sendBc(pin=false){if(!bcMsg.trim())return;const nb=[...bc,{id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"}];setBc(nb);await DB.set("bc",nb);if(pin){setPinnedBc(bcMsg.trim());await DB.set("pinnedbc",bcMsg.trim());}setBcMsg("");toast2(pin?"📌 Pinned!":"Sent!","ok");}
  async function clearPin(){setPinnedBc(null);await DB.set("pinnedbc",null);toast2("Pin cleared");}
  async function addManualMatch(){const{mn,home,away,date,time,venue}=manMatchForm;if(!mn||!home||!away||!date||!time){toast2("Fill all fields","error");return;}if(home===away){toast2("Teams must differ","error");return;}const pt=time.length===4?"0"+time:time;const existing=await DB.get("manmatches")||[];const nm={id:Date.now(),mn:mn.trim(),home,away,date,time:pt,venue:venue||"Custom Venue",result:null,_partial:null,manual:true};await DB.set("manmatches",[...existing,nm]);setMs(prev=>[...prev,nm]);setManMatchForm({mn:"",home:"RCB",away:"MI",date:"",time:"19:30",venue:""});toast2("Match added!","ok");}
  async function toggleMatchLock(mid){const cur=lockedMatches[mid]??lockedMatches[String(mid)];const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";const upd={...lockedMatches};if(next===null)delete upd[mid];else upd[mid]=next;setLockedMatches(upd);await DB.set("lockedm",upd);toast2(next==="locked"?"🔒 Locked":next==="unlocked"?"🔓 Unlocked":"↩️ Auto");}
  async function adjustPts(em,delta){const emk=ek(em);const cur=manualPtsAdj[emk]||0;const upd={...manualPtsAdj,[emk]:cur+delta};setManualPtsAdj(upd);await DB.set("ptsadj",upd);toast2((delta>0?"+":"")+delta+" pts","ok");}
  async function setMatchPts(em,mid,delta){const emk=ek(em);const cur=((matchPtsOverride[emk]||{})[mid])||0;const upd={...matchPtsOverride,[emk]:{...(matchPtsOverride[emk]||{}),[mid]:cur+delta}};setMatchPtsOverride(upd);await DB.set("matchptsoverride",upd);toast2((delta>0?"+":"")+delta+" pts","ok");}
  async function setSeasonWinner(t){setSw(t);await DB.set("sw",t);toast2("Champion: "+t+" 🏆","ok");}
  async function toggleMaintenance(v){setMaintenance(v);await DB.set("maintenance",v);toast2(v?"🔒 App locked":"✅ App live","ok");}
  function exportCSV(){const lb=getLb();const rows=[["Rank","Name","Email","Points","Accuracy","Champion","Top4"].join(","),...lb.map((u,i)=>[i+1,'"'+u.name+'"',u.email,u.pts,u.acc+"%",u.userSp||"",(u.userT4||[]).join("|")].join(","))];const blob=new Blob([rows.join("\n")],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ipl26_leaderboard.csv";a.click();URL.revokeObjectURL(url);toast2("CSV exported!","ok");}

  const cardProps={myPicks,allPicks,rxns,doubleMatch,lockedMatches,matchPtsOverride,email,allMs:ms,onReact:reactFn,
    onPredict:(m)=>{
      if(getP(myPicks,m.id)){toast2("Prediction already locked — no edits allowed","error");return;}
      setAm(m);setDraft({});setSc("picks");
    }
  };

  const navItems=isAdmin
    ?[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","My Game"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"],["adm","⚙️","Admin"]]
    :[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","My Game"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"]];

  function Nav(){return<nav className="nav">{navItems.map(([s,ic,lb2])=>(
    <button key={s} className="ni" onClick={()=>{if(s!=="picks")setAm(null);setSc(s);if(s==="chat"){setChatU(0);setChatSeenTs(Date.now());}if(s==="home")setBcSeenTs(Date.now());}}>
      <div style={{position:"relative",display:"inline-block"}}>
        <span style={{fontSize:15,opacity:sc===s?1:.4}}>{ic}</span>
        {s==="chat"&&chatU>0&&<span className="bd"/>}
        {s==="adm"&&pendingCount>0&&<span className="bd"/>}
      </div>
      <span className="nl" style={{color:sc===s?"#1D428A":"#334155"}}>{lb2}</span>
    </button>
  ))}</nav>;}

  const hdr=<div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"13px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <img src={LOGOS.IPL} alt="IPL" style={{height:28,filter:"brightness(0) invert(1)"}} onError={e=>{e.target.style.display="none";}}/>
      <div><p className="C" style={{color:"#FFE57F",fontSize:13,fontWeight:700,letterSpacing:1,margin:0,textTransform:"uppercase"}}>Fantasy Predictor{isAdmin?" · Admin":""}</p><p style={{color:"#bfdbfe",fontSize:10,margin:0}}>TATA IPL 2026{maintenance?" · 🔒":""}</p></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"5px 12px",textAlign:"center"}}>
        <p className="C" style={{color:"#FFE57F",fontSize:18,fontWeight:800,margin:0,letterSpacing:1}}>{myPts}</p>
        <p style={{color:"#bfdbfe",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>My Pts</p>
      </div>
      <button onClick={logout} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,color:"#bfdbfe",fontSize:11,padding:"5px 8px",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600}}>Out</button>
    </div>
  </div>;

  /* ════════ SCREENS ════════ */
  if(sc==="splash")return<div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f2456,#1D428A,#2a5bbf)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px"}}><style>{CSS}</style><img src={LOGOS.IPL} alt="IPL" style={{width:90,marginBottom:16}} onError={e=>{e.target.style.display="none";}}/><p className="C" style={{fontSize:30,fontWeight:800,color:"#fff",letterSpacing:3,margin:0}}>FANTASY PREDICTOR</p><p style={{color:"#FFE57F",fontSize:12,letterSpacing:4,marginTop:6,marginBottom:28,textTransform:"uppercase"}}>TATA IPL 2026</p><div style={{display:"flex",gap:14,marginBottom:14,justifyContent:"center"}}>{["RCB","MI","CSK","KKR","SRH"].map((t,i)=><div key={t} style={{animation:`fadeIn .4s ease ${i*.08}s both`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><TLogo t={t} sz={38}/></div><span style={{color:"rgba(255,255,255,.7)",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>{t}</span></div>)}</div><div style={{display:"flex",gap:14,marginBottom:36,justifyContent:"center"}}>{["RR","PBKS","GT","LSG","DC"].map((t,i)=><div key={t} style={{animation:`fadeIn .4s ease ${(i+5)*.08}s both`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><TLogo t={t} sz={38}/></div><span style={{color:"rgba(255,255,255,.7)",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>{t}</span></div>)}</div><div style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.6)",fontSize:12}}><span className="spin" style={{fontSize:16}}>⚙</span> Loading…</div></div>;

  if(sc==="pending_approval")return<div className="app"><style>{CSS}</style><div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}><span style={{fontSize:52,marginBottom:16}}>⏳</span><p className="C" style={{color:"#1D428A",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>PENDING APPROVAL</p><p style={{color:"#64748b",fontSize:14,marginTop:12,lineHeight:1.6}}>Your registration is awaiting admin approval.</p><button onClick={()=>setSc("login")} style={{marginTop:28,padding:"12px 28px",borderRadius:10,background:"linear-gradient(135deg,#1D428A,#2a5bbf)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>← Back to Sign In</button></div></div>;

  if(sc==="login")return<div className="app"><style>{CSS}</style><div style={{background:"linear-gradient(160deg,#0f2456,#1D428A,#2a5bbf)",padding:"32px 24px 28px",textAlign:"center"}}><img src={LOGOS.IPL} alt="IPL" style={{width:60,marginBottom:10}} onError={e=>{e.target.style.display="none";}}/><p className="C" style={{fontSize:24,fontWeight:800,letterSpacing:2,color:"#fff",margin:0}}>FANTASY PREDICTOR</p><p style={{color:"#FFE57F",fontSize:10,letterSpacing:3,marginTop:4,textTransform:"uppercase"}}>TATA IPL 2026</p><div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>{TEAMS.map(t=><TLogo key={t} t={t} sz={22}/>)}</div><div style={{display:"flex",gap:0,marginTop:16,background:"rgba(255,255,255,.1)",borderRadius:12,padding:3}}>{[["login","Sign In"],["register","Register"],["forgot","Reset PW"]].map(([m,l])=><button key={m} onClick={()=>{setAuthMode(m);clearAuthForm();}} style={{flex:1,padding:"8px 4px",borderRadius:9,background:authMode===m?"#fff":"transparent",color:authMode===m?"#1D428A":"rgba(255,255,255,.7)",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:10,border:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:.5}}>{l}</button>)}</div></div><div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>{authMode==="login"&&<><div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off" autoCorrect="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showPw?"text":"password"} value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{paddingRight:48}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button></div>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doLogin}>{authLoading?"Signing in…":"Sign In"}</button><p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>No account? <button onClick={()=>{setAuthMode("register");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:11,cursor:"pointer",fontWeight:600}}>Create one →</button></p></>}{authMode==="register"&&<><div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#1e40af"}}>🔒 New accounts require admin approval.</div><div><input className={"inp"+(authErrors.name?" err":"")} value={authName} onChange={e=>{setAuthName(e.target.value);setAuthErrors(p=>({...p,name:""}));}} placeholder="Full name"/>{authErrors.name&&<p className="ferr">{authErrors.name}</p>}</div><div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off" autoCorrect="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showPw?"text":"password"} value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="Password" style={{paddingRight:48}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button></div><p style={{color:"#94a3b8",fontSize:10,marginTop:4}}>Min 8 chars · uppercase · number · special char</p>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw2?" err":"")} type={showPw2?"text":"password"} value={authPw2} onChange={e=>{setAuthPw2(e.target.value);setAuthErrors(p=>({...p,pw2:""}));}} placeholder="Confirm password" style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&doRegister()}/><button onClick={()=>setShowPw2(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw2?"🙈":"👁"}</button></div>{authErrors.pw2&&<p className="ferr">{authErrors.pw2}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doRegister}>{authLoading?"Submitting…":"Submit for Approval"}</button><p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>Already registered? <button onClick={()=>{setAuthMode("login");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:11,cursor:"pointer",fontWeight:600}}>Sign in →</button></p></>}{authMode==="forgot"&&<>{forgotStep===1&&<><div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#1e40af"}}>Enter your registered email to reset your password.</div><div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doForgotStep1}>{authLoading?"Checking…":"Verify Email"}</button></>}{forgotStep===2&&<><div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#166534"}}>✅ Verified: <b>{authEmail}</b></div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showForgotPw?"text":"password"} value={forgotNewPw} onChange={e=>{setForgotNewPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="New password" style={{paddingRight:48}}/><button onClick={()=>setShowForgotPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showForgotPw?"🙈":"👁"}</button></div>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw2?" err":"")} type={showForgotPw2?"text":"password"} value={forgotNewPw2} onChange={e=>{setForgotNewPw2(e.target.value);setAuthErrors(p=>({...p,pw2:""}));}} placeholder="Confirm new password" style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&doForgotStep2()}/><button onClick={()=>setShowForgotPw2(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showForgotPw2?"🙈":"👁"}</button></div>{authErrors.pw2&&<p className="ferr">{authErrors.pw2}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doForgotStep2}>{authLoading?"Saving…":"Set New Password"}</button><button onClick={()=>{setForgotStep(1);setForgotNewPw("");setForgotNewPw2("");setAuthErrors({});}} style={{background:"none",border:"none",color:"#94a3b8",fontSize:12,cursor:"pointer"}}>← Back</button></>}<button onClick={()=>{setAuthMode("login");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:13,cursor:"pointer",fontWeight:600,marginTop:4}}>← Back to Sign In</button></>}</div>{toast&&<Tst t={toast}/>}</div>;

  if(sc==="onboard")return<div className="app" style={{minHeight:"100vh"}}><style>{CSS}</style><div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"24px 20px 20px"}}><p style={{color:"#bfdbfe",fontSize:12,margin:0}}>Welcome, {user?.name}! One-time setup</p><p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:1,margin:"4px 0 0"}}>{obStep===0?"PICK YOUR CHAMPION":"PICK YOUR TOP 4"}</p><div style={{display:"flex",gap:6,marginTop:12}}>{[0,1].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:obStep>=i?"#FFE57F":"rgba(255,255,255,.2)"}}/>)}</div></div><div style={{padding:"20px 16px"}}>{obStep===0&&<><p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who will win IPL 2026?</p><p style={{color:"#64748b",fontSize:13,margin:"0 0 16px"}}>Worth <b style={{color:"#1D428A"}}>{PTS.season}pts</b> if correct. Locked forever.</p><div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=><button key={t} className={"ot"+(obSp===t?" on":"")} onClick={()=>setObSp(t)}><TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:obSp===t?"#1D428A":"#475569"}}>{t}</span></button>)}</div><button className="lbtn" disabled={!obSp} onClick={()=>updateObStep(1,obSp,obT4)} style={{opacity:obSp?1:.4}}>Next → Pick Top 4</button></>}{obStep===1&&<><p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who reaches the playoffs?</p><p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>Select exactly 4 teams · {obT4.length}/4</p><div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=>{const sel=obT4.includes(t);return<button key={t} className={"ot"+(sel?" on":"")} onClick={()=>{if(sel)setObT4(p=>p.filter(x=>x!==t));else if(obT4.length<4)setObT4(p=>[...p,t]);else toast2("Max 4 teams","error");}}><TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:sel?"#1D428A":"#475569"}}>{t}</span>{sel&&<span style={{fontSize:9,background:"#1D428A",color:"#fff",borderRadius:8,padding:"1px 6px"}}>{obT4.indexOf(t)+1}</span>}</button>;})}</div><button style={{width:"100%",padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",marginBottom:10}} onClick={()=>updateObStep(0,obSp,obT4)}>← Back</button><button className="lbtn" disabled={obT4.length!==4} onClick={doneOnboard} style={{opacity:obT4.length===4?1:.4}}>Lock Picks — Let's Play!</button></>}</div>{toast&&<Tst t={toast}/>}</div>;

  if(sc==="picks"&&am){return<div className="app" style={{paddingBottom:32}}><style>{CSS}</style><div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"16px",display:"flex",alignItems:"center",gap:14}}><button onClick={()=>{setAm(null);setSc("home");}} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0}}>&#8592;</button><TLogo t={am.home} sz={28}/><div style={{flex:1}}><p className="C" style={{color:"#fff",fontSize:16,fontWeight:800,margin:0}}>{am.home} vs {am.away}</p><p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{am.date} · {am.time} IST</p></div><TLogo t={am.away} sz={28}/></div><div style={{background:"#FFF9E6",padding:"8px 16px",borderBottom:"1px solid #FDE68A"}}><span style={{color:"#92400E",fontSize:12}}>⚠️ Once submitted, predictions are final. No edits allowed.</span></div><div style={{padding:"16px",display:"flex",flexDirection:"column",gap:18}}>{[["TOSS WINNER","toss",PTS.toss],["MATCH WINNER","win",PTS.win]].map(([title,field,pts])=>(<div key={field}><p className="st">{title} <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{pts}pts</span></p><div style={{display:"flex",gap:10}}>{[am.home,am.away].map(t=><button key={t} className={"tmbtn"+(draft[field]===t?" on":"")} onClick={()=>setDraft(d=>({...d,[field]:t}))}><TLogo t={t} sz={50}/><p className="C" style={{color:draft[field]===t?"#1D428A":"#64748b",fontSize:14,fontWeight:700,margin:0}}>{t}</p>{draft[field]===t&&<span style={{background:"#1D428A",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:12}}>SELECTED</span>}</button>)}</div></div>))}<div><p className="st">PLAYER OF THE MATCH <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.motm}pts</span></p><PotmDropdown homeTeam={am.home} awayTeam={am.away} value={draft.motm||""} onChange={v=>setDraft(d=>({...d,motm:v}))}/></div>{draft.toss&&draft.win&&draft.motm&&<div style={{background:"#EBF0FA",border:"1px solid #dbeafe",borderRadius:12,padding:"14px 16px"}}><p className="st" style={{marginBottom:12}}>YOUR PREDICTION</p>{[["Toss",draft.toss,PTS.toss],["Winner",draft.win,PTS.win],["POTM",draft.motm,PTS.motm]].map(([l,v,p])=><div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#64748b",fontSize:13}}>{l}</span><span style={{color:"#1a2540",fontSize:13,fontWeight:600}}>{v} <span className="C" style={{color:"#1D428A",fontSize:11}}>+{p}pts</span></span></div>)}<div style={{borderTop:"1px solid #dbeafe",paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{color:"#64748b",fontSize:12}}>Max with bonus</span><span className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800}}>+{PTS.toss+PTS.win+PTS.motm+PTS.streak}pts</span></div></div>}<button className="lbtn" disabled={!draft.toss||!draft.win||!draft.motm} onClick={submitPick} style={{opacity:draft.toss&&draft.win&&draft.motm?1:.4}}>Lock Prediction 🔒</button></div>{toast&&<Tst t={toast}/>}</div>;}

  /* ── NEW: Best XI screen ── */
  if(sc==="best11"&&b11Match){
    return<div className="app" style={{paddingBottom:32}}><style>{CSS}</style>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"16px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={()=>{setB11Match(null);setSc("home");}} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0}}>&#8592;</button>
        <TLogo t={b11Match.home} sz={28}/>
        <div style={{flex:1}}>
          <p className="C" style={{color:"#fff",fontSize:16,fontWeight:800,margin:0}}>{b11Match.home} vs {b11Match.away}</p>
          <p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{b11Match.date} · {b11Match.time} IST · Best XI</p>
        </div>
        <TLogo t={b11Match.away} sz={28}/>
      </div>
      <div style={{padding:16}}>
        <Best11Picker
          matchNum={b11Match.id}
          team1={b11Match.home}
          team2={b11Match.away}
          locked={isMatchLocked(b11Match,lockedMatches)}
          currentUser={{uid:myEk,displayName:user?.name}}
          onSave={async({squad,captain,vc})=>{
            await saveB11Pick(b11Match.id,myEk,{squad,captain,vc});
            toast2("Best XI locked! 🏏","ok");
          }}
        />
      </div>
      {toast&&<Tst t={toast}/>}
    </div>;
  }

  if(maintenance&&!isAdmin)return<div className="app"><style>{CSS}</style><div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}><span style={{fontSize:48,marginBottom:16}}>🔧</span><p className="C" style={{color:"#1D428A",fontSize:26,fontWeight:800,letterSpacing:2}}>MAINTENANCE MODE</p><p style={{color:"#64748b",fontSize:14,marginTop:8}}>The app is temporarily offline.</p><button onClick={logout} style={{marginTop:24,padding:"10px 24px",borderRadius:10,background:"#f1f5f9",color:"#64748b",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:13}}>← Sign Out</button></div></div>;

  /* ════════ MAIN SHELL ════════ */
  return<div className="app" style={{paddingBottom:68}}><style>{CSS}</style>
    {hdr}
    {pinnedBc&&<div style={{background:"#1D428A",padding:"8px 16px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>📌</span><p style={{color:"#fff",fontSize:12,fontWeight:600,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pinnedBc}</p></div>}
    {bc.length>0&&sc==="home"&&!pinnedBc&&(()=>{const lt=bc[bc.length-1];return<div style={{background:"#FFF9E6",borderBottom:"1px solid #FDE68A",padding:"8px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setBcSeenTs(Date.now())}><span style={{color:"#B8860B",fontSize:14}}>📢</span><p style={{color:"#92400E",fontSize:12,fontWeight:600,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lt.msg}</p>{unbc>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:12}}>{unbc} new</span>}</div>;})()}
    <div style={{background:"#fff",padding:"8px 16px",display:"flex",borderBottom:"1px solid #e2e8f0"}}>
      {[["🎯","Toss",PTS.toss],["🏆","Win",PTS.win],["⭐","POTM",PTS.motm],["🔥","Streak",PTS.streak]].map(([ic,l,p],i)=><div key={l} style={{flex:1,textAlign:"center",borderRight:i<3?"1px solid #e2e8f0":"none"}}><p style={{color:"#1D428A",fontWeight:700,fontSize:12,margin:0}}>{p}<span style={{fontSize:9,color:"#94a3b8",fontWeight:400}}> pts</span></p><p style={{color:"#64748b",fontSize:9,margin:"1px 0 0"}}>{ic} {l}</p></div>)}
    </div>

    {/* ════════ HOME SCREEN ════════ */}
    {sc==="home"&&<>
      {/* ── Predict / Best XI mode toggle ── */}
      <div style={{display:"flex",gap:8,background:"#EBF0FA",borderBottom:"1px solid #bfdbfe",padding:"10px 16px"}}>
        {[["predict","🎯 Predict"],["best11","🏏 Best XI"]].map(([m,l])=>(
          <button key={m} onClick={()=>setHomeMode(m)} style={{flex:1,padding:"9px",borderRadius:10,border:"none",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:.5,cursor:"pointer",background:homeMode===m?"linear-gradient(135deg,#1D428A,#2a5bbf)":"rgba(255,255,255,.6)",color:homeMode===m?"#fff":"#1D428A",transition:"all .15s"}}>
            {l}
          </button>
        ))}
      </div>

      {/* ── PREDICT mode ── */}
      {homeMode==="predict"&&<>
        <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
          {[["today","Today ("+todayMs.length+")"],["done","Results ("+done.length+")"],["up","Schedule ("+upMs.length+")"],["season","Season"]].map(([t,l])=><button key={t} className={"tbtn"+(htab===t?" on":"")} onClick={()=>setHtab(t)}>{l}</button>)}
        </div>
        <div style={{padding:"14px 14px 0"}}>
          {htab==="today"&&(todayMs.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40,marginBottom:12}}>🏏</p><p className="C" style={{color:"#94a3b8",fontSize:18,fontWeight:700,letterSpacing:1}}>NO MATCHES TODAY</p></div>:todayMs.map(m=><MCard key={m.id} m={m} pred={true} {...cardProps}/>))}
          {htab==="done"&&(done.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40,marginBottom:12}}>⏳</p><p className="C" style={{color:"#94a3b8",fontSize:18,fontWeight:700,letterSpacing:1}}>NO RESULTS YET</p></div>:[...done].reverse().map(m=><MCard key={m.id} m={m} pred={false} {...cardProps}/>))}
          {htab==="up"&&(upMs.length===0?<div style={{textAlign:"center",padding:"48px 16px"}}><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700}}>ALL MATCHES DONE</p></div>:upMs.map(m=>{
            const hasPick=!!getP(myPicks,m.id);
            return<div key={m.id} style={{background:"#fff",border:"1px solid "+(hasPick?"#bbf7d0":"#e2e8f0"),borderRadius:14,padding:"14px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>{hasPick?<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>✅ Predicted</span>:<span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Upcoming</span>}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><TLogo t={m.home} sz={34}/><p className="C" style={{color:"#475569",fontSize:13,fontWeight:700,margin:0}}>{m.home}</p></div><p className="C" style={{color:"#e2e8f0",fontSize:16,fontWeight:800,padding:"0 8px",margin:0}}>VS</p><div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}><TLogo t={m.away} sz={34}/><p className="C" style={{color:"#475569",fontSize:13,fontWeight:700,margin:0}}>{m.away}</p></div></div>
              <p style={{color:"#cbd5e1",fontSize:11,marginTop:10,borderTop:"1px solid #f1f5f9",paddingTop:8}}>📍 {m.venue}</p>
            </div>;
          }))}
          {htab==="season"&&<div>
            <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:2,margin:0}}>MY SEASON PICKS</p></div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}><p className="st">IPL 2026 CHAMPION</p><div style={{display:"flex",alignItems:"center",gap:14}}>{mySp?<TLogo t={mySp} sz={50}/>:<div style={{width:50,height:50,borderRadius:10,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>?</div>}<div><p className="C" style={{color:"#1a2540",fontSize:18,fontWeight:800,margin:0}}>{mySp||"Not set"}</p>{sw&&mySp&&<p style={{color:mySp===sw?"#15803d":"#dc2626",fontSize:13,fontWeight:700,marginTop:6}}>{mySp===sw?"✅ Correct! +200pts":"❌ Better luck next time"}</p>}{!sw&&mySp&&<p style={{color:"#94a3b8",fontSize:11,marginTop:4}}>Worth +{PTS.season}pts at season end</p>}</div></div></div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px"}}><p className="st">MY TOP 4 PICKS</p>{myT4&&myT4.length>0?<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:8,background:"#f8faff",borderRadius:10,padding:"8px 12px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:13,fontWeight:700}}>#{i+1}</span><TLogo t={t} sz={28}/><span className="C" style={{color:"#1D428A",fontSize:14,fontWeight:700}}>{t}</span>{sw&&<span style={{fontSize:13}}>{t===sw?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}</div>
          </div>}
        </div>
      </>}

      {/* ── BEST XI mode ── */}
      {homeMode==="best11"&&<div style={{padding:"14px 14px 0"}}>
        <div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#1e40af"}}>
          🏏 Pick your Best XI for any upcoming match. Min 1 WK · 3 BAT · 1 AR · 3 BOWL. Max 7 from one team. Locks 35 min before start.
        </div>
        {[...todayMs,...upMs].filter(m=>!isTBD(m)).length===0
          ?<div style={{textAlign:"center",padding:"48px 16px"}}>
              <p style={{fontSize:40,marginBottom:12}}>🏏</p>
              <p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700,letterSpacing:1}}>NO UPCOMING MATCHES</p>
            </div>
          :[...todayMs,...upMs].filter(m=>!isTBD(m)).map(m=>{
              const lk=isMatchLocked(m,lockedMatches);
              return(
                <div key={m.id}
                  style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px",marginBottom:10,cursor:"pointer",boxShadow:"0 2px 8px rgba(29,66,138,.05)"}}
                  onClick={()=>{setB11Match(m);setSc("best11");}}
                >
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
                    {lk
                      ?<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🔒 Locked</span>
                      :<span style={{background:"#dcfce7",color:"#166534",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🟢 Open</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                      <TLogo t={m.home} sz={42}/>
                      <div>
                        <p className="C" style={{color:"#1a2540",fontSize:15,fontWeight:800,margin:0}}>{m.home}</p>
                        <p style={{color:"#64748b",fontSize:10,margin:0}}>{TF[m.home]||""}</p>
                      </div>
                    </div>
                    <p className="C" style={{color:"#cbd5e1",fontSize:18,fontWeight:800,margin:"0 8px"}}>VS</p>
                    <div style={{display:"flex",alignItems:"center",gap:10,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}>
                      <TLogo t={m.away} sz={42}/>
                      <div style={{textAlign:"right"}}>
                        <p className="C" style={{color:"#1a2540",fontSize:15,fontWeight:800,margin:0}}>{m.away}</p>
                        <p style={{color:"#64748b",fontSize:10,margin:0}}>{TF[m.away]||""}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{borderTop:"1px solid #f1f5f9",paddingTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <p style={{color:"#94a3b8",fontSize:11,margin:0}}>📍 {m.venue}</p>
                    <span style={{color:"#1D428A",fontSize:12,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif"}}>PICK XI →</span>
                  </div>
                </div>
              );
            })
        }
      </div>}
    </>}

    {sc==="lb"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>LEADERBOARD</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>{done.length} matches · {getLb().length} players</p></div>
      {done.length>0&&(()=>{const lb=getLb();const ae=Object.entries(allPicks);const totalPicks=ae.reduce((s,[,u])=>s+Object.keys(u).length,0);const totalPerfs=done.reduce((s,m)=>s+ae.filter(([,u])=>{const p=getP(u,m.id);if(!p)return false;const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);if(!tA||!wA||!mA)return false;return p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm);}).length,0);const avgAcc=lb.length?Math.round(lb.reduce((s,u)=>s+u.acc,0)/lb.length):0;return<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{[["🏏",totalPicks,"Picks"],["🎯",totalPerfs,"Perfects"],["📊",avgAcc+"%","Avg Acc"],["🔥",lb.filter(u=>u.hot).length,"On Fire"]].map(([ic,val,lbl])=><div key={lbl} style={{flex:1,minWidth:70,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 8px",textAlign:"center"}}><p style={{fontSize:16,margin:0}}>{ic}</p><p className="C" style={{color:"#1D428A",fontSize:16,fontWeight:800,margin:"2px 0 0"}}>{val}</p><p style={{color:"#64748b",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p></div>)}</div>;})()}
      {getLb().map((u,i)=>(
        <div key={u.email} style={{background:u.email===email?"#EBF0FA":"#fff",border:"1px solid "+(u.email===email?"#1D428A60":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10,boxShadow:"0 1px 4px rgba(29,66,138,.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:32,flexShrink:0}}><span style={{fontSize:i<3?18:13}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>{i<3&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:10,color:i===0?"#D4AF37":i===1?"#94a3b8":"#b45309"}}>#{i+1}</span>}</div>
            <Av name={u.name} sz={30}/>
            <div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:5}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}</p>{u.hot&&<span style={{fontSize:13}}>🔥</span>}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:2,flexWrap:"wrap"}}><span style={{fontSize:10,color:"#64748b"}}>{u.acc}% accurate</span>{(u.bgs||[]).slice(0,2).map(b=><span key={b.id} className="bp">{b.ic} {b.lb}</span>)}</div></div>
            <div style={{textAlign:"right",flexShrink:0}}><p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,margin:0,letterSpacing:1}}>{u.pts}</p>{(getManualAdj(u.email)+getMatchOverride(u.email))!==0&&<p style={{color:"#FF822A",fontSize:9,margin:0,fontWeight:600}}>{getManualAdj(u.email)+getMatchOverride(u.email)>0?"+":""}{getManualAdj(u.email)+getMatchOverride(u.email)} adj</p>}</div>
          </div>
          <div style={{display:"flex",gap:8,borderTop:"1px solid #f1f5f9",paddingTop:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0"}}><span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>🏆</span>{u.userSp?<><TLogo t={u.userSp} sz={16}/><span className="C" style={{fontSize:12,fontWeight:700,color:sw&&u.userSp===sw?"#15803d":"#1D428A"}}>{u.userSp}{sw&&u.userSp===sw?" ✅":""}</span></>:<span style={{fontSize:11,color:"#94a3b8"}}>—</span>}</div>
            <div style={{display:"flex",alignItems:"center",gap:4,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0",flex:1,flexWrap:"wrap"}}><span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>Top4:</span>{(u.userT4||[]).length>0?(u.userT4||[]).map(t=><TLogo key={t} t={t} sz={16}/>):<span style={{fontSize:11,color:"#94a3b8"}}>—</span>}</div>
          </div>
        </div>
      ))}
      {getLb().length===0&&<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:36}}>👥</p><p style={{color:"#94a3b8",marginTop:12}}>No players yet.</p></div>}
    </div>}

    {sc==="picks"&&!am&&(()=>{
      const played=ms.filter(m=>m.result&&getP(myPicks,m.id));
      const pending=ms.filter(m=>!m.result&&getP(myPicks,m.id));
      const schedule=ms.filter(m=>!m.result&&!isTBD(m)&&!isToday(m));
      let totalPts=0,perfect=0,streakCur=0,streakBest=0;
      const rows=played.map(m=>{
        const p=getP(myPicks,m.id);
        const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);const mult=isDouble?2:1;
        const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
        const tossOk=tA&&p.toss===m.result.toss,winOk=wA&&p.win===m.result.win,motmOk=mA&&motmMatch(p.motm,m.result.motm);
        const avail=[tA,wA,mA].filter(Boolean).length;const correct=[tossOk,winOk,motmOk].filter(Boolean).length;
        const isPerfect=avail===3&&correct===3;
        let base=0;if(tossOk)base+=PTS.toss;if(winOk)base+=PTS.win;if(motmOk)base+=PTS.motm;
        if(avail>0&&correct===avail)base+=PTS.streak;
        if(isPerfect){perfect++;streakCur++;streakBest=Math.max(streakBest,streakCur);}else streakCur=0;
        const mOv=((matchPtsOverride[myEk]||{})[m.id])??((matchPtsOverride[myEk]||{})[String(m.id)])??0;
        const pts=(base*mult)+mOv;totalPts+=pts;
        return{m,p,tossOk,winOk,motmOk,isPerfect,pts,mult,mOv,tA,wA,mA};
      });
      const acc=rows.length?Math.round(rows.filter(r=>r.tossOk||r.winOk||r.motmOk).length/rows.length*100):0;
      const tossAcc=rows.filter(r=>r.tA).length?Math.round(rows.filter(r=>r.tossOk).length/rows.filter(r=>r.tA).length*100):0;
      const winAcc=rows.filter(r=>r.wA).length?Math.round(rows.filter(r=>r.winOk).length/rows.filter(r=>r.wA).length*100):0;
      const motmAcc=rows.filter(r=>r.mA).length?Math.round(rows.filter(r=>r.motmOk).length/rows.filter(r=>r.mA).length*100):0;
      return<div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>MY GAME</p><p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{Object.keys(myPicks).length} predictions made</p></div><p className="C" style={{color:"#FFE57F",fontSize:28,fontWeight:800,margin:0}}>{myPts}</p></div>
          <div style={{display:"flex",gap:6}}>{[["🏏",rows.length,"Played"],["⭐",totalPts,"Pts"],["🎯",perfect,"Perfect"],["📊",acc+"%","Acc"]].map(([ic,val,lbl])=><div key={lbl} className="stat-mini"><p style={{fontSize:13,margin:0}}>{ic}</p><p className="C" style={{color:"#FFE57F",fontSize:15,fontWeight:800,margin:"2px 0 0"}}>{val}</p><p style={{color:"#bfdbfe",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p></div>)}</div>
          {streakBest>=2&&<div style={{marginTop:10,background:"rgba(255,229,127,.15)",borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>🔥</span><span style={{color:"#FFE57F",fontSize:12,fontWeight:600}}>Best perfect streak: {streakBest} in a row</span></div>}
        </div>
        {rows.length>0&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}><p className="st">PREDICTION ACCURACY</p>{[["🪙 Toss",tossAcc,"#1D428A"],["🏆 Winner",winAcc,"#15803d"],["⭐ POTM",motmAcc,"#B8860B"]].map(([lbl,pct,clr])=><div key={lbl} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:12,color:clr,fontWeight:700}}>{pct}%</span></div><div className="bar-bg"><div className="bar-fill" style={{width:pct+"%",background:clr}}/></div></div>)}</div>}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}><p className="st">SEASON PICKS</p><div style={{display:"flex",gap:10}}><div style={{flex:1,background:"#f8faff",border:"1px solid #dbeafe",borderRadius:10,padding:"10px 12px"}}><p style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 6px"}}>🏆 Champion</p>{mySp?<div style={{display:"flex",alignItems:"center",gap:8}}><TLogo t={mySp} sz={28}/><div><p className="C" style={{color:"#1D428A",fontSize:14,fontWeight:800,margin:0}}>{mySp}</p><p style={{color:sw?(mySp===sw?"#15803d":"#dc2626"):"#94a3b8",fontSize:10,fontWeight:600,margin:0}}>{sw?(mySp===sw?"✅ +200pts":"❌"):"Pending"}</p></div></div>:<p style={{color:"#94a3b8",fontSize:12,margin:0}}>Not set</p>}</div><div style={{flex:1,background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 12px"}}><p style={{fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 6px"}}>🏅 Top 4</p>{myT4&&myT4.length>0?<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:4,background:"#fff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0"}}><span style={{fontSize:9,color:"#94a3b8",fontWeight:700}}>#{i+1}</span><TLogo t={t} sz={18}/><span className="C" style={{fontSize:11,fontWeight:700,color:"#1D428A"}}>{t}</span>{sw&&<span style={{fontSize:10}}>{t===sw?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12,margin:0}}>Not set</p>}</div></div></div>
        <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,marginBottom:14,overflow:"hidden",border:"1px solid #e2e8f0"}}>{[["pending","Pending ("+pending.length+")"],["results","History ("+rows.length+")"],["schedule","Schedule ("+schedule.length+")"]].map(([t,l])=><button key={t} className={"at"+(ptab===t?" on":"")} onClick={()=>setPtab(t)} style={{fontSize:10}}>{l}</button>)}</div>
        {ptab==="pending"&&<>{pending.length===0?<div style={{textAlign:"center",padding:"30px 16px"}}><p style={{fontSize:32}}>⏳</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No predictions awaiting results.</p></div>:pending.map(m=>{const p=getP(myPicks,m.id);const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);const lk=isMatchLocked(m,lockedMatches);const ct=cutoff(m);const cStr=ct.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});return<div key={m.id} style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:12,padding:"12px 14px",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.home} vs {m.away}{isDouble?" ⚡":""}</p><p style={{color:"#94a3b8",fontSize:11,margin:"2px 0 0"}}>📍 {m.venue}</p></div>{!lk?<span style={{background:"#dcfce7",color:"#166534",fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:12,flexShrink:0}}>Open till {cStr}</span>:<span style={{background:"#FDE68A",color:"#92400E",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,flexShrink:0}}>🔒 Locked</span>}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["Toss",p?.toss],["Win",p?.win],["POTM",p?.motm]].map(([l,v])=><span key={l} style={{background:"#fff",border:"1px solid #FDE68A",borderRadius:6,padding:"4px 10px",fontSize:12,color:"#92400E"}}>{l}: <b>{v||"—"}</b></span>)}</div></div>;})}</>}
        {ptab==="results"&&<>{rows.length===0?<div style={{textAlign:"center",padding:"30px 16px"}}><p style={{fontSize:32}}>📜</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No completed predictions yet.</p></div>:[...rows].reverse().map(({m,p,tossOk,winOk,motmOk,isPerfect,pts,mult,mOv,tA,wA,mA})=>(
          <div key={m.id} style={{background:"#fff",border:"1px solid "+(isPerfect?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10,position:"relative",overflow:"hidden"}}>
            {isPerfect&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#22c55e,#16a34a)"}}/>}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date}</p><p style={{color:"#64748b",fontSize:11,margin:"1px 0 0"}}>Win: <b style={{color:isNR(m.result.win)?"#64748b":"#15803d"}}>{showVal(m.result.win)}</b> · POTM: <b style={{color:isNR(m.result.motm)?"#64748b":"#B8860B"}}>{showVal(m.result.motm)}</b></p></div><div style={{textAlign:"right",flexShrink:0}}><p className="C" style={{color:pts>0?"#15803d":"#94a3b8",fontSize:20,fontWeight:800,margin:0}}>{pts>0?"+":""}{pts}</p><p style={{color:"#94a3b8",fontSize:9,margin:0,textTransform:"uppercase"}}>pts{mult>1?" 2×":""}</p></div></div>
            <div style={{display:"flex",gap:6}}>{[["Toss",p.toss,tossOk,m.result.toss,tA],["Winner",p.win,winOk,m.result.win,wA],["POTM",p.motm?.split(" ").slice(-1)[0],motmOk,m.result.motm?.split(" ").slice(-1)[0],mA]].map(([lbl,val,ok,actual,avail])=>(<div key={lbl} style={{flex:1,background:!avail?"#f8faff":ok?"#f0fdf4":"#fef2f2",border:"1px solid "+(!avail?"#e2e8f0":ok?"#bbf7d0":"#fecaca"),borderRadius:8,padding:"6px 8px",textAlign:"center"}}><p style={{color:"#94a3b8",fontSize:9,fontWeight:600,textTransform:"uppercase",margin:"0 0 3px"}}>{lbl}</p><p style={{color:!avail?"#94a3b8":ok?"#15803d":"#dc2626",fontSize:11,fontWeight:700,margin:0}}>{!avail?"🌧":(ok?"✓":"✗")} {val||"—"}</p>{avail&&!ok&&<p style={{color:"#94a3b8",fontSize:9,margin:"2px 0 0"}}>was {actual}</p>}</div>))}</div>
            {isPerfect&&<div style={{marginTop:8,background:"#f0fdf4",borderRadius:6,padding:"5px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12}}>🎯</span><span style={{color:"#15803d",fontSize:11,fontWeight:700}}>Perfect! +{PTS.streak}pts streak bonus</span></div>}
            {mOv!==0&&<p style={{color:"#FF822A",fontSize:10,fontWeight:600,margin:"6px 0 0"}}>Admin adj: {mOv>0?"+":""}{mOv} pts</p>}
          </div>
        ))}</>}
        {ptab==="schedule"&&<><div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:12,color:"#1e40af",display:"flex",gap:8,alignItems:"center"}}><span>📅</span><span>Predictions open on match day only, 5 mins before start.</span></div>{schedule.length===0?<div style={{textAlign:"center",padding:"30px 16px"}}><p style={{fontSize:32}}>🏁</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No upcoming matches left.</p></div>:schedule.map(m=>{const hasPick=!!getP(myPicks,m.id);return<div key={m.id} style={{background:"#fff",border:"1px solid "+(hasPick?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>{hasPick?<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>✅ Predicted</span>:<span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Opens match day</span>}</div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><TLogo t={m.home} sz={30}/><span className="C" style={{color:"#475569",fontSize:13,fontWeight:700}}>{m.home}</span></div><span className="C" style={{color:"#e2e8f0",fontSize:14,fontWeight:800}}>VS</span><div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}><TLogo t={m.away} sz={30}/><span className="C" style={{color:"#475569",fontSize:13,fontWeight:700}}>{m.away}</span></div></div><p style={{color:"#cbd5e1",fontSize:11,margin:0}}>📍 {m.venue}</p></div>;})}</>}
      </div>;
    })()}

    {sc==="chat"&&<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 134px)"}}>
      <div style={{padding:"10px 16px 8px",borderBottom:"1px solid #e2e8f0",background:"#fff"}}><p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,letterSpacing:1,margin:0}}>GROUP CHAT</p><p style={{color:"#64748b",fontSize:11,margin:"2px 0 6px"}}>{Object.values(users).filter(u=>u.approved!==false).length} players · <span style={{color:"#22c55e",fontWeight:600}}>{Object.keys(onlineUsers).length} online</span>{chatMuted?" · 🔇":""}</p><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.values(users).filter(u=>u.approved!==false).map(u=>{const isOnline=!!(onlineUsers[ek(u.email)]);return<div key={u.email} style={{display:"flex",alignItems:"center",gap:4,background:isOnline?"#f0fdf4":"#f8faff",border:"1px solid "+(isOnline?"#bbf7d0":"#e2e8f0"),borderRadius:20,padding:"3px 8px"}}><div style={{width:6,height:6,borderRadius:"50%",background:isOnline?"#22c55e":"#cbd5e1",flexShrink:0}}/><span style={{fontSize:10,fontWeight:600,color:isOnline?"#15803d":"#94a3b8"}}>{u.name.split(" ")[0]}</span></div>;})}</div></div>
      <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:8,background:"#F4F6FB"}}>{chat.length===0&&<div style={{textAlign:"center",padding:"40px 16px"}}><span style={{fontSize:36}}>💬</span><p className="C" style={{color:"#94a3b8",fontSize:16,fontWeight:700,letterSpacing:1,marginTop:12}}>NO MESSAGES YET</p></div>}{chat.map(msg=>{const im=msg.email===email,is=msg.sys;return<div key={msg.id} className={"chat-row "+(is?"sys":im?"me":"them")}>{!im&&!is&&<div style={{display:"flex",alignItems:"center",gap:5}}><Av name={msg.name} sz={16}/><span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{msg.name}</span></div>}<div className={"bubble "+(is?"sys":im?"me":"them")}>{msg.text}{isAdmin&&!is&&<button onClick={()=>delMsg(msg.id)} style={{background:"none",border:"none",color:im?"rgba(255,255,255,.4)":"#94a3b8",fontSize:10,cursor:"pointer",marginLeft:8,padding:0,verticalAlign:"middle"}}>×</button>}</div><span style={{color:"#94a3b8",fontSize:10}}>{new Date(msg.ts).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}</span></div>;})}
        <div ref={chatRef}/></div>
      <div style={{padding:"10px 14px 12px",borderTop:"1px solid #e2e8f0",background:"#fff"}}><div style={{display:"flex",gap:10,alignItems:"flex-end"}}><input className="inp" value={chatIn} onChange={e=>setChatIn(e.target.value.slice(0,CHAT_MAX))} placeholder={chatMuted||(mutedUsers||{})[myEk]?"Chat is muted":"Type a message…"} disabled={chatMuted||(mutedUsers||{})[myEk]} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} style={{flex:1,padding:"10px 14px",borderRadius:24}}/><button onClick={sendChat} style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#1D428A,#2a5bbf)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>&#10148;</button></div>{chatIn.length>CHAT_MAX*0.8&&<p className="charcnt">{chatIn.length}/{CHAT_MAX}</p>}</div>
    </div>}

    {sc==="wof"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>WALL OF FAME</p><p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>Season honours · {done.length} matches</p></div>
      {done.length===0&&<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40}}>🏆</p><p style={{color:"#94a3b8",fontSize:14,marginTop:12}}>Wall of Fame fills as matches complete.</p></div>}
      {done.length>0&&(()=>{
        const stats={};
        Object.values(users).forEach(u=>{if(u.approved===false)return;const emk=ek(u.email);stats[emk]={name:u.name,emk,perfects:0,totalPts:0,streak:0,bestStreak:0,mvpCount:0};});
        const ae=Object.entries(allPicks);
        const matchPerfs={},matchBest={};
        done.forEach(m=>{
          const perMid=[];
          ae.forEach(([emk,up])=>{
            const p=getP(up,m.id);if(!p)return;
            const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
            let base=0;
            if(tA&&p.toss===m.result.toss)base+=PTS.toss;
            if(wA&&p.win===m.result.win)base+=PTS.win;
            if(mA&&motmMatch(p.motm,m.result.motm))base+=PTS.motm;
            const avail=[tA,wA,mA].filter(Boolean).length;
            const correct=[tA&&p.toss===m.result.toss,wA&&p.win===m.result.win,mA&&motmMatch(p.motm,m.result.motm)].filter(Boolean).length;
            if(avail>0&&correct===avail)base+=PTS.streak;
            const isPerfect=tA&&wA&&mA&&correct===3;
            perMid.push({emk,pts:base,isPerfect});
            if(stats[emk]){stats[emk].totalPts+=base;if(isPerfect)stats[emk].perfects++;}
          });
          matchPerfs[m.id]=perMid.filter(x=>x.isPerfect).map(x=>({emk:x.emk,name:stats[x.emk]?.name||x.emk}));
          const maxPts=perMid.reduce((a,b)=>b.pts>a?b.pts:a,0);
          const mvps=perMid.filter(x=>x.pts===maxPts&&x.pts>0);
          mvps.forEach(({emk})=>{if(stats[emk])stats[emk].mvpCount++;});
          matchBest[m.id]=perMid.sort((a,b)=>b.pts-a.pts).slice(0,3).filter(x=>x.pts>0).map(x=>({emk:x.emk,name:stats[x.emk]?.name||x.emk,pts:x.pts,isPerfect:x.isPerfect}));
        });
        Object.keys(stats).forEach(emk=>{let cur=0,best=0;done.forEach(m=>{const p=getP(allPicks[emk]||{},m.id);const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);const avail=[tA,wA,mA].filter(Boolean).length;const correct=[tA&&p?.toss===m.result.toss,wA&&p?.win===m.result.win,mA&&p&&motmMatch(p.motm,m.result.motm)].filter(Boolean).length;const isPerfect=p&&tA&&wA&&mA&&correct===3;if(isPerfect){cur++;best=Math.max(best,cur);}else cur=0;});stats[emk].streak=cur;stats[emk].bestStreak=best;});
        const statArr=Object.values(stats).filter(s=>s.totalPts>0);
        const byPerf=[...statArr].sort((a,b)=>b.perfects-a.perfects||b.totalPts-a.totalPts);
        const byMvp=[...statArr].sort((a,b)=>b.mvpCount-a.mvpCount||b.totalPts-a.totalPts).filter(s=>s.mvpCount>0);
        const byStreak=[...statArr].sort((a,b)=>b.bestStreak-a.bestStreak||b.perfects-a.perfects).filter(s=>s.bestStreak>=2);
        const HallRow=({s,i,val,color,suffix=""})=><div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span style={{fontSize:i<3?18:13,width:28,textAlign:"center",flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span><Av name={s.name} sz={28}/><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{s.name}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{s.perfects} perfects · {s.totalPts} pts{s.streak>0?` · 🔥 ${s.streak} active`:""}</p></div><span style={{background:color+"22",color,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,padding:"3px 10px",borderRadius:10,flexShrink:0}}>{val}{suffix}</span></div>;
        return<>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}><p className="st">🎯 PERFECT PICK HALL</p>{byPerf.filter(s=>s.perfects>0).length===0?<p style={{color:"#94a3b8",fontSize:12,margin:0}}>No perfect picks yet!</p>:byPerf.filter(s=>s.perfects>0).map((s,i)=><HallRow key={s.emk} s={s} i={i} val={s.perfects+"×"} color="#1D428A"/>)}</div>
          {byMvp.length>0&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}><p className="st">⭐ MATCH MVP HALL</p><p style={{color:"#94a3b8",fontSize:11,margin:"0 0 10px"}}>Most times top scorer in a match</p>{byMvp.slice(0,5).map((s,i)=><HallRow key={s.emk} s={s} i={i} val={s.mvpCount+"×"} color="#92400E"/>)}</div>}
          {byStreak.length>0&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}><p className="st">🔥 BEST STREAK HALL</p><p style={{color:"#94a3b8",fontSize:11,margin:"0 0 10px"}}>Longest run of consecutive perfect picks</p>{byStreak.slice(0,5).map((s,i)=><HallRow key={s.emk} s={s} i={i} val={s.bestStreak} suffix="🔥" color="#dc2626"/>)}</div>}
          <p className="st" style={{marginTop:4}}>MATCH BY MATCH</p>
          {done.map(m=>{const perfs=matchPerfs[m.id]||[];const best=matchBest[m.id]||[];const hasPerfect=perfs.length>0;const isWashout=isNR(m.result.win)||isNR(m.result.motm);return<div key={m.id} style={{background:"#fff",border:"1px solid "+(hasPerfect?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"14px",marginBottom:10,position:"relative",overflow:"hidden"}}>{hasPerfect&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#22c55e,#16a34a)"}}/>}{isWashout&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#94a3b8,#64748b)"}}/>}<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><TLogo t={m.home} sz={22}/><div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:13,fontWeight:700,margin:0}}>{m.home} vs {m.away}{isWashout?" 🌧":""}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{m.mn} · {m.date}</p></div><TLogo t={m.away} sz={22}/></div><div style={{background:"#F4F6FB",borderRadius:8,padding:"6px 10px",fontSize:11,marginBottom:10,color:"#64748b"}}>Win: <b style={{color:isNR(m.result.win)?"#64748b":"#15803d"}}>{showVal(m.result.win)}</b> · POTM: <b style={{color:isNR(m.result.motm)?"#64748b":"#B8860B"}}>{showVal(m.result.motm)}</b></div>{hasPerfect&&<div style={{marginBottom:8}}><p style={{color:"#15803d",fontSize:11,fontWeight:700,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.5}}>🎯 Perfect Picks</p><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{perfs.map(p=><div key={p.emk} style={{display:"flex",alignItems:"center",gap:5,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:20,padding:"3px 10px"}}><Av name={p.name} sz={18}/><span style={{color:"#15803d",fontSize:12,fontWeight:600}}>{p.name}</span></div>)}</div></div>}{best.length>0&&<div><p style={{color:"#64748b",fontSize:11,fontWeight:700,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.5}}>{hasPerfect?"📊 Top Scorers":"⭐ Best this match"}</p><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{best.map((b,i)=><div key={b.emk} style={{display:"flex",alignItems:"center",gap:5,background:i===0?"#FFF9E6":"#f8faff",border:"1px solid "+(i===0?"#FDE68A":"#e2e8f0"),borderRadius:20,padding:"3px 10px"}}>{i===0&&<span style={{fontSize:11}}>⭐</span>}<Av name={b.name} sz={18}/><span style={{color:i===0?"#92400E":"#475569",fontSize:12,fontWeight:i===0?700:400}}>{b.name}</span><span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>+{b.pts}</span></div>)}</div></div>}{best.length===0&&<p style={{color:"#94a3b8",fontSize:12,margin:0}}>No picks recorded</p>}</div>;})}
        </>;
      })()}
    </div>}

    {sc==="rules"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p style={{fontSize:28,margin:"0 0 6px"}}>📖</p><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>HOW TO PLAY</p></div>
      {[{icon:"🎯",title:"Making Predictions",color:"#EBF0FA",border:"#bfdbfe",tc:"#1e40af",items:["Predictions open on match day only, locking 35 minutes before start.","Predict Toss Winner, Match Winner, and Player of the Match.","Once submitted, predictions are final — no edits allowed."]},{icon:"⭐",title:"How Points Work",color:"#f0fdf4",border:"#bbf7d0",tc:"#166534",items:["Correct Toss → +10 pts","Correct Match Winner → +20 pts","Correct POTM → +30 pts","All 3 correct → +15 pts bonus","Max per match: 75 pts (150 on 2× match)"]},{icon:"🌧",title:"Washouts",color:"#f8faff",border:"#e2e8f0",tc:"#475569",items:["Only fields with a real result score. Streak bonus never awarded on washouts."]},{icon:"🏆",title:"Season Picks",color:"#FFF9E6",border:"#FDE68A",tc:"#92400E",items:["Pick Champion (+200 pts) and Top 4 (+50 pts each) at signup. Locked forever."]},{icon:"⚡",title:"Double Points",color:"#fff7ed",border:"#fed7aa",tc:"#9a3412",items:["Admin can mark any match as 2× — all points including streak are doubled."]},{icon:"📋",title:"General",color:"#fef2f2",border:"#fecaca",tc:"#991b1b",items:["New accounts require admin approval.","Picks are final once submitted.","Leaderboard updates in real time."]}].map(({icon,title,color,border,tc,items})=>(
        <div key={title} style={{background:color,border:"1px solid "+border,borderRadius:12,padding:"14px 16px",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:18}}>{icon}</span><p className="C" style={{color:tc,fontSize:15,fontWeight:800,margin:0,textTransform:"uppercase"}}>{title}</p></div>{items.map((item,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:i<items.length-1?8:0}}><span style={{color:tc,fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>•</span><p style={{color:tc,fontSize:13,margin:0,lineHeight:1.55,opacity:.9}}>{item}</p></div>)}</div>
      ))}
    </div>}

    {sc==="adm"&&isAdmin&&<div style={{padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><p className="C" style={{color:"#1D428A",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>ADMIN PANEL</p>{maintenance&&<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:700}}>🔒 Maintenance</span>}</div>
      <div style={{display:"flex",background:"#f1f5f9",borderRadius:10,marginBottom:14,overflow:"hidden",border:"1px solid #e2e8f0",flexWrap:"wrap"}}>
        {[["approvals","✅ Approve"+(pendingCount>0?" ("+pendingCount+")":"")],["results","📊 Results"],["pickstatus","👁 Picks"],["users","👥 Users"],["matches","➕ Matches"],["analytics","📈 Stats"],["controls","🎛️ Controls"],["broadcast","📢 Broadcast"]].map(([t,l])=>(
          <button key={t} className={"at"+(admTab===t?" on":"")} onClick={()=>setAdmTab(t)} style={{minWidth:"25%",fontSize:8.5,color:t==="approvals"&&pendingCount>0&&admTab!==t?"#dc2626":undefined,fontWeight:t==="approvals"&&pendingCount>0?"700":undefined}}>{l}</button>
        ))}
      </div>

      {admTab==="approvals"&&(
        pendingCount===0
          ?<div style={{textAlign:"center",padding:"48px 16px"}}><span style={{fontSize:48}}>✅</span><p className="C" style={{color:"#15803d",fontSize:20,fontWeight:800,letterSpacing:1,marginTop:12}}>ALL CAUGHT UP</p></div>
          :<div>{Object.entries(pendingUsers).map(([emk,u])=>(
            <div key={emk} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><Av name={u.name} sz={40}/><div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{u.name}</p><p style={{color:"#64748b",fontSize:12,margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</p></div></div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>approveUser(emk)} style={{flex:1,padding:"11px",borderRadius:10,background:"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,textTransform:"uppercase"}}>✅ Approve</button>
                <button onClick={()=>rejectUser(emk)} style={{flex:1,padding:"11px",borderRadius:10,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,textTransform:"uppercase"}}>❌ Reject</button>
              </div>
            </div>
          ))}</div>
      )}

      {admTab==="results"&&<>
        <p className="st">PENDING ({ms.filter(m=>!m.result&&!isTBD(m)).length})</p>
        {ms.filter(m=>!m.result&&!isTBD(m)).map(m=>{
          const rf=admResultForm[m.id]||{};
          const prefill={toss:rf.toss||(m._partial?.toss||""),win:rf.win||(m._partial?.win||""),motm:rf.motm||(m._partial?.motm||"")};
          const allFilled=!!(prefill.toss&&prefill.win&&prefill.motm);
          const isWashout=prefill.win===NR||prefill.motm===NR;
          return(
            <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date} · {m.time}</p></div></div>
              {[{lbl:"🪙 Toss",field:"toss"},{lbl:"🏆 Winner",field:"win"}].map(({lbl,field})=>(
                <div key={field} style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                  <p style={{color:"#64748b",fontSize:10,fontWeight:700,margin:"0 0 8px",textTransform:"uppercase"}}>{lbl}</p>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <select className="sel" style={{flex:1}} value={prefill[field]} onChange={e=>setAdmResultForm(f=>({...f,[m.id]:{...prefill,[field]:e.target.value}}))}>
                      <option value="">— Select —</option>
                      <option value={m.home}>{m.home}</option>
                      <option value={m.away}>{m.away}</option>
                      <option value={NR}>🌧 No Result</option>
                    </select>
                    <button onClick={async()=>{const val=admResultForm[m.id]?.[field]||prefill[field];if(!val)return;await savePartialResult(m.id,field,val);}} style={{padding:"10px 14px",borderRadius:8,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,flexShrink:0}}>Save</button>
                  </div>
                </div>
              ))}
              <div style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <p style={{color:"#64748b",fontSize:10,fontWeight:700,margin:"0 0 8px",textTransform:"uppercase"}}>⭐ POTM</p>
                <div style={{display:"flex",gap:8,marginBottom:6}}>
                  <button onMouseDown={e=>{e.preventDefault();setAdmResultForm(f=>({...f,[m.id]:{...prefill,motm:NR}}));}} style={{padding:"8px 12px",borderRadius:8,background:prefill.motm===NR?"#fee2e2":"#f8faff",color:prefill.motm===NR?"#dc2626":"#64748b",border:"1px solid "+(prefill.motm===NR?"#fecaca":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:12,flexShrink:0}}>🌧 No Result</button>
                  <button onClick={async()=>savePartialResult(m.id,"motm",NR)} style={{padding:"8px 10px",borderRadius:8,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0}}>Save NR</button>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1}}><PotmDropdown homeTeam={m.home} awayTeam={m.away} value={prefill.motm===NR?"":prefill.motm} onChange={v=>setAdmResultForm(f=>({...f,[m.id]:{...prefill,motm:v}}))}/></div>
                  <button onClick={async()=>{const val=admResultForm[m.id]?.motm||prefill.motm;if(!val)return;await savePartialResult(m.id,"motm",val);}} style={{padding:"10px 14px",borderRadius:8,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,flexShrink:0}}>Save</button>
                </div>
              </div>
              <button onClick={()=>{setAdmResultForm(f=>({...f,[m.id]:{...prefill,...f[m.id]}}));setTimeout(()=>setManualResult(m.id),0);}} disabled={!allFilled} style={{width:"100%",padding:"10px",borderRadius:8,background:allFilled?(isWashout?"linear-gradient(135deg,#64748b,#475569)":"linear-gradient(135deg,#15803d,#16a34a)"):"#f1f5f9",color:allFilled?"#fff":"#94a3b8",border:"none",cursor:allFilled?"pointer":"default",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,textTransform:"uppercase"}}>{allFilled?(isWashout?"🌧 Finalise Washout":"✅ Finalise & Notify"):"Fill all 3 fields"}</button>
            </div>
          );
        })}
        <p className="st" style={{marginTop:16}}>COMPLETED ({done.length})</p>
        {[...done].reverse().map(m=>{
          const ae=Object.entries(allPicks);
          const tot=ae.filter(([,u])=>getP(u,m.id)!=null).length;
          const tossC=ae.filter(([,u])=>!isNR(m.result.toss)&&getP(u,m.id)?.toss===m.result.toss).length;
          const winC=ae.filter(([,u])=>!isNR(m.result.win)&&getP(u,m.id)?.win===m.result.win).length;
          const motmC=ae.filter(([,u])=>!isNR(m.result.motm)&&motmMatch(getP(u,m.id)?.motm,m.result.motm)).length;
          const perfs=ae.filter(([,u])=>{const p=getP(u,m.id);if(!p)return false;const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);if(!tA||!wA||!mA)return false;return p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm);}).length;
          const io=anM===m.id;const hc2=TC[m.home]||{bg:"#1D428A"};const isWashout=isNR(m.result.win)||isNR(m.result.motm);
          return(
            <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,marginBottom:10,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setAnM(io?null:m.id)}>
                <TLogo t={m.home} sz={20}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={20}/>
                <div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn} · {m.date}{isWashout?" 🌧":""}</p><p style={{color:"#64748b",fontSize:11,margin:"2px 0 0"}}>W: <b style={{color:isNR(m.result.win)?"#64748b":"#15803d"}}>{showVal(m.result.win)}</b> · POTM: <b style={{color:isNR(m.result.motm)?"#64748b":"#B8860B"}}>{showVal(m.result.motm)}</b></p></div>
                <div style={{textAlign:"right"}}>{perfs>0&&<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,display:"block",marginBottom:2}}>🎯 {perfs}</span>}<span style={{color:"#94a3b8",fontSize:11}}>{io?"▲":"▼"} {tot}</span></div>
              </div>
              {io&&tot>0&&(
                <div style={{borderTop:"1px solid #f1f5f9",padding:"12px 14px",background:"#f8faff"}}>
                  {[["🪙 Toss",tossC,tot,hc2.bg,!isNR(m.result.toss)],["🏆 Winner",winC,tot,hc2.bg,!isNR(m.result.win)],["⭐ POTM",motmC,tot,"#B8860B",!isNR(m.result.motm)]].map(([lbl,correct,total,clA,avail])=>{
                    const pct=total?Math.round(correct/total*100):0;
                    return(<div key={lbl} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:11,fontWeight:700}}>{avail?correct+"/"+total+" ("+pct+"%)":"🌧 N/A"}</span></div>{avail&&<div className="bar-bg"><div className="bar-fill" style={{width:pct+"%",background:clA}}/></div>}</div>);
                  })}
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <div style={{flex:1,background:"#EBF0FA",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,margin:0}}>{perfs}</p><p style={{color:"#64748b",fontSize:10,margin:0}}>All correct</p></div>
                    <div style={{flex:1,background:"#FFF9E6",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><p className="C" style={{color:"#92400E",fontSize:18,fontWeight:800,margin:0}}>{tot-perfs}</p><p style={{color:"#64748b",fontSize:10,margin:0}}>Missed</p></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </>}

      {admTab==="pickstatus"&&(()=>{
        const approvedUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false);
        const relevantMs=[...ms.filter(m=>!m.result&&!isTBD(m)),...[...done].reverse().slice(0,5)];
        const loadRaw=async()=>{setDbLoading(true);const raw=await DB.get("ap");setDbRaw(raw||{});setDbLoading(false);};
        const forceFixDB=async()=>{setFixLoading(true);const raw=await DB.get("ap")||{};const fixed=normalizeAP(raw);await DB.set("ap",fixed);await reloadShared(email);setDbRaw(fixed);setFixLoading(false);toast2("DB fixed & reloaded ✅","ok");};
        return(
          <div>
            <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
              <p style={{color:"#991b1b",fontSize:12,fontWeight:700,margin:"0 0 8px"}}>⚠️ Ghost Pick Fix</p>
              <p style={{color:"#dc2626",fontSize:11,margin:"0 0 10px"}}>If a user shows as predicted but DB has no pick, click Force Fix.</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={loadRaw} disabled={dbLoading} style={{flex:1,padding:"9px",borderRadius:8,background:"#EBF0FA",color:"#1D428A",border:"1px solid #bfdbfe",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase"}}>{dbLoading?"Loading…":"🔍 Load Raw DB"}</button>
                <button onClick={forceFixDB} disabled={fixLoading} style={{flex:1,padding:"9px",borderRadius:8,background:"linear-gradient(135deg,#dc2626,#b91c1c)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase"}}>{fixLoading?"Fixing…":"🔧 Force Fix DB"}</button>
              </div>
            </div>
            {dbRaw&&(
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
                <p className="st">RAW DB STATE ({Object.keys(dbRaw).length} users)</p>
                {Object.keys(dbRaw).length===0&&<p style={{color:"#94a3b8",fontSize:12}}>No picks in DB.</p>}
                {Object.entries(dbRaw).map(([emk,picks])=>{
                  const u=Object.values(users).find(u=>ek(u.email)===canonicalKey(emk));
                  const name=u?.name||emk;
                  const pickCount=picks&&typeof picks==="object"?Object.keys(picks).length:0;
                  const isExpanded=expandUser===emk;
                  return(
                    <div key={emk} style={{borderBottom:"1px solid #f1f5f9",paddingBottom:8,marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setExpandUser(isExpanded?null:emk)}>
                        <Av name={name} sz={24}/>
                        <div style={{flex:1}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{name}</p><p style={{color:"#94a3b8",fontSize:10,margin:0}}>{emk} · {pickCount} picks in DB</p></div>
                        <span style={{color:"#1D428A",fontSize:12}}>{isExpanded?"▲":"▼"}</span>
                      </div>
                      {isExpanded&&(
                        <div style={{marginTop:8,background:"#f8faff",borderRadius:8,padding:"8px 10px"}}>
                          {pickCount===0&&<p style={{color:"#94a3b8",fontSize:11,margin:0}}>No picks stored.</p>}
                          {Object.entries(picks||{}).map(([mid,pick])=>{
                            const matchObj=ms.find(m=>String(m.id)===String(mid));
                            const isComplete=pick&&pick.toss&&pick.win&&pick.motm;
                            return(<div key={mid} style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,padding:"5px 8px",borderRadius:6,background:isComplete?"#f0fdf4":"#fef2f2",border:"1px solid "+(isComplete?"#bbf7d0":"#fecaca")}}><span style={{fontSize:10,fontWeight:700,color:"#64748b",minWidth:28}}>M{mid}</span>{matchObj&&<span style={{fontSize:10,color:"#94a3b8",minWidth:60}}>{matchObj.home} v {matchObj.away}</span>}<span style={{fontSize:10,color:"#475569",flex:1}}>🪙{pick?.toss||"?"} 🏆{pick?.win||"?"} ⭐{pick?.motm?.split(" ").slice(-1)[0]||"?"}</span>{!isComplete&&<span style={{fontSize:9,background:"#fef2f2",color:"#dc2626",padding:"1px 5px",borderRadius:4,fontWeight:700}}>INCOMPLETE</span>}</div>);
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1e40af"}}>Upcoming + last 5 completed. ✓ = all 3 fields saved. ⚠️ = partial.</div>
            {relevantMs.map(m=>{
              const isDone=!!m.result;const lk=isMatchLocked(m,lockedMatches);
              const predicted=approvedUsers.filter(u=>getP(allPicks[ek(u.email)]||{},m.id)!=null);
              const notPredicted=approvedUsers.filter(u=>getP(allPicks[ek(u.email)]||{},m.id)==null);
              const pct=approvedUsers.length?Math.round(predicted.length/approvedUsers.length*100):0;
              return(<div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><TLogo t={m.home} sz={22}/><div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home} vs {m.away}</p><p style={{color:"#94a3b8",fontSize:11,margin:"1px 0 0"}}>{m.mn} · {m.date} · {isDone?"Done":lk?"Locked":"Open"}</p></div><TLogo t={m.away} sz={22}/></div>
                <div style={{display:"flex",gap:6,marginBottom:8}}>
                  <div style={{flex:1,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"6px",textAlign:"center"}}><p className="C" style={{color:"#15803d",fontSize:18,fontWeight:800,margin:0}}>{predicted.length}</p><p style={{color:"#15803d",fontSize:10,margin:0,fontWeight:600}}>Predicted</p></div>
                  <div style={{flex:1,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"6px",textAlign:"center"}}><p className="C" style={{color:"#dc2626",fontSize:18,fontWeight:800,margin:0}}>{notPredicted.length}</p><p style={{color:"#dc2626",fontSize:10,margin:0,fontWeight:600}}>{lk||isDone?"Missed":"Not Yet"}</p></div>
                  <div style={{flex:1,background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:8,padding:"6px",textAlign:"center"}}><p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,margin:0}}>{pct}%</p><p style={{color:"#64748b",fontSize:10,margin:0,fontWeight:600}}>Rate</p></div>
                </div>
                <div className="bar-bg" style={{marginBottom:10}}><div className="bar-fill" style={{width:pct+"%",background:"#15803d"}}/></div>
                {predicted.length>0&&(<div style={{marginBottom:8}}><p style={{color:"#15803d",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 6px"}}>✅ Predicted</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{predicted.map(u=>{const pick=getP(allPicks[ek(u.email)]||{},m.id);const dbOk=!!(pick&&pick.toss&&pick.win&&pick.motm);return(<div key={u.email} style={{display:"flex",alignItems:"center",gap:4,background:dbOk?"#f0fdf4":"#FFF9E6",border:"1px solid "+(dbOk?"#bbf7d0":"#FDE68A"),borderRadius:20,padding:"3px 9px"}}><Av name={u.name} sz={16}/><span style={{fontSize:11,fontWeight:600,color:dbOk?"#15803d":"#92400E"}}>{u.name.split(" ")[0]}</span><span style={{fontSize:9,color:dbOk?"#15803d":"#92400E"}}>{dbOk?"✓":"⚠️"}</span></div>);})}</div></div>)}
                {notPredicted.length>0&&(<div><p style={{color:"#dc2626",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 6px"}}>{lk||isDone?"❌ Missed":"⏳ Not Yet"}</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{notPredicted.map(u=>(<div key={u.email} style={{display:"flex",alignItems:"center",gap:4,background:"#fef2f2",border:"1px solid #fecaca",borderRadius:20,padding:"3px 9px"}}><Av name={u.name} sz={16}/><span style={{fontSize:11,fontWeight:600,color:"#dc2626"}}>{u.name.split(" ")[0]}</span></div>))}</div></div>)}
              </div>);
            })}
          </div>
        );
      })()}

      {admTab==="users"&&<>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><p style={{color:"#64748b",fontSize:12,margin:0}}>{Object.keys(users).length} players</p><button onClick={exportCSV} style={{padding:"6px 12px",borderRadius:8,background:"#EBF0FA",color:"#1D428A",border:"1px solid #bfdbfe",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase"}}>Export CSV</button></div>
        <input className="inp" value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search by name or email…" style={{marginBottom:12,fontSize:13}}/>
        {Object.values(users).filter(u=>!userSearch||u.name?.toLowerCase().includes(userSearch.toLowerCase())||u.email?.toLowerCase().includes(userSearch.toLowerCase())).sort((a,b)=>(lbScores[b.email]?.pts||0)-(lbScores[a.email]?.pts||0)).map(u=>{
          const st=lbScores[u.email]||{pts:0,acc:0};const up=allPicks[ek(u.email)]||{};const ex2=exU===u.email;const adj=getManualAdj(u.email);const mOv=getMatchOverride(u.email);
          return(<div key={u.email} style={{background:"#fff",border:"1px solid "+(u.email===email?"#1D428A40":"#e2e8f0"),borderRadius:12,marginBottom:10,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setExU(ex2?null:u.email)}>
              <Av name={u.name} sz={34}/>
              <div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}{u.email===SUPER_ADMIN?" 👑":""}</p><p style={{color:"#94a3b8",fontSize:11,margin:"1px 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{Object.keys(up).length} picks · {st.acc}%</p></div>
              <div style={{textAlign:"right"}}><p className="C" style={{color:"#1D428A",fontSize:17,fontWeight:800,margin:0}}>{st.pts}</p>{(adj+mOv)!==0&&<p style={{color:"#FF822A",fontSize:9,margin:0,fontWeight:600}}>{adj+mOv>0?"+":""}{adj+mOv} adj</p>}<p style={{color:"#94a3b8",fontSize:10,margin:"1px 0 0"}}>{ex2?"▲":"▼"}</p></div>
            </div>
            {ex2&&(<div style={{padding:"0 14px 14px",borderTop:"1px solid #f1f5f9"}}>
              <p className="st" style={{marginTop:12}}>POINTS ADJUSTMENT</p>
              <div style={{display:"flex",gap:8,marginBottom:8}}>{[-50,-25,-10,10,25,50].map(d=><button key={d} onClick={()=>adjustPts(u.email,d)} style={{flex:1,padding:"7px 4px",borderRadius:8,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12}}>{d>0?"+":""}{d}</button>)}</div>
              {adj!==0&&<p style={{color:"#FF822A",fontSize:11,fontWeight:600,marginBottom:12}}>Current adj: {adj>0?"+":""}{adj} pts</p>}
              <p className="st">PER-MATCH OVERRIDE</p>
              {ms.filter(m=>getP(up,m.id)).map(m=>{const emk2=ek(u.email);const mOvM=((matchPtsOverride[emk2]||{})[m.id])||0;return(<div key={m.id} style={{background:"#f8faff",borderRadius:10,padding:"10px 12px",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><TLogo t={m.home} sz={16}/><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={16}/><span style={{color:"#64748b",fontSize:11,flex:1}}>{m.mn}</span>{mOvM!==0&&<span style={{color:"#FF822A",fontSize:11,fontWeight:700}}>{mOvM>0?"+":""}{mOvM} pts</span>}</div><div style={{display:"flex",gap:6}}>{[-25,-10,-5,5,10,25].map(d=><button key={d} onClick={()=>setMatchPts(u.email,m.id,d)} style={{flex:1,padding:"5px 2px",borderRadius:6,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11}}>{d>0?"+":""}{d}</button>)}</div></div>);})}
              {u.email!==SUPER_ADMIN&&u.email!==email&&<button onClick={()=>deleteUser(u.email)} className="dbtn" style={{marginTop:12}}>🗑️ Delete Account</button>}
            </div>)}
          </div>);
        })}
      </>}

      {admTab==="matches"&&(<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px"}}><p className="st">ADD CUSTOM MATCH</p><div style={{display:"flex",flexDirection:"column",gap:10}}><input className="inp" value={manMatchForm.mn} onChange={e=>setManMatchForm(f=>({...f,mn:e.target.value}))} placeholder="Match label e.g. M75" style={{fontSize:13}}/><div style={{display:"flex",gap:8}}><select className="sel" value={manMatchForm.home} onChange={e=>setManMatchForm(f=>({...f,home:e.target.value}))}>{TEAMS.map(t=><option key={t} value={t}>{t}</option>)}</select><select className="sel" value={manMatchForm.away} onChange={e=>setManMatchForm(f=>({...f,away:e.target.value}))}>{TEAMS.map(t=><option key={t} value={t}>{t}</option>)}</select></div><div style={{display:"flex",gap:8}}><input className="inp" type="date" value={manMatchForm.date} onChange={e=>setManMatchForm(f=>({...f,date:e.target.value}))} style={{flex:1,fontSize:13}}/><input className="inp" value={manMatchForm.time} onChange={e=>setManMatchForm(f=>({...f,time:e.target.value}))} placeholder="19:30" style={{flex:1,fontSize:13}}/></div><input className="inp" value={manMatchForm.venue} onChange={e=>setManMatchForm(f=>({...f,venue:e.target.value}))} placeholder="Stadium, City" style={{fontSize:13}}/><button onClick={addManualMatch} className="pbtn">Add Match</button></div></div>)}

      {admTab==="analytics"&&<>
        <p className="st">GROUP OVERVIEW</p>
        {(()=>{const lb=getLb();const ae=Object.entries(allPicks);const totalPredictions=ae.reduce((s,[,u])=>s+Object.keys(u).length,0);const totalPerfs=done.reduce((s,m)=>s+ae.filter(([,u])=>{const p=getP(u,m.id);if(!p)return false;const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);if(!tA||!wA||!mA)return false;return p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm);}).length,0);const avgAcc=lb.length?Math.round(lb.reduce((s,u)=>s+u.acc,0)/lb.length):0;return<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{[["🏏",totalPredictions,"Predictions"],["🎯",totalPerfs,"All Correct"],["📊",avgAcc+"%","Avg Acc"],["👥",lb.length,"Players"]].map(([ic,val,lbl])=><div key={lbl} style={{flex:1,minWidth:70,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 8px",textAlign:"center"}}><p style={{fontSize:16,margin:0}}>{ic}</p><p className="C" style={{color:"#1D428A",fontSize:16,fontWeight:800,margin:"2px 0 0"}}>{val}</p><p style={{color:"#64748b",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p></div>)}</div>;})()}
        {done.length>0&&(()=>{const ae=Object.entries(allPicks);const tossT=done.reduce((s,m)=>{if(isNR(m.result.toss))return s;const c=ae.filter(([,u])=>getP(u,m.id)?.toss===m.result.toss).length,t=ae.filter(([,u])=>getP(u,m.id)!=null).length;return{c:s.c+c,t:s.t+t};},{c:0,t:0});const winT=done.reduce((s,m)=>{if(isNR(m.result.win))return s;const c=ae.filter(([,u])=>getP(u,m.id)?.win===m.result.win).length,t=ae.filter(([,u])=>getP(u,m.id)!=null).length;return{c:s.c+c,t:s.t+t};},{c:0,t:0});const motmT=done.reduce((s,m)=>{if(isNR(m.result.motm))return s;const c=ae.filter(([,u])=>motmMatch(getP(u,m.id)?.motm,m.result.motm)).length,t=ae.filter(([,u])=>getP(u,m.id)!=null).length;return{c:s.c+c,t:s.t+t};},{c:0,t:0});return<><p className="st">GROUP ACCURACY</p><div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>{[["🪙 Toss",tossT,"#1D428A"],["🏆 Winner",winT,"#15803d"],["⭐ POTM",motmT,"#B8860B"]].map(([lbl,d,clr])=>{const pct=d.t?Math.round(d.c/d.t*100):0;return<div key={lbl} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:12,color:clr,fontWeight:700}}>{d.c}/{d.t} ({pct}%)</span></div><div className="bar-bg"><div className="bar-fill" style={{width:pct+"%",background:clr}}/></div></div>;})}</div></>;})()}
        <p className="st">CHAMPION PICKS</p>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>{(()=>{const counts={};Object.values(spk).forEach(t=>{if(t)counts[t]=(counts[t]||0)+1;});const tot2=Object.values(counts).reduce((a,b)=>a+b,0)||1;const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);if(!sorted.length)return<p style={{color:"#94a3b8",fontSize:12,margin:0}}>No champion picks yet.</p>;return sorted.map(([t,cnt])=>{const pct=Math.round(cnt/tot2*100);return<div key={t} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><TLogo t={t} sz={20}/><span className="C" style={{fontSize:12,fontWeight:700,color:"#1D428A",minWidth:40}}>{t}</span><div className="bar-bg" style={{flex:1}}><div className="bar-fill" style={{width:pct+"%",background:TC[t]?.bg||"#1D428A"}}/></div><span style={{fontSize:11,color:"#64748b",minWidth:36,textAlign:"right"}}>{cnt} ({pct}%)</span>{sw&&t===sw&&<span>🏆</span>}</div>;});})()}</div>
        <p className="st">PER-MATCH SPLIT</p>
        {ms.filter(m=>{const ae=Object.entries(allPicks);return ae.some(([,u])=>getP(u,m.id)!=null);}).map(m=>{
          const ae=Object.entries(allPicks);const tot=ae.filter(([,u])=>getP(u,m.id)!=null).length;const tA=ae.filter(([,u])=>getP(u,m.id)?.toss===m.home).length;const wA=ae.filter(([,u])=>getP(u,m.id)?.win===m.home).length;const io=anM===m.id;const hc2=TC[m.home]||{bg:"#1D428A"},ac2=TC[m.away]||{bg:"#555"};
          return(<div key={m.id} className="ac" style={{cursor:"pointer"}} onClick={()=>setAnM(io?null:m.id)}><div style={{display:"flex",alignItems:"center",gap:10}}><TLogo t={m.home} sz={22}/><span style={{color:"#94a3b8",fontSize:11}}>vs</span><TLogo t={m.away} sz={22}/><div style={{flex:1}}><p className="C" style={{color:"#1a2540",fontSize:14,fontWeight:700,margin:0}}>{m.home} vs {m.away}</p><p style={{color:"#64748b",fontSize:11,margin:0}}>{tot} picks · {m.mn}</p></div><span style={{color:"#1D428A",fontSize:14}}>{io?"▲":"▼"}</span></div>{io&&<div style={{marginTop:12,borderTop:"1px solid #f1f5f9",paddingTop:12}} onClick={e=>e.stopPropagation()}><SBar lbl="Toss" tA={m.home} tB={m.away} cA={tA} cB={tot-tA} clA={hc2.bg} clB={ac2.bg}/><SBar lbl="Winner" tA={m.home} tB={m.away} cA={wA} cB={tot-wA} clA={hc2.bg} clB={ac2.bg}/></div>}</div>);
        })}
      </>}

      {admTab==="controls"&&<div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">APP CONTROLS</p>
          <div className="ctrl-row"><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>🔧 Maintenance Mode</p><Toggle on={maintenance} onChange={toggleMaintenance}/></div>
          <div className="ctrl-row"><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>📤 Export CSV</p><button onClick={exportCSV} style={{padding:"7px 14px",borderRadius:8,background:"#EBF0FA",color:"#1D428A",border:"1px solid #bfdbfe",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12}}>Export</button></div>
          <div className="ctrl-row"><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>🔇 Mute All Chat</p><Toggle on={!!chatMuted} onChange={async v=>{setChatMuted(v);await DB.set("chatmuted",v);toast2(v?"Chat muted":"Chat reopened");}}/></div>
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">⚡ DOUBLE POINTS MATCH</p>
          {ms.filter(m=>!m.result&&!isTBD(m)).slice(0,8).map(m=>{const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);return(<div key={m.id} className="ctrl-row" style={{padding:"10px 0"}}><div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}><TLogo t={m.home} sz={16}/><span className="C" style={{fontSize:11,fontWeight:700}}>{m.home}</span><span style={{color:"#94a3b8",fontSize:10}}>vs</span><TLogo t={m.away} sz={16}/><span className="C" style={{fontSize:11,fontWeight:700}}>{m.away}</span><span style={{color:"#94a3b8",fontSize:10,marginLeft:4}}>{m.mn}</span></div><button onClick={async()=>{const v=isDouble?null:m.id;setDoubleMatch(v);await DB.set("doublematch",v);toast2(v?"⚡ 2× set":"Removed");}} style={{padding:"5px 10px",borderRadius:8,background:isDouble?"linear-gradient(135deg,#FF822A,#D4AF37)":"#f8faff",color:isDouble?"#fff":"#64748b",border:"1px solid "+(isDouble?"#FF822A":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0}}>{isDouble?"2× ON":"Set 2×"}</button></div>);})}
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">SET CHAMPION</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>{TEAMS.map(t=><button key={t} onClick={()=>setSeasonWinner(t)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:sw===t?"#1D428A":"#f8faff",border:"1.5px solid "+(sw===t?"#1D428A":"#e2e8f0"),cursor:"pointer"}}><TLogo t={t} sz={20}/><span className="C" style={{fontSize:12,fontWeight:700,color:sw===t?"#fff":"#475569"}}>{t}</span>{sw===t&&<span style={{fontSize:10}}>🏆</span>}</button>)}</div>
          {sw&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#15803d"}}>Champion: <b>{sw}</b></div>}
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">🔒 LOCK / UNLOCK MATCHES</p>
          {ms.filter(m=>!m.result&&!isTBD(m)).map(m=>{
            const lstate=lockedMatches[m.id]??lockedMatches[String(m.id)];
            return(
              <div key={m.id} className="ctrl-row">
                <div style={{flex:1,minWidth:0}}><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{m.mn}: {m.home} vs {m.away}</p><p style={{color:"#94a3b8",fontSize:11,margin:"1px 0 0"}}>{m.date} · {m.time}</p></div>
                <button onClick={()=>toggleMatchLock(m.id)} style={{padding:"6px 12px",borderRadius:8,background:lstate==="locked"?"#fee2e2":lstate==="unlocked"?"#dcfce7":"#f1f5f9",color:lstate==="locked"?"#dc2626":lstate==="unlocked"?"#15803d":"#64748b",border:"1px solid "+(lstate==="locked"?"#fecaca":lstate==="unlocked"?"#bbf7d0":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0,textTransform:"uppercase",minWidth:90}}>{lstate==="locked"?"🔒 Locked":lstate==="unlocked"?"🔓 Unlocked":"⚙️ Auto"}</button>
              </div>
            );
          })}
        </div>
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st">💬 MUTE USERS</p>
          {Object.values(users).filter(u=>u.email!==email&&u.approved!==false).map(u=>{
            const isMuted=(mutedUsers||{})[ek(u.email)];
            return(
              <div key={u.email} className="ctrl-row">
                <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}><Av name={u.name} sz={24}/><p style={{color:"#1a2540",fontSize:12,fontWeight:600,margin:0}}>{u.name}</p></div>
                <button onClick={async()=>{const upd={...(mutedUsers||{}),[ek(u.email)]:!isMuted};setMutedUsers(upd);await DB.set("mutedusers",upd);toast2((!isMuted?"🔇 ":"🔊 ")+u.name);}} style={{padding:"5px 10px",borderRadius:8,background:isMuted?"#fef2f2":"#f8faff",color:isMuted?"#dc2626":"#64748b",border:"1px solid "+(isMuted?"#fecaca":"#e2e8f0"),cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,flexShrink:0,textTransform:"uppercase"}}>{isMuted?"Unmute":"Mute"}</button>
              </div>
            );
          })}
        </div>
        <div style={{background:"#fff",border:"1px solid #fecaca",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p className="st" style={{color:"#dc2626",borderColor:"#fecaca"}}>⚠️ DANGER ZONE</p>
          <div className="ctrl-row">
            <div><p style={{color:"#1a2540",fontSize:13,fontWeight:600,margin:0}}>🗑️ Reset Season</p><p style={{color:"#94a3b8",fontSize:11,margin:"2px 0 0"}}>Wipes all picks, results, pts.</p></div>
            <button onClick={async()=>{if(!confirm("RESET entire season? Cannot be undone."))return;await Promise.all([DB.set("ap",{}),DB.set("rm",{}),DB.set("sp",{}),DB.set("t4",{}),DB.set("ptsadj",{}),DB.set("doublematch",null),DB.set("sw",null),DB.set("matchptsoverride",{}),DB.set("manmatches",[]),DB.set("bracket",null),DB.set("lockedm",{})]);setAllPicks({});setMyPicks({});setMs(buildBaseMatches());setManualPtsAdj({});setSw(null);setDoubleMatch(null);setMatchPtsOverride({});setBracket(null);setLockedMatches({});setSpk({});setT4pk({});setMySp("");setMyT4([]);toast2("Season reset","ok");}} style={{padding:"7px 10px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",flexShrink:0}}>Reset</button>
          </div>
        </div>
      </div>}

      {admTab==="broadcast"&&<>
        <div className="ac"><p className="st">SEND BROADCAST</p><textarea className="inp" value={bcMsg} onChange={e=>setBcMsg(e.target.value)} placeholder="Message for everyone's Home tab…" rows={3} style={{resize:"none",marginBottom:12,lineHeight:1.5}}/><div style={{display:"flex",gap:8}}><button onClick={()=>sendBc(false)} className="pbtn" style={{flex:2}}>Send</button><button onClick={()=>sendBc(true)} style={{flex:1,padding:"11px",borderRadius:10,background:"#1D428A",color:"#FFE57F",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,border:"none",cursor:"pointer"}}>📌 Pin</button></div>{pinnedBc&&<div style={{marginTop:12,background:"#1D428A",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#fff",fontSize:12,fontWeight:600}}>📌 {pinnedBc}</span><button onClick={clearPin} style={{background:"none",border:"none",color:"#bfdbfe",cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button></div>}</div>
        <p className="st" style={{marginTop:16}}>HISTORY</p>
        {bc.length===0&&<p style={{color:"#94a3b8",fontSize:12}}>No broadcasts yet</p>}
        {[...bc].reverse().map(b=>(
          <div key={b.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:15,flexShrink:0}}>📢</span>
            <div style={{flex:1}}><p style={{color:"#1a2540",fontSize:13,margin:"0 0 3px"}}>{b.msg}</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>{new Date(b.ts).toLocaleString("en-IN",{timeZone:"Asia/Kolkata",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:true})}</p></div>
            <button onClick={async()=>{const nb=bc.filter(x=>x.id!==b.id);setBc(nb);await DB.set("bc",nb);}} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14,padding:"2px 6px"}}>×</button>
          </div>
        ))}
      </>}
    </div>}

    <Nav/>
    {toast&&<Tst t={toast}/>}
  </div>;
}
