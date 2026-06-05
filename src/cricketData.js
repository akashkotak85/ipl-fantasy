// cricketData.js 
import { WT20WC_2026 } from "./wt20wc2026Data.js";
// All cricket DATA lives here — no logic, no React.
//
// Restructured so each tournament is a self-describing config object. Today
// there is one (IPL 2026). Adding IPL 2027 / a World Cup later is just another
// object in CRICKET_TOURNAMENTS — no changes to scoring or UI code.
//
// IMPORTANT — three large blocks below are marked  // >>> PASTE ... <<<
// Paste those constant definitions VERBATIM from your current App.jsx. They
// are large and known-good, so re-typing them here would only risk typos.
// Cut them out of App.jsx as you paste them in.

/* =========================================================================
   SHARED SCORING / DISPLAY CONSTANTS (same across cricket tournaments)
   ========================================================================= */
export const PTS = {
  toss: 10,
  win: 20,
  motm: 30,
  streak: 15,
  season: 200,
  top4: 50,
  bonus: 15,
  prop: 100,
  scoreBand: 10,
};

// NOTE: `id` values MUST stay exactly as below — user picks are stored against
// them. Emoji are cosmetic; the paste showed them as "?" so swap in whatever
// you actually use.
export const SCORE_BANDS = [
  { id: "<150", label: "Below 150", short: "<150", emoji: "🪫" },
  { id: "150-170", label: "150 – 170", short: "150–170", emoji: "🔋" },
  { id: "171-190", label: "171 – 190", short: "171–190", emoji: "⚡" },
  { id: "191-210", label: "191 – 210", short: "191–210", emoji: "🔥" },
  { id: "210+", label: "210 and above", short: "210+", emoji: "🚀" },
];

export const EMOJIK = ["fire", "cry", "aim", "rage", "clap", "boom"];
// Restore your real emoji here (paste showed "?").
export const EMOJIV = { fire: "🔥", cry: "😭", aim: "🎯", rage: "😡", clap: "👏", boom: "💥" };

/* =========================================================================
   IPL 2026 — team identity
   ========================================================================= */
const IPL2026_LOGOS = {
  IPL: "https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",
  RCB: "https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png",
  SRH: "https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png",
  MI: "https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png",
  KKR: "https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png",
  CSK: "https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png",
  RR: "https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png",
  PBKS: "https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png",
  GT: "https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png",
  LSG: "https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png",
  DC: "https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png",
};

const IPL2026_TC = {
  RCB: { bg: "#C8102E", dk: "#FFD700" },
  SRH: { bg: "#FF822A", dk: "#1B1B1B" },
  MI: { bg: "#004BA0", dk: "#fff" },
  KKR: { bg: "#3A225D", dk: "#FFD700" },
  CSK: { bg: "#F5C600", dk: "#003566" },
  RR: { bg: "#2D0A6B", dk: "#E91E8C" },
  PBKS: { bg: "#ED1B24", dk: "#fff" },
  GT: { bg: "#1B3A6B", dk: "#B5985A" },
  LSG: { bg: "#A72056", dk: "#fff" },
  DC: { bg: "#00008B", dk: "#fff" },
};

const IPL2026_TF = {
  RCB: "Royal Challengers Bengaluru",
  SRH: "Sunrisers Hyderabad",
  MI: "Mumbai Indians",
  KKR: "Kolkata Knight Riders",
  CSK: "Chennai Super Kings",
  RR: "Rajasthan Royals",
  PBKS: "Punjab Kings",
  GT: "Gujarat Titans",
  LSG: "Lucknow Super Giants",
  DC: "Delhi Capitals",
};

const IPL2026_TEAMS = Object.keys(IPL2026_TF);

const IPL2026_SQ={
  RCB:[
    "Virat Kohli","Rajat Patidar","Phil Salt","Jitesh Sharma","Devdutt Padikkal",
    "Krunal Pandya","Tim David","Jacob Bethell","Romario Shepherd","Nuwan Thushara",
    "Josh Hazlewood","Bhuvneshwar Kumar","Yash Dayal","Rasikh Dar","Suyash Sharma",
    "Swapnil Singh","Abhinandan Singh","Venkatesh Iyer","Jacob Duffy",
    "Satvik Deswal","Vicky Ostwal","Jordan Cox","Mangesh Yadav",
    "Kanishk Chouhan","Vihaan Malhotra",
  ],
  SRH:[
    "Travis Head","Abhishek Sharma","Ishan Kishan","Heinrich Klaasen",
    "Nitish Kumar Reddy","Pat Cummins","Harshal Patel","Brydon Carse",
    "Jaydev Unadkat","Kamindu Mendis","Aniket Verma","Harsh Dubey",
    "Eshan Malinga","Smaran Ravichandran","Zeeshan Ansari","Liam Livingstone",
    "Jack Edwards","Salil Arora","Shivam Mavi","Praful Hinge",
    "Amit Kumar","Onkar Tarmale","Sakib Hussain","Shivang Kumar","Krains Fuletra",
  ],
  MI:[
    "Rohit Sharma","Suryakumar Yadav","Hardik Pandya","Jasprit Bumrah",
    "Tilak Varma","Ryan Rickelton","Naman Dhir","Robin Minz","Will Jacks",
    "Mitchell Santner","Raj Angad Bawa","Trent Boult","Deepak Chahar",
    "Shardul Thakur","AM Ghazanfar","Corbin Bosch","Ashwani Kumar",
    "Raghu Sharma","Sherfane Rutherford","Mayank Markande",
    "Quinton de Kock","Atharva Ankolekar","Mohammad Izhar","Danish Malewar","Mayank Rawat",
  ],
  KKR:[
    "Ajinkya Rahane","Angkrish Raghuvanshi","Rinku Singh","Sunil Narine",
    "Varun Chakaravarthy","Harshit Rana","Vaibhav Arora","Anukul Roy",
    "Rovman Powell","Umran Malik","Ramandeep Singh","Manish Pandey",
    "Cameron Green","Matheesha Pathirana","Finn Allen","Rachin Ravindra",
    "Tim Seifert","Tejasvi Singh","Luvnith Sisodia","Kartik Tyagi",
    "Saurabh Dubey","Blessing Muzarabani","Rahul Tripathi","Venkatesh Iyer","Akash Deep",
  ],
  CSK:[
    "Ruturaj Gaikwad","Sanju Samson","Ayush Mhatre","Shivam Dube",
    "Dewald Brevis","MS Dhoni","Urvil Patel","Noor Ahmad","Nathan Ellis",
    "Khaleel Ahmed","Anshul Kamboj","Gurjapneet Singh","Mukesh Choudhary",
    "Jamie Overton","Ramakrishna Ghosh","Shreyas Gopal",
    "Prashant Veer","Kartik Sharma","Akeal Hosein","Matt Henry",
    "Matthew Short","Sarfaraz Khan","Zak Foulkes","Rahul Chahar","Aman Khan",
  ],
  RR:[
    "Yashasvi Jaiswal","Vaibhav Suryavanshi","Riyan Parag","Shimron Hetmyer",
    "Dhruv Jurel","Ravindra Jadeja","Sam Curran","Donovan Ferreira",
    "Jofra Archer","Nandre Burger","Sandeep Sharma","Tushar Deshpande",
    "Kwena Maphaka","Lhuan-dre Pretorius","Shubham Dubey","Yudhvir Singh Charak",
    "Ravi Bishnoi","Adam Milne","Kuldeep Sen","Sushant Mishra",
    "Yash Raj Punja","Vignesh Puthur","Ravi Singh","Aman Rao","Brijesh Sharma",
  ],
  PBKS:[
    "Shreyas Iyer","Prabhsimran Singh","Priyansh Arya","Shashank Singh",
    "Nehal Wadhera","Marcus Stoinis","Azmatullah Omarzai","Marco Jansen",
    "Arshdeep Singh","Yuzvendra Chahal","Lockie Ferguson","Xavier Bartlett",
    "Musheer Khan","Harpreet Brar","Mitchell Owen","Vyshak Vijaykumar",
    "Yash Thakur","Vishnu Vinod","Pyla Avinash","Harnoor Pannu","Suryansh Shedge",
    "Ben Dwarshuis","Cooper Connolly","Vishal Nishad","Pravin Dubey",
  ],
  GT:[
    "Shubman Gill","Jos Buttler","Sai Sudharsan","Shahrukh Khan",
    "Washington Sundar","Rahul Tewatia","Rashid Khan","Kagiso Rabada",
    "Mohammed Siraj","Prasidh Krishna","Sai Kishore","Gurnoor Brar",
    "Jayant Yadav","Nishant Sindhu","Manav Suthar","Arshad Khan",
    "Anuj Rawat","Kumar Kushagra","Glenn Phillips","Ishant Sharma",
    "Jason Holder","Tom Banton","Ashok Sharma","Luke Wood","Prithvi Raj",
  ],
  LSG:[
    "Rishabh Pant","Mitchell Marsh","Nicholas Pooran","Aiden Markram",
    "Abdul Samad","Ayush Badoni","Himmat Singh","Shahbaz Ahmed",
    "Digvesh Rathi","Mohammed Shami","Avesh Khan","Mayank Yadav",
    "Akash Singh","Matthew Breetzke","Arshin Kulkarni","Manimaran Siddharth",
    "Mohsin Khan","Prince Yadav","Arjun Tendulkar","Josh Inglis",
    "Mukul Choudhary","Akshat Raghuwanshi","Wanindu Hasaranga","Anrich Nortje","Naman Tiwari",
  ],
  DC:[
    "KL Rahul","Axar Patel","Abhishek Porel","Ashutosh Sharma","Karun Nair",
    "Kuldeep Yadav","Mitchell Starc","T. Natarajan","Dushmantha Chameera",
    "Tristan Stubbs","Sameer Rizvi","Ajay Mandal","Madhav Tiwari",
    "Vipraj Nigam","Nitish Rana","Tripurana Vijay","Mukesh Kumar",
    "David Miller","Ben Duckett","Auqib Nabi","Pathum Nissanka",
    "Lungi Ngidi","Sahil Parakh","Prithvi Shaw","Kyle Jamieson",
  ],
};

const IPL2026_MATCHES=[
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
  {id:71,mn:"Q1",home:"RCB",away:"GT",date:"2026-05-26",time:"19:30",venue:"HPCA Stadium, Dharamshala"},
  {id:72,mn:"EL1",home:"SRH",away:"RR",date:"2026-05-27",time:"19:30",venue:"Maharaja Yadavindra Singh Intl. Stadium, New Chandigarh"},
  {id:73,mn:"Q2",home:"GT",away:"RR",date:"2026-05-29",time:"19:30",venue:"Maharaja Yadavindra Singh Intl. Stadium, New Chandigarh"},
  {id:74,mn:"Final",home:"RCB",away:"GT",date:"2026-05-31",time:"19:30",venue:"Narendra Modi Stadium, Ahmedabad"},
];

const IPL2026_BONUS={
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

const IPL2026_PROPS = [
  { id: "q0", label: "Orange Cap — who will score the most runs in IPL 2026?", type: "player" },
  { id: "q1", label: "Purple Cap — who will take the most wickets in IPL 2026?", type: "player" },
  { id: "q2", label: "Which team will score the highest total in any single match?", type: "team" },
  { id: "q3", label: "Will there be at least one Super Over in IPL 2026?", type: "yesno" },
  { id: "q4", label: "Which team will finish last (10th) in the points table?", type: "team" },
];

/* =========================================================================
   TOURNAMENT REGISTRY
   status: "upcoming" | "live" | "finished"
   - "live"     → playable, shown front-and-centre
   - "finished" → read-only history (frozen leaderboard, no new picks)
   ========================================================================= */
export const IPL_2026 = {
  id: "ipl2026",
  sport: "cricket",
  name: "IPL 2026",
  shortName: "IPL '26",
  season: "2026",
  dbPrefix: "ipl26_", // each tournament owns its own RTDB namespace
  status: "active",
  logo: IPL2026_LOGOS.IPL,
  teams: IPL2026_TEAMS,
  LOGOS: IPL2026_LOGOS,
  TC: IPL2026_TC,
  TF: IPL2026_TF,
  SQ: IPL2026_SQ,
  matches: IPL2026_MATCHES,
  bonusQuestions: IPL2026_BONUS,
  propQuestions: IPL2026_PROPS,
};

export const CRICKET_TOURNAMENTS = [
  IPL_2026,
  // IPL_2027,           // add future tournaments here
  WT20WC_2026,
];

export const getTournament = (id) => CRICKET_TOURNAMENTS.find((t) => t.id === id);
export const getLiveTournaments = () => CRICKET_TOURNAMENTS.filter((t) => t.status === "active");
export const getUpcomingTournaments = () =>
  CRICKET_TOURNAMENTS.filter((t) => t.status === "upcoming");
export const getFinishedTournaments = () =>
  CRICKET_TOURNAMENTS.filter((t) => t.status === "finished");

/* =========================================================================
   BACK-COMPAT NAMED EXPORTS
   These let your existing App.jsx keep referencing TEAMS / BASE_MATCHES / etc.
   unchanged. When you move to a multi-tournament hub, switch these references
   to read from the active tournament config instead.
   ========================================================================= */
export const LOGOS = IPL_2026.LOGOS;
export const TC = IPL_2026.TC;
export const TF = IPL_2026.TF;
export const SQ = IPL_2026.SQ;
export const TEAMS = IPL_2026.teams;
export const BASE_MATCHES = IPL_2026.matches;
export const BONUS_QUESTIONS = IPL_2026.bonusQuestions;
export const PROP_QUESTIONS = IPL_2026.propQuestions;

export const ALL_PLAYERS = Object.entries(SQ)
  .flatMap(([team, players]) => players.map((p) => ({ p, t: team })))
  .sort((a, b) => a.p.localeCompare(b.p));

export const TRASH_TALK=[
  (perfs,zeros,lone,mn)=>`🏏 ${mn} VERDICT!
${perfs.length?`✅ ${perfs.join(" & ")} nailed all 3! Flawless.`:"Nobody got all 3. Collective suffering. 🏏"}
${zeros.length?`😔 Moment of silence for ${zeros.join(", ")} — 0 from 3.`:""}
${lone?`🐺 Lone wolf award: ${lone} was the only one who backed the winner. Respect.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} DONE!
${perfs.length?`✅ Perfect picks: ${perfs.join(", ")}. Someone's been doing their homework.`:"Not a single perfect pick. Humbling stuff."}
${zeros.length?`🫗 Pour one out for ${zeros.join(", ")} (0/3). The cricket gods were not kind.`:""}
${lone?`🐺 ${lone} backed the underdog winner alone. Absolute scenes.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} RESULT IN!
${perfs.length?`✅ PERFECTS: ${perfs.join(", ")} — bought a ticket on the right bus!`:"Nobody called it perfectly. The IPL remains unpredictable."}
${zeros.length?`😭 Complete whitewash for ${zeros.join(", ")}. Didn't get a single one.`:""}
${lone?`👑 Contrarian king: ${lone} went against the group on the winner. And WON.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} WRAPPED!
${perfs.length?`✅ ${perfs.join(" and ")} with the perfect prediction. Bow down.`:"The match gave everyone nothing. Ouch."}
${zeros.length?`😔 ${zeros.join(", ")} finished with a big fat 0. Let's not talk about it.`:""}
${lone?`🐺 Only ${lone} called the winner right. Chaos theory at work.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} FULL TIME!
${perfs.length?`✅ ${perfs.join(", ")} — all 3 correct. Scouts take note.`:"Zero perfects. The IPL continues to humble us all."}
${zeros.length?`😔 Rough night for ${zeros.join(", ")}. 0 from 3 — happens to the best of us.`:""}
${lone?`🐺 ${lone} stood alone on the winner. Brave. Unhinged. Correct.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} IN THE BOOKS!
${perfs.length?`✅ Hall of fame alert: ${perfs.join(", ")} got all 3 right!`:"Not a single person called it perfectly. Beautiful chaos."}
${zeros.length?`😔 ${zeros.join(", ")} — three wrong. That's impressively bad.`:""}
${lone?`🐺 ${lone} was the lone ranger on the winner. Deserves a round of applause.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} DONE AND DUSTED!
${perfs.length?`✅ ${perfs.join(" & ")} read the game perfectly. Respect.`:"Nobody got all 3. This group really keeps admin humble."}
${zeros.length?`😔 ${zeros.join(", ")} with the goose egg. 0/3 is actually a skill.`:""}
${lone?`🐺 ${lone} went rogue on the winner and won. What a legend.`:""}`,
  (perfs,zeros,lone,mn)=>`🏏 ${mn} OVER!
${perfs.length?`✅ ${perfs.join(", ")} called it perfectly. Flawless prediction.`:"Zero perfects this match. The IPL is genuinely unpredictable."}
${zeros.length?`😔 ${zeros.join(", ")} scored a combined 0. We move.`:""}
${lone?`🐺 Only ${lone} predicted the winner. Fortune favours the bold.`:""}`,
];
