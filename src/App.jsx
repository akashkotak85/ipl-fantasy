import * as React from "react";
import{useState,useEffect,useRef,useCallback,useMemo}from"react";
import MatchIntelPanel from"./MatchIntelPanel.jsx";

const LOGOS={IPL:"https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",RCB:"https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",SRH:"https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",MI:"https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",KKR:"https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",CSK:"https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",RR:"https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",PBKS:"https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",GT:"https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",LSG:"https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",DC:"https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png"};
const TC={RCB:{bg:"#C8102E",dk:"#FFD700"},SRH:{bg:"#FF822A",dk:"#1B1B1B"},MI:{bg:"#004BA0",dk:"#fff"},KKR:{bg:"#3A225D",dk:"#FFD700"},CSK:{bg:"#F5C600",dk:"#003566"},RR:{bg:"#2D0A6B",dk:"#E91E8C"},PBKS:{bg:"#ED1B24",dk:"#fff"},GT:{bg:"#1B3A6B",dk:"#B5985A"},LSG:{bg:"#A72056",dk:"#fff"},DC:{bg:"#00008B",dk:"#fff"}};
const TF={RCB:"Royal Challengers Bengaluru",SRH:"Sunrisers Hyderabad",MI:"Mumbai Indians",KKR:"Kolkata Knight Riders",CSK:"Chennai Super Kings",RR:"Rajasthan Royals",PBKS:"Punjab Kings",GT:"Gujarat Titans",LSG:"Lucknow Super Giants",DC:"Delhi Capitals"};
const TEAMS=Object.keys(TF);
const SQ={
  RCB:["Virat Kohli","Rajat Patidar","Phil Salt","Devdutt Padikkal","Jitesh Sharma","Tim David","Krunal Pandya","Swapnil Singh","Jacob Bethell","Romario Shepherd","Nuwan Thushara","Josh Hazlewood","Bhuvneshwar Kumar","Yash Dayal","Rasikh Dar","Suyash Sharma","Abhinandan Singh","Liam Livingstone","Jacob Duffy","Mohit Rathee","Lungi Ngidi"],
  SRH:["Travis Head","Abhishek Sharma","Ishan Kishan","Heinrich Klaasen","Nitish Kumar Reddy","Pat Cummins","Harshal Patel","Brydon Carse","Liam Livingstone","Jaydev Unadkat","Shivam Mavi","Kamindu Mendis","Aniket Verma","Harsh Dubey","Eshan Malinga","Salil Arora","Smaran Ravichandran","Amit Kumar","Jack Edwards","Zeeshan Ansari","Praful Hinge","Onkar Tarmale","Sakib Hussain","Shivang Kumar","Krains Fuletra"],
  MI:["Rohit Sharma","Suryakumar Yadav","Hardik Pandya","Jasprit Bumrah","Tilak Varma","Ryan Rickelton","Naman Dhir","Robin Minz","Will Jacks","Mitchell Santner","Raj Angad Bawa","Trent Boult","Deepak Chahar","Shardul Thakur","AM Ghazanfar","Corbin Bosch","Ashwani Kumar","Raghu Sharma","Sherfane Rutherford","Mayank Markande","Bevon Jacobs"],
  KKR:["Ajinkya Rahane","Angkrish Raghuvanshi","Rinku Singh","Venkatesh Iyer","Cameron Green","Sunil Narine","Varun Chakaravarthy","Harshit Rana","Vaibhav Arora","Matheesha Pathirana","Blessing Muzarabani","Ramandeep Singh","Anukul Roy","Tim Seifert","Finn Allen","Rachin Ravindra","Rahul Tripathi","Kartik Tyagi","Saurabh Dubey","Manish Pandey","Luvnith Sisodia"],
  CSK:["Ruturaj Gaikwad","Sanju Samson","Ayush Mhatre","Shivam Dube","Dewald Brevis","MS Dhoni","Urvil Patel","Noor Ahmad","Nathan Ellis","Khaleel Ahmed","Anshul Kamboj","Gurjapneet Singh","Mukesh Choudhary","Jamie Overton","Ramakrishna Ghosh","Shreyas Gopal","Prashant Veer","Kartik Sharma","Akeal Hosein","Matt Henry","Matthew Short","Sarfaraz Khan","Zak Foulkes","Rahul Chahar","Aman Khan"],
  RR:["Yashasvi Jaiswal","Vaibhav Suryavanshi","Riyan Parag","Shimron Hetmyer","Dhruv Jurel","Ravindra Jadeja","Sam Curran","Donovan Ferreira","Jofra Archer","Nandre Burger","Sandeep Sharma","Tushar Deshpande","Ravi Bishnoi","Shubham Dubey","Yudhvir Singh Charak","Kwena Maphaka","Lhuan-dre Pretorius","Adam Milne","Ravi Singh","Sushant Mishra","Kuldeep Sen","Vignesh Puthur","Yash Raj Punja","Aman Rao","Brijesh Sharma"],
  PBKS:["Shreyas Iyer","Prabhsimran Singh","Priyansh Arya","Shashank Singh","Nehal Wadhera","Marcus Stoinis","Azmatullah Omarzai","Marco Jansen","Arshdeep Singh","Yuzvendra Chahal","Lockie Ferguson","Xavier Bartlett","Musheer Khan","Harpreet Brar","Cooper Connolly","Ben Dwarshuis","Pravin Dubey","Vishal Nishad","Harnoor Pannu","Pyla Avinash","Suryansh Shedge"],
  GT:["Shubman Gill","Jos Buttler","Sai Sudharsan","Shahrukh Khan","Washington Sundar","Rahul Tewatia","Rashid Khan","Kagiso Rabada","Mohammed Siraj","Prasidh Krishna","Gerald Coetzee","Jayant Yadav","Nishant Sindhu","Manav Suthar","Kulwant Khejroliya","Gurnoor Brar","Sai Kishore","Anuj Rawat","Arshad Khan","Matthew Wade","Karim Janat"],
  LSG:["Rishabh Pant","Mitchell Marsh","Nicholas Pooran","Aiden Markram","Abdul Samad","Ayush Badoni","Himmat Singh","Shahbaz Ahmed","Digvesh Rathi","Mohammed Shami","Avesh Khan","Mayank Yadav","Anrich Nortje","Wanindu Hasaranga","Akash Singh","Matthew Breetzke","Arshin Kulkarni","Manimaran Siddharth","Josh Inglis","Mukul Choudhary","Akshat Raghuwanshi","Naman Tiwari","Mohsin Khan","Prince Yadav","Arjun Tendulkar"],
  DC:["KL Rahul","Axar Patel","Abishek Porel","Ashutosh Sharma","Karun Nair","Kuldeep Yadav","Mitchell Starc","T. Natarajan","Dushmantha Chameera","Jake Fraser-McGurk","Tristan Stubbs","Sameer Rizvi","Ajay Mandal","Madhav Tiwari","Vipraj Nigam","Nitish Rana","Faf du Plessis","Mukesh Kumar","Tripurana Vijay","Darshan Nalkande","Donovan Ferreira"]
};

const BASE_MATCHES=[
  {id:1,mn:"M1",home:"RCB",away:"SRH",date:"2026-03-28",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:2,mn:"M2",home:"MI",away:"KKR",date:"2026-03-29",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:3,mn:"M3",home:"RR",away:"CSK",date:"2026-03-30",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:4,mn:"M4",home:"PBKS",away:"GT",date:"2026-03-31",time:"19:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:5,mn:"M5",home:"LSG",away:"DC",date:"2026-04-01",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:6,mn:"M6",home:"KKR",away:"SRH",date:"2026-04-02",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:7,mn:"M7",home:"CSK",away:"PBKS",date:"2026-04-03",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:8,mn:"M8",home:"DC",away:"MI",date:"2026-04-04",time:"15:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:9,mn:"M9",home:"GT",away:"RR",date:"2026-04-04",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:10,mn:"M10",home:"SRH",away:"LSG",date:"2026-04-05",time:"15:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:11,mn:"M11",home:"RCB",away:"CSK",date:"2026-04-05",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:12,mn:"M12",home:"KKR",away:"PBKS",date:"2026-04-06",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:13,mn:"M13",home:"RR",away:"MI",date:"2026-04-07",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:14,mn:"M14",home:"DC",away:"GT",date:"2026-04-08",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:15,mn:"M15",home:"KKR",away:"LSG",date:"2026-04-09",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:16,mn:"M16",home:"RR",away:"RCB",date:"2026-04-10",time:"19:30",venue:"Barsapara Cricket Stadium, Guwahati"},
  {id:17,mn:"M17",home:"PBKS",away:"SRH",date:"2026-04-11",time:"15:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:18,mn:"M18",home:"CSK",away:"DC",date:"2026-04-11",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:19,mn:"M19",home:"LSG",away:"GT",date:"2026-04-12",time:"15:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:20,mn:"M20",home:"MI",away:"RCB",date:"2026-04-12",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:21,mn:"M21",home:"SRH",away:"RR",date:"2026-04-13",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:22,mn:"M22",home:"CSK",away:"KKR",date:"2026-04-14",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:23,mn:"M23",home:"RCB",away:"LSG",date:"2026-04-15",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:24,mn:"M24",home:"MI",away:"PBKS",date:"2026-04-16",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:25,mn:"M25",home:"GT",away:"KKR",date:"2026-04-17",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:26,mn:"M26",home:"RCB",away:"DC",date:"2026-04-18",time:"15:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:27,mn:"M27",home:"SRH",away:"CSK",date:"2026-04-18",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:28,mn:"M28",home:"KKR",away:"RR",date:"2026-04-19",time:"15:30",venue:"Eden Gardens, Kolkata"},
  {id:29,mn:"M29",home:"PBKS",away:"LSG",date:"2026-04-19",time:"19:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:30,mn:"M30",home:"GT",away:"MI",date:"2026-04-20",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:31,mn:"M31",home:"SRH",away:"DC",date:"2026-04-21",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:32,mn:"M32",home:"LSG",away:"RR",date:"2026-04-22",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:33,mn:"M33",home:"MI",away:"CSK",date:"2026-04-23",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:34,mn:"M34",home:"RCB",away:"GT",date:"2026-04-24",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:35,mn:"M35",home:"DC",away:"PBKS",date:"2026-04-25",time:"15:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:36,mn:"M36",home:"RR",away:"SRH",date:"2026-04-25",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:37,mn:"M37",home:"CSK",away:"GT",date:"2026-04-26",time:"15:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:38,mn:"M38",home:"LSG",away:"KKR",date:"2026-04-26",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:39,mn:"M39",home:"DC",away:"RCB",date:"2026-04-27",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:40,mn:"M40",home:"PBKS",away:"RR",date:"2026-04-28",time:"19:30",venue:"Mullanpur Stadium, New Chandigarh"},
  {id:41,mn:"M41",home:"MI",away:"SRH",date:"2026-04-29",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:42,mn:"M42",home:"GT",away:"RCB",date:"2026-04-30",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:43,mn:"M43",home:"RR",away:"DC",date:"2026-05-01",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:44,mn:"M44",home:"CSK",away:"MI",date:"2026-05-02",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:45,mn:"M45",home:"SRH",away:"KKR",date:"2026-05-03",time:"15:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:46,mn:"M46",home:"GT",away:"PBKS",date:"2026-05-03",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:47,mn:"M47",home:"MI",away:"LSG",date:"2026-05-04",time:"19:30",venue:"Wankhede Stadium, Mumbai"},
  {id:48,mn:"M48",home:"DC",away:"CSK",date:"2026-05-05",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:49,mn:"M49",home:"SRH",away:"PBKS",date:"2026-05-06",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:50,mn:"M50",home:"LSG",away:"RCB",date:"2026-05-07",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:51,mn:"M51",home:"DC",away:"KKR",date:"2026-05-08",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:52,mn:"M52",home:"RR",away:"GT",date:"2026-05-09",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:53,mn:"M53",home:"CSK",away:"LSG",date:"2026-05-10",time:"15:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:54,mn:"M54",home:"RCB",away:"MI",date:"2026-05-10",time:"19:30",venue:"Shaheed Veer Narayan Singh Intl. Stadium, Raipur"},
  {id:55,mn:"M55",home:"PBKS",away:"DC",date:"2026-05-11",time:"19:30",venue:"HPCA Stadium, Dharamshala"},
  {id:56,mn:"M56",home:"GT",away:"SRH",date:"2026-05-12",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:57,mn:"M57",home:"RCB",away:"KKR",date:"2026-05-13",time:"19:30",venue:"Shaheed Veer Narayan Singh Intl. Stadium, Raipur"},
  {id:58,mn:"M58",home:"PBKS",away:"MI",date:"2026-05-14",time:"19:30",venue:"HPCA Stadium, Dharamshala"},
  {id:59,mn:"M59",home:"LSG",away:"CSK",date:"2026-05-15",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:60,mn:"M60",home:"KKR",away:"GT",date:"2026-05-16",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:61,mn:"M61",home:"PBKS",away:"RCB",date:"2026-05-17",time:"15:30",venue:"HPCA Stadium, Dharamshala"},
  {id:62,mn:"M62",home:"DC",away:"RR",date:"2026-05-17",time:"19:30",venue:"Arun Jaitley Stadium, Delhi"},
  {id:63,mn:"M63",home:"CSK",away:"SRH",date:"2026-05-18",time:"19:30",venue:"MA Chidambaram Stadium, Chennai"},
  {id:64,mn:"M64",home:"RR",away:"LSG",date:"2026-05-19",time:"19:30",venue:"Sawai Mansingh Stadium, Jaipur"},
  {id:65,mn:"M65",home:"KKR",away:"MI",date:"2026-05-20",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:66,mn:"M66",home:"GT",away:"CSK",date:"2026-05-21",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
  {id:67,mn:"M67",home:"SRH",away:"RCB",date:"2026-05-22",time:"19:30",venue:"Rajiv Gandhi Intl. Stadium, Hyderabad"},
  {id:68,mn:"M68",home:"LSG",away:"PBKS",date:"2026-05-23",time:"19:30",venue:"Ekana Cricket Stadium, Lucknow"},
  {id:69,mn:"M69",home:"MI",away:"RR",date:"2026-05-24",time:"15:30",venue:"Wankhede Stadium, Mumbai"},
  {id:70,mn:"M70",home:"KKR",away:"DC",date:"2026-05-24",time:"19:30",venue:"Eden Gardens, Kolkata"},
  {id:71,mn:"Q1",home:"TBD1",away:"TBD2",date:"2026-05-26",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
  {id:72,mn:"EL1",home:"TBD3",away:"TBD4",date:"2026-05-27",time:"19:30",venue:"TBD"},
  {id:73,mn:"Q2",home:"TBD",away:"TBD",date:"2026-05-29",time:"19:30",venue:"TBD"},
  {id:74,mn:"Final",home:"TBD",away:"TBD",date:"2026-05-31",time:"19:30",venue:"M.Chinnaswamy Stadium, Bengaluru"},
];

const PTS={toss:10,win:20,motm:30,streak:15,season:200,top4:50,bonus:15,prop:100,scoreBand:10};

const SCORE_BANDS=[
  {id:"<150",label:"Below 150",short:"<150",emoji:"💀"},
  {id:"150-170",label:"150 – 170",short:"150–170",emoji:"📉"},
  {id:"171-190",label:"171 – 190",short:"171–190",emoji:"📊"},
  {id:"191-210",label:"191 – 210",short:"191–210",emoji:"💥"},
  {id:"210+",label:"210 and above",short:"210+",emoji:"🚀"},
];
const EMOJIK=["fire","cry","aim","rage","clap","boom"];
const EMOJIV={fire:"🔥",cry:"😭",aim:"🎯",rage:"😤",clap:"👏",boom:"🤯"};
const SUPER_ADMIN="akashkotak@gmail.com";
const PFX="ipl26_";
const CHAT_MAX=400;
const CHAT_CAP=500;
const REG_LIMIT=20;
const REG_WINDOW=10*60*1000;
const NR="NO_RESULT";

/* Bonus question per match — Yes/No, +15pts for correct */
const BONUS_QUESTIONS={
  1:"Will the opening partnership (either team) last at least 6 overs?",
  2:"Will this match be decided in the last over?",
  3:"Will there be a run-out in this match?",
  4:"Will PBKS successfully defend batting first?",
  5:"Will this match produce 25+ sixes total?",
  6:"Will the POTM be a bowler?",
  7:"Will the chasing team win by 5+ wickets?",
  8:"Will any bowler take 4+ wickets in this match?",
  9:"Will any team hit 15+ sixes?",
  10:"Will the toss winner go on to win the match?",
  11:"Will there be at least one wicket maiden in this match?",
  12:"Will the match be completed without interruption?",
  13:"Will there be a run-out in the final 5 overs?",
  14:"Will 5 or more different bowlers take wickets?",
  15:"Will the toss winner choose to bat first?",
  16:"Will the toss winner win this match?",
  17:"Will any bowler bowl a maiden over in this match?",
  18:"Will the winning team win by 25+ runs?",
  19:"Will either team lose 3+ wickets in the powerplay?",
  20:"Will MI vs RCB produce 30+ sixes combined?",
  21:"Will SRH chase down their target in 18 overs or less?",
  22:"Will the POTM be a CSK player?",
  23:"Will RCB win by 6+ wickets?",
  24:"Will the winning team's captain be the POTM?",
  25:"Will there be a stumping in this match?",
  26:"Will both opening batters reach 20+ runs each?",
  27:"Will this match be won by the team batting first?",
  28:"Will KKR win by more than 30 runs?",
  29:"Will this match be decided in the last 2 overs?",
  30:"Will the POTM be a wicket-keeper?",
  31:"Will the POTM be an overseas player?",
  32:"Will the losing team's top scorer outscore the winner's top scorer?",
  33:"Will any player score 75+ individual runs?",
  34:"Will the POTM be a spinner?",
  35:"Will any bowler concede fewer than 20 runs in their 4 overs?",
  36:"Will RR win by 7+ wickets?",
  37:"Will CSK successfully defend batting first?",
  38:"Will this match go to the final over?",
  39:"Will the chasing team win comfortably by 6+ wickets?",
  40:"Will the winning captain bowl at least 2 overs?",
  41:"Will any bowler take 4+ wickets?",
  42:"Will this match produce 30+ sixes?",
  43:"Will this be a nail-biter (decided by <10 runs or 1 wicket)?",
  44:"Will both teams' captains bat in the top 4?",
  45:"Will there be a golden duck (out first ball) in this match?",
  46:"Will any player score 80+?",
  47:"Will this match be decided in the final over?",
  48:"Will the highest individual score come from the losing team?",
  49:"Will the last wicket partnership add 15+ runs?",
  50:"Will any player score 75+?",
  51:"Will this match produce 25+ sixes combined?",
  52:"Will there be a partnership of 80+ runs?",
  53:"Will there be at least 2 boundaries hit off the last over?",
  54:"Will any fielder take 3+ catches?",
  55:"Will any fielder take 3+ catches in this match?",
  56:"Will the winning team win with 2+ overs to spare (if chasing)?",
  57:"Will this match have a last-over finish?",
  58:"Will the winning chasing team win with 2+ overs to spare?",
  59:"Will the top scorer in the match be from the losing team?",
  60:"Will any team take a wicket off the very first ball of an innings?",
  61:"Will both teams use more than 5 different bowlers?",
  62:"Will this be decided by less than 15 runs?",
  63:"Will any bowler take wickets in 3 consecutive overs?",
  64:"Will any bowler concede 0 runs in an over (maiden)?",
  65:"Will both openers put on a 50+ partnership?",
  66:"Will GT successfully defend batting first?",
  67:"Will any bowler take a hat-trick?",
  68:"Will the match be decided before the final over?",
  69:"Will the last ball of the match be a boundary (4 or 6)?",
  70:"Will this match be decided by less than 10 runs or 1 wicket?",
  71:"Will the team that bats first win Q1?",
  72:"Will the Eliminator be a last-over finish?",
  73:"Will Q2 be won by the team batting second?",
  74:"Will the team batting first win the Final?",
};

/* Season-long prop bets — answered once at onboarding, +100pts each */
const PROP_QUESTIONS=[
  {id:"q0",label:"Orange Cap — who will score the most runs in IPL 2026?",type:"player"},
  {id:"q1",label:"Purple Cap — who will take the most wickets in IPL 2026?",type:"player"},
  {id:"q2",label:"Which team will score the highest total in any single match?",type:"team"},
  {id:"q3",label:"Will there be at least one Super Over in IPL 2026?",type:"yesno"},
  {id:"q4",label:"Which team will finish last (10th) in the points table?",type:"team"},
];

const ALL_PLAYERS=Object.entries(SQ).flatMap(([team,players])=>players.map(p=>({p,t:team}))).sort((a,b)=>a.p.localeCompare(b.p));

const TRASH_TALK=[
  (perfs,zeros,lone,mn)=>`🎭 ${mn} VERDICT!\n${perfs.length?`🎯 ${perfs.join(" & ")} nailed all 3! Flawless.`:"Nobody got all 3. Collective suffering. 💀"}\n${zeros.length?`😅 Moment of silence for ${zeros.join(", ")} — 0 from 3.`:""}\n${lone?`🐉 Lone wolf award: ${lone} was the only one who backed the winner. Respect.`:""}`,
  (perfs,zeros,lone,mn)=>`📋 ${mn} DONE!\n${perfs.length?`🏆 Perfect picks: ${perfs.join(", ")}. Someone's been doing their homework.`:"Not a single perfect pick. Humbling stuff."}\n${zeros.length?`🪦 Pour one out for ${zeros.join(", ")} (0/3). The cricket gods were not kind.`:""}\n${lone?`🐉 ${lone} backed the underdog winner alone. Absolute scenes.`:""}`,
  (perfs,zeros,lone,mn)=>`⚡ ${mn} RESULT IN!\n${perfs.length?`🎯 PERFECTS: ${perfs.join(", ")} — bought a ticket on the right bus!`:"Nobody called it perfectly. The IPL remains unpredictable."}\n${zeros.length?`💀 Complete whitewash for ${zeros.join(", ")}. Didn't get a single one.`:""}\n${lone?`🐉 Contrarian king: ${lone} went against the group on the winner. And WON.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} WRAPPED!\n${perfs.length?`🎯 ${perfs.join(" and ")} with the perfect prediction. Bow down.`:"The match gave everyone nothing. Ouch."}\n${zeros.length?`😬 ${zeros.join(", ")} finished with a big fat 0. Let's not talk about it.`:""}\n${lone?`🤯 Only ${lone} called the winner right. Chaos theory at work.`:""}`,
];


/* ─── UTILS ─── */
const encodeEmail=e=>(e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const ek=e=>encodeEmail(e);
const normalizeEmail=e=>(e||"").trim().toLowerCase();
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const decodeKey=k=>{let d=k;for(let i=0;i<8;i++){const n=d.replace(/_at_/g,"@").replace(/_dot_/g,".");if(n===d)break;d=n;}return d;};
const canonicalKey=k=>ek(decodeKey(k));

function normalizeKeyMap(raw){if(!raw)return{};const out={};Object.keys(raw).forEach(k=>{out[canonicalKey(k)]=raw[k];});return out;}
function deepEncodeKeys(v){if(!v||typeof v!=="object"||Array.isArray(v))return v;const r={};Object.keys(v).forEach(k=>{const isEmailKey=k.includes("@")||k.includes("_at_");r[isEmailKey?ek(k):k]=deepEncodeKeys(v[k]);});return r;}

/*
  FIX — normalizeAP:
  ─────────────────────────────────────────────────────────────────────────────
  ROOT CAUSE OF DOUBLE-HEADER BUG:
  Firebase RTDB coerces object keys that look like consecutive integers into an
  array-like ordering on read. When a user submits picks for BOTH matches on a
  double-header day (e.g. id=17 and id=18), the stored object { "17":{}, "18":{} }
  comes back with numeric integer keys { 17:{}, 18:{} } — or worse, is
  re-ordered. The old code then did String(mid) for the output key BUT silently
  DROPPED any pick that had a falsy field (empty string, null, undefined).
  A pick that was legitimately stored but arrived with a coerced key was simply
  deleted from the normalised map, making it invisible in the UI even though
  the DB record was intact.

  The fix has three parts:
  1. NEVER silently drop a pick — keep it even if fields are partially missing.
  2. Always write the output key as String(mid) so downstream getP() works.
  3. Ensure every field that IS present is preserved; fill missing ones with "".
  ─────────────────────────────────────────────────────────────────────────────
*/
function normalizeAP(raw){
  if(!raw)return{};
  const out={};
  Object.keys(raw).forEach(k=>{
    const ck=canonicalKey(k);
    const userPicks=raw[k];
    if(!userPicks||typeof userPicks!=="object"){
      out[ck]={};
      return;
    }
    const normalized={};
    // Firebase RTDB may coerce {1:{},2:{},3:{}} to an array [null,{},{},{}]
    // when keys are consecutive integers. Recover by using array indices as match IDs.
    const entries=Array.isArray(userPicks)
      ?userPicks.map((pick,idx)=>[String(idx),pick]).filter(([,pick])=>pick&&typeof pick==="object")
      :Object.entries(userPicks);
    entries.forEach(([mid,pick])=>{
      if(!pick||typeof pick!=="object"||Array.isArray(pick))return;
      const smid=String(mid);
      // Only keep picks that have at least one meaningful field
      if(pick.toss||pick.win||pick.motm||pick.sb){
        normalized[smid]={
          toss: pick.toss||"",
          win:  pick.win||"",
          motm: pick.motm||"",
          sb:   pick.sb||"",
        };
      }
    });
    out[ck]=normalized;
  });
  return out;
}

function validateEmail(e){if(!e?.trim())return"Email is required";if(!EMAIL_RE.test(e.trim()))return"Enter a valid email";return"";}
function validatePassword(p,mode="login"){if(!p)return"Password is required";if(mode==="register"){if(p.length<8)return"Min 8 characters";if(!/[A-Z]/.test(p))return"Add an uppercase letter";if(!/[0-9]/.test(p))return"Add a number";if(!/[^A-Za-z0-9]/.test(p))return"Add a special character";}return"";}
function validateName(n){if(!n||n.trim().length<2)return"Name must be at least 2 characters";return"";}
function capChat(arr){return arr.length>CHAT_CAP?arr.slice(arr.length-CHAT_CAP):arr;}
async function sha256(str){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");}
const isNR=v=>!v||v===NR;
const showVal=(v,fallback="—")=>isNR(v)?"🌧 No Result":(v||fallback);

/*
  FIX — getP:
  ─────────────────────────────────────────────────────────────────────────────
  Must check BOTH String(id) and Number(id) because:
  - Local state after submitPick stores String keys (we write them that way)
  - Firebase on read may return Number keys (coercion of numeric-looking strings)
  - After reloadShared normalizeAP converts back to String, but during the
    brief window between submit and reload, allPicks may have mixed key types.
  Also: a pick with all-empty fields (toss:"", win:"", motm:"") is considered
  absent — this prevents ghost empty picks from blocking the "Make Prediction"
  button after a failed write that left an empty record.
  ─────────────────────────────────────────────────────────────────────────────
*/
const getP=(picks,id)=>{
  if(!picks||typeof picks!=="object")return null;
  const found=picks[String(id)]??picks[Number(id)]??null;
  if(!found)return null;
  // A pick with no meaningful fields is treated as absent
  if(!found.toss&&!found.win&&!found.motm)return null;
  return found;
};

const pickKey=id=>String(id); // kept for external callers

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
  set:async(k,v)=>{try{const{db,dbMod}=await firebaseReady;const sv=(k==="ap"&&typeof v==="object"&&v!==null&&!Array.isArray(v))?deepEncodeKeys(v):v;if(sv===null||sv===undefined)await dbMod.remove(dbMod.ref(db,PFX+k));else await dbMod.set(dbMod.ref(db,PFX+k),sv);}catch(e){console.error("DB.set",k,e);}},
  /*
    FIX — setUserPick (atomic single-pick write):
    ─────────────────────────────────────────────────────────────────────────
    Write ONE pick at the exact path ap/{userKey}/{matchId} using String(matchId).
    This avoids the read-modify-write cycle that caused double-header data loss:
    old approach read the full ap object, mutated it in JS, wrote it back —
    if two picks were submitted in quick succession (double-header day), the
    second write could overwrite the first because the read for pick-2 happened
    before pick-1's write landed.
    Atomic path writes are safe to interleave and cannot clobber each other.
    ─────────────────────────────────────────────────────────────────────────
  */
  setUserPick:async(userKey,matchId,pick)=>{
    try{
      const{db,dbMod}=await firebaseReady;
      // ALWAYS use String(matchId) so Firebase stores a string key, not an integer
      const path=`${PFX}ap/${userKey}/${String(matchId)}`;
      await dbMod.set(dbMod.ref(db,path),pick);
      return true;
    }catch(e){
      console.error("DB.setUserPick",e);
      return false;
    }
  },
  /*
    FIX — repairAllPicks:
    Full re-normalisation of the entire ap subtree. Reads raw, normalises all
    keys (email encoding + string match IDs), writes back. Safe to call at any
    time — idempotent. Used by admin "Repair DB" button and on login.
  */
  repairAllPicks:async()=>{
    try{
      const raw=await DB.get("ap");
      if(!raw)return true;
      const fixed=normalizeAP(raw);
      await DB.set("ap",fixed);
      return true;
    }catch(e){
      console.error("DB.repairAllPicks",e);
      return false;
    }
  },
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
.manpick-card{background:#FFF9E6;border:2px solid #FDE68A;border-radius:14px;padding:16px;margin-bottom:12px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes cardReveal{0%{opacity:0;transform:scale(.85) rotateY(90deg);}60%{transform:scale(1.04) rotateY(-5deg);}100%{opacity:1;transform:scale(1) rotateY(0);}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fade-in{animation:fadeIn .4s ease forwards;}
.reveal-card{animation:cardReveal .45s cubic-bezier(.34,1.56,.64,1) forwards;}
.spin{animation:spin .8s linear infinite;}
.bq-btn{flex:1;padding:9px 6px;border-radius:10px;border:2px solid #e2e8f0;background:#f8faff;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;cursor:pointer;letter-spacing:.5px;text-transform:uppercase;transition:all .15s;}
.bq-btn.yes.on{border-color:#15803d;background:#f0fdf4;color:#15803d;}
.bq-btn.no.on{border-color:#dc2626;background:#fef2f2;color:#dc2626;}
.reveal-overlay{position:fixed;inset:0;background:rgba(10,20,60,.96);z-index:300;display:flex;flex-direction:column;max-width:430px;left:50%;transform:translateX(-50%);overflow-y:auto;}
`;

/* ─── SUB-COMPONENTS ─── */
function TLogo({t,sz=48}){const[e,sE]=useState(false);const c=TC[t]||{bg:"#94a3b8",dk:"#fff"};if(e||!TC[t])return<span style={{width:sz,height:sz,borderRadius:8,background:c.bg,color:c.dk,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:sz*.34,flexShrink:0}}>{(t||"?").slice(0,3)}</span>;return<img src={LOGOS[t]} alt={t} width={sz} height={sz} onError={()=>sE(true)} style={{objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.25))",maxWidth:sz,maxHeight:sz}}/>;}
function Av({name,sz=32}){const ini=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();const c=["#C8102E","#004BA0","#3A225D","#E91E8C","#FF822A","#1B3A6B","#166534"];return<div style={{width:sz,height:sz,borderRadius:"50%",background:c[(name||"").charCodeAt(0)%c.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:sz*.38,color:"#fff",flexShrink:0}}>{ini}</div>;}
function Tst({t}){const bg=t.type==="error"?"#fef2f2":t.type==="ok"?"#f0fdf4":"#EBF0FA";const cl=t.type==="error"?"#991b1b":t.type==="ok"?"#166534":"#1e40af";const br=t.type==="error"?"#fecaca":t.type==="ok"?"#bbf7d0":"#bfdbfe";return<div style={{position:"fixed",bottom:86,left:"50%",transform:"translateX(-50%)",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'Barlow',sans-serif",whiteSpace:"nowrap",zIndex:999,maxWidth:"90vw",overflow:"hidden",textOverflow:"ellipsis",background:bg,color:cl,border:"1px solid "+br,boxShadow:"0 8px 32px rgba(29,66,138,.15)"}}>{t.msg}</div>;}
function Toggle({on,onChange}){return<button className="tog" onClick={()=>onChange(!on)} style={{background:on?"#1D428A":"#e2e8f0"}}><div className="tog-knob" style={{left:on?"23px":"3px"}}/></button>;}
function useCd(ts){const[tl,sT]=useState("");useEffect(()=>{const tick=()=>{const d=ts-Date.now();if(d<=0){sT("NOW");return;}const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);sT(h>0?h+"h "+m+"m":m>0?m+"m "+s+"s":s+"s");};tick();const id=setInterval(tick,1000);return()=>clearInterval(id);},[ts]);return tl;}
function SBar({lbl,tA,tB,cA,cB,clA,clB}){const tot=cA+cB||1,pA=Math.round(cA/tot*100);return<div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#64748b",fontWeight:600}}>{lbl}</span><span style={{fontSize:10,color:"#94a3b8"}}>{cA+cB} picks</span></div><div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:"#1a2540",minWidth:28,textAlign:"right"}}>{pA}%</span><div className="bar-bg" style={{flex:1,display:"flex"}}><div className="bar-fill" style={{width:pA+"%",background:clA}}/><div style={{flex:1,background:clB}}/></div><span style={{fontSize:11,fontWeight:700,color:"#1a2540",minWidth:28}}>{100-pA}%</span></div><div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:10,color:"#94a3b8"}}>{tA} <span style={{color:"#64748b",fontWeight:600}}>({cA})</span></span><span style={{fontSize:10,color:"#94a3b8"}}><span style={{color:"#64748b",fontWeight:600}}>({cB})</span> {tB}</span></div></div>;}
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
function MCard({m,pred,myPicks,allPicks,rxns,doubleMatch,lockedMatches,matchPtsOverride,email,allMs,onPredict,onReact,bonusAnswers,myBonusPicks,allBonusPicks,scoreBandAnswers,onBonusPick,onReveal}){
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
          <p style={{fontSize:10,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>🔒 Your Locked Picks</p>           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>             {[["🎰 Toss",mp.toss],["🏆 Winner",mp.win],["⭐ POTM",mp.motm?.split(" ").slice(-1)[0]||"—"],["📊 1st Inn",mp.sb?SCORE_BANDS.find(b=>b.id===mp.sb)?.short||mp.sb:"—"]].map(([l,v])=>(               <div key={l} style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px"}}>                 <p style={{fontSize:9,color:"#64748b",fontWeight:600,margin:0}}>{l}</p>                 <p style={{fontSize:11,fontWeight:700,color:"#1a2540",margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</p>               </div>             ))}           </div>           {(()=>{             const myBQ=myBonusPicks?.[String(m.id)];             const bqAns=bonusAnswers?.[String(m.id)];             const bqOk=bqAns!=null&&myBQ!=null&&myBQ===bqAns;             return myBQ!=null               ?<div style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px",marginTop:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>                   <div>                     <p style={{fontSize:9,color:"#64748b",fontWeight:600,margin:0}}>❓ Bonus Q</p>                     <p style={{fontSize:11,fontWeight:700,color:"#1a2540",margin:"2px 0 0"}}>{myBQ?"Yes":"No"}</p>                   </div>                   {bqAns!=null&&<span style={{fontSize:11,fontWeight:700,color:bqOk?"#15803d":"#dc2626"}}>{bqOk?"✓ Correct":"✗ Wrong"}</span>}                 </div>               :null;           })()}
          {mp.sb&&<span style={{marginLeft:8,color:"#1D428A",fontWeight:700}}>· 1st inn: {SCORE_BANDS.find(b=>b.id===mp.sb)?.short||mp.sb}</span>}
        </div>
      )}

      {/* Score band result row */}
      {(()=>{
        if(!mp?.sb&&!scoreBandAnswers?.[String(m.id)])return null;
        const sbAns=scoreBandAnswers?.[String(m.id)];
        const myBand=mp?.sb;
        const bandObj=myBand?SCORE_BANDS.find(b=>b.id===myBand):null;
        const correctBandObj=sbAns?SCORE_BANDS.find(b=>b.id===sbAns):null;
        const isCorrect=sbAns&&myBand&&myBand===sbAns;
        const isWrong=sbAns&&myBand&&myBand!==sbAns;
        if(!myBand&&!sbAns)return null;
        return<div style={{background:"#F4F6FB",border:"1px solid #e2e8f0",borderRadius:8,padding:"7px 12px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12}}>📊</span>
            <span style={{fontSize:11,color:"#64748b"}}>1st Innings: <b style={{color:"#1a2540"}}>{bandObj?.label||"—"}</b></span>
          </div>
          {sbAns&&<span style={{fontSize:11,fontWeight:700,color:isCorrect?"#15803d":isWrong?"#dc2626":"#94a3b8"}}>
            {isCorrect?`✅ Correct! +${PTS.scoreBand}pts`:isWrong?`✗ Was: ${correctBandObj?.short}`:correctBandObj?`Correct: ${correctBandObj?.short}`:"Result TBD"}
          </span>}
          {!sbAns&&myBand&&<span style={{fontSize:10,color:"#94a3b8"}}>Awaiting result</span>}
        </div>;
      })()}

      {hints&&(
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
          <p style={{color:"#92400E",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>
            💡 Group Leans · {hints.tot} pick{hints.tot!==1?"s":""}
          </p>
          {[["Toss",hints.tA,hints.tB],["Winner",hints.wA,hints.wB]].map(([lbl,cA,cB])=>{
            const tot2=cA+cB||1,pA=Math.round(cA/tot2*100),pB=100-pA;
            return(
              <div key={lbl} style={{marginBottom:lbl==="Toss"?10:0}}>
                <span style={{fontSize:10,fontWeight:600,color:"#92400E",display:"block",marginBottom:4}}>{lbl}</span>
                <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:10,fontWeight:700,color:hc.bg,minWidth:32}}>{m.home}</span>
                  <div style={{flex:1,height:8,borderRadius:4,overflow:"hidden",background:"#e2e8f0",display:"flex"}}>
                    <div style={{width:pA+"%",background:hc.bg,transition:"width .6s",borderRadius:"4px 0 0 4px"}}/>
                    <div style={{width:pB+"%",background:ac.bg,borderRadius:"0 4px 4px 0"}}/>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:ac.bg,minWidth:32,textAlign:"right"}}>{m.away}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"0 36px"}}>
                  <span style={{fontSize:10,color:"#92400E",fontWeight:600}}>{pA}% <span style={{fontWeight:400,color:"#B45309"}}>({cA})</span></span>
                  <span style={{fontSize:10,color:"#92400E",fontWeight:600}}><span style={{fontWeight:400,color:"#B45309"}}>({cB})</span> {pB}%</span>
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

      {/* ── BONUS QUESTION (read-only — answered in prediction screen) ── */}
      {!isTBD(m)&&BONUS_QUESTIONS[m.id]&&(()=>{
        const bq=BONUS_QUESTIONS[m.id];
        const bonusAns2=bonusAnswers?.[String(m.id)]??bonusAnswers?.[Number(m.id)];
        const myAns=myBonusPicks?.[String(m.id)];
        const ae2=Object.entries(allBonusPicks||{});
        const yesCount=ae2.filter(([,bp])=>bp[String(m.id)]===true).length;
        const noCount=ae2.filter(([,bp])=>bp[String(m.id)]===false).length;
        const tot2=yesCount+noCount;
        const bqPts=m.result&&bonusAns2!=null&&myAns!=null?(myAns===bonusAns2?PTS.bonus:0):null;
        return<div style={{background:"#F4F6FB",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <span style={{fontSize:12}}>❓</span>
            <span style={{fontSize:10,fontWeight:700,color:"#1D428A",textTransform:"uppercase",letterSpacing:.5}}>Bonus Question · +{PTS.bonus}pts</span>
            {bqPts!==null&&<span style={{marginLeft:"auto",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,color:bqPts>0?"#15803d":"#dc2626"}}>+{bqPts}pts</span>}
          </div>
          <p style={{fontSize:12,color:"#1a2540",fontWeight:600,margin:"0 0 8px",lineHeight:1.4}}>{bq}</p>
          {myAns!=null
            ?<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span className={"bq-btn "+(myAns?"yes":"no")+" on"} style={{display:"inline-block",textAlign:"center",padding:"6px 14px",fontSize:12}}>{myAns?"✅ Yes":"❌ No"}</span>
                {bonusAns2!=null&&<span style={{fontSize:11,color:bqPts>0?"#15803d":"#dc2626",fontWeight:700}}>{bonusAns2?"Correct: Yes":"Correct: No"}{bqPts!==null?" · "+(bqPts>0?"✓ +"+bqPts+"pts":"✗ 0pts"):""}</span>}
              </div>
            :<p style={{fontSize:11,color:"#94a3b8",margin:0,fontStyle:"italic"}}>{lk?"Answered in your prediction":"Answer this inside Make Prediction →"}</p>
          }
          {tot2>0&&lk&&<p style={{fontSize:10,color:"#94a3b8",margin:"6px 0 0"}}>Group: {yesCount} Yes · {noCount} No</p>}
        </div>;
      })()}

      {/* ── REVEAL BUTTON ── */}
      {lk&&!isTBD(m)&&onReveal&&<button onClick={()=>onReveal(m)} style={{width:"100%",padding:"9px",borderRadius:10,background:"linear-gradient(135deg,#1a2540,#1D428A)",color:"#FFE57F",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,letterSpacing:1,marginBottom:8}}>🎭 REVEAL PICKS</button>}

      {pred&&!lk&&!mp&&<button className="pbtn" style={{marginTop:10}} onClick={()=>onPredict(m)}>Make Prediction</button>}
      {pred&&lk&&!mp&&!m.result&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#991b1b",marginTop:4}}>🔒 Prediction window closed</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   REVEAL THEATRE — sequential animated pick reveal after lock
   ════════════════════════════════════════════════════════════════ */
function RevealTheatre({m,allPicks,users,bonusAnswers,allBonusPicks,onClose}){
  const[revealed,setRevealed]=useState(0);
  const[phase,setPhase]=useState("intro"); // intro | revealing | done
  const approved=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
  const hc=TC[m.home]||{bg:"#1D428A"};
  const ac=TC[m.away]||{bg:"#475569"};
  const bonusQ=BONUS_QUESTIONS[m.id];
  const bonusAns=bonusAnswers[String(m.id)]??bonusAnswers[Number(m.id)];

  function startReveal(){
    setPhase("revealing");
    let i=0;
    const iv=setInterval(()=>{
      i++;setRevealed(i);
      if(i>=approved.length){clearInterval(iv);setPhase("done");}
    },480);
  }

  // Analysis
  const pickData=approved.map(u=>{
    const emk=ek(u.email);
    const p=getP(allPicks[emk]||{},m.id);
    const bq=(allBonusPicks[emk]||{})[String(m.id)];
    const tossOk=m.result&&!isNR(m.result.toss)&&p?.toss===m.result.toss;
    const winOk=m.result&&!isNR(m.result.win)&&p?.win===m.result.win;
    const motmOk=m.result&&!isNR(m.result.motm)&&motmMatch(p?.motm,m.result.motm);
    const bqOk=bonusAns!=null&&bq!=null&&bq===bonusAns;
    const perfect=tossOk&&winOk&&motmOk;
    return{u,p,bq,tossOk,winOk,motmOk,perfect,bqOk};
  });
  const perfects=pickData.filter(d=>d.perfect).map(d=>d.u.name);
  const zeros=m.result?pickData.filter(d=>d.p&&!d.tossOk&&!d.winOk&&!d.motmOk).map(d=>d.u.name):[];
  const winPickers=pickData.filter(d=>d.winOk);
  const loneWolf=m.result&&winPickers.length===1?winPickers[0].u.name:null;

  return<div className="reveal-overlay">
    {/* Header */}
    <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"16px 16px 14px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
      <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:18,cursor:"pointer",borderRadius:8,padding:"4px 10px"}}>✕</button>
      <div style={{flex:1}}>
        <p style={{color:"#FFE57F",fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,margin:0,letterSpacing:1}}>🎭 PICK REVEAL</p>
        <p style={{color:"#bfdbfe",fontSize:11,margin:0}}>{m.mn}: {m.home} vs {m.away} · {m.date}</p>
      </div>
      <div style={{display:"flex",gap:6}}>
        <div style={{width:24,height:24,borderRadius:6,background:hc.bg}}/>
        <div style={{width:24,height:24,borderRadius:6,background:ac.bg}}/>
      </div>
    </div>

    {/* Result ribbon if available */}
    {m.result&&<div style={{background:"rgba(255,255,255,.07)",padding:"10px 16px",display:"flex",gap:14,borderBottom:"1px solid rgba(255,255,255,.1)",flexShrink:0}}>
      {[["Toss",m.result.toss],["Winner",m.result.win],["POTM",m.result.motm?.split(" ").slice(-1)[0]]].map(([l,v])=>(
        <div key={l} style={{textAlign:"center"}}>
          <p style={{color:"rgba(255,255,255,.5)",fontSize:9,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 2px"}}>{l}</p>
          <p style={{color:"#FFE57F",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,margin:0}}>{isNR(v)?"NR":v||"?"}</p>
        </div>
      ))}
    </div>}

    {/* Intro CTA */}
    {phase==="intro"&&<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,gap:20}}>
      <p style={{fontSize:48}}>🎭</p>
      <p style={{color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,letterSpacing:2,textAlign:"center"}}>READY TO SEE EVERYONE'S PICKS?</p>
      <p style={{color:"rgba(255,255,255,.5)",fontSize:13,textAlign:"center",lineHeight:1.6}}>{approved.length} players · {approved.filter(u=>{const p=getP(allPicks[ek(u.email)]||{},m.id);return!!p;}).length} predicted</p>
      <button onClick={startReveal} style={{background:"linear-gradient(135deg,#FFE57F,#F0C060)",color:"#1a2540",border:"none",borderRadius:12,padding:"14px 36px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,cursor:"pointer",letterSpacing:1}}>REVEAL ALL PICKS →</button>
    </div>}

    {/* Cards revealed one by one */}
    {phase!=="intro"&&<div style={{padding:"14px 14px 0",display:"flex",flexDirection:"column",gap:10}}>
      {approved.slice(0,revealed).map((u,i)=>{
        const d=pickData[i];
        const cardBg=d.p?(d.perfect?"linear-gradient(135deg,#1a4a2a,#1a3a1a)":d.winOk?"linear-gradient(135deg,#1a2a4a,#12233a)":"linear-gradient(135deg,#3a1a1a,#2a1212)"):"rgba(255,255,255,.06)";
        const borderCol=d.p?(d.perfect?"#22c55e":d.winOk?"#3b82f6":"#ef4444"):"rgba(255,255,255,.1)";
        return<div key={u.email} className="reveal-card" style={{background:cardBg,border:"1px solid "+borderCol,borderRadius:12,padding:"12px 14px",animationDelay:(i*0.05)+"s"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:d.p?10:0}}>
            <Av name={u.name} sz={34}/>
            <div style={{flex:1}}>
              <p style={{color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,margin:0}}>{u.name}</p>
              {!d.p&&<p style={{color:"rgba(255,255,255,.4)",fontSize:11,margin:0}}>No prediction made</p>}
            </div>
            {d.perfect&&<span style={{background:"#22c55e",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8}}>🎯 PERFECT</span>}
            {!d.perfect&&d.winOk&&<span style={{background:"#3b82f6",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8}}>✓ Winner right</span>}
            {d.p&&!d.tossOk&&!d.winOk&&!d.motmOk&&m.result&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8}}>💀 0/3</span>}
            {loneWolf===u.name&&<span style={{background:"linear-gradient(135deg,#FF822A,#D4AF37)",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:8}}>🐉 LONE WOLF</span>}
          </div>
          {d.p&&<div style={{display:"flex",gap:6}}>
            {[["Toss",d.p.toss,d.tossOk,!isNR(m.result?.toss)],["Winner",d.p.win,d.winOk,!isNR(m.result?.win)],["POTM",d.p.motm?.split(" ").slice(-1)[0],d.motmOk,!isNR(m.result?.motm)]].map(([l,v,ok,avail])=>(
              <div key={l} style={{flex:1,background:!m.result?"rgba(255,255,255,.08)":!avail?"rgba(255,255,255,.05)":ok?"rgba(34,197,94,.2)":"rgba(239,68,68,.15)",borderRadius:8,padding:"6px 6px",textAlign:"center",border:"1px solid "+(m.result&&avail?(ok?"rgba(34,197,94,.4)":"rgba(239,68,68,.3)"):"rgba(255,255,255,.08)")}}>
                <p style={{fontSize:9,color:"rgba(255,255,255,.5)",margin:0,textTransform:"uppercase",letterSpacing:.3}}>{l}</p>
                <p style={{fontSize:11,fontWeight:700,color:m.result&&avail?(ok?"#86efac":"#fca5a5"):"#fff",margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v||"—"}</p>
                {m.result&&avail&&<p style={{fontSize:9,color:"rgba(255,255,255,.4)",margin:"1px 0 0"}}>{ok?"✓":"✗"}</p>}
              </div>
            ))}
            {bonusQ&&<div style={{flex:1,background:!bonusAns?"rgba(255,255,255,.08)":d.bqOk?"rgba(34,197,94,.2)":"rgba(239,68,68,.15)",borderRadius:8,padding:"6px 6px",textAlign:"center",border:"1px solid "+(bonusAns!=null?(d.bqOk?"rgba(34,197,94,.4)":"rgba(239,68,68,.3)"):"rgba(255,255,255,.08)")}}>
              <p style={{fontSize:9,color:"rgba(255,255,255,.5)",margin:0,textTransform:"uppercase",letterSpacing:.3}}>Bonus</p>
              <p style={{fontSize:11,fontWeight:700,color:bonusAns!=null?(d.bqOk?"#86efac":"#fca5a5"):"#fff",margin:"2px 0 0"}}>{d.bq==null?"—":d.bq?"Yes":"No"}</p>
              {bonusAns!=null&&<p style={{fontSize:9,color:"rgba(255,255,255,.4)",margin:"1px 0 0"}}>{d.bqOk?"✓":"✗"}</p>}
            </div>}
          </div>}
        </div>;
      })}

      {/* Loading indicator while revealing */}
      {phase==="revealing"&&<div style={{textAlign:"center",padding:"16px 0",color:"rgba(255,255,255,.5)",fontSize:12}}>Revealing… {revealed}/{approved.length}</div>}

      {/* Summary after all revealed */}
      {phase==="done"&&<div style={{background:"rgba(255,215,0,.1)",border:"1px solid rgba(255,215,0,.3)",borderRadius:12,padding:"14px",margin:"8px 0 80px"}}>
        <p style={{color:"#FFE57F",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,margin:"0 0 10px",letterSpacing:1}}>🏆 MATCH SUMMARY</p>
        {perfects.length>0&&<p style={{color:"#86efac",fontSize:12,margin:"0 0 5px"}}>🎯 Perfect picks: <b>{perfects.join(", ")}</b></p>}
        {zeros.length>0&&<p style={{color:"#fca5a5",fontSize:12,margin:"0 0 5px"}}>💀 0/3: <b>{zeros.join(", ")}</b></p>}
        {loneWolf&&<p style={{color:"#F0C060",fontSize:12,margin:"0 0 5px"}}>🐉 Lone wolf winner: <b>{loneWolf}</b></p>}
        {!perfects.length&&!zeros.length&&!loneWolf&&<p style={{color:"rgba(255,255,255,.5)",fontSize:12,margin:0}}>A tight spread — everyone somewhere in the middle.</p>}
      </div>}
    </div>}
  </div>;
}

/* ════════════════════════════════════════════════════════════════
   ADMIN PICK STATUS PANEL
   ════════════════════════════════════════════════════════════════ */
function PickStatusPanel({ms,users,allPicks,doubleMatch,lockedMatches,adminEmail,scoreBandAnswers,bonusAnswers,allBonusPicks}){
  const playableMs=ms.filter(m=>!isTBD(m)&&TEAMS.includes(m.home)&&TEAMS.includes(m.away)).sort((a,b)=>Number(a.id)-Number(b.id));
  const[psMatch,setPsMatch]=useState(()=>playableMs[0]?.id??null);
  const approvedUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
  const selM=playableMs.find(m=>Number(m.id)===Number(psMatch))||null;
  const hc2=TC[selM?.home]||{bg:"#333"};
  const ac2=TC[selM?.away]||{bg:"#555"};

  const ae=Object.entries(allPicks);
  const tot=approvedUsers.length;
  const picked=selM?ae.filter(([emk])=>approvedUsers.some(u=>ek(u.email)===emk)&&getP(allPicks[emk]||{},selM.id)!=null).length:0;
  const notPicked=tot-picked;
  const tossHome=selM?ae.filter(([emk])=>getP(allPicks[emk]||{},selM.id)?.toss===selM.home).length:0;
  const tossAway=selM?ae.filter(([emk])=>getP(allPicks[emk]||{},selM.id)?.toss===selM.away).length:0;
  const winHome=selM?ae.filter(([emk])=>getP(allPicks[emk]||{},selM.id)?.win===selM.home).length:0;
  const winAway=selM?ae.filter(([emk])=>getP(allPicks[emk]||{},selM.id)?.win===selM.away).length:0;

  const potmMap={};
  if(selM)ae.forEach(([emk])=>{const p=getP(allPicks[emk]||{},selM.id);if(p?.motm)potmMap[p.motm]=(potmMap[p.motm]||0)+1;});
  const topPotm=Object.entries(potmMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return<div>
    {/* Match selector */}
    <div className="ac" style={{marginBottom:12}}>
      <p className="st" style={{marginBottom:8}}>SELECT MATCH</p>
      <select className="sel" value={psMatch??""} onChange={e=>setPsMatch(Number(e.target.value))}>
        {playableMs.map(m=><option key={m.id} value={m.id}>{m.mn}: {m.home} vs {m.away} ({m.date}){m.result?" ✅":""}</option>)}
      </select>
    </div>

    {selM&&<>
      {/* Summary cards */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[["✅","Picked",picked],["⏳","No Pick",notPicked],["👥","Total",tot]].map(([ic,lb2,val])=>(
          <div key={lb2} style={{flex:1,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
            <p style={{fontSize:16,margin:0}}>{ic}</p>
            <p className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800,margin:"2px 0 0"}}>{val}</p>
            <p style={{color:"#64748b",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lb2}</p>
          </div>
        ))}
      </div>

      {/* Distribution bars */}
      {picked>0&&<div className="ac" style={{marginBottom:12}}>
        <p className="st" style={{marginBottom:8}}>PICK DISTRIBUTION</p>
        {[["Toss",tossHome,tossAway],["Winner",winHome,winAway]].map(([lbl,cA,cB])=>{
          const t2=cA+cB||1,pA=Math.round(cA/t2*100);
          return<div key={lbl} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.3}}>{lbl}</span>
              <span style={{fontSize:10,color:"#94a3b8"}}>{cA+cB} picks</span>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:4}}>
              <div style={{display:"flex",alignItems:"center",gap:4,minWidth:56}}><TLogo t={selM.home} sz={16}/><span style={{fontSize:10,fontWeight:700,color:hc2.bg}}>{selM.home}</span></div>
              <div style={{flex:1,height:10,borderRadius:5,overflow:"hidden",background:"#e2e8f0",display:"flex"}}>
                <div style={{width:pA+"%",background:hc2.bg,transition:"width .6s"}}/>
                <div style={{flex:1,background:ac2.bg}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,minWidth:56,justifyContent:"flex-end"}}><span style={{fontSize:10,fontWeight:700,color:ac2.bg}}>{selM.away}</span><TLogo t={selM.away} sz={16}/></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px"}}>
              <span style={{fontSize:11,fontWeight:700,color:"#1a2540"}}>{pA}% <span style={{fontSize:10,color:"#64748b",fontWeight:400}}>({cA})</span></span>
              <span style={{fontSize:11,fontWeight:700,color:"#1a2540"}}><span style={{fontSize:10,color:"#64748b",fontWeight:400}}>({cB})</span> {100-pA}%</span>
            </div>
          </div>;
        })}
        {topPotm.length>0&&<>
          <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.3,margin:"4px 0 8px"}}>Top POTM Picks</p>
          {topPotm.map(([name,cnt])=>{
            const pct=Math.round(cnt/(picked||1)*100);
            const team=TEAMS.find(t=>(SQ[t]||[]).includes(name));
            const tc2=TC[team]||{bg:"#94a3b8"};
            return<div key={name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:tc2.bg,flexShrink:0}}/>
              <span style={{fontSize:12,color:"#1a2540",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</span>
              <div style={{width:70,height:6,borderRadius:3,background:"#e2e8f0",overflow:"hidden",flexShrink:0}}>
                <div style={{width:pct+"%",height:"100%",background:tc2.bg}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:"#64748b",minWidth:40,textAlign:"right",flexShrink:0}}>{cnt} <span style={{fontWeight:400,color:"#94a3b8"}}>({pct}%)</span></span>
            </div>;
          })}
        </>}
      </div>}

      {/* Per-user pick table */}
      <div className="ac">
        <p className="st" style={{marginBottom:10}}>USER PICKS — {selM.mn}: {selM.home} vs {selM.away}</p>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,tableLayout:"fixed"}}>
            <colgroup>
              <col style={{width:"26%"}}/>
              <col style={{width:"11%"}}/>
              <col style={{width:"11%"}}/>
              <col style={{width:"16%"}}/>
              <col style={{width:"10%"}}/>
              {selM.result&&<col style={{width:"16%"}}/>}
            </colgroup>
            <thead>
              <tr style={{borderBottom:"2px solid #e2e8f0"}}>
                <th style={{textAlign:"left",padding:"6px 8px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>Player</th>
                <th style={{textAlign:"center",padding:"6px 2px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>Toss</th>
                <th style={{textAlign:"center",padding:"6px 2px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>Win</th>
                <th style={{textAlign:"center",padding:"6px 2px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>POTM</th>
                <th style={{textAlign:"center",padding:"6px 2px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>📊</th>                 <th style={{textAlign:"center",padding:"6px 2px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>❓</th>
                {selM.result&&<th style={{textAlign:"center",padding:"6px 2px",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:.3}}>Pts</th>}
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map(u=>{
                const emk=ek(u.email);
                const p=getP(allPicks[emk]||{},selM.id);
                const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(selM.id);
                const mult=isDouble?2:1;
                let rowPts=0,tossOk=false,winOk=false,motmOk=false;
                const sbAns=lockedMatches&&scoreBandAnswers?scoreBandAnswers[String(selM.id)]:undefined;
                const sbOk=sbAns&&p?.sb&&p.sb===sbAns;
                if(p&&selM.result){
                  const tA=!isNR(selM.result.toss),wA=!isNR(selM.result.win),mA=!isNR(selM.result.motm);
                  tossOk=tA&&p.toss===selM.result.toss;
                  winOk=wA&&p.win===selM.result.win;
                  motmOk=mA&&motmMatch(p.motm,selM.result.motm);
                  let base=0;
                  if(tossOk)base+=PTS.toss;
                  if(winOk)base+=PTS.win;
                  if(motmOk)base+=PTS.motm;
                  const avail=[tA,wA,mA].filter(Boolean).length;
                  const correct=[tossOk,winOk,motmOk].filter(Boolean).length;
                  if(avail>0&&correct===avail)base+=PTS.streak;
                  if(sbOk)base+=PTS.scoreBand;                   const bqAns=bonusAnswers?.[String(selM.id)];                   const userBQ=(allBonusPicks?.[emk]||{})[String(selM.id)];                   const bqOk2=bqAns!=null&&userBQ!=null&&userBQ===bqAns;                   if(bqOk2)base+=PTS.bonus;
                  rowPts=base*mult;
                }
                const rowBg=p?(selM.result?(rowPts>0?"#f0fdf4":"#fff7f7"):"#FFFBEB"):"#fafafa";
                return<tr key={u.email} style={{borderBottom:"1px solid #f1f5f9",background:rowBg}}>
                  <td style={{padding:"8px 8px",overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <Av name={u.name} sz={22}/>
                      <div style={{minWidth:0}}>
                        <p style={{fontSize:11,fontWeight:600,color:"#1a2540",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</p>
                        {u.email===adminEmail&&<span style={{fontSize:9,color:"#1D428A",fontWeight:700}}>You</span>}
                      </div>
                    </div>
                  </td>
                  {p?<>
                    <td style={{textAlign:"center",padding:"6px 2px"}}>
                      <span style={{display:"inline-block",fontSize:10,fontWeight:700,padding:"2px 5px",borderRadius:5,
                        color:selM.result?(tossOk?"#15803d":"#dc2626"):(TC[p.toss]?.bg||"#1a2540"),
                        background:selM.result?(tossOk?"#dcfce7":"#fee2e2"):"#f1f5f9"}}>{p.toss}</span>
                    </td>
                    <td style={{textAlign:"center",padding:"6px 2px"}}>
                      <span style={{display:"inline-block",fontSize:10,fontWeight:700,padding:"2px 5px",borderRadius:5,
                        color:selM.result?(winOk?"#15803d":"#dc2626"):(TC[p.win]?.bg||"#1a2540"),
                        background:selM.result?(winOk?"#dcfce7":"#fee2e2"):"#f1f5f9"}}>{p.win}</span>
                    </td>
                    <td style={{textAlign:"center",padding:"6px 2px"}}>
                      <span style={{display:"block",fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                        color:selM.result?(motmOk?"#15803d":"#dc2626"):"#475569",fontWeight:selM.result?700:400}}>
                        {p.motm?.split(" ").slice(-1)[0]||"—"}
                      </span>
                    </td>
                    <td style={{textAlign:"center",padding:"6px 2px"}}>
                      <span style={{display:"block",fontSize:10,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                        color:sbAns?(sbOk?"#15803d":"#dc2626"):"#94a3b8"}}>
                        {p.sb?SCORE_BANDS.find(b=>b.id===p.sb)?.emoji+(SCORE_BANDS.find(b=>b.id===p.sb)?.short||p.sb):"—"}
                      </span>
                    </td>
                    {selM.result&&<td style={{textAlign:"center",padding:"6px 2px"}}>
                      <span className="C" style={{fontSize:13,fontWeight:800,color:rowPts>0?"#15803d":"#94a3b8"}}>+{rowPts}</span>
                    </td>}
                  <td style={{textAlign:"center",padding:"6px 2px"}}>{(()=>{const bqA=bonusAnswers?.[String(selM.id)];const uBQ=(allBonusPicks?.[emk]||{})[String(selM.id)];const bqOk3=bqA!=null&&uBQ!=null&&uBQ===bqA;return uBQ!=null?<span style={{fontSize:10,fontWeight:700,color:bqA!=null?(bqOk3?"#15803d":"#dc2626"):"#1a2540"}}>{uBQ?"Yes":"No"}{bqA!=null&&<span style={{fontSize:9}}>{bqOk3?" ✓":" ✗"}</span>}</span>:<span style={{fontSize:10,color:"#94a3b8"}}>—</span>;})()}</td>                   <td style={{textAlign:"center",padding:"6px 2px"}}>
                      <button onClick={async()=>{if(!confirm("Reset pick for "+u.name+"?"))return;const{db,dbMod}=await(async()=>{const[app,db]=await Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")]);const _app=app.getApps().length?app.getApp():app.initializeApp({apiKey:"AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",authDomain:"ipl2026-fantasy-20c9b.firebaseapp.com",databaseURL:"https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",projectId:"ipl2026-fantasy-20c9b",storageBucket:"ipl2026-fantasy-20c9b.firebasestorage.app",messagingSenderId:"973930153403",appId:"1:973930153403:web:872ce26072b07e1adf309e"});return{db:db.getDatabase(_app),dbMod:db};})();await dbMod.remove(dbMod.ref(db,"ipl26_ap/"+emk+"/"+String(selM.id)));await dbMod.remove(dbMod.ref(db,"ipl26_bq/"+emk+"/"+String(selM.id)));const freshAP=await DB.get("ap");const normAP=normalizeAP(freshAP||{});window.location.reload();}} style={{padding:"3px 7px",borderRadius:6,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:10,fontWeight:700}}>↩️</button>
                    </td>
                  </>:<td colSpan={selM.result?8:7} style={{textAlign:"center",padding:"8px 4px",color:"#94a3b8",fontSize:11,fontStyle:"italic"}}>no pick</td>}
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        {/* Who hasn't picked yet warning (pre-result, pre-lock only) */}
        {(()=>{
          const noPick=approvedUsers.filter(u=>!getP(allPicks[ek(u.email)]||{},selM.id));
          const stillOpen=!selM.result&&!isMatchLocked(selM,lockedMatches);
          if(noPick.length===0||!stillOpen)return null;
          return<div style={{marginTop:10,padding:"10px 12px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8}}>
            <p style={{fontSize:10,fontWeight:700,color:"#991b1b",margin:"0 0 4px",textTransform:"uppercase"}}>⚠️ Yet to predict ({noPick.length})</p>
            <p style={{fontSize:11,color:"#dc2626",margin:0,lineHeight:1.6}}>{noPick.map(u=>u.name).join(", ")}</p>
          </div>;
        })()}
      </div>
    </>}
  </div>;
}

function AdminManualPickPanel({ms,users,allPicks,doubleMatch,onSave,onSaveSeasonData,spk,t4pk,allPropBets,allBonusPicks,toast2}){
  const[selUser,setSelUser]=useState("");
  const[selMatch,setSelMatch]=useState(null);
  const[draft,setDraft]=useState({toss:"",win:"",motm:"",sb:"",bqAns:null});
  const[saving,setSaving]=useState(false);
  const[userSearch,setUserSearch]=useState("");
  const[matchSearch,setMatchSearch]=useState("");
  // Season override state
  const[ovChamp,setOvChamp]=useState("");
  const[ovT4,setOvT4]=useState([]);
  const[ovProps,setOvProps]=useState({q0:"",q1:"",q2:"",q3:"",q4:""});
  const[savingSeason,setSavingSeason]=useState("");

  const approvedUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
  const filteredUsers=approvedUsers.filter(u=>u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const playableMs=ms.filter(m=>!isTBD(m)&&TEAMS.includes(m.home)&&TEAMS.includes(m.away));
  const filteredMs=playableMs.filter(m=>(m.mn+m.home+m.away+m.date).toLowerCase().includes(matchSearch.toLowerCase()));

  const existingPick=selUser&&selMatch?getP(allPicks[ek(selUser)]||{},selMatch.id):null;
  const existingBQ=selUser&&selMatch?(allBonusPicks[ek(selUser)]||{})[String(selMatch.id)]:undefined;
  const hasBQ=selMatch&&!!BONUS_QUESTIONS[selMatch.id];
  const allReady=!!(draft.toss&&draft.win&&draft.motm&&draft.sb&&(!hasBQ||draft.bqAns!==null));

  // Pre-fill season data when user is selected
  function selectUser(email){
    const emk=ek(email);
    setSelUser(email);setSelMatch(null);
    setDraft({toss:"",win:"",motm:"",sb:"",bqAns:null});setUserSearch("");
    setOvChamp(spk[emk]||"");
    setOvT4(t4pk[emk]||[]);
    const ep=allPropBets[emk]||{};
    setOvProps({q0:ep.q0||"",q1:ep.q1||"",q2:ep.q2||"",q3:ep.q3||"",q4:ep.q4||""});
  }

  async function handleSave(){
    if(!selUser||!selMatch){toast2("Select a user and match","error");return;}
    if(!draft.toss||!draft.win||!draft.motm||!draft.sb){toast2("Fill Q1–Q4","error");return;}
    if(hasBQ&&draft.bqAns===null){toast2("Answer the bonus question (Q5)","error");return;}
    setSaving(true);
    const ok=await onSave(selUser,selMatch,{toss:draft.toss,win:draft.win,motm:draft.motm,sb:draft.sb},draft.bqAns);
    if(ok){setSelMatch(null);setDraft({toss:"",win:"",motm:"",sb:"",bqAns:null});}
    setSaving(false);
  }

  async function handleSaveChampion(){
    if(!selUser||!ovChamp){toast2("Select a team","error");return;}
    setSavingSeason("champ");await onSaveSeasonData(selUser,"champion",ovChamp);setSavingSeason("");
  }
  async function handleSaveTop4(){
    if(!selUser||ovT4.length!==4){toast2("Select exactly 4 teams","error");return;}
    setSavingSeason("t4");await onSaveSeasonData(selUser,"top4",ovT4);setSavingSeason("");
  }
  async function handleSaveProps(){
    if(!selUser){return;}
    setSavingSeason("props");await onSaveSeasonData(selUser,"props",ovProps);setSavingSeason("");
  }

  return(
    <div>
    <div className="ac">
      <p className="st" style={{marginBottom:12}}>📸 MANUAL PICK ENTRY (SCREENSHOT EVIDENCE)</p>
      <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:12,color:"#92400E"}}>
        ⚠️ Use only when a player sent screenshot proof of their prediction before lock time. This bypasses the lock — use responsibly.
      </div>

      {/* Step 1: User */}
      <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Step 1 — Select Player</p>
      <input className="inp" placeholder="Search player…" value={userSearch} onChange={e=>setUserSearch(e.target.value)} style={{marginBottom:8}}/>
      <div style={{maxHeight:160,overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:10,marginBottom:14}}>
        {filteredUsers.map(u=>{
          const emk=ek(u.email);
          const pickCount=Object.keys(allPicks[emk]||{}).length;
          return(
            <div key={u.email} onClick={()=>selectUser(u.email)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",cursor:"pointer",background:selUser===u.email?"#EBF0FA":"#fff",borderBottom:"1px solid #f1f5f9"}}>
              <Av name={u.name} sz={28}/>
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:600,color:"#1a2540",margin:0}}>{u.name}</p>
                <p style={{fontSize:10,color:"#94a3b8",margin:0}}>{u.email} · {pickCount} picks</p>
              </div>
              {selUser===u.email&&<span style={{color:"#1D428A",fontSize:14}}>✓</span>}
            </div>
          );
        })}
      </div>

      {/* Step 2: Match */}
      {selUser&&<>
        <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Step 2 — Select Match</p>
        <input className="inp" placeholder="Search match (M17, PBKS, CSK…)" value={matchSearch} onChange={e=>setMatchSearch(e.target.value)} style={{marginBottom:8}}/>
        <div style={{maxHeight:180,overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:10,marginBottom:14}}>
          {filteredMs.map(m=>{
            const hasPick=!!getP(allPicks[ek(selUser)]||{},m.id);
            const locked=isMatchLocked(m,{});
            return(
              <div key={m.id} onClick={()=>{setSelMatch(m);setDraft({toss:"",win:"",motm:"",sb:"",bqAns:null});setMatchSearch("");}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",cursor:"pointer",background:selMatch?.id===m.id?"#EBF0FA":"#fff",borderBottom:"1px solid #f1f5f9"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#1D428A"}}>{m.mn}</span>
                    <span style={{fontSize:12,color:"#1a2540",fontWeight:600}}>{m.home} vs {m.away}</span>
                  </div>
                  <p style={{fontSize:10,color:"#94a3b8",margin:0}}>{m.date} · {m.time}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                  {hasPick&&<span style={{background:"#f0fdf4",color:"#15803d",fontSize:9,padding:"2px 6px",borderRadius:8,fontWeight:700}}>Has pick</span>}
                  {locked&&<span style={{background:"#fee2e2",color:"#991b1b",fontSize:9,padding:"2px 6px",borderRadius:8,fontWeight:700}}>🔒</span>}
                  {m.result&&<span style={{background:"#dbeafe",color:"#1e40af",fontSize:9,padding:"2px 6px",borderRadius:8,fontWeight:700}}>Done</span>}
                  {selMatch?.id===m.id&&<span style={{color:"#1D428A",fontSize:14}}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* Existing pick warning */}
      {existingPick&&<div style={{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:12,color:"#92400E"}}>
        ⚠️ Existing pick for {selMatch?.mn}: <b>{existingPick.toss}</b> toss · <b>{existingPick.win}</b> win · POTM: <b>{existingPick.motm?.split(" ").slice(-1)[0]}</b>{existingPick.sb?` · Band: ${existingPick.sb}`:""}. Saving will overwrite.
        {existingBQ!==undefined&&<span> · Bonus: {existingBQ?"Yes":"No"}</span>}
      </div>}

      {/* Step 3: Full 5-question pick entry */}
      {selUser&&selMatch&&<>
        <div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:12,padding:"14px",marginBottom:14}}>
          <p style={{fontSize:11,fontWeight:700,color:"#1e40af",textTransform:"uppercase",letterSpacing:.5,marginBottom:14}}>
            Step 3 — Enter All 5 Picks · {selMatch.mn}: {selMatch.home} vs {selMatch.away}
          </p>

          {/* Q1: Toss */}
          <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>Q1 · Toss Winner</p>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[selMatch.home,selMatch.away].map(t=>(
              <button key={t} onClick={()=>setDraft(d=>({...d,toss:t}))}
                style={{flex:1,padding:"10px 6px",borderRadius:10,border:"2px solid "+(draft.toss===t?"#1D428A":"#e2e8f0"),background:draft.toss===t?"#EBF0FA":"#f8faff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <TLogo t={t} sz={32}/>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:draft.toss===t?"#1D428A":"#64748b"}}>{t}</span>
              </button>
            ))}
          </div>

          {/* Q2: Winner */}
          <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>Q2 · Match Winner</p>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[selMatch.home,selMatch.away].map(t=>(
              <button key={t} onClick={()=>setDraft(d=>({...d,win:t}))}
                style={{flex:1,padding:"10px 6px",borderRadius:10,border:"2px solid "+(draft.win===t?"#1D428A":"#e2e8f0"),background:draft.win===t?"#EBF0FA":"#f8faff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <TLogo t={t} sz={32}/>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:draft.win===t?"#1D428A":"#64748b"}}>{t}</span>
              </button>
            ))}
          </div>

          {/* Q3: POTM */}
          <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>Q3 · Player of the Match</p>
          <div style={{marginBottom:14}}>
            <PotmDropdown homeTeam={selMatch.home} awayTeam={selMatch.away} value={draft.motm} onChange={v=>setDraft(d=>({...d,motm:v}))}/>
          </div>

          {/* Q4: Score Band */}
          <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>Q4 · First Innings Score Band</p>
          <div style={{display:"flex",gap:6,marginBottom:4}}>
            {SCORE_BANDS.map(band=>(
              <button key={band.id} onClick={()=>setDraft(d=>({...d,sb:d.sb===band.id?"":band.id}))}
                style={{flex:1,padding:"8px 4px",borderRadius:10,border:"2px solid "+(draft.sb===band.id?"#1D428A":"#e2e8f0"),background:draft.sb===band.id?"#EBF0FA":"#f8faff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:18}}>{band.emoji}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:draft.sb===band.id?"#1D428A":"#64748b"}}>{band.short}</span>
              </button>
            ))}
          </div>
          {!draft.sb&&<p style={{fontSize:10,color:"#ef4444",marginBottom:10,fontWeight:600}}>⚠ Required</p>}
          {draft.sb&&<p style={{fontSize:10,color:"#94a3b8",marginBottom:10}}>Selected: {SCORE_BANDS.find(b=>b.id===draft.sb)?.label}</p>}

          {/* Q5: Bonus Question */}
          {hasBQ&&<>
            <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>Q5 · Bonus Question</p>
            <p style={{fontSize:11,color:"#475569",marginBottom:8,lineHeight:1.4,fontStyle:"italic"}}>{BONUS_QUESTIONS[selMatch.id]}</p>
            <div style={{display:"flex",gap:8,marginBottom:draft.bqAns===null?4:10}}>
              <button className={"bq-btn yes"+(draft.bqAns===true?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===true?null:true}))}>✅ Yes</button>
              <button className={"bq-btn no"+(draft.bqAns===false?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===false?null:false}))}>❌ No</button>
            </div>
            {draft.bqAns===null&&<p style={{fontSize:10,color:"#ef4444",marginBottom:10,fontWeight:600}}>⚠ Required</p>}
          </>}

          {/* Summary */}
          {allReady&&<div style={{background:"#fff",borderRadius:10,padding:"10px 12px",marginTop:4,border:"1px solid #bfdbfe",fontSize:12}}>
            <p style={{color:"#1e40af",fontWeight:700,margin:"0 0 6px",fontSize:11,textTransform:"uppercase"}}>Will save:</p>
            <p style={{color:"#1a2540",margin:0,lineHeight:1.6}}>
              <b>{Object.values(users).find(u=>u.email===selUser)?.name||selUser}</b> → {selMatch.mn}:{" "}
              <b>{draft.toss}</b> toss · <b>{draft.win}</b> win · <b>{draft.motm?.split(" ").slice(-1)[0]}</b> POTM · <b>{draft.sb}</b> band{hasBQ?` · Bonus: ${draft.bqAns?"Yes":"No"}`:""}
            </p>
          </div>}
        </div>

        <button className="pbtn" disabled={saving||!allReady} onClick={handleSave} style={{marginBottom:8}}>
          {saving?"Saving…":"💾 Save Pick for "+Object.values(users).find(u=>u.email===selUser)?.name}
        </button>
      </>}
    </div>

    {/* ── Season Data Override ── */}
    {selUser&&<div className="ac" style={{marginTop:14}}>
      <p className="st" style={{marginBottom:4}}>🔧 SEASON DATA OVERRIDE</p>
      <p style={{fontSize:11,color:"#64748b",marginBottom:14}}>Override champion, top 4, and prop bets for <b>{Object.values(users).find(u=>u.email===selUser)?.name||selUser}</b>.</p>

      {/* Champion */}
      <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>🏆 Champion Pick</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
        {TEAMS.map(t=><button key={t} onClick={()=>setOvChamp(t)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:ovChamp===t?"#1D428A":"#f8faff",border:"2px solid "+(ovChamp===t?"#1D428A":"#e2e8f0"),cursor:"pointer"}}><TLogo t={t} sz={20}/><span style={{fontSize:11,fontWeight:700,color:ovChamp===t?"#fff":"#475569"}}>{t}</span></button>)}
      </div>
      <button className="pbtn" disabled={!ovChamp||savingSeason==="champ"} onClick={handleSaveChampion} style={{marginBottom:14,opacity:ovChamp?1:.4}}>
        {savingSeason==="champ"?"Saving…":"💾 Save Champion: "+(ovChamp||"—")}
      </button>

      {/* Top 4 */}
      <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>🏅 Top 4 Picks · {ovT4.length}/4</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
        {TEAMS.map(t=>{const sel=ovT4.includes(t);return<button key={t} onClick={()=>{if(sel)setOvT4(p=>p.filter(x=>x!==t));else if(ovT4.length<4)setOvT4(p=>[...p,t]);else toast2("Max 4 teams","error");}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:sel?"#1D428A":"#f8faff",border:"2px solid "+(sel?"#1D428A":"#e2e8f0"),cursor:"pointer"}}><TLogo t={t} sz={20}/><span style={{fontSize:11,fontWeight:700,color:sel?"#fff":"#475569"}}>{t}</span>{sel&&<span style={{fontSize:10,background:"rgba(255,255,255,.25)",color:"#fff",borderRadius:4,padding:"0 4px"}}>#{ovT4.indexOf(t)+1}</span>}</button>;})}</div>
      <button className="pbtn" disabled={ovT4.length!==4||savingSeason==="t4"} onClick={handleSaveTop4} style={{marginBottom:14,opacity:ovT4.length===4?1:.4}}>
        {savingSeason==="t4"?"Saving…":"💾 Save Top 4"}
      </button>

      {/* Prop Bets */}
      <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>🔮 Season Prop Bets</p>
      {PROP_QUESTIONS.map((q,i)=>{
        const val=ovProps[q.id]||"";
        return<div key={q.id} style={{marginBottom:10}}>
          <p style={{fontSize:11,fontWeight:700,color:"#1D428A",margin:"0 0 4px"}}>Q{i+1} · {q.label}</p>
          {q.type==="player"&&<select className="sel" value={val} onChange={e=>setOvProps(p=>({...p,[q.id]:e.target.value}))}><option value="">Select player…</option>{ALL_PLAYERS.map(({p,t})=><option key={p+t} value={p}>{p} ({t})</option>)}</select>}
          {q.type==="team"&&<select className="sel" value={val} onChange={e=>setOvProps(p=>({...p,[q.id]:e.target.value}))}><option value="">Select team…</option>{TEAMS.map(t=><option key={t} value={t}>{TF[t]}</option>)}</select>}
          {q.type==="yesno"&&<div style={{display:"flex",gap:8}}><button className={"bq-btn yes"+(val==="true"?" on":"")} onClick={()=>setOvProps(p=>({...p,[q.id]:"true"}))}>✅ Yes</button><button className={"bq-btn no"+(val==="false"?" on":"")} onClick={()=>setOvProps(p=>({...p,[q.id]:"false"}))}>❌ No</button></div>}
        </div>;
      })}
      <button className="pbtn" disabled={savingSeason==="props"} onClick={handleSaveProps} style={{background:"linear-gradient(135deg,#0f6e56,#1D9E75)"}}>
        {savingSeason==="props"?"Saving…":"💾 Save Prop Bets"}
      </button>
    </div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NAV — defined outside App so React never remounts it on re-renders
   ════════════════════════════════════════════════════════════════ */
function AppNav({sc,setSc,navItems,chatU,pendingCount,setAm,setChatU,setChatSeenTs,setBcSeenTs}){
  return<nav className="nav">{navItems.map(([s,ic,lb2])=>(
    <button key={s} className="ni" onClick={()=>{
      if(s!=="picks")setAm(null);
      setSc(s);
      if(s==="chat"){setChatU(0);setChatSeenTs(Date.now());}
      if(s==="home")setBcSeenTs(Date.now());
    }}>
      <div style={{position:"relative",display:"inline-block"}}>
        <span style={{fontSize:15,opacity:sc===s?1:.4}}>{ic}</span>
        {s==="chat"&&chatU>0&&<span className="bd"/>}
        {s==="adm"&&pendingCount>0&&<span className="bd"/>}
      </div>
      <span className="nl" style={{color:sc===s?"#1D428A":"#334155"}}>{lb2}</span>
    </button>
  ))}</nav>;
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
  const[ptab,setPtab]=useState("pending");
  const[am,setAm]=useState(null);const[draft,setDraft]=useState({});
  const[admTab,setAdmTab]=useState("approvals");
  const[bcMsg,setBcMsg]=useState("");
  const[exU,setExU]=useState(null);
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
  const[repairLoading,setRepairLoading]=useState(false);
  // Bonus questions
  const[bonusAnswers,setBonusAnswers]=useState({});
  const[myBonusPicks,setMyBonusPicks]=useState({});
  const[allBonusPicks,setAllBonusPicks]=useState({});
  // Score band answers (admin sets correct band per match)
  const[scoreBandAnswers,setScoreBandAnswers]=useState({});
  // Prop bets
  const[propAnswers,setPropAnswers]=useState({});
  const[myPropBets,setMyPropBets]=useState({});
  const[allPropBets,setAllPropBets]=useState({});
  const[obProps,setObProps]=useState({q0:"",q1:"",q2:"",q3:"",q4:""});
  // Reveal theatre
  const[revealMatchId,setRevealMatchId]=useState(null);

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

  /*
    FIX — forceRepair: now calls DB.repairAllPicks which re-normalises ALL
    keys in the ap subtree (email encoding + string match IDs). Also normalises
    sp and t4 key maps. Called on every login and available as admin button.
  */
  const forceRepair=useCallback(async()=>{
    try{
      await Promise.all([
        DB.repairAllPicks(),
        DB.get("sp").then(sp=>sp?DB.set("sp",normalizeKeyMap(sp)):null),
        DB.get("t4").then(t4=>t4?DB.set("t4",normalizeKeyMap(t4)):null),
      ]);
    }catch(e){console.error("repair",e);}
  },[]);

  const reloadShared=useCallback(async(em)=>{
    const emk=ek(em);
    const[ap,u,rm,b,cm,sp,sw2,t4,rx,rms,br,mn,mnt,pts,lk,pbc,dm,cm2,mu,mpo,pu,bonusAns,bqAll,pbAll,paAll,sba]=await Promise.all([
      DB.get("ap"),DB.get("u"),DB.get("rm"),DB.get("bc"),DB.get("ch"),
      DB.get("sp"),DB.get("sw"),DB.get("t4"),DB.get("rx"),DB.get("rms"),
      DB.get("bracket"),DB.get("manmatches"),DB.get("maintenance"),DB.get("ptsadj"),DB.get("lockedm"),
      DB.get("pinnedbc"),DB.get("doublematch"),DB.get("chatmuted"),DB.get("mutedusers"),DB.get("matchptsoverride"),
      DB.get("pending"),DB.get("bonusans"),DB.get("bq"),DB.get("propbets"),DB.get("propanswers"),DB.get("sbans")
    ]);
    if(u)setUsers(u);
    if(pu)setPendingUsers(pu);else setPendingUsers({});

    // FIX: always normalise the ap map on every reload — this converts any
    // Firebase-coerced integer keys back to string keys, preventing ghost picks
    const freshAP=normalizeAP(ap);
    setAllPicks(freshAP);
    if(em)setMyPicks(freshAP[emk]||{});

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
    if(bonusAns)setBonusAnswers(bonusAns);
    if(sba)setScoreBandAnswers(sba);
    const normBQ={};if(bqAll&&typeof bqAll==="object"){Object.keys(bqAll).forEach(k=>{normBQ[canonicalKey(k)]=bqAll[k];});}setAllBonusPicks(normBQ);if(em)setMyBonusPicks(normBQ[emk]||{});
    const normPB=normalizeKeyMap(pbAll);setAllPropBets(normPB);if(em)setMyPropBets(normPB[emk]||{});
    if(paAll)setPropAnswers(paAll);
    const userPropBets=em?(normPB[emk]||{}):null;
    const hasPropBets=!!(em&&userPropBets&&PROP_QUESTIONS.every((q,i)=>userPropBets[`q${i}`]&&userPropBets[`q${i}`]!==""));
    return{freshAP,hasOnboarded:!!(nsp[emk]),hasPropBets,userPropBets:userPropBets||{}};
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
        // FIX: repair DB on every auto-login REMOVED — too dangerous (caused data loss).
        // Repair is now admin-only via the DB Repair button in admin panel.
        setUser(ex);setEmail(saved.email);setIsAdmin(saved.email===SUPER_ADMIN);setSessionEmail(saved.email);
        const{freshAP,hasOnboarded,hasPropBets,userPropBets}=await reloadShared(saved.email);if(cancelled)return;
        setMyPicks(freshAP[ek(saved.email)]||{});
        setBcSeenTs(Date.now());setChatSeenTs(Date.now());
        if(!hasOnboarded)setSc("onboard");
        else if(!hasPropBets&&saved.email!==SUPER_ADMIN){
          setObProps({q0:userPropBets.q0||"",q1:userPropBets.q1||"",q2:userPropBets.q2||"",q3:userPropBets.q3||"",q4:userPropBets.q4||""});
          setSc("propbets");
        }
        else setSc("home");
      }catch(e){console.error("auto-login",e);if(!cancelled)setSc("login");}
    };
    const t=setTimeout(()=>{if(!cancelled)setSc("login");},7000);
    go().finally(()=>clearTimeout(t));
    return()=>{cancelled=true;clearTimeout(t);};
  // eslint-disable-next-line
  },[]);

  useEffect(()=>{if(["home","picks","lb","wof","adm"].includes(sc)&&email)reloadShared(email);},[sc,email]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enforce prop bets: whenever user arrives at home screen, check if props filled
  const propBetsSkipped=useRef(false);
  useEffect(()=>{
    if(sc!=="home"||!email||email===SUPER_ADMIN)return;
    if(propBetsSkipped.current)return; // user already skipped this session
    const emk2=ek(email);
    const userPb=allPropBets[emk2]||{};
    const filled=PROP_QUESTIONS.every((q,i)=>userPb[`q${i}`]&&userPb[`q${i}`]!=="");
    if(!filled){
      setObProps({q0:userPb.q0||"",q1:userPb.q1||"",q2:userPb.q2||"",q3:userPb.q3||"",q4:userPb.q4||""});
      setSc("propbets");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sc,email,allPropBets]);

  useEffect(()=>{
    Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));remTimers.current={};
    Object.keys(reminders).forEach(mid=>{if(!reminders[mid])return;const m=ms.find(x=>x.id===parseInt(mid)||x.id===mid);if(!m)return;const diff=cutoff(m).getTime()-30*60*1000-Date.now();if(diff>0&&diff<24*60*60*1000)remTimers.current[mid]=setTimeout(()=>toast2("⏰ "+m.home+" vs "+m.away+" locks in 30 mins!"),diff);});
    return()=>Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));
  },[reminders,ms,toast2]);

  useEffect(()=>{
    if(sc==="chat"){
      setChatU(0);setChatSeenTs(Date.now());
      const poll=async()=>{
        if(document.hidden)return; // pause when tab backgrounded
        const[c,u2,ou]=await Promise.all([DB.get("ch"),DB.get("u"),DB.get("online")]);
        if(c)setChat(c);if(u2)setUsers(u2);
        if(ou){const now=Date.now();Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});setOnlineUsers({...ou});}
      };
      poll();
      if(pollRef.current)clearInterval(pollRef.current);
      pollRef.current=setInterval(poll,8000);
      // Resume poll immediately when tab becomes visible again
      const onVis=()=>{if(!document.hidden&&sc==="chat")poll();};
      document.addEventListener("visibilitychange",onVis);
      return()=>{
        if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}
        document.removeEventListener("visibilitychange",onVis);
      };
    }else{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}}
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
  const myBonusPts=useMemo(()=>ms.filter(m=>m.result).reduce((s,m)=>{
    const ans=bonusAnswers[String(m.id)]??bonusAnswers[Number(m.id)];if(ans==null)return s;
    const myAns=myBonusPicks[String(m.id)];if(myAns==null)return s;
    return s+(myAns===ans?PTS.bonus:0);
  },0),[ms,bonusAnswers,myBonusPicks]);
  const mySbPts=useMemo(()=>ms.filter(m=>m.result).reduce((s,m)=>{
    const ans=scoreBandAnswers[String(m.id)]??scoreBandAnswers[Number(m.id)];if(!ans)return s;
    const p=getP(myPicks,m.id);if(!p?.sb)return s;
    return s+(p.sb===ans?PTS.scoreBand:0);
  },0),[ms,scoreBandAnswers,myPicks]);
  const myPropPts=useMemo(()=>PROP_QUESTIONS.reduce((s,q,i)=>{
    const ans=propAnswers?.[`q${i}`];const myAns=myPropBets?.[`q${i}`];
    if(!ans||myAns==null||myAns==="")return s;
    return s+(String(myAns)===String(ans)?PTS.prop:0);
  },0),[propAnswers,myPropBets]);
  const myPts=useMemo(()=>myS.pts+((spk[myEk]&&sw&&spk[myEk]===sw)?PTS.season:0)+((sw&&myT4&&myT4.includes(sw))?PTS.top4:0)+getManualAdj(email)+getMatchOverride(email)+myBonusPts+myPropPts+mySbPts,[myS,spk,myEk,sw,myT4,getManualAdj,getMatchOverride,email,myBonusPts,myPropPts,mySbPts]);
  const lbScores=useMemo(()=>{
    const scores={};
    const doneMs=ms.filter(m=>m.result);
    Object.values(users).forEach(u=>{
      if(!u?.email||u.approved===false)return;
      const emk=ek(u.email);const up=allPicks[emk]||{};
      const st=calcScore(up,ms,doubleMatch);
      const userSp=spk[emk]||"";const userT4=t4pk[emk]||[];
      const sp2=(userSp&&sw&&userSp===sw)?PTS.season:0;
      const t4p=(sw&&userT4.includes(sw))?PTS.top4:0;
      const bonusPts=doneMs.reduce((s,m)=>{
        const ans=bonusAnswers[String(m.id)]??bonusAnswers[Number(m.id)];if(ans==null)return s;
        const userAns=(allBonusPicks[emk]||{})[String(m.id)];if(userAns==null)return s;
        return s+(userAns===ans?PTS.bonus:0);
      },0);
      const sbPts=doneMs.reduce((s,m)=>{
        const ans=scoreBandAnswers[String(m.id)]??scoreBandAnswers[Number(m.id)];if(!ans)return s;
        const p=getP(up,m.id);if(!p?.sb)return s;
        return s+(p.sb===ans?PTS.scoreBand:0);
      },0);
      const propPts=PROP_QUESTIONS.reduce((s,q,i)=>{
        const ans=propAnswers?.[`q${i}`];const userAns=allPropBets[emk]?.[`q${i}`];
        if(!ans||userAns==null||userAns==="")return s;
        return s+(String(userAns)===String(ans)?PTS.prop:0);
      },0);
      scores[u.email]={pts:st.pts+sp2+t4p+getManualAdj(u.email)+getMatchOverride(u.email)+bonusPts+propPts+sbPts,acc:st.acc,hot:st.hot,bgs:calcBadges(up,ms,allPicks),userSp,userT4,bonusPts,propPts,sbPts,userProps:allPropBets[emk]||{}};
    });
    return scores;
  },[users,allPicks,ms,doubleMatch,spk,sw,t4pk,getManualAdj,getMatchOverride,bonusAnswers,allBonusPicks,propAnswers,allPropBets,scoreBandAnswers]);
  const getLb=useCallback(()=>Object.values(users).filter(u=>u?.email&&u.approved!==false).map(u=>({...u,...(lbScores[u.email]||{pts:0,acc:0,hot:false,bgs:[],userSp:"",userT4:[],userProps:{}})})).sort((a,b)=>b.pts-a.pts),[users,lbScores]);

  /* AUTH */
  function clearAuthForm(){setAuthEmail("");setAuthPw("");setAuthPw2("");setAuthName("");setAuthErrors({});setShowPw(false);setShowPw2(false);setForgotStep(1);setForgotNewPw("");setForgotNewPw2("");setShowForgotPw(false);setShowForgotPw2(false);}
  async function doLogin(){setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const eErr=validateEmail(em);if(eErr)errs.email=eErr;if(!authPw)errs.pw="Password is required";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}try{const u2=await DB.get("u")||{};const storedHash=await DB.get("pw_"+ek(em));const userEntry=u2[em]||u2[ek(em)];if(!userEntry||storedHash==null){setAuthErrors({email:"No account found."});setAuthLoading(false);return;}if(userEntry.approved===false){setAuthErrors({email:"Account pending admin approval."});setAuthLoading(false);return;}const inputHash=await sha256(authPw);const match=storedHash===inputHash||storedHash===authPw;if(!match){setAuthErrors({pw:"Incorrect password."});setAuthLoading(false);return;}if(storedHash===authPw)await DB.set("pw_"+ek(em),inputHash);setUsers(u2);await doSignIn(em,userEntry);}catch(e){console.error("login",e);setAuthErrors({email:"Something went wrong."});}setAuthLoading(false);}
  async function doRegister(){const now=Date.now();regAttempts.current=regAttempts.current.filter(t=>now-t<REG_WINDOW);if(regAttempts.current.length>=REG_LIMIT){setAuthErrors({email:"Too many attempts."});return;}regAttempts.current.push(now);setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const eErr=validateEmail(em);if(eErr)errs.email=eErr;const nErr=validateName(authName);if(nErr)errs.name=nErr;const pErr=validatePassword(authPw,"register");if(pErr)errs.pw=pErr;if(authPw!==authPw2)errs.pw2="Passwords do not match";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}try{const u2=await DB.get("u")||{};if(u2[em]||u2[ek(em)]){setAuthErrors({email:"Account already exists."});setAuthLoading(false);return;}const existingPending=await DB.get("pending")||{};if(existingPending[ek(em)]){setAuthErrors({email:"Registration already pending."});setAuthLoading(false);return;}const isFirstUser=Object.keys(u2).length===0||em===SUPER_ADMIN;if(isFirstUser){const ex={email:em,name:authName.trim(),joined:new Date().toISOString(),approved:true};await DB.set("u",{...u2,[em]:ex});await DB.set("pw_"+ek(em),await sha256(authPw));const verify=await DB.get("u")||{};const entry=verify[em]||verify[ek(em)];if(!entry){setAuthErrors({email:"Registration failed."});setAuthLoading(false);return;}setUsers(verify);await doSignIn(em,entry,true);}else{await DB.set("pw_"+ek(em),await sha256(authPw));const pending=await DB.get("pending")||{};pending[ek(em)]={email:em,name:authName.trim(),joined:new Date().toISOString()};await DB.set("pending",pending);setSc("pending_approval");}}catch(err){console.error("register",err);setAuthErrors({email:"Registration failed."});}setAuthLoading(false);}
  async function doForgotStep1(){setAuthLoading(true);const em=normalizeEmail(authEmail);const eErr=validateEmail(em);if(eErr){setAuthErrors({email:eErr});setAuthLoading(false);return;}const u2=await DB.get("u")||{};if(!u2[em]&&!u2[ek(em)]){setAuthErrors({email:"No account found."});setAuthLoading(false);return;}setAuthErrors({});setForgotStep(2);setAuthLoading(false);}
  async function doForgotStep2(){setAuthLoading(true);const em=normalizeEmail(authEmail);const errs={};const pErr=validatePassword(forgotNewPw,"register");if(pErr)errs.pw=pErr;if(forgotNewPw!==forgotNewPw2)errs.pw2="Passwords do not match";if(Object.keys(errs).length){setAuthErrors(errs);setAuthLoading(false);return;}await DB.set("pw_"+ek(em),await sha256(forgotNewPw));toast2("Password reset! Please sign in.","ok");const se=authEmail;clearAuthForm();setAuthMode("login");setAuthEmail(se);setAuthLoading(false);}
  async function doSignIn(em,ex,isNew=false){
    setMyPicks({});setMySp("");setMyT4([]);setObSp("");setObT4([]);setObStep(0);setAm(null);
    setUser(ex);setEmail(em);setIsAdmin(em===SUPER_ADMIN);
    await persistSession(em);
    const{freshAP,hasOnboarded,hasPropBets,userPropBets}=await reloadShared(em);
    setMyPicks(freshAP[ek(em)]||{});
    setBcSeenTs(Date.now());setChatSeenTs(Date.now());
    if(isNew||!hasOnboarded)setSc("onboard");
    else if(!hasPropBets&&em!==SUPER_ADMIN){
      setObProps({q0:userPropBets.q0||"",q1:userPropBets.q1||"",q2:userPropBets.q2||"",q3:userPropBets.q3||"",q4:userPropBets.q4||""});
      setSc("propbets");toast2("One quick thing — fill in your season prop bets! 🏏");
    }
    else{setSc("home");toast2("Welcome back, "+ex.name+"! 👋","ok");}
  }
  async function logout(){Object.keys(remTimers.current).forEach(id=>clearTimeout(remTimers.current[id]));remTimers.current={};if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}clearTimeout(tRef.current);if(sessionEmail){try{const ou=await DB.get("online")||{};delete ou[ek(sessionEmail)];await DB.set("online",ou);await DB.set("token_"+ek(sessionEmail),null);await DB.set("session",null);}catch(e){console.error(e);}}setSessionEmail(null);setUser(null);setEmail("");setMyPicks({});setMySp("");setMyT4([]);setIsAdmin(false);setAm(null);setAllPicks({});setSpk({});setT4pk({});setOnlineUsers({});setUsers({});setBcSeenTs(0);setChatSeenTs(Date.now());setChatU(0);setToast(null);clearAuthForm();setSc("login");}
  async function approveUser(emk){const pu=await DB.get("pending")||{};const entry=pu[emk];if(!entry)return;delete pu[emk];const u2=await DB.get("u")||{};u2[entry.email]={...entry,approved:true};await DB.set("u",u2);await DB.set("pending",pu);setUsers({...users,[entry.email]:{...entry,approved:true}});setPendingUsers({...pu});toast2(entry.name+" approved! ✅","ok");const latest=await DB.get("ch")||[];const nc=capChat([...latest,{id:Date.now(),email:"__sys__",name:"IPL Bot",text:"🎉 "+entry.name+" has joined! Welcome!",ts:Date.now(),sys:true}]);setChat(nc);await DB.set("ch",nc);}
  async function rejectUser(emk){const pu=await DB.get("pending")||{};const entry=pu[emk];if(!entry)return;delete pu[emk];await DB.set("pending",pu);await DB.set("pw_"+emk,null);setPendingUsers({...pu});toast2(entry.name+" rejected","error");}
  async function updateObStep(step,sp,t4){setObStep(step);if(email)await DB.set("ob_"+myEk,{step,sp,t4});}
  async function doneOnboard(){
    if(!obSp){toast2("Pick a champion first","error");return;}
    if(obT4.length!==4){toast2("Select exactly 4 teams","error");return;}
    const unanswered=PROP_QUESTIONS.filter((q,i)=>!obProps[`q${i}`]||obProps[`q${i}`]==="");
    if(unanswered.length>0){toast2("Answer all "+unanswered.length+" of 5 prop bet questions","error");return;}
    const sp2={...spk,[myEk]:obSp};const t42={...t4pk,[myEk]:obT4};
    setSpk(sp2);setMySp(obSp);setT4pk(t42);setMyT4(obT4);
    await DB.set("sp",sp2);await DB.set("t4",t42);
    await savePropBets(obProps);
    await DB.set("ob_"+myEk,null);
    setSc("home");toast2("All picks locked! Let the games begin! 🏏","ok");
  }

  /*
    FIX — submitPick (complete rewrite):
    ────────────────────────────────────────────────────────────────────────────
    OLD BUG: optimistic local state update then navigate away. On next
    reloadShared (triggered by sc change), Firebase returned the data with
    potentially coerced keys — normalizeAP dropped them — picks vanished.

    NEW APPROACH:
    1. Atomic write via DB.setUserPick (single path, no read-modify-write)
    2. Re-fetch the ENTIRE ap subtree from Firebase immediately after write
    3. normalizeAP the fresh data (converts coerced integer keys to strings)
    4. Set both myPicks and allPicks from the normalised result
    5. Only THEN navigate away — UI reflects what Firebase actually stored

    This guarantees that double-header picks (e.g. M17 then M18) are both
    visible immediately after each submission because we re-read what Firebase
    actually stored, not what we optimistically assumed it stored.
    ────────────────────────────────────────────────────────────────────────────
  */
  async function submitPick(){
    if(!am)return;
    if(getP(myPicks,am.id)){toast2("Prediction already locked — no edits allowed","error");return;}

    // Re-check lock state from fresh DB data
    const freshRm=await DB.get("rm")||{};
    const freshMatch={...am,...(freshRm[am.id]??freshRm[String(am.id)]??{})};
    if(isMatchLocked(freshMatch,lockedMatches)){
      toast2("Match is now locked","error");
      setAm(null);setSc("home");
      return;
    }

    if(!draft.toss||!draft.win||!draft.motm||!draft.sb){toast2("Fill all 4 prediction fields","error");return;}
    if(BONUS_QUESTIONS[am.id]&&draft.bqAns===null){toast2("Answer the bonus question too","error");return;}

    const sid=String(am.id); // Always string — never numeric
    const pick={toss:draft.toss,win:draft.win,motm:draft.motm,sb:draft.sb||""};

    // Atomic single-path write
    const ok=await DB.setUserPick(myEk,sid,pick);
    if(!ok){toast2("Save failed, try again","error");return;}

    // Save bonus answer alongside pick
    if(BONUS_QUESTIONS[am.id]&&draft.bqAns!==null){
      await submitBonusPick(am.id,draft.bqAns);
    }

    // FIX: Re-fetch from Firebase immediately to get the authoritative normalised state
    // This is the critical step that prevents ghost picks on double-header days
    const freshAPRaw=await DB.get("ap");
    const freshAP=normalizeAP(freshAPRaw);
    setMyPicks(freshAP[myEk]||{});
    setAllPicks(freshAP);

    toast2("Prediction locked! 🎯","ok");
    setAm(null);
    setSc("home");
  }

  async function reactFn(mid,key){const mr=rxns[mid]||{},list=mr[key]||[];const upd={...rxns,[mid]:{...mr,[key]:list.includes(email)?list.filter(e=>e!==email):[...list,email]}};setRxns(upd);await DB.set("rx",upd);}
  async function sendChat(){if(!chatIn.trim()||!user)return;if(chatMuted){toast2("Chat is muted","error");return;}if((mutedUsers||{})[myEk]){toast2("You have been muted","error");return;}const text=chatIn.trim().slice(0,CHAT_MAX);const latest=await DB.get("ch")||[];const nc=capChat([...latest,{id:Date.now(),email:user.email,name:user.name,text,ts:Date.now()}]);setChat(nc);setChatIn("");await DB.set("ch",nc);setChatSeenTs(Date.now());}
  async function delMsg(id){const latest=await DB.get("ch")||[];const nc=latest.filter(m=>m.id!==id);setChat(nc);await DB.set("ch",nc);}

  async function savePartialResult(mid,field,value){
    const numMid=Number(mid)||mid;
    const rm=(await DB.get("rm"))||{};
    const existing=rm[numMid]||{};
    const{result:_r,...existingFlat}=existing;
    const updated={...existingFlat,[field]:value};
    rm[numMid]=updated;
    await DB.set("rm",rm);
    setMs(prev=>prev.map(m=>Number(m.id)===Number(mid)?applyRmEntry(m,updated):m));
    toast2("Saved ✓","ok");
  }

  // FIX: accepts overrideResult directly to avoid stale closure from admResultForm state
  async function setManualResult(mid,overrideResult){
    const f=overrideResult??admResultForm[mid];
    if(!f?.toss||!f?.win||!f?.motm){toast2("Fill all result fields","error");return;}
    const result={toss:f.toss,win:f.win,motm:f.motm};
    const numMid=Number(mid)||mid;
    const rm=(await DB.get("rm"))||{};
    rm[numMid]={toss:result.toss,win:result.win,motm:result.motm,status:"completed"};
    await DB.set("rm",rm);
    const nm=ms.map(m=>Number(m.id)===Number(mid)?{...m,result,_partial:null,status:"completed"}:m);
    setMs(nm);
    setAdmResultForm(prev=>{const n={...prev};delete n[mid];return n;});
    const freshAP=normalizeAP(await DB.get("ap")||{});
    const matchObj=nm.find(x=>Number(x.id)===Number(mid));
    const latest=await DB.get("ch")||[];
    const trashMsg=generateTrashTalk(result,matchObj,freshAP);
    const bonusAnsSet=bonusAnswers[String(numMid)]??bonusAnswers[numMid];
    const bonusQ=BONUS_QUESTIONS[Number(numMid)];
    const bonusLine=bonusQ&&bonusAnsSet!=null?`\n❓ Bonus Q: "${bonusQ.slice(0,60)}..."\n✅ Answer: ${bonusAnsSet?"YES":"NO"} (+${PTS.bonus}pts for correct)`:"";
    const newCh=capChat([...latest,{id:Date.now(),email:"__sys__",name:"IPL Bot",text:trashMsg+bonusLine,ts:Date.now(),sys:true}]);
    setChat(newCh);await DB.set("ch",newCh);
    toast2("Result saved! ✅","ok");
    await reloadShared(email);
  }

  /*
    Admin manual pick save — called by AdminManualPickPanel.
    Uses the same atomic DB.setUserPick path to avoid any key coercion.
    Works on locked matches and completed matches (admin override).
  */
  async function adminSavePick(targetEmail,match,pick,bqAns){
    const targetEmk=ek(targetEmail);
    const sid=String(match.id);
    const ok=await DB.setUserPick(targetEmk,sid,{toss:pick.toss,win:pick.win,motm:pick.motm,sb:pick.sb||""});
    if(!ok){toast2("Save failed","error");return false;}
    // Save bonus answer if provided
    if(BONUS_QUESTIONS[match.id]&&bqAns!==null&&bqAns!==undefined){
      const bqPath="bq/"+targetEmk+"/"+sid;
      await DB.set(bqPath,bqAns);
      const freshBQ=normalizeKeyMap(await DB.get("bq")||{});
      setAllBonusPicks(freshBQ);
      if(targetEmail===email)setMyBonusPicks(freshBQ[myEk]||{});
    }
    // Re-fetch and normalise to update local state
    const freshAPRaw=await DB.get("ap");
    const freshAP=normalizeAP(freshAPRaw);
    setAllPicks(freshAP);
    if(targetEmail===email){setMyPicks(freshAP[myEk]||{});}
    const targetName=Object.values(users).find(u=>u.email===targetEmail)?.name||targetEmail;
    toast2("✅ Pick saved for "+targetName,"ok");
    return true;
  }

  async function adminSaveSeasonData(targetEmail,type,data){
    const targetEmk=ek(targetEmail);
    const targetName=Object.values(users).find(u=>u.email===targetEmail)?.name||targetEmail;
    if(type==="champion"){
      const upd={...spk,[targetEmk]:data};setSpk(upd);await DB.set("sp",upd);
      if(targetEmail===email)setMySp(data);
      toast2("✅ Champion saved for "+targetName,"ok");
    }else if(type==="top4"){
      const upd={...t4pk,[targetEmk]:data};setT4pk(upd);await DB.set("t4",upd);
      if(targetEmail===email)setMyT4(data);
      toast2("✅ Top 4 saved for "+targetName,"ok");
    }else if(type==="props"){
      const upd={...allPropBets,[targetEmk]:data};setAllPropBets(upd);await DB.set("propbets/"+targetEmk,data);
      if(targetEmail===email)setMyPropBets(data);
      toast2("✅ Prop bets saved for "+targetName,"ok");
    }
  }

  /*
    Admin repair all picks — re-normalises every key in the ap subtree.
    Use this button any time picks look wrong or after a double-header day.
  */
  const repairRunning=useRef(false);
  async function adminRepairDB(){
    if(repairRunning.current)return; // rate-limit guard
    repairRunning.current=true;
    setRepairLoading(true);
    try{
      await forceRepair();
      await reloadShared(email);
      toast2("✅ DB repaired & reloaded","ok");
    }catch(e){
      console.error("adminRepairDB",e);
      toast2("Repair failed — check console","error");
    }
    setRepairLoading(false);
    repairRunning.current=false;
  }

  // Undo/clear a finalised result so admin can re-enter it
  async function undoResult(mid){
    if(!confirm("This will clear the result for this match and allow re-entry. Continue?"))return;
    const numMid=Number(mid)||mid;
    const rm=(await DB.get("rm"))||{};
    delete rm[numMid];
    await DB.set("rm",rm);
    setMs(prev=>prev.map(m=>Number(m.id)===Number(mid)?{...m,result:null,_partial:null}:m));
    setAdmResultForm(prev=>{const n={...prev};delete n[mid];return n;});
    toast2("Result cleared — re-enter below","ok");
  }

  async function deleteUser(ue){if(!confirm("Delete "+users[ue]?.name+"?"))return;const uek=ek(ue);const nu={...users};delete nu[ue];delete nu[uek];const na={...allPicks};delete na[uek];const ns={...spk};delete ns[uek];const nt={...t4pk};delete nt[uek];const np={...manualPtsAdj};delete np[uek];const nmpo={...matchPtsOverride};delete nmpo[uek];setUsers(nu);setAllPicks(na);setSpk(ns);setT4pk(nt);setManualPtsAdj(np);setMatchPtsOverride(nmpo);await Promise.all([DB.set("u",nu),DB.set("ap",na),DB.set("sp",ns),DB.set("t4",nt),DB.set("ptsadj",np),DB.set("pw_"+uek,null),DB.set("token_"+uek,null),DB.set("matchptsoverride",nmpo)]);setExU(null);toast2("User deleted","ok");}
  async function sendBc(pin=false){if(!bcMsg.trim())return;const nb=[...bc,{id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"}];setBc(nb);await DB.set("bc",nb);if(pin){setPinnedBc(bcMsg.trim());await DB.set("pinnedbc",bcMsg.trim());}setBcMsg("");toast2(pin?"📌 Pinned!":"Sent!","ok");}
  async function clearPin(){setPinnedBc(null);await DB.set("pinnedbc",null);toast2("Pin cleared");}
  async function addManualMatch(){const{mn,home,away,date,time,venue}=manMatchForm;if(!mn||!home||!away||!date||!time){toast2("Fill all fields","error");return;}if(home===away){toast2("Teams must differ","error");return;}const pt=time.length===4?"0"+time:time;const existing=await DB.get("manmatches")||[];const nm={id:Date.now(),mn:mn.trim(),home,away,date,time:pt,venue:venue||"Custom Venue",result:null,_partial:null,manual:true};await DB.set("manmatches",[...existing,nm]);setMs(prev=>[...prev,nm]);setManMatchForm({mn:"",home:"RCB",away:"MI",date:"",time:"19:30",venue:""});toast2("Match added!","ok");}
  async function toggleMatchLock(mid){const cur=lockedMatches[mid]??lockedMatches[String(mid)];const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";const upd={...lockedMatches};if(next===null)delete upd[mid];else upd[mid]=next;setLockedMatches(upd);await DB.set("lockedm",upd);toast2(next==="locked"?"🔒 Locked":next==="unlocked"?"🔓 Unlocked":"↩️ Auto");}
  async function adjustPts(em,delta){const emk=ek(em);const cur=manualPtsAdj[emk]||0;const upd={...manualPtsAdj,[emk]:cur+delta};setManualPtsAdj(upd);await DB.set("ptsadj",upd);toast2((delta>0?"+":"")+delta+" pts","ok");}
  async function setMatchPts(em,mid,delta){const emk=ek(em);const cur=((matchPtsOverride[emk]||{})[mid])||0;const upd={...matchPtsOverride,[emk]:{...(matchPtsOverride[emk]||{}),[mid]:cur+delta}};setMatchPtsOverride(upd);await DB.set("matchptsoverride",upd);toast2((delta>0?"+":"")+delta+" pts","ok");}
  async function setSeasonWinner(t){setSw(t);await DB.set("sw",t);toast2("Champion: "+t+" 🏆","ok");}
  async function toggleMaintenance(v){setMaintenance(v);await DB.set("maintenance",v);toast2(v?"🔒 App locked":"✅ App live","ok");}
  async function submitBonusPick(mid,ans){
    const sid=String(mid);
    const upd={...myBonusPicks,[sid]:ans};
    setMyBonusPicks(upd);
    const allUpd={...allBonusPicks,[myEk]:{...(allBonusPicks[myEk]||{}),[sid]:ans}};
    setAllBonusPicks(allUpd);
    await DB.set("bq/"+myEk+"/"+sid,ans);
    toast2(ans?"Bonus: Yes locked 👍":"Bonus: No locked 👎","ok");
  }
  async function savePropBets(props){
    setMyPropBets(props);
    const allUpd={...allPropBets,[myEk]:props};
    setAllPropBets(allUpd);
    await DB.set("propbets/"+myEk,props);
  }

  function generateTrashTalk(result,matchObj,freshAP){
    const ae=Object.entries(freshAP);
    const allUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false);
    const sidStr=String(matchObj.id);
    const tA=!isNR(result.toss),wA=!isNR(result.win),mA=!isNR(result.motm);
    const avail=[tA,wA,mA].filter(Boolean).length;
    const getUserName=emk=>allUsers.find(u=>ek(u.email)===emk)?.name||emk;
    const perfs=ae.filter(([emk])=>{
      const p=(freshAP[emk]||{})[sidStr];if(!p)return false;
      const correct=[tA&&p.toss===result.toss,wA&&p.win===result.win,mA&&motmMatch(p.motm,result.motm)].filter(Boolean).length;
      return avail>0&&correct===avail;
    }).map(([emk])=>getUserName(emk));
    const zeros=ae.filter(([emk])=>{
      const p=(freshAP[emk]||{})[sidStr];if(!p)return false;
      return tA&&wA&&mA&&p.toss!==result.toss&&p.win!==result.win&&!motmMatch(p.motm,result.motm);
    }).map(([emk])=>getUserName(emk));
    const winPickers=ae.filter(([emk])=>(freshAP[emk]||{})[sidStr]?.win===result.win);
    const lone=wA&&winPickers.length===1?getUserName(winPickers[0][0]):null;
    const mn=matchObj.mn+": "+matchObj.home+" vs "+matchObj.away;
    const tmpl=TRASH_TALK[Math.floor(Math.random()*TRASH_TALK.length)];
    return tmpl(perfs,zeros,lone,mn);
  }

  function exportCSV(){const lb=getLb();const rows=[["Rank","Name","Email","Points","Accuracy","Champion","Top4"].join(","),...lb.map((u,i)=>[i+1,'"'+u.name+'"',u.email,u.pts,u.acc+"%",u.userSp||"",(u.userT4||[]).join("|")].join(","))];const blob=new Blob([rows.join("\n")],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ipl26_leaderboard.csv";a.click();URL.revokeObjectURL(url);toast2("CSV exported!","ok");}
  function exportPicksCSV(){
    const playableMs=ms.filter(m=>!isTBD(m)&&TEAMS.includes(m.home)&&TEAMS.includes(m.away)).sort((a,b)=>Number(a.id)-Number(b.id));
    const users2=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
    const hdr2=["Name","Email",...playableMs.flatMap(m=>[m.mn+"_toss",m.mn+"_win",m.mn+"_potm"])];
    const rows=[hdr2.join(","),...users2.map(u=>{
      const emk=ek(u.email);
      const picks=allPicks[emk]||{};
      const cells=playableMs.flatMap(m=>{const p=getP(picks,m.id);return[p?.toss||"",p?.win||"",p?.motm?.split(" ").slice(-1)[0]||""];});
      return['"'+u.name+'"',u.email,...cells].join(",");
    })];
    const blob=new Blob([rows.join("\n")],{type:"text/csv"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ipl26_all_picks.csv";a.click();URL.revokeObjectURL(url);
    toast2("All picks exported!","ok");
  }
  async function toggleReminder(mid){const upd={...reminders,[mid]:!reminders[mid]};setReminders(upd);await DB.set("rms",upd);toast2(upd[mid]?"🔔 Reminder set":"🔕 Reminder off");}

  const cardProps={myPicks,allPicks,rxns,doubleMatch,lockedMatches,matchPtsOverride,email,allMs:ms,onReact:reactFn,
    bonusAnswers,myBonusPicks,allBonusPicks,scoreBandAnswers,
    onBonusPick:submitBonusPick,
    onReveal:(m)=>setRevealMatchId(m.id),
    onPredict:(m)=>{
      if(getP(myPicks,m.id)){toast2("Prediction already locked — no edits allowed","error");return;}
      setAm(m);setDraft({toss:"",win:"",motm:"",sb:"",bqAns:null});setSc("picks");
    }
  };

  const navItems=isAdmin
    ?[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","My Game"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"],["adm","⚙️","Admin"]]
    :[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","My Game"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"]];

  const hdr=useMemo(()=><div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"13px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
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
  </div>,[myPts,isAdmin,maintenance,user]);// eslint-disable-line

  /* ════════ SCREENS ════════ */
  if(sc==="splash")return<div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f2456,#1D428A,#2a5bbf)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 20px"}}><style>{CSS}</style><img src={LOGOS.IPL} alt="IPL" style={{width:90,marginBottom:16}} onError={e=>{e.target.style.display="none";}}/><p className="C" style={{fontSize:30,fontWeight:800,color:"#fff",letterSpacing:3,margin:0}}>FANTASY PREDICTOR</p><p style={{color:"#FFE57F",fontSize:12,letterSpacing:4,marginTop:6,marginBottom:28,textTransform:"uppercase"}}>TATA IPL 2026</p><div style={{display:"flex",gap:14,marginBottom:14,justifyContent:"center"}}>{["RCB","MI","CSK","KKR","SRH"].map((t,i)=><div key={t} style={{animation:`fadeIn .4s ease ${i*.08}s both`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><TLogo t={t} sz={38}/></div><span style={{color:"rgba(255,255,255,.7)",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>{t}</span></div>)}</div><div style={{display:"flex",gap:14,marginBottom:36,justifyContent:"center"}}>{["RR","PBKS","GT","LSG","DC"].map((t,i)=><div key={t} style={{animation:`fadeIn .4s ease ${(i+5)*.08}s both`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><TLogo t={t} sz={38}/></div><span style={{color:"rgba(255,255,255,.7)",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>{t}</span></div>)}</div><div style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.6)",fontSize:12}}><span className="spin" style={{fontSize:16}}>⚙</span> Loading…</div></div>;

  if(sc==="pending_approval")return<div className="app"><style>{CSS}</style><div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}><span style={{fontSize:52,marginBottom:16}}>⏳</span><p className="C" style={{color:"#1D428A",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>PENDING APPROVAL</p><p style={{color:"#64748b",fontSize:14,marginTop:12,lineHeight:1.6}}>Your registration is awaiting admin approval.</p><button onClick={()=>setSc("login")} style={{marginTop:28,padding:"12px 28px",borderRadius:10,background:"linear-gradient(135deg,#1D428A,#2a5bbf)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>← Back to Sign In</button></div></div>;

  if(sc==="login")return<div className="app"><style>{CSS}</style><div style={{background:"linear-gradient(160deg,#0f2456,#1D428A,#2a5bbf)",padding:"32px 24px 28px",textAlign:"center"}}><img src={LOGOS.IPL} alt="IPL" style={{width:60,marginBottom:10}} onError={e=>{e.target.style.display="none";}}/><p className="C" style={{fontSize:24,fontWeight:800,letterSpacing:2,color:"#fff",margin:0}}>FANTASY PREDICTOR</p><p style={{color:"#FFE57F",fontSize:10,letterSpacing:3,marginTop:4,textTransform:"uppercase"}}>TATA IPL 2026</p><div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14,flexWrap:"wrap"}}>{TEAMS.map(t=><TLogo key={t} t={t} sz={22}/>)}</div><div style={{display:"flex",gap:0,marginTop:16,background:"rgba(255,255,255,.1)",borderRadius:12,padding:3}}>{[["login","Sign In"],["register","Register"],["forgot","Reset PW"]].map(([m,l])=><button key={m} onClick={()=>{setAuthMode(m);clearAuthForm();}} style={{flex:1,padding:"8px 4px",borderRadius:9,background:authMode===m?"#fff":"transparent",color:authMode===m?"#1D428A":"rgba(255,255,255,.7)",fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:10,border:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:.5}}>{l}</button>)}</div></div><div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>{authMode==="login"&&<><div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off" autoCorrect="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showPw?"text":"password"} value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{paddingRight:48}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button></div>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doLogin}>{authLoading?"Signing in…":"Sign In"}</button><p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>No account? <button onClick={()=>{setAuthMode("register");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:11,cursor:"pointer",fontWeight:600}}>Create one →</button></p></>}{authMode==="register"&&<><div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#1e40af"}}>🔒 New accounts require admin approval.</div><div><input className={"inp"+(authErrors.name?" err":"")} value={authName} onChange={e=>{setAuthName(e.target.value);setAuthErrors(p=>({...p,name:""}));}} placeholder="Full name"/>{authErrors.name&&<p className="ferr">{authErrors.name}</p>}</div><div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off" autoCorrect="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showPw?"text":"password"} value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="Password" style={{paddingRight:48}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw?"🙈":"👁"}</button></div><p style={{color:"#94a3b8",fontSize:10,marginTop:4}}>Min 8 chars · uppercase · number · special char</p>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw2?" err":"")} type={showPw2?"text":"password"} value={authPw2} onChange={e=>{setAuthPw2(e.target.value);setAuthErrors(p=>({...p,pw2:""}));}} placeholder="Confirm password" style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&doRegister()}/><button onClick={()=>setShowPw2(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showPw2?"🙈":"👁"}</button></div>{authErrors.pw2&&<p className="ferr">{authErrors.pw2}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doRegister}>{authLoading?"Submitting…":"Submit for Approval"}</button><p style={{color:"#94a3b8",fontSize:11,textAlign:"center"}}>Already registered? <button onClick={()=>{setAuthMode("login");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:11,cursor:"pointer",fontWeight:600}}>Sign in →</button></p></>}{authMode==="forgot"&&<>{forgotStep===1&&<><div style={{background:"#EBF0FA",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#1e40af"}}>Enter your registered email to reset your password.</div><div><input className={"inp"+(authErrors.email?" err":"")} value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErrors(p=>({...p,email:""}));}} placeholder="Email address" autoCapitalize="off"/>{authErrors.email&&<p className="ferr">{authErrors.email}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doForgotStep1}>{authLoading?"Checking…":"Verify Email"}</button></>}{forgotStep===2&&<><div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#166534"}}>✅ Verified: <b>{authEmail}</b></div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw?" err":"")} type={showForgotPw?"text":"password"} value={forgotNewPw} onChange={e=>{setForgotNewPw(e.target.value);setAuthErrors(p=>({...p,pw:""}));}} placeholder="New password" style={{paddingRight:48}}/><button onClick={()=>setShowForgotPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showForgotPw?"🙈":"👁"}</button></div>{authErrors.pw&&<p className="ferr">{authErrors.pw}</p>}</div><div><div style={{position:"relative"}}><input className={"inp"+(authErrors.pw2?" err":"")} type={showForgotPw2?"text":"password"} value={forgotNewPw2} onChange={e=>{setForgotNewPw2(e.target.value);setAuthErrors(p=>({...p,pw2:""}));}} placeholder="Confirm new password" style={{paddingRight:48}} onKeyDown={e=>e.key==="Enter"&&doForgotStep2()}/><button onClick={()=>setShowForgotPw2(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:18}}>{showForgotPw2?"🙈":"👁"}</button></div>{authErrors.pw2&&<p className="ferr">{authErrors.pw2}</p>}</div><button className="pbtn" disabled={authLoading} onClick={doForgotStep2}>{authLoading?"Saving…":"Set New Password"}</button><button onClick={()=>{setForgotStep(1);setForgotNewPw("");setForgotNewPw2("");setAuthErrors({});}} style={{background:"none",border:"none",color:"#94a3b8",fontSize:12,cursor:"pointer"}}>← Back</button></>}<button onClick={()=>{setAuthMode("login");clearAuthForm();}} style={{background:"none",border:"none",color:"#1D428A",fontSize:13,cursor:"pointer",fontWeight:600,marginTop:4}}>← Back to Sign In</button></>}</div>{toast&&<Tst t={toast}/>}</div>;

  if(sc==="onboard")return<div className="app" style={{minHeight:"100vh"}}><style>{CSS}</style>
    <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"24px 20px 20px"}}>
      <p style={{color:"#bfdbfe",fontSize:12,margin:0}}>Welcome, {user?.name}! One-time setup</p>
      <p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:1,margin:"4px 0 0"}}>{obStep===0?"PICK YOUR CHAMPION":obStep===1?"PICK YOUR TOP 4":"SEASON PROP BETS"}</p>
      <div style={{display:"flex",gap:6,marginTop:12}}>{[0,1,2].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:obStep>=i?"#FFE57F":"rgba(255,255,255,.2)"}}/>)}</div>
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
        <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>Select exactly 4 teams · {obT4.length}/4</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>{TEAMS.map(t=>{const sel=obT4.includes(t);return<button key={t} className={"ot"+(sel?" on":"")} onClick={()=>{if(sel)setObT4(p=>p.filter(x=>x!==t));else if(obT4.length<4)setObT4(p=>[...p,t]);else toast2("Max 4 teams","error");}}><TLogo t={t} sz={38}/><span style={{fontSize:11,fontWeight:700,color:sel?"#1D428A":"#475569"}}>{t}</span>{sel&&<span style={{fontSize:9,background:"#1D428A",color:"#fff",borderRadius:8,padding:"1px 6px"}}>{obT4.indexOf(t)+1}</span>}</button>;})}</div>
        <button style={{width:"100%",padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",marginBottom:10}} onClick={()=>updateObStep(0,obSp,obT4)}>← Back</button>
        <button className="lbtn" disabled={obT4.length!==4} onClick={()=>updateObStep(2,obSp,obT4)} style={{opacity:obT4.length===4?1:.4}}>Next → Season Prop Bets</button>
      </>}
      {obStep===2&&<>
        <p style={{color:"#1a2540",fontSize:15,fontWeight:600,margin:"0 0 4px"}}>5 season-long prop bets</p>
        <p style={{color:"#64748b",fontSize:12,margin:"0 0 4px"}}>Each correct answer = <b style={{color:"#1D428A"}}>+{PTS.prop}pts</b>. Set once — locked for the season.</p>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}>
          {PROP_QUESTIONS.map((q,i)=>{
            const filled=!!(obProps[q.id]&&obProps[q.id]!=="");
            return<div key={q.id} style={{flex:1,height:4,borderRadius:2,background:filled?"#1D428A":"#e2e8f0"}}/>;
          })}
          <span style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap",fontWeight:600,marginLeft:4}}>
            {PROP_QUESTIONS.filter((q,i)=>obProps[`q${i}`]&&obProps[`q${i}`]!=="").length}/5 answered
          </span>
        </div>
        {PROP_QUESTIONS.map((q,i)=>{
          const val=obProps[q.id]||"";
          const filled=!!(val&&val!=="");
          return<div key={q.id} style={{background:filled?"#f0fdf4":"#f8faff",border:"1px solid "+(filled?"#bbf7d0":"#e2e8f0"),borderRadius:10,padding:"12px 14px",marginBottom:10,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <p style={{fontSize:12,fontWeight:700,color:"#1D428A",margin:0}}>Q{i+1} · +{PTS.prop}pts</p>
              {filled&&<span style={{fontSize:10,color:"#15803d",fontWeight:700}}>✓ Answered</span>}
              {!filled&&<span style={{fontSize:10,color:"#ef4444",fontWeight:600}}>Required</span>}
            </div>
            <p style={{fontSize:13,color:"#1a2540",fontWeight:600,margin:"0 0 10px",lineHeight:1.4}}>{q.label}</p>
            {q.type==="player"&&<div className="dd-wrap"><select className="sel" value={val} onChange={e=>setObProps(p=>({...p,[q.id]:e.target.value}))} style={{borderColor:filled?"#bbf7d0":"#e2e8f0"}}><option value="">Select player…</option>{ALL_PLAYERS.map(({p,t})=><option key={p+t} value={p}>{p} ({t})</option>)}</select></div>}
            {q.type==="team"&&<select className="sel" value={val} onChange={e=>setObProps(p=>({...p,[q.id]:e.target.value}))} style={{borderColor:filled?"#bbf7d0":"#e2e8f0"}}><option value="">Select team…</option>{TEAMS.map(t=><option key={t} value={t}>{TF[t]}</option>)}</select>}
            {q.type==="yesno"&&<div style={{display:"flex",gap:8}}><button className={"bq-btn yes"+(val==="true"?" on":"")} onClick={()=>setObProps(p=>({...p,[q.id]:"true"}))}>✅ Yes</button><button className={"bq-btn no"+(val==="false"?" on":"")} onClick={()=>setObProps(p=>({...p,[q.id]:"false"}))}>❌ No</button></div>}
          </div>;
        })}
        <button style={{width:"100%",padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:15,textTransform:"uppercase",marginBottom:10}} onClick={()=>updateObStep(1,obSp,obT4)}>← Back</button>
        <button className="lbtn"
          disabled={PROP_QUESTIONS.some((q,i)=>!obProps[`q${i}`]||obProps[`q${i}`]==="")}
          onClick={doneOnboard}
          style={{opacity:PROP_QUESTIONS.every((q,i)=>obProps[`q${i}`]&&obProps[`q${i}`]!=="")?"1":".4"}}>
          Lock All Picks — Let's Play! 🏏
        </button>
      </>}
    </div>
    {toast&&<Tst t={toast}/>}
  </div>;

  /* ── STANDALONE PROP BETS SCREEN (for already-onboarded users) ── */
  if(sc==="propbets"){
    const allFilled=PROP_QUESTIONS.every((q,i)=>obProps[`q${i}`]&&obProps[`q${i}`]!=="");
    async function submitStandalonePropBets(){
      const unanswered=PROP_QUESTIONS.filter((q,i)=>!obProps[`q${i}`]||obProps[`q${i}`]==="");
      if(unanswered.length>0){toast2("Answer all "+unanswered.length+" of 5 prop bet questions","error");return;}
      await savePropBets(obProps);
      propBetsSkipped.current=true; // mark as done so effect doesn't redirect again
      setSc("home");toast2("Prop bets locked! Good luck 🏏","ok");
    }
    return<div className="app" style={{minHeight:"100vh",paddingBottom:68}}><style>{CSS}</style>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"24px 20px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <button onClick={()=>{propBetsSkipped.current=true;setSc("home");}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:13,cursor:"pointer",borderRadius:8,padding:"4px 10px",fontFamily:"'Barlow',sans-serif"}}>← Skip for now</button>
          <span style={{color:"rgba(255,255,255,.5)",fontSize:12}}>({PROP_QUESTIONS.filter((q,i)=>obProps[`q${i}`]&&obProps[`q${i}`]!=="").length}/5 answered)</span>
        </div>
        <p style={{color:"#bfdbfe",fontSize:12,margin:0}}>Hey {user?.name} — one more thing!</p>
        <p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:1,margin:"4px 0 0"}}>SEASON PROP BETS</p>
        <p style={{color:"rgba(255,255,255,.65)",fontSize:12,margin:"6px 0 0",lineHeight:1.5}}>These were added after you registered. Answer all 5 to unlock the full +{PTS.prop*5}pts!</p>
      </div>
      <div style={{padding:"20px 16px"}}>
        <div style={{display:"flex",gap:6,marginBottom:16,alignItems:"center"}}>
          {PROP_QUESTIONS.map((q,i)=>{
            const filled=!!(obProps[q.id]&&obProps[q.id]!=="");
            return<div key={q.id} style={{flex:1,height:4,borderRadius:2,background:filled?"#1D428A":"#e2e8f0",transition:"background .3s"}}/>;
          })}
          <span style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap",fontWeight:600,marginLeft:6}}>
            {PROP_QUESTIONS.filter((q,i)=>obProps[`q${i}`]&&obProps[`q${i}`]!=="").length}/5
          </span>
        </div>
        {PROP_QUESTIONS.map((q,i)=>{
          const val=obProps[q.id]||"";
          const filled=!!(val&&val!=="");
          return<div key={q.id} style={{background:filled?"#f0fdf4":"#f8faff",border:"1px solid "+(filled?"#bbf7d0":"#e2e8f0"),borderRadius:10,padding:"12px 14px",marginBottom:10,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <p style={{fontSize:12,fontWeight:700,color:"#1D428A",margin:0}}>Q{i+1} · +{PTS.prop}pts</p>
              {filled?<span style={{fontSize:10,color:"#15803d",fontWeight:700}}>✓ Answered</span>:<span style={{fontSize:10,color:"#ef4444",fontWeight:600}}>Required</span>}
            </div>
            <p style={{fontSize:13,color:"#1a2540",fontWeight:600,margin:"0 0 10px",lineHeight:1.4}}>{q.label}</p>
            {q.type==="player"&&<select className="sel" value={val} onChange={e=>setObProps(p=>({...p,[q.id]:e.target.value}))} style={{borderColor:filled?"#bbf7d0":"#e2e8f0"}}><option value="">Select player…</option>{ALL_PLAYERS.map(({p,t})=><option key={p+t} value={p}>{p} ({t})</option>)}</select>}
            {q.type==="team"&&<select className="sel" value={val} onChange={e=>setObProps(p=>({...p,[q.id]:e.target.value}))} style={{borderColor:filled?"#bbf7d0":"#e2e8f0"}}><option value="">Select team…</option>{TEAMS.map(t=><option key={t} value={t}>{TF[t]}</option>)}</select>}
            {q.type==="yesno"&&<div style={{display:"flex",gap:8}}><button className={"bq-btn yes"+(val==="true"?" on":"")} onClick={()=>setObProps(p=>({...p,[q.id]:"true"}))}>✅ Yes</button><button className={"bq-btn no"+(val==="false"?" on":"")} onClick={()=>setObProps(p=>({...p,[q.id]:"false"}))}>❌ No</button></div>}
          </div>;
        })}
        <button className="lbtn" disabled={!allFilled} onClick={submitStandalonePropBets} style={{opacity:allFilled?1:.4,marginTop:8}}>
          Lock Prop Bets 🔒
        </button>
        {!allFilled&&<p style={{fontSize:11,color:"#94a3b8",marginTop:10,textAlign:"center"}}>Or tap "← Skip for now" above to explore your picks first and come back later.</p>}
      </div>
      {toast&&<Tst t={toast}/>}
      <AppNav sc={sc} setSc={setSc} navItems={navItems} chatU={chatU} pendingCount={pendingCount} setAm={setAm} setChatU={setChatU} setChatSeenTs={setChatSeenTs} setBcSeenTs={setBcSeenTs}/>
    </div>;
  }

  if(sc==="picks"&&am){
    const hasBQ=!!BONUS_QUESTIONS[am.id];
    const bqAnswered=!hasBQ||draft.bqAns!==null;
    const allReady=!!(draft.toss&&draft.win&&draft.motm&&draft.sb&&bqAnswered);
    const maxPts=PTS.toss+PTS.win+PTS.motm+PTS.streak+PTS.scoreBand+(hasBQ?PTS.bonus:0);
    return<div className="app" style={{paddingBottom:32}}><style>{CSS}</style>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",padding:"16px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={()=>{setAm(null);setSc("home");}} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0}}>&#8592;</button>
        <TLogo t={am.home} sz={28}/>
        <div style={{flex:1}}><p className="C" style={{color:"#fff",fontSize:16,fontWeight:800,margin:0}}>{am.home} vs {am.away}</p><p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{am.date} · {am.time} IST</p></div>
        <TLogo t={am.away} sz={28}/>
      </div>
      <div style={{background:"#FFF9E6",padding:"8px 16px",borderBottom:"1px solid #FDE68A"}}><span style={{color:"#92400E",fontSize:12}}>⚠️ Once submitted, predictions are final. No edits allowed.</span></div>
      <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:18}}>

        {/* Q1 + Q2: Toss + Winner */}
        {[["TOSS WINNER","toss",PTS.toss],["MATCH WINNER","win",PTS.win]].map(([title,field,pts])=>(
          <div key={field}>
            <p className="st">{title} <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{pts}pts</span></p>
            <div style={{display:"flex",gap:10}}>{[am.home,am.away].map(t=><button key={t} className={"tmbtn"+(draft[field]===t?" on":"")} onClick={()=>setDraft(d=>({...d,[field]:t}))}><TLogo t={t} sz={50}/><p className="C" style={{color:draft[field]===t?"#1D428A":"#64748b",fontSize:14,fontWeight:700,margin:0}}>{t}</p>{draft[field]===t&&<span style={{background:"#1D428A",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:12}}>SELECTED</span>}</button>)}</div>
          </div>
        ))}

        {/* Q3: POTM */}
        <div>
          <p className="st">PLAYER OF THE MATCH <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.motm}pts</span></p>
          <PotmDropdown homeTeam={am.home} awayTeam={am.away} value={draft.motm||""} onChange={v=>setDraft(d=>({...d,motm:v}))}/>
        </div>

        {/* Q4: Score Band */}
        <div>
          <p className="st">FIRST INNINGS SCORE <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.scoreBand}pts</span></p>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 10px",lineHeight:1.5}}>How many runs will the team batting first score?</p>
          <div style={{display:"flex",gap:8}}>
            {SCORE_BANDS.map(band=>(
              <button key={band.id} onClick={()=>setDraft(d=>({...d,sb:d.sb===band.id?"":band.id}))}
                style={{flex:1,padding:"12px 4px",borderRadius:12,border:"2px solid "+(draft.sb===band.id?"#1D428A":"#e2e8f0"),background:draft.sb===band.id?"#EBF0FA":"#f8faff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .15s"}}>
                <span style={{fontSize:24}}>{band.emoji}</span>
                <p className="C" style={{color:draft.sb===band.id?"#1D428A":"#64748b",fontSize:14,fontWeight:800,margin:0,letterSpacing:.5}}>{band.short}</p>
                {draft.sb===band.id&&<span style={{background:"#1D428A",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8}}>SELECTED</span>}
              </button>
            ))}
          </div>
          {draft.sb&&<p style={{fontSize:10,color:"#94a3b8",margin:"6px 0 0",textAlign:"center"}}>Tap again to change selection</p>}
          {!draft.sb&&<p style={{fontSize:10,color:"#ef4444",margin:"6px 0 0",textAlign:"center",fontWeight:600}}>⚠ Required</p>}
        </div>

        {/* Q5: Bonus Question */}
        {hasBQ&&<div>
          <p className="st">BONUS QUESTION <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.bonus}pts</span></p>
          <div style={{background:"#F4F6FB",border:"1px solid "+(draft.bqAns!==null?"#1D428A40":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:8}}>
            <p style={{fontSize:13,color:"#1a2540",fontWeight:600,margin:"0 0 12px",lineHeight:1.5}}>{BONUS_QUESTIONS[am.id]}</p>
            <div style={{display:"flex",gap:8}}>
              <button className={"bq-btn yes"+(draft.bqAns===true?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===true?null:true}))}>✅ Yes</button>
              <button className={"bq-btn no"+(draft.bqAns===false?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===false?null:false}))}>❌ No</button>
            </div>
          </div>
          {draft.bqAns===null&&<p style={{fontSize:10,color:"#ef4444",margin:"4px 0 0",textAlign:"center",fontWeight:600}}>⚠ Required</p>}
          {draft.bqAns!==null&&<p style={{fontSize:10,color:"#94a3b8",margin:"4px 0 0",textAlign:"center"}}>Tap again to change answer</p>}
        </div>}

        {/* Summary */}
        {draft.toss&&draft.win&&draft.motm&&(
          <div style={{background:"#EBF0FA",border:"1px solid #dbeafe",borderRadius:12,padding:"14px 16px"}}>
            <p className="st" style={{marginBottom:12}}>YOUR PREDICTION</p>
            {[["Toss",draft.toss,PTS.toss],["Winner",draft.win,PTS.win],["POTM",draft.motm,PTS.motm]].map(([l,v,p])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:"#64748b",fontSize:13}}>{l}</span>
                <span style={{color:"#1a2540",fontSize:13,fontWeight:600}}>{v} <span className="C" style={{color:"#1D428A",fontSize:11}}>+{p}pts</span></span>
              </div>
            ))}
            {draft.sb&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{color:"#64748b",fontSize:13}}>1st Innings</span>
              <span style={{color:"#1a2540",fontSize:13,fontWeight:600}}>{SCORE_BANDS.find(b=>b.id===draft.sb)?.label} <span className="C" style={{color:"#1D428A",fontSize:11}}>+{PTS.scoreBand}pts</span></span>
            </div>}
            {hasBQ&&draft.bqAns!==null&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{color:"#64748b",fontSize:13}}>Bonus Q</span>
              <span style={{color:"#1a2540",fontSize:13,fontWeight:600}}>{draft.bqAns?"Yes":"No"} <span className="C" style={{color:"#1D428A",fontSize:11}}>+{PTS.bonus}pts</span></span>
            </div>}
            <div style={{borderTop:"1px solid #dbeafe",paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:"#64748b",fontSize:12}}>Max possible</span>
              <span className="C" style={{color:"#1D428A",fontSize:18,fontWeight:800}}>+{maxPts}pts</span>
            </div>
          </div>
        )}

        <button className="lbtn" disabled={!allReady} onClick={submitPick} style={{opacity:allReady?1:.4}}>Lock Prediction 🔒</button>
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

    {sc==="home"&&<>
      {/* Prop bets reminder banner — shows if user skipped the prop bets prompt */}
      {email&&email!==SUPER_ADMIN&&(()=>{
        const emk2=ek(email);
        const userPb=allPropBets[emk2]||{};
        const filled=PROP_QUESTIONS.every((q,i)=>userPb[`q${i}`]&&userPb[`q${i}`]!=="");
        if(filled)return null;
        const answeredCount=PROP_QUESTIONS.filter((q,i)=>userPb[`q${i}`]&&userPb[`q${i}`]!=="").length;
        return<div style={{background:"#FEF3C7",borderBottom:"1px solid #FDE68A",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div>
            <p style={{color:"#92400E",fontSize:12,fontWeight:700,margin:0}}>🔮 Season Prop Bets not answered ({answeredCount}/5)</p>
            <p style={{color:"#B8860B",fontSize:11,margin:"2px 0 0"}}>Miss out on up to +{PTS.prop*5}pts — answer now!</p>
          </div>
          <button onClick={()=>{propBetsSkipped.current=false;setSc("propbets");}} style={{background:"#1D428A",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif"}}>Answer →</button>
        </div>;
      })()}
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
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:14}}><p className="st">MY TOP 4 PICKS</p>{myT4&&myT4.length>0?<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:8,background:"#f8faff",borderRadius:10,padding:"8px 12px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:13,fontWeight:700}}>#{i+1}</span><TLogo t={t} sz={28}/><span className="C" style={{color:"#1D428A",fontSize:14,fontWeight:700}}>{t}</span>{sw&&<span style={{fontSize:13}}>{t===sw?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}</div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px"}}>
            <p className="st">MY SEASON PROP BETS · +{PTS.prop}pts each · {PTS.prop*5}pts total</p>
            {PROP_QUESTIONS.map((q,i)=>{
              const myAns=myPropBets?.[q.id]||"";
              const correctAns=propAnswers?.[q.id]||"";
              const isCorrect=correctAns&&myAns&&String(myAns)===String(correctAns);
              const isWrong=correctAns&&myAns&&String(myAns)!==String(correctAns);
              return<div key={q.id} style={{paddingBottom:10,marginBottom:10,borderBottom:"1px solid #f1f5f9"}}>
                <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 3px"}}>Q{i+1}</p>
                <p style={{fontSize:12,color:"#1a2540",fontWeight:600,margin:"0 0 4px",lineHeight:1.4}}>{q.label}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,color:"#475569"}}>{myAns||<span style={{color:"#94a3b8",fontStyle:"italic"}}>Not answered</span>}</span>
                  {isCorrect&&<span style={{color:"#15803d",fontSize:12,fontWeight:700}}>✅ Correct! +{PTS.prop}pts</span>}
                  {isWrong&&<span style={{color:"#dc2626",fontSize:12,fontWeight:700}}>❌ Wrong (was: {correctAns})</span>}
                  {!correctAns&&myAns&&<span style={{color:"#94a3b8",fontSize:10}}>Result TBD</span>}
                </div>
              </div>;
            })}
            <p style={{fontSize:10,color:"#94a3b8",marginTop:4,textAlign:"center"}}>Admin enters correct answers at season end</p>
          </div>
        </div>}
      </div>
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
          {/* Prop bets row */}
          {(()=>{
            const up2=u.userProps||{};
            const hasSomeProps=PROP_QUESTIONS.some((q,i)=>up2[`q${i}`]&&up2[`q${i}`]!=="");
            if(!hasSomeProps)return<div style={{borderTop:"1px solid #f1f5f9",paddingTop:6,marginTop:4}}><span style={{fontSize:10,color:"#94a3b8",fontStyle:"italic"}}>🔮 Prop bets not yet answered</span></div>;
            const propLabels=["🏅 Orange","💜 Purple","📈 Hi-Total","⚡ Super Over","⬇️ Last"];
            return<div style={{borderTop:"1px solid #f1f5f9",paddingTop:6,marginTop:4}}>
              <p style={{fontSize:9,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 5px"}}>🔮 Season Prop Bets</p>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {PROP_QUESTIONS.map((q,i)=>{
                  const val=up2[`q${i}`]||"";
                  const correctAns=propAnswers?.[`q${i}`]||"";
                  const isCorrect=correctAns&&val&&String(val)===String(correctAns);
                  const isWrong=correctAns&&val&&String(val)!==String(correctAns);
                  const shortVal=q.type==="player"?val.split(" ").slice(-1)[0]:q.type==="yesno"?(val==="true"?"Yes":"No"):val;
                  return<div key={q.id} style={{display:"flex",alignItems:"center",gap:3,background:isCorrect?"#f0fdf4":isWrong?"#fef2f2":"#f8faff",border:"1px solid "+(isCorrect?"#bbf7d0":isWrong?"#fecaca":"#e2e8f0"),borderRadius:6,padding:"2px 6px"}}>
                    <span style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>{propLabels[i]}:</span>
                    <span style={{fontSize:10,fontWeight:700,color:isCorrect?"#15803d":isWrong?"#dc2626":"#1a2540"}}>{shortVal||"—"}</span>
                    {isCorrect&&<span style={{fontSize:9}}>✅</span>}
                    {isWrong&&<span style={{fontSize:9}}>✗</span>}
                  </div>;
                })}
              </div>
            </div>;
          })()}
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
        // Score band pts
        const sbAns2=scoreBandAnswers[String(m.id)]??scoreBandAnswers[Number(m.id)];
        const sbOk2=!!(sbAns2&&p.sb&&p.sb===sbAns2);
        if(sbOk2)base+=PTS.scoreBand;
        // Bonus question per-match pts
        const bqAns3=bonusAnswers[String(m.id)]??bonusAnswers[Number(m.id)];
        const myBQ3=myBonusPicks[String(m.id)];
        const bqOk3=!!(bqAns3!=null&&myBQ3!=null&&myBQ3===bqAns3);
        if(bqOk3)base+=PTS.bonus;
        if(isPerfect){perfect++;streakCur++;streakBest=Math.max(streakBest,streakCur);}else streakCur=0;
        const mOv=((matchPtsOverride[myEk]||{})[m.id])??((matchPtsOverride[myEk]||{})[String(m.id)])??0;
        const pts=(base*mult)+mOv;totalPts+=pts;
        return{m,p,tossOk,winOk,motmOk,isPerfect,pts,mult,mOv,tA,wA,mA,sbOk:sbOk2,sbAns:sbAns2,bqOk:bqOk3,bqAns:bqAns3,myBQ:myBQ3};
      });
      const acc=rows.length?Math.round(rows.filter(r=>r.tossOk||r.winOk||r.motmOk).length/rows.length*100):0;
      const tossAcc=rows.filter(r=>r.tA).length?Math.round(rows.filter(r=>r.tossOk).length/rows.filter(r=>r.tA).length*100):0;
      const winAcc=rows.filter(r=>r.wA).length?Math.round(rows.filter(r=>r.winOk).length/rows.filter(r=>r.wA).length*100):0;
      const motmAcc=rows.filter(r=>r.mA).length?Math.round(rows.filter(r=>r.motmOk).length/rows.filter(r=>r.mA).length*100):0;
      return<div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div><p className="C" style={{color:"#FFE57F",fontSize:20,fontWeight:800,letterSpacing:1,margin:0}}>MY GAME</p><p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{Object.keys(myPicks).length} predictions made</p></div><p className="C" style={{color:"#FFE57F",fontSize:28,fontWeight:800,margin:0}}>{myPts}</p></div>
          <div style={{display:"flex",gap:6}}>{[["🏏",rows.length,"Played"],["⭐",totalPts,"Pts"],["🎯",perfect,"Perfect"],["📊",acc+"%","Acc"]].map(([ic,val,lbl])=><div key={lbl} className="stat-mini"><p style={{fontSize:14,margin:0}}>{ic}</p><p className="C" style={{color:"#FFE57F",fontSize:15,fontWeight:800,margin:"2px 0 0"}}>{val}</p><p style={{color:"rgba(255,255,255,.6)",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p></div>)}</div>
          {rows.length>0&&<>
            <div style={{borderTop:"1px solid rgba(255,255,255,.15)",marginTop:10,paddingTop:10}}>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:9,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 6px"}}>Category Accuracy</p>
              <div style={{display:"flex",gap:6}}>
                {[["🎰",tossAcc+"%","Toss"],["🏆",winAcc+"%","Winner"],["⭐",motmAcc+"%","POTM"]].map(([ic,val,lbl])=><div key={lbl} className="stat-mini"><p style={{fontSize:12,margin:0}}>{ic}</p><p className="C" style={{color:"#FFE57F",fontSize:14,fontWeight:800,margin:"2px 0 0"}}>{val}</p><p style={{color:"rgba(255,255,255,.5)",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p></div>)}
                {streakBest>0&&<div className="stat-mini"><p style={{fontSize:12,margin:0}}>🔥</p><p className="C" style={{color:"#FFE57F",fontSize:14,fontWeight:800,margin:"2px 0 0"}}>{streakBest}</p><p style={{color:"rgba(255,255,255,.5)",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>Best Streak</p></div>}
              </div>
            </div>
          </>}
        </div>
        <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:14,overflow:"hidden"}}>
          {[["pending","Pending ("+pending.length+")"],["played","Results ("+played.length+")"],["upcoming","Schedule"]].map(([t,l])=><button key={t} className={"tbtn"+(ptab===t?" on":"")} onClick={()=>setPtab(t)}>{l}</button>)}
        </div>
        {ptab==="pending"&&(pending.length===0?<div style={{textAlign:"center",padding:"32px 16px"}}><p style={{fontSize:36}}>✅</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No pending predictions.</p></div>:pending.map(m=>{const p=getP(myPicks,m.id);return<div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span><span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>✅ Locked</span></div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><TLogo t={m.home} sz={32}/><span className="C" style={{color:"#94a3b8",fontSize:14,fontWeight:700}}>VS</span><TLogo t={m.away} sz={32}/></div><div style={{background:"#f0fdf4",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#15803d"}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>Your Predictions</p>           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>             {[["🎰 Toss",p?.toss],["🏆 Winner",p?.win],["⭐ POTM",p?.motm?.split(" ").slice(-1)[0]||"—"],["📊 1st Innings",p?.sb?SCORE_BANDS.find(b=>b.id===p.sb)?.short||p.sb:"—"]].map(([l,v])=>(               <div key={l} style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px"}}>                 <p style={{fontSize:9,color:"#64748b",fontWeight:600,margin:0}}>{l}</p>                 <p style={{fontSize:12,fontWeight:700,color:"#1a2540",margin:"2px 0 0"}}>{v||"—"}</p>               </div>             ))}           </div>           {(()=>{const myBQ=myBonusPicks[String(m.id)];return myBQ!=null             ?<div style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px",marginTop:6}}>                 <p style={{fontSize:9,color:"#64748b",fontWeight:600,margin:0}}>❓ Bonus Q</p>                 <p style={{fontSize:12,fontWeight:700,color:"#1a2540",margin:"2px 0 0"}}>{myBQ?"Yes":"No"}</p>               </div>             :null;})()}
                  {p?.sb&&<span> · 📊 {SCORE_BANDS.find(b=>b.id===p.sb)?.short||p.sb}</span>}
                  {(()=>{const myBQ=myBonusPicks[String(m.id)];return myBQ!=null?<span> · ❓ {myBQ?"Yes":"No"}</span>:null;})()}
                </div></div>;}))}{ptab==="played"&&(played.length===0?<div style={{textAlign:"center",padding:"32px 16px"}}><p style={{fontSize:36}}>⏳</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No results yet.</p></div>:[...rows].reverse().map(({m,p,tossOk,winOk,motmOk,isPerfect,pts,mult,tA,wA,mA,sbOk,sbAns,bqOk,bqAns,myBQ})=><div key={m.id} style={{background:"#fff",border:"1px solid "+(isPerfect?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"14px",marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date}</span><div style={{display:"flex",gap:6,alignItems:"center"}}>{isPerfect&&<span style={{fontSize:11}}>🎯 Perfect</span>}{mult>1&&<span style={{background:"#FF822A",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:10,fontWeight:700}}>2×</span>}<span className="C" style={{color:pts>0?"#15803d":"#94a3b8",fontSize:14,fontWeight:700}}>+{pts}pts</span></div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["Toss",p?.toss,m.result?.toss,tossOk,tA],["Win",p?.win,m.result?.win,winOk,wA],["POTM",p?.motm?.split(" ").slice(-1)[0],m.result?.motm?.split(" ").slice(-1)[0],motmOk,mA]].map(([l,pv,rv,ok,avail])=><div key={l} style={{flex:1,minWidth:60,background:!avail?"#f1f5f9":ok?"#f0fdf4":"#fef2f2",borderRadius:8,padding:"6px 8px",textAlign:"center"}}><p style={{fontSize:9,color:"#94a3b8",margin:0,textTransform:"uppercase"}}>{l}</p><p style={{fontSize:11,fontWeight:700,color:!avail?"#94a3b8":ok?"#15803d":"#dc2626",margin:"2px 0 0"}}>{pv||"—"}</p>{!avail?<p style={{fontSize:9,color:"#94a3b8",margin:"1px 0 0"}}>N/A</p>:<p style={{fontSize:9,color:"#94a3b8",margin:"1px 0 0"}}>{ok?"✓":"✗"} {rv||"NR"}</p>}</div>)}{p?.sb&&<div style={{flex:1,minWidth:60,background:sbAns?(sbOk?"#f0fdf4":"#fef2f2"):"#f1f5f9",borderRadius:8,padding:"6px 8px",textAlign:"center"}}><p style={{fontSize:9,color:"#94a3b8",margin:0,textTransform:"uppercase"}}>📊 Band</p><p style={{fontSize:11,fontWeight:700,color:sbAns?(sbOk?"#15803d":"#dc2626"):"#1a2540",margin:"2px 0 0"}}>{SCORE_BANDS.find(b=>b.id===p.sb)?.short||p.sb}</p><p style={{fontSize:9,color:"#94a3b8",margin:"1px 0 0"}}>{sbAns?(sbOk?"✓ +"+PTS.scoreBand:"✗"):"TBD"}</p></div>}{myBQ!=null&&<div style={{flex:1,minWidth:60,background:bqAns!=null?(bqOk?"#f0fdf4":"#fef2f2"):"#f1f5f9",borderRadius:8,padding:"6px 8px",textAlign:"center"}}><p style={{fontSize:9,color:"#94a3b8",margin:0,textTransform:"uppercase"}}>❓ Bonus</p><p style={{fontSize:11,fontWeight:700,color:bqAns!=null?(bqOk?"#15803d":"#dc2626"):"#1a2540",margin:"2px 0 0"}}>{myBQ?"Yes":"No"}</p><p style={{fontSize:9,color:"#94a3b8",margin:"1px 0 0"}}>{bqAns!=null?(bqOk?"✓ +"+PTS.bonus:"✗"):"TBD"}</p></div>}</div></div>))}
        {ptab==="upcoming"&&(schedule.length===0?<div style={{textAlign:"center",padding:"32px 16px"}}><p style={{color:"#94a3b8",fontSize:13}}>No upcoming matches.</p></div>:schedule.map(m=>{
          const hasPick=!!getP(myPicks,m.id);const lk=isMatchLocked(m,lockedMatches);const hasRem=!!reminders[m.id];
          return<div key={m.id} style={{background:"#fff",border:"1px solid "+(hasPick?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time}</span>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {!lk&&<button onClick={()=>toggleReminder(m.id)} title={hasRem?"Cancel reminder":"Set 30-min reminder"} style={{background:hasRem?"#EBF0FA":"#f8faff",border:"1px solid "+(hasRem?"#1D428A":"#e2e8f0"),borderRadius:8,padding:"3px 8px",cursor:"pointer",fontSize:12,color:hasRem?"#1D428A":"#94a3b8"}}>{hasRem?"🔔":"🔕"}</button>}
                {hasPick?<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>✅</span>:lk?<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>🔒</span>:<span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>Pending</span>}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><TLogo t={m.home} sz={26}/><span className="C" style={{color:"#475569",fontSize:12,fontWeight:700}}>{m.home}</span><span className="C" style={{color:"#e2e8f0",fontSize:12,margin:"0 6px"}}>VS</span><span className="C" style={{color:"#475569",fontSize:12,fontWeight:700}}>{m.away}</span><TLogo t={m.away} sz={26}/></div>
            {!hasPick&&!lk&&<button className="pbtn" style={{marginTop:10,fontSize:12,padding:"8px"}} onClick={()=>{setAm(m);setDraft({});setSc("picks");}}>Predict →</button>}
          </div>;
        }))}</div>;
    })()}

    {sc==="chat"&&<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
      <div style={{background:"#fff",padding:"10px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><p style={{fontWeight:700,fontSize:14,color:"#1a2540",margin:0}}>Group Chat</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>{Object.keys(onlineUsers).length} online · {chat.length}/{CHAT_CAP} messages</p></div>
        {chatMuted&&<span style={{background:"#fef2f2",color:"#dc2626",fontSize:11,padding:"3px 8px",borderRadius:8,fontWeight:600}}>🔇 Muted</span>}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 0",display:"flex",flexDirection:"column",gap:10}}>
        {chat.map(msg=>{
          const isMe=msg.email===email,isSys=msg.sys||msg.email==="__sys__";
          return<div key={msg.id} className={"chat-row"+(isSys?" sys":isMe?" me":" them")}>
            {!isMe&&!isSys&&<span style={{fontSize:11,color:"#94a3b8",marginBottom:2,paddingLeft:4}}>{msg.name}</span>}
            <div style={{display:"flex",alignItems:"flex-end",gap:6,flexDirection:isMe?"row-reverse":"row"}}>
              {!isMe&&!isSys&&<Av name={msg.name} sz={22}/>}
              <div className={"bubble"+(isSys?" sys":isMe?" me":" them")}>{msg.text}</div>
              {isAdmin&&!isSys&&<button onClick={()=>delMsg(msg.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#fca5a5",fontSize:12,padding:"0 4px",opacity:.6}}>✕</button>}
            </div>
            <span style={{fontSize:9,color:"#94a3b8",paddingLeft:4}}>{new Date(msg.ts).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}</span>
          </div>;
        })}
        <div ref={chatRef}/>
      </div>
      <div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",gap:10,alignItems:"flex-end"}}>
        <textarea className="inp" value={chatIn} onChange={e=>setChatIn(e.target.value.slice(0,CHAT_MAX))} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder={chatMuted||(mutedUsers||{})[myEk]?"Chat is disabled…":"Type a message…"} disabled={chatMuted||(mutedUsers||{})[myEk]} style={{flex:1,resize:"none",minHeight:42,maxHeight:80}}/>
        <button onClick={sendChat} disabled={!chatIn.trim()||chatMuted||(mutedUsers||{})[myEk]} style={{padding:"10px 16px",borderRadius:10,background:"#1D428A",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:14,flexShrink:0}}>➤</button>
      </div>
    </div>}

    {sc==="wof"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#D4AF37,#F0C060)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#1a2540",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>🌟 WALL OF FAME</p><p style={{color:"#5a4000",fontSize:12,marginTop:4}}>Perfect prediction history</p></div>
      {(()=>{
        const perfs=[];
        done.forEach(m=>{
          const tA=!isNR(m.result.toss),wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
          if(!tA||!wA||!mA)return;
          Object.entries(allPicks).forEach(([emk,up])=>{
            const p=getP(up,m.id);if(!p)return;
            if(p.toss===m.result.toss&&p.win===m.result.win&&motmMatch(p.motm,m.result.motm)){
              const u=Object.values(users).find(u=>ek(u.email)===emk);
              if(u)perfs.push({user:u,match:m});
            }
          });
        });
        if(perfs.length===0)return<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:36}}>🎯</p><p style={{color:"#94a3b8",marginTop:12}}>No perfect predictions yet.</p></div>;
        return perfs.reverse().map(({user:u,match:m},i)=>(
          <div key={i} style={{background:"#fff",border:"1px solid #FDE68A",borderRadius:12,padding:"14px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28}}>🌟</span>
            <Av name={u.name} sz={36}/>
            <div style={{flex:1}}>
              <p style={{fontWeight:700,fontSize:14,color:"#1a2540",margin:0}}>{u.name}</p>
              <p style={{color:"#64748b",fontSize:12,margin:"2px 0 0"}}>{m.mn}: {m.home} vs {m.away} · {m.date}</p>
              <p style={{color:"#B8860B",fontSize:11,margin:"2px 0 0",fontWeight:600}}>Perfect prediction! +{PTS.toss+PTS.win+PTS.motm+PTS.streak}pts</p>
            </div>
          </div>
        ));
      })()}
    </div>}

    {sc==="rules"&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1D428A,#2a5bbf)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:24,fontWeight:800,letterSpacing:2,margin:0}}>HOW TO PLAY</p></div>
      {[
        ["🎯 Points System",`Toss Winner: +${PTS.toss}pts | Match Winner: +${PTS.win}pts | Player of the Match: +${PTS.motm}pts | All 3 Correct (Streak Bonus): +${PTS.streak}pts extra`],
        ["⚡ Double Header",`One match per doubleheader day earns 2× all points including the Bonus Question and Score Band. Watch for the ⚡ badge on match cards.`],
        ["🏆 Season Picks",`Champion Pick: +${PTS.season}pts if correct | Top 4 Picks: +${PTS.top4}pts each team that qualifies. Set once during onboarding — cannot be changed.`],
        ["📊 First Innings Score",`Predict which run band the first batting team will score in. This is compulsory — you cannot lock a prediction without answering it.\n• 📉 150 – 170 runs\n• 📊 171 – 190 runs\n• 💥 190 and above\nCorrect band = +${PTS.scoreBand}pts. Admin enters the correct band in the Results tab after the match.`],
        ["❓ Bonus Question",`Every match has one Yes/No bonus question worth +${PTS.bonus}pts. Answer before the match locks — it appears on each match card. Admin enters the correct answer after the match.`],
        ["🎭 Pick Reveal Theatre",`After a match locks, tap the 🎭 REVEAL PICKS button on any match card to see a cinematic reveal of everyone's picks — with highlights for perfects, 0-scorers, and lone wolf winners.`],
        ["🔮 Season Prop Bets",`5 compulsory season-long questions answered once during onboarding — all must be answered before you can start playing:\n• Orange Cap (most runs): +${PTS.prop}pts\n• Purple Cap (most wickets): +${PTS.prop}pts\n• Highest Team Total: +${PTS.prop}pts\n• Super Over (Yes/No): +${PTS.prop}pts\n• Last Place team: +${PTS.prop}pts\nAdmin enters correct answers at season end. Total potential: +${PTS.prop*5}pts.`],
        ["🔒 Lock Times",`Predictions lock 35 minutes before match start. The Score Band and Bonus Question also lock at the same time. No changes allowed after lock.`],
        ["💡 Group Leans",`After lock (before result): see how the group voted on Toss and Winner. After result: see full pick splits with actual counts.`],
        ["🔔 Match Reminders",`Tap 🔔 on any upcoming match in My Game → Schedule to set a 30-minute reminder before lock.`],
      ].map(([t,d])=>(
        <div key={t} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
          <p style={{fontWeight:700,fontSize:13,color:"#1a2540",margin:"0 0 6px"}}>{t}</p>
          <p style={{color:"#64748b",fontSize:12,lineHeight:1.6,margin:0}}>{d}</p>
        </div>
      ))}
      <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:12,padding:"14px",marginBottom:10}}>
        <p style={{fontWeight:700,fontSize:13,color:"#92400E",margin:"0 0 8px"}}>📊 Full Points Summary</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {[["🎰 Toss correct",`+${PTS.toss}pts`],["🏆 Winner correct",`+${PTS.win}pts`],["⭐ POTM correct",`+${PTS.motm}pts`],["🔥 All 3 correct bonus",`+${PTS.streak}pts`],["📊 Score band correct",`+${PTS.scoreBand}pts`],["❓ Bonus Q correct",`+${PTS.bonus}pts`],["⚡ Double header match","×2 all above"],["🥇 Champion correct",`+${PTS.season}pts`],["🏅 Top 4 team correct",`+${PTS.top4}pts each`],["🔮 Prop bet correct",`+${PTS.prop}pts each`]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,.6)",borderRadius:8,padding:"6px 8px"}}>
              <span style={{fontSize:11,color:"#92400E"}}>{l}</span>
              <span style={{fontSize:12,fontWeight:800,color:"#1D428A",fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>}

    {/* ════════ ADMIN PANEL ════════ */}
    {sc==="adm"&&isAdmin&&<div style={{padding:"16px"}}>
      <div style={{background:"linear-gradient(135deg,#1a2540,#1D428A)",borderRadius:14,padding:"14px",marginBottom:14,textAlign:"center"}}><p className="C" style={{color:"#FFE57F",fontSize:22,fontWeight:800,letterSpacing:2,margin:0}}>⚙️ ADMIN PANEL</p></div>

      {/* Admin tab bar */}
      <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:14,overflow:"auto"}}>
        {[["approvals","✅ Approve"],["manpick","📸 Pick Entry"],["results","📊 Results"],["pickstatus","👁 Pick Status"],["users","👥 Users"],["analytics","📈 Analytics"],["matches","🏏 Matches"],["controls","🎛️ Controls"],["broadcast","📢 Broadcast"]].map(([t,l])=><button key={t} className={"at"+(admTab===t?" on":"")} onClick={()=>setAdmTab(t)}>{l}{t==="approvals"&&pendingCount>0?` (${pendingCount})`:""}</button>)}
      </div>

      {/* ── APPROVALS TAB ── */}
      {admTab==="approvals"&&<div>
        <div className="ac">
          <p className="st">PENDING APPROVALS ({pendingCount})</p>
          {Object.keys(pendingUsers).length===0?<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"16px 0"}}>No pending registrations.</p>:Object.entries(pendingUsers).map(([emk,entry])=>(
            <div key={emk} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
              <Av name={entry.name} sz={36}/>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:13,color:"#1a2540",margin:0}}>{entry.name}</p>
                <p style={{color:"#94a3b8",fontSize:11,margin:0}}>{entry.email}</p>
              </div>
              <button onClick={()=>approveUser(emk)} style={{padding:"6px 12px",borderRadius:8,background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0",cursor:"pointer",fontSize:12,fontWeight:700}}>Approve</button>
              <button onClick={()=>rejectUser(emk)} style={{padding:"6px 12px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:12,fontWeight:700}}>Reject</button>
            </div>
          ))}
        </div>
      </div>}

      {/* ── MANUAL PICK ENTRY TAB ── */}
      {admTab==="manpick"&&<AdminManualPickPanel ms={ms} users={users} allPicks={allPicks} doubleMatch={doubleMatch} onSave={adminSavePick} onSaveSeasonData={adminSaveSeasonData} spk={spk} t4pk={t4pk} allPropBets={allPropBets} allBonusPicks={allBonusPicks} toast2={toast2}/>}

      {/* ── PICK STATUS TAB ── */}
      {admTab==="pickstatus"&&<PickStatusPanel ms={ms} users={users} allPicks={allPicks} doubleMatch={doubleMatch} lockedMatches={lockedMatches} adminEmail={email} scoreBandAnswers={scoreBandAnswers} bonusAnswers={bonusAnswers} allBonusPicks={allBonusPicks}/>}

      {/* ── RESULTS TAB ── */}
      {admTab==="results"&&<div>
        {/* Repair DB button — always visible at top of results */}
        <div className="ac" style={{background:"#EBF0FA",border:"2px solid #1D428A"}}>
          <p className="st">🔧 DB REPAIR TOOL</p>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>Safely re-normalises all pick keys. The fixed code now <b>recovers</b> Firebase-coerced arrays rather than wiping them. Run only when needed — not automatic anymore.</p>
          <button className="pbtn" disabled={repairLoading} onClick={adminRepairDB}>
            {repairLoading?"Repairing…":"🔧 Repair & Reload All Picks"}
          </button>
        </div>
        {ms.filter(m=>!isTBD(m)).sort((a,b)=>Number(a.id)-Number(b.id)).map(m=>(
          <div key={m.id} className="ac">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><p style={{fontWeight:700,fontSize:13,color:"#1a2540",margin:0}}>{m.mn}: {m.home} vs {m.away}</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>{m.date} · {m.time}</p></div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>toggleMatchLock(m.id)} style={{padding:"4px 10px",borderRadius:8,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontSize:11,fontWeight:600}}>
                  {(lockedMatches[m.id]??lockedMatches[String(m.id)])==="locked"?"🔒":((lockedMatches[m.id]??lockedMatches[String(m.id)])==="unlocked"?"🔓":"⏱")}
                </button>
              </div>
            </div>
            {/* Match result: entry form OR done display */}
            {m.result
              ?<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#15803d",marginBottom:8}}>✅ Result: {showVal(m.result.toss)} · {showVal(m.result.win)} · {showVal(m.result.motm)}</div>
              :<div style={{marginBottom:8}}>
                {["toss","win","motm"].map(field=>(
                  <div key={field} style={{marginBottom:8}}>
                    <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 4px",textTransform:"capitalize"}}>{field==="motm"?"Player of the Match":field==="toss"?"Toss Winner":"Match Winner"}</p>
                    {field!=="motm"?<div style={{display:"flex",gap:6}}>
                      {[m.home,m.away,NR].map(v=><button key={v} onClick={()=>savePartialResult(m.id,field,v)}
                        style={{flex:1,padding:"6px 4px",borderRadius:8,background:(m._partial?.[field]===v||admResultForm[m.id]?.[field]===v)?"#1D428A":"#f1f5f9",color:(m._partial?.[field]===v||admResultForm[m.id]?.[field]===v)?"#fff":"#475569",border:"1px solid "+(m._partial?.[field]===v||admResultForm[m.id]?.[field]===v?"#1D428A":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:600}}>
                        {v===NR?"🌧 NR":v}
                      </button>)}
                    </div>:<div>
                      <PotmDropdown homeTeam={m.home} awayTeam={m.away} value={admResultForm[m.id]?.motm||m._partial?.motm||""} onChange={v=>{setAdmResultForm(p=>({...p,[m.id]:{...p[m.id],motm:v}}));savePartialResult(m.id,"motm",v);}}/>
                    </div>}
                  </div>
                ))}
                <button className="pbtn" style={{marginTop:4}} onClick={()=>{
                  const f={toss:m._partial?.toss||admResultForm[m.id]?.toss,win:m._partial?.win||admResultForm[m.id]?.win,motm:m._partial?.motm||admResultForm[m.id]?.motm};
                  if(!f.toss||!f.win||!f.motm){toast2("Select toss, winner and POTM first","error");return;}
                  setManualResult(m.id,f);
                }}>✅ Finalise Result</button>
              </div>
            }

            {/* Q4: Score Band — always visible so admin can enter before or after result */}
            {(()=>{
              const mid3=String(m.id);
              const cur=scoreBandAnswers[mid3];
              async function saveSb(bandId){
                const upd=Object.assign({},scoreBandAnswers);upd[mid3]=bandId;
                setScoreBandAnswers(upd);await DB.set("sbans",upd);toast2("Score band saved","ok");
              }
              async function clearSb(){
                const upd=Object.assign({},scoreBandAnswers);delete upd[mid3];
                setScoreBandAnswers(upd);await DB.set("sbans",upd);toast2("Cleared");
              }
              return<div style={{background:"#F4F6FB",border:"1px solid "+(cur?"#1D428A30":"#e2e8f0"),borderRadius:8,padding:"8px 10px",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <p style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:0}}>📊 Q4 · First Innings Score Band</p>
                  {!cur&&<span style={{fontSize:9,color:"#ef4444",fontWeight:700,marginLeft:"auto"}}>Not set</span>}
                  {cur&&<span style={{fontSize:9,color:"#15803d",fontWeight:700,marginLeft:"auto"}}>✓ Set: {SCORE_BANDS.find(b=>b.id===cur)?.label}</span>}
                </div>
                <div style={{display:"flex",gap:6}}>
                  {SCORE_BANDS.map(band=><button key={band.id} onClick={()=>saveSb(band.id)} style={{flex:1,padding:"7px 4px",borderRadius:8,background:cur===band.id?"#1D428A":"#f1f5f9",color:cur===band.id?"#fff":"#475569",border:"1px solid "+(cur===band.id?"#1D428A":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:700,textAlign:"center"}}>{band.emoji} {band.short}</button>)}
                  {cur&&<button onClick={clearSb} style={{padding:"6px 10px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:11,fontWeight:700}}>✕</button>}
                </div>
              </div>;
            })()}

            {/* Q5: Bonus Question — always visible */}
            {BONUS_QUESTIONS[m.id]&&(()=>{
              const bAns=bonusAnswers[String(m.id)]??bonusAnswers[m.id];
              const mid2=String(m.id);
              async function saveBonusAns(v){
                const upd=Object.assign({},bonusAnswers);upd[mid2]=v;
                setBonusAnswers(upd);await DB.set("bonusans",upd);toast2("Bonus answer saved","ok");
              }
              async function clearBonusAns(){
                const upd=Object.assign({},bonusAnswers);delete upd[mid2];
                setBonusAnswers(upd);await DB.set("bonusans",upd);toast2("Cleared");
              }
              return<div style={{background:"#F4F6FB",border:"1px solid "+(bAns!=null?"#1D428A30":"#e2e8f0"),borderRadius:8,padding:"8px 10px",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <p style={{fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:0}}>❓ Q5 · Bonus Question</p>
                  {bAns==null&&<span style={{fontSize:9,color:"#ef4444",fontWeight:700,marginLeft:"auto"}}>Not set</span>}
                  {bAns!=null&&<span style={{fontSize:9,color:"#15803d",fontWeight:700,marginLeft:"auto"}}>✓ Set: {bAns?"YES":"NO"}</span>}
                </div>
                <p style={{fontSize:11,color:"#1a2540",margin:"0 0 6px",lineHeight:1.4,fontStyle:"italic"}}>{BONUS_QUESTIONS[m.id]}</p>
                <div style={{display:"flex",gap:6}}>
                  {[true,false].map(v=><button key={String(v)} onClick={()=>saveBonusAns(v)} style={{flex:1,padding:"6px",borderRadius:8,background:bAns===v?(v?"#f0fdf4":"#fef2f2"):"#f1f5f9",color:bAns===v?(v?"#15803d":"#dc2626"):"#475569",border:"1px solid "+(bAns===v?(v?"#bbf7d0":"#fecaca"):"#e2e8f0"),cursor:"pointer",fontSize:12,fontWeight:700}}>{v?"✅ YES":"❌ NO"}</button>)}
                  {bAns!=null&&<button onClick={clearBonusAns} style={{padding:"6px 10px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:11,fontWeight:700}}>✕</button>}
                </div>
              </div>;
            })()}

            {m.result&&<button onClick={()=>undoResult(m.id)} style={{marginTop:4,width:"100%",padding:"7px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:11,fontWeight:700}}>↩️ Edit / Undo Result</button>}
          </div>
        ))}
      </div>}

      {/* ── USERS TAB ── */}
      {admTab==="users"&&<div>
        <input className="inp" placeholder="Search users…" value={userSearch} onChange={e=>setUserSearch(e.target.value)} style={{marginBottom:12}}/>
        {Object.values(users).filter(u=>u?.email&&u.approved!==false&&(u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase()))).map(u=>{
          const emk=ek(u.email);const userPicks=allPicks[emk]||{};const pickCount=Object.keys(userPicks).length;
          const open=exU===u.email;
          return<div key={u.email} className="ac" style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setExU(open?null:u.email)}>
              <Av name={u.name} sz={32}/>
              <div style={{flex:1}}><p style={{fontWeight:700,fontSize:13,color:"#1a2540",margin:0}}>{u.name}{u.email===email?" (You)":""}</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>{u.email} · {pickCount} picks</p></div>
              <span style={{color:"#94a3b8",fontSize:12}}>{open?"▲":"▼"}</span>
            </div>
            {open&&<div style={{marginTop:12,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
              <p style={{fontSize:11,color:"#64748b",margin:"0 0 8px"}}>Manual pts adj: <b>{manualPtsAdj[emk]||0}</b></p>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                {[-50,-10,-5,5,10,50].map(d=><button key={d} onClick={()=>adjustPts(u.email,d)} style={{flex:1,padding:"6px 2px",borderRadius:8,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontSize:11,fontWeight:700}}>{d>0?"+":""}{d}</button>)}
              </div>
              <div style={{background:"#f8faff",borderRadius:8,padding:"8px 10px",marginBottom:10}}>
                <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 6px"}}>Per-match bonus pts:</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {ms.filter(m=>m.result&&!isTBD(m)).map(m=>{
                    const cur=((matchPtsOverride[emk]||{})[m.id])??((matchPtsOverride[emk]||{})[String(m.id)])??0;
                    return<div key={m.id} style={{display:"flex",alignItems:"center",gap:4,background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"3px 6px"}}>
                      <span style={{fontSize:9,color:"#64748b",fontWeight:600}}>{m.mn}</span>
                      <button onClick={()=>setMatchPts(u.email,m.id,-5)} style={{background:"#fef2f2",border:"none",borderRadius:4,color:"#dc2626",fontSize:10,cursor:"pointer",padding:"0 3px",fontWeight:700}}>-5</button>
                      <span style={{fontSize:10,fontWeight:700,color:cur>0?"#15803d":cur<0?"#dc2626":"#94a3b8",minWidth:18,textAlign:"center"}}>{cur>0?"+":""}{cur}</span>
                      <button onClick={()=>setMatchPts(u.email,m.id,5)} style={{background:"#f0fdf4",border:"none",borderRadius:4,color:"#15803d",fontSize:10,cursor:"pointer",padding:"0 3px",fontWeight:700}}>+5</button>
                    </div>;
                  })}
                </div>
              </div>
              <div style={{background:"#f8faff",borderRadius:8,padding:"8px 10px",marginBottom:10}}>
                <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 6px"}}>Pick status for all matches:</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {ms.filter(m=>!isTBD(m)).map(m=>{const p=getP(userPicks,m.id);return<div key={m.id} title={m.mn+": "+(p?p.toss+" toss, "+p.win+" win":"No pick")} style={{padding:"2px 6px",borderRadius:6,background:p?"#f0fdf4":m.result?"#fef2f2":"#f1f5f9",border:"1px solid "+(p?"#bbf7d0":m.result?"#fecaca":"#e2e8f0"),fontSize:9,fontWeight:600,color:p?"#15803d":m.result?"#dc2626":"#94a3b8"}}>{m.mn}</div>;})}
                </div>
              </div>
              {u.email!==SUPER_ADMIN&&<button className="dbtn" onClick={()=>deleteUser(u.email)}>🗑 Delete User</button>}
            </div>}
          </div>;
        })}
      </div>}

      {/* ── ANALYTICS TAB ── */}
      {admTab==="analytics"&&(()=>{
        const doneMs=ms.filter(m=>m.result&&!isTBD(m)&&!isNR(m.result.win));
        const ae=Object.entries(allPicks);
        const approvedUsers2=Object.values(users).filter(u=>u?.email&&u.approved!==false);
        // Per-match group accuracy
        const matchStats=doneMs.map(m=>{
          const picks=ae.filter(([,up])=>getP(up,m.id));
          const tot=picks.length||1;
          const tossRight=picks.filter(([,up])=>getP(up,m.id)?.toss===m.result.toss).length;
          const winRight=picks.filter(([,up])=>getP(up,m.id)?.win===m.result.win).length;
          const motmRight=picks.filter(([,up])=>motmMatch(getP(up,m.id)?.motm,m.result.motm)).length;
          const perfect=picks.filter(([,up])=>{const p=getP(up,m.id);return p?.toss===m.result.toss&&p?.win===m.result.win&&motmMatch(p?.motm,m.result.motm);}).length;
          return{m,tot,tossRight,winRight,motmRight,perfect,tossAcc:Math.round(tossRight/tot*100),winAcc:Math.round(winRight/tot*100),motmAcc:Math.round(motmRight/tot*100)};
        }).sort((a,b)=>a.winAcc-b.winAcc); // hardest matches first
        // Biggest upsets (everyone picked wrong winner)
        const upsets=matchStats.filter(s=>s.winAcc<30&&s.tot>=2);
        // Best-predicted matches
        const easiest=matchStats.filter(s=>s.winAcc>=70&&s.tot>=2).reverse();
        // Overall group stats
        const totalPicks2=ae.reduce((s,[,up])=>s+Object.keys(up).length,0);
        const totalPerfects2=doneMs.reduce((s,m)=>{const p=ae.filter(([,up])=>{const pk=getP(up,m.id);return pk?.toss===m.result.toss&&pk?.win===m.result.win&&motmMatch(pk?.motm,m.result.motm);}).length;return s+p;},0);
        const avgTossAcc=matchStats.length?Math.round(matchStats.reduce((s,x)=>s+x.tossAcc,0)/matchStats.length):0;
        const avgWinAcc=matchStats.length?Math.round(matchStats.reduce((s,x)=>s+x.winAcc,0)/matchStats.length):0;
        const avgMotmAcc=matchStats.length?Math.round(matchStats.reduce((s,x)=>s+x.motmAcc,0)/matchStats.length):0;
        return<div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {[["🏏",doneMs.length,"Matches Done"],["🎯",totalPerfects2,"Group Perfects"],["🎰",avgTossAcc+"%","Avg Toss Acc"],["🏆",avgWinAcc+"%","Avg Win Acc"],["⭐",avgMotmAcc+"%","Avg POTM Acc"]].map(([ic,val,lbl])=>(
              <div key={lbl} style={{flex:1,minWidth:60,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                <p style={{fontSize:14,margin:0}}>{ic}</p>
                <p className="C" style={{color:"#1D428A",fontSize:15,fontWeight:800,margin:"2px 0 0"}}>{val}</p>
                <p style={{color:"#64748b",fontSize:8,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p>
              </div>
            ))}
          </div>
          {upsets.length>0&&<div className="ac" style={{marginBottom:12}}>
            <p className="st" style={{marginBottom:8}}>🐉 BIGGEST UPSETS (Group mostly wrong)</p>
            {upsets.map(s=><div key={s.m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
              <div><p style={{fontSize:12,fontWeight:600,color:"#1a2540",margin:0}}>{s.m.mn}: {s.m.home} vs {s.m.away}</p><p style={{fontSize:10,color:"#94a3b8",margin:0}}>Winner: <b style={{color:"#1a2540"}}>{s.m.result.win}</b> · {s.tot} picks</p></div>
              <div style={{textAlign:"right"}}><span style={{background:"#fee2e2",color:"#991b1b",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8}}>{s.winAcc}% right</span></div>
            </div>)}
          </div>}
          {easiest.length>0&&<div className="ac" style={{marginBottom:12}}>
            <p className="st" style={{marginBottom:8}}>✅ MOST PREDICTED CORRECTLY</p>
            {easiest.map(s=><div key={s.m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
              <div><p style={{fontSize:12,fontWeight:600,color:"#1a2540",margin:0}}>{s.m.mn}: {s.m.home} vs {s.m.away}</p><p style={{fontSize:10,color:"#94a3b8",margin:0}}>Winner: <b style={{color:"#1a2540"}}>{s.m.result.win}</b> · {s.tot} picks</p></div>
              <span style={{background:"#f0fdf4",color:"#15803d",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8}}>{s.winAcc}% right</span>
            </div>)}
          </div>}
          <div className="ac">
            <p className="st" style={{marginBottom:8}}>📊 ALL MATCH ACCURACY (WINNER %)</p>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"2px solid #e2e8f0"}}>
                  {["Match","Picks","Toss%","Win%","POTM%","Perfects"].map(h=><th key={h} style={{textAlign:"left",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:9,textTransform:"uppercase"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[...matchStats].reverse().map(s=><tr key={s.m.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"7px 6px",fontWeight:600,color:"#1a2540"}}>{s.m.mn}</td>
                    <td style={{padding:"7px 6px",color:"#64748b"}}>{s.tot}</td>
                    <td style={{padding:"7px 6px"}}><span style={{color:s.tossAcc>=60?"#15803d":s.tossAcc>=40?"#92400E":"#dc2626",fontWeight:700}}>{s.tossAcc}%</span></td>
                    <td style={{padding:"7px 6px"}}><span style={{color:s.winAcc>=60?"#15803d":s.winAcc>=40?"#92400E":"#dc2626",fontWeight:700}}>{s.winAcc}%</span></td>
                    <td style={{padding:"7px 6px"}}><span style={{color:s.motmAcc>=60?"#15803d":s.motmAcc>=40?"#92400E":"#dc2626",fontWeight:700}}>{s.motmAcc}%</span></td>
                    <td style={{padding:"7px 6px",color:"#1D428A",fontWeight:700}}>{s.perfect}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>;
      })()}

      {/* ── MATCHES TAB ── */}
      {admTab==="matches"&&<div>
        <div className="ac">
          <p className="st">ADD MANUAL MATCH</p>
          {[["Match #","mn","text","e.g. M75"],["Date","date","date",""],["Time","time","time",""],["Venue","venue","text","Optional"]].map(([l,k,type,ph])=>(
            <div key={k} style={{marginBottom:8}}>
              <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 4px"}}>{l}</p>
              <input className="inp" type={type} placeholder={ph} value={manMatchForm[k]} onChange={e=>setManMatchForm(p=>({...p,[k]:e.target.value}))}/>
            </div>
          ))}
          {[["Home","home"],["Away","away"]].map(([l,k])=>(
            <div key={k} style={{marginBottom:8}}>
              <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 4px"}}>{l} Team</p>
              <select className="sel" value={manMatchForm[k]} onChange={e=>setManMatchForm(p=>({...p,[k]:e.target.value}))}>
                {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          ))}
          <button className="pbtn" style={{marginTop:8}} onClick={addManualMatch}>+ Add Match</button>
        </div>
      </div>}

      {/* ── CONTROLS TAB ── */}
      {admTab==="controls"&&<div>
        <div className="ac">
          <p className="st">SEASON CONTROLS</p>
          <div className="ctrl-row"><div><p style={{fontWeight:600,fontSize:13,color:"#1a2540",margin:0}}>Maintenance Mode</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>Lock app for all non-admins</p></div><Toggle on={maintenance} onChange={toggleMaintenance}/></div>
          <div className="ctrl-row"><div><p style={{fontWeight:600,fontSize:13,color:"#1a2540",margin:0}}>Chat Muted</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>Disable chat for all users</p></div><Toggle on={chatMuted} onChange={async v=>{setChatMuted(v);await DB.set("chatmuted",v);toast2(v?"Chat muted":"Chat open");}}/></div>
        </div>
        <div className="ac">
          <p className="st">DOUBLE HEADER MATCH</p>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>Select which match gets 2× points multiplier.</p>
          <select className="sel" value={doubleMatch??""} onChange={async e=>{const v=e.target.value===""?null:Number(e.target.value);setDoubleMatch(v);await DB.set("doublematch",v);toast2(v?"⚡ Double: M"+v:"Double removed");}}>
            <option value="">None</option>
            {ms.filter(m=>!isTBD(m)).map(m=><option key={m.id} value={m.id}>{m.mn}: {m.home} vs {m.away} ({m.date})</option>)}
          </select>
        </div>
        <div className="ac">
          <p className="st">SEASON WINNER (CHAMPION)</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {TEAMS.map(t=><button key={t} onClick={()=>setSeasonWinner(t)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:sw===t?"#1D428A":"#f8faff",border:"2px solid "+(sw===t?"#1D428A":"#e2e8f0"),cursor:"pointer"}}><TLogo t={t} sz={22}/><span style={{fontSize:12,fontWeight:700,color:sw===t?"#fff":"#475569"}}>{t}</span></button>)}
          </div>
          {sw&&<button className="dbtn" style={{marginTop:10}} onClick={async()=>{setSw(null);await DB.set("sw",null);toast2("Champion cleared");}}>Clear Champion</button>}
        </div>
        <div className="ac">
          <p className="st">SEASON PROP BET ANSWERS</p>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>Enter correct answers at season end — each correct user pick = +{PTS.prop}pts.</p>
          {PROP_QUESTIONS.map((q,i)=>{
            const cur=propAnswers?.[q.id]||"";
            const qid=q.id;
            async function savePropAns(val){
              const upd=Object.assign({},propAnswers);upd[qid]=val;
              setPropAnswers(upd);await DB.set("propanswers",upd);toast2("Prop answer saved","ok");
            }
            return<div key={q.id} style={{marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:700,color:"#1D428A",margin:"0 0 3px"}}>Q{i+1} · {q.label}</p>
              {q.type==="player"&&<select className="sel" value={cur} onChange={e=>savePropAns(e.target.value)}><option value="">Select correct player…</option>{ALL_PLAYERS.map(({p,t})=><option key={p+t} value={p}>{p} ({t})</option>)}</select>}
              {q.type==="team"&&<select className="sel" value={cur} onChange={e=>savePropAns(e.target.value)}><option value="">Select correct team…</option>{TEAMS.map(t=><option key={t} value={t}>{TF[t]}</option>)}</select>}
              {q.type==="yesno"&&<div style={{display:"flex",gap:8}}>{["true","false"].map(v=><button key={v} onClick={()=>savePropAns(v)} style={{flex:1,padding:"7px",borderRadius:8,background:cur===v?(v==="true"?"#f0fdf4":"#fef2f2"):"#f1f5f9",color:cur===v?(v==="true"?"#15803d":"#dc2626"):"#475569",border:"1px solid "+(cur===v?(v==="true"?"#bbf7d0":"#fecaca"):"#e2e8f0"),cursor:"pointer",fontSize:12,fontWeight:700}}>{v==="true"?"✅ Yes":"❌ No"}</button>)}</div>}
            </div>;
          })}
        </div>
        <div className="ac">
          <p className="st">EXPORT DATA</p>
          <div style={{display:"flex",gap:8,flexDirection:"column"}}>
            <button className="pbtn" onClick={exportCSV}>📊 Export Leaderboard CSV</button>
            <button className="pbtn" style={{background:"linear-gradient(135deg,#0f6e56,#1D9E75)"}} onClick={exportPicksCSV}>📋 Export All Picks CSV</button>
          </div>
        </div>
        <div className="ac" style={{background:"#EBF0FA",border:"2px solid #1D428A"}}>
          <p className="st">🔧 DB REPAIR</p>
          <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>Fixes Firebase key coercion issues. Run this after any double-header day if picks are not showing correctly.</p>
          <button className="pbtn" disabled={repairLoading} onClick={adminRepairDB}>
            {repairLoading?"Repairing…":"🔧 Repair & Reload All Picks"}
          </button>
        </div>
      </div>}

      {/* ── BROADCAST TAB ── */}
      {admTab==="broadcast"&&<div>
        <div className="ac">
          <p className="st">SEND BROADCAST</p>
          <textarea className="inp" value={bcMsg} onChange={e=>setBcMsg(e.target.value.slice(0,300))} placeholder="Type announcement…" style={{minHeight:80,resize:"none",marginBottom:4}}/>
          <div className="charcnt">{bcMsg.length}/300</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button className="pbtn" style={{flex:1}} onClick={()=>sendBc(false)}>📢 Send</button>
            <button className="pbtn" style={{flex:1,background:"linear-gradient(135deg,#D4AF37,#F0C060)",color:"#1a2540"}} onClick={()=>sendBc(true)}>📌 Pin</button>
          </div>
          {pinnedBc&&<button className="dbtn" style={{marginTop:8}} onClick={clearPin}>✕ Clear Pinned Message</button>}
        </div>
        <div className="ac">
          <p className="st">BROADCAST HISTORY ({bc.length})</p>
          {bc.length===0?<p style={{color:"#94a3b8",fontSize:12,textAlign:"center",padding:"8px 0"}}>No broadcasts yet.</p>:[...bc].reverse().slice(0,10).map(b=>(
            <div key={b.id} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
              <p style={{fontSize:12,color:"#1a2540",margin:0}}>{b.msg}</p>
              <p style={{fontSize:10,color:"#94a3b8",margin:"2px 0 0"}}>{new Date(b.ts).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>}
    </div>}

    <AppNav sc={sc} setSc={setSc} navItems={navItems} chatU={chatU} pendingCount={pendingCount} setAm={setAm} setChatU={setChatU} setChatSeenTs={setChatSeenTs} setBcSeenTs={setBcSeenTs}/>
    {toast&&<Tst t={toast}/>}
    {revealMatchId&&(()=>{const rm2=ms.find(m=>Number(m.id)===Number(revealMatchId));return rm2?<RevealTheatre m={rm2} allPicks={allPicks} users={users} bonusAnswers={bonusAnswers} allBonusPicks={allBonusPicks} onClose={()=>setRevealMatchId(null)}/>:null;})()}
  </div>;
}
