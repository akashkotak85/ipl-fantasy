// wt20wc2026Data.js
// ICC Women's T20 World Cup 2026 — England & Wales
// 12 teams · 33 matches · Jun 12 – Jul 5 2026
// Source: ICC official + ESPNcricinfo (verified May 2026)
// All times in IST (UTC+5:30)

// ── Team Colors ────────────────────────────────────────────
export const WT20_TC = {
  AUS: "#F4C430", // Gold
  BAN: "#006A4E", // Dark green
  IND: "#1A3A6C", // Navy blue
  NED: "#FF6300", // Orange
  PAK: "#014F32", // Pakistan green
  SA:  "#007A4D", // Proteas green
  ENG: "#1C3F88", // England blue
  IRE: "#169B62", // Shamrock green
  NZ:  "#1A1A1A", // Black caps
  SCO: "#003B8E", // Scotland blue
  SL:  "#003478", // Sri Lanka blue
  WI:  "#6D1919", // Maroon
};

// ── Team Full Names ────────────────────────────────────────
export const WT20_TF = {
  AUS: "Australia",
  BAN: "Bangladesh",
  IND: "India",
  NED: "Netherlands",
  PAK: "Pakistan",
  SA:  "South Africa",
  ENG: "England",
  IRE: "Ireland",
  NZ:  "New Zealand",
  SCO: "Scotland",
  SL:  "Sri Lanka",
  WI:  "West Indies",
};

// ── Country Flags (lipis CDN + fallbacks) ─────────────────
export const WT20_FLAGS = {
  AUS: "https://flagicons.lipis.dev/flags/4x3/au.svg",
  BAN: "https://flagicons.lipis.dev/flags/4x3/bd.svg",
  IND: "https://flagicons.lipis.dev/flags/4x3/in.svg",
  NED: "https://flagicons.lipis.dev/flags/4x3/nl.svg",
  PAK: "https://flagicons.lipis.dev/flags/4x3/pk.svg",
  SA:  "https://flagicons.lipis.dev/flags/4x3/za.svg",
  ENG: "https://flagicons.lipis.dev/flags/4x3/gb-eng.svg",
  IRE: "https://flagicons.lipis.dev/flags/4x3/ie.svg",
  NZ:  "https://flagicons.lipis.dev/flags/4x3/nz.svg",
  SCO: "https://flagicons.lipis.dev/flags/4x3/gb-sct.svg",
  SL:  "https://flagicons.lipis.dev/flags/4x3/lk.svg",
  WI:  "https://upload.wikimedia.org/wikipedia/en/thumb/3/38/Cricket_West_Indies_Logo.svg/200px-Cricket_West_Indies_Logo.svg.png",
};

// ── Flag Emoji (fallback display) ─────────────────────────
export const WT20_EMOJI = {
  AUS: "🇦🇺", BAN: "🇧🇩", IND: "🇮🇳", NED: "🇳🇱",
  PAK: "🇵🇰", SA:  "🇿🇦", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", IRE: "🇮🇪",
  NZ:  "🇳🇿", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", SL:  "🇱🇰", WI:  "🌴",
};

// ── Groups ─────────────────────────────────────────────────
export const WT20_GROUPS = {
  A: ["AUS", "BAN", "IND", "NED", "PAK", "SA"],
  B: ["ENG", "IRE", "NZ",  "SCO", "SL",  "WI"],
};

// ── Squads (15 players per team, ICC-confirmed) ───────────
export const WT20_SQ = {
  AUS: [
    "Sophie Molineux", "Nicola Carey", "Ashleigh Gardner", "Kim Garth",
    "Lucy Hamilton", "Grace Harris", "Alana King", "Phoebe Litchfield",
    "Tahlia McGrath", "Beth Mooney", "Ellyse Perry", "Megan Schutt",
    "Annabel Sutherland", "Georgia Voll", "Georgia Wareham",
  ],
  BAN: [
    "Nigar Sultana Joty", "Nahida Akter", "Sharmin Akter Supta",
    "Sobhana Mostary", "Shorna Akter", "Ritu Moni", "Rabeya Khan",
    "Fahima Khatun", "Fariha Islam Trisna", "Marufa Akter",
    "Shanjida Akther Maghla", "Sultana Khatun", "Dilara Akter",
    "Juairiya Ferdous", "Taj Nehar",
  ],
  IND: [
    "Harmanpreet Kaur", "Smriti Mandhana", "Shafali Verma",
    "Jemimah Rodrigues", "Bharti Fulmali", "Deepti Sharma",
    "Richa Ghosh", "Shree Charani", "Yastika Bhatia", "Nandani Sharma",
    "Arundhati Reddy", "Renuka Singh", "Kranti Gaud",
    "Shreyanka Patil", "Radha Yadav",
  ],
  NED: [
    "Babette de Leede", "Caroline de Lange", "Frédérique Overdijk",
    "Hannah Landheer", "Heather Siegers", "Iris Zwilling",
    "Isabel van der Woning", "Lara Leemhuis", "Myrthe van den Raad",
    "Phebe Molkenboer", "Robine Rijke", "Rosalie Lawrence",
    "Sanya Khurana", "Silver Siegers", "Sterre Kalis",
  ],
  PAK: [
    "Fatima Sana", "Gull Feroza", "Ayesha Zafar", "Iram Javed",
    "Eyman Fatima", "Aliya Riaz", "Natalia Parvaiz", "Saira Jabeen",
    "Muneeba Ali", "Tuba Hassan", "Rameen Shamim", "Sadia Iqbal",
    "Nashra Sandhu", "Diana Baig", "Tasmia Rubab",
  ],
  SA: [
    "Laura Wolvaardt", "Tazmin Brits", "Nadine de Klerk",
    "Annerie Dercksen", "Shabnim Ismail", "Sinalo Jafta",
    "Marizanne Kapp", "Ayabonga Khaka", "Sune Luus", "Karabo Meso",
    "Nonkululeko Mlaba", "Kayla Reyneke", "Tumi Sekhukhune",
    "Chloe Tryon", "Dane van Nierkerk",
  ],
  ENG: [
    "Nat Sciver-Brunt", "Lauren Bell", "Alice Capsey",
    "Tilly Corteen-Coleman", "Charlie Dean", "Sophia Dunkley",
    "Sophie Ecclestone", "Lauren Filer", "Dani Gibson", "Amy Jones",
    "Freya Kemp", "Heather Knight", "Linsey Smith",
    "Issy Wong", "Danni Wyatt-Hodge",
  ],
  IRE: [
    "Gaby Lewis", "Ava Canning", "Christina Coulter Reilly",
    "Alana Dalzell", "Georgina Dempsey", "Amy Hunter", "Arlene Kelly",
    "Louise Little", "Aimee Maguire", "Lara McBride", "Cara Murray",
    "Leah Paul", "Orla Prendergast", "Rebecca Stokell", "Alice Tector",
  ],
  NZ: [
    "Melie Kerr", "Suzie Bates", "Sophie Devine", "Flora Devonshire",
    "Izzy Gaze", "Maddy Green", "Brooke Halliday", "Bree Illing",
    "Polly Inglis", "Jess Kerr", "Rosemary Mair", "Nensi Patel",
    "Georgia Plimmer", "Izzy Sharp", "Lea Tahuhu",
  ],
  SCO: [
    "Kathryn Bryce", "Chloe Abel", "Olivia Bell", "Sarah Bryce",
    "Darcey Carter", "Priyanaz Chatterji", "Gabriella Fontenla",
    "Katherine Fraser", "Kirstie Gordon", "Ailsa Lister",
    "Maisie Maceira", "Abtaha Maqsood", "Megan McColl",
    "Rachel Slater", "Pippa Sproul",
  ],
  SL: [
    "Chamari Athapaththu", "Hasini Perera", "Vishmi Gunarathne",
    "Harshitha Samarawickrama", "Imesha Dulani", "Nilakshika Silva",
    "Kaveesha Dilhari", "Hansima Karunarathne", "Kaushini Nuthyangana",
    "Sugandika Dassanayaka", "Nimasha Madushani", "Shashini Gimhani",
    "Kawya Kavindi", "Malki Madara", "Mithali Ayodhya",
  ],
  WI: [
    "Hayley Matthews", "Chinelle Henry", "Deandra Dottin",
    "Stafanie Taylor", "Afy Fletcher", "Aaliyah Alleyne",
    "Shemaine Campbelle", "Ashmini Munisar", "Karishma Ramharack",
    "Jannillea Glasgow", "Jahzara Claxton", "Qiana Joseph",
    "Zaida James", "Mandy Mangru", "Shawnisha Hector",
  ],
};

// ── All Players flat list (for MOTM picker) ────────────────
export const WT20_ALL_PLAYERS = Object.entries(WT20_SQ)
  .flatMap(([t, ps]) => ps.map(p => ({ p, t })))
  .sort((a, b) => a.p.localeCompare(b.p));

// ── Venues ─────────────────────────────────────────────────
// Edgbaston·Birmingham  | Old Trafford·Manchester
// Headingley·Leeds      | Rose Bowl·Southampton
// County Ground·Bristol | Lord's·London
// The Oval·London

// ── Matches (all 33, times in IST) ────────────────────────
export const WT20_MATCHES = [
  // ── Group Stage ──────────────────────────────────────────
  {id:1,  mn:"M1",  home:"ENG", away:"SL",  date:"2026-06-12", time:"23:00", venue:"Edgbaston, Birmingham",    group:"B"},
  {id:2,  mn:"M2",  home:"SCO", away:"IRE", date:"2026-06-13", time:"15:00", venue:"Old Trafford, Manchester", group:"B"},
  {id:3,  mn:"M3",  home:"AUS", away:"SA",  date:"2026-06-13", time:"19:00", venue:"Old Trafford, Manchester", group:"A"},
  {id:4,  mn:"M4",  home:"WI",  away:"NZ",  date:"2026-06-13", time:"23:00", venue:"Rose Bowl, Southampton",   group:"B"},
  {id:5,  mn:"M5",  home:"BAN", away:"NED", date:"2026-06-14", time:"15:00", venue:"Edgbaston, Birmingham",    group:"A"},
  {id:6,  mn:"M6",  home:"IND", away:"PAK", date:"2026-06-14", time:"19:00", venue:"Edgbaston, Birmingham",    group:"A"},
  {id:7,  mn:"M7",  home:"NZ",  away:"SL",  date:"2026-06-16", time:"19:00", venue:"Rose Bowl, Southampton",   group:"B"},
  {id:8,  mn:"M8",  home:"ENG", away:"IRE", date:"2026-06-16", time:"23:00", venue:"Rose Bowl, Southampton",   group:"B"},
  {id:9,  mn:"M9",  home:"AUS", away:"BAN", date:"2026-06-17", time:"15:00", venue:"Headingley, Leeds",        group:"A"},
  {id:10, mn:"M10", home:"IND", away:"NED", date:"2026-06-17", time:"19:00", venue:"Headingley, Leeds",        group:"A"},
  {id:11, mn:"M11", home:"SA",  away:"PAK", date:"2026-06-17", time:"23:00", venue:"Edgbaston, Birmingham",    group:"A"},
  {id:12, mn:"M12", home:"WI",  away:"SCO", date:"2026-06-18", time:"23:00", venue:"Headingley, Leeds",        group:"B"},
  {id:13, mn:"M13", home:"NZ",  away:"IRE", date:"2026-06-19", time:"23:00", venue:"Rose Bowl, Southampton",   group:"B"},
  {id:14, mn:"M14", home:"AUS", away:"NED", date:"2026-06-20", time:"15:00", venue:"Rose Bowl, Southampton",   group:"A"},
  {id:15, mn:"M15", home:"PAK", away:"BAN", date:"2026-06-20", time:"19:00", venue:"Rose Bowl, Southampton",   group:"A"},
  {id:16, mn:"M16", home:"ENG", away:"SCO", date:"2026-06-20", time:"23:00", venue:"Headingley, Leeds",        group:"B"},
  {id:17, mn:"M17", home:"WI",  away:"SL",  date:"2026-06-21", time:"15:00", venue:"County Ground, Bristol",   group:"B"},
  {id:18, mn:"M18", home:"SA",  away:"IND", date:"2026-06-21", time:"19:00", venue:"Old Trafford, Manchester", group:"A"},
  {id:19, mn:"M19", home:"NZ",  away:"SCO", date:"2026-06-23", time:"15:00", venue:"County Ground, Bristol",   group:"B"},
  {id:20, mn:"M20", home:"SL",  away:"IRE", date:"2026-06-23", time:"19:00", venue:"County Ground, Bristol",   group:"B"},
  {id:21, mn:"M21", home:"AUS", away:"PAK", date:"2026-06-23", time:"23:00", venue:"Headingley, Leeds",        group:"A"},
  {id:22, mn:"M22", home:"ENG", away:"WI",  date:"2026-06-24", time:"23:00", venue:"Lord's, London",           group:"B"},
  {id:23, mn:"M23", home:"IND", away:"BAN", date:"2026-06-25", time:"19:00", venue:"Old Trafford, Manchester", group:"A"},
  {id:24, mn:"M24", home:"SA",  away:"NED", date:"2026-06-25", time:"23:00", venue:"County Ground, Bristol",   group:"A"},
  {id:25, mn:"M25", home:"SL",  away:"SCO", date:"2026-06-26", time:"23:00", venue:"Old Trafford, Manchester", group:"B"},
  {id:26, mn:"M26", home:"PAK", away:"NED", date:"2026-06-27", time:"15:00", venue:"County Ground, Bristol",   group:"A"},
  {id:27, mn:"M27", home:"WI",  away:"IRE", date:"2026-06-27", time:"19:00", venue:"County Ground, Bristol",   group:"B"},
  {id:28, mn:"M28", home:"ENG", away:"NZ",  date:"2026-06-27", time:"23:00", venue:"The Oval, London",         group:"B"},
  {id:29, mn:"M29", home:"SA",  away:"BAN", date:"2026-06-28", time:"15:00", venue:"Lord's, London",           group:"A"},
  {id:30, mn:"M30", home:"AUS", away:"IND", date:"2026-06-28", time:"19:00", venue:"Lord's, London",           group:"A"},
  // ── Knockouts ─────────────────────────────────────────────
  {id:31, mn:"SF1", home:"TBD", away:"TBD", date:"2026-06-30", time:"19:00", venue:"The Oval, London",         group:"SF"},
  {id:32, mn:"SF2", home:"TBD", away:"TBD", date:"2026-07-02", time:"23:00", venue:"The Oval, London",         group:"SF"},
  {id:33, mn:"FIN", home:"TBD", away:"TBD", date:"2026-07-05", time:"19:00", venue:"Lord's, London",           group:"Final"},
];

// ── Bonus Questions (2 per match) ─────────────────────────
// Format matches existing app structure: { [matchId]: "question text" }
export const WT20_BONUS = {
  // Group A matches
  1:  "Will England score 150+ against Sri Lanka?",
  2:  "Will there be a half-century in the Scotland vs Ireland match?",
  3:  "Will Ellyse Perry score 30+ runs for Australia?",
  4:  "Will New Zealand win by 20+ runs against West Indies?",
  5:  "Will Bangladesh take 5+ wickets against Netherlands?",
  6:  "Will India win without losing more than 4 wickets?",
  7:  "Will Chamari Athapaththu score a fifty against New Zealand?",
  8:  "Will England win inside 16 overs against Ireland?",
  9:  "Will Australia take a wicket in the first over vs Bangladesh?",
  10: "Will India post 160+ against Netherlands?",
  11: "Will Shabnim Ismail take 2+ wickets vs Pakistan?",
  12: "Will Hayley Matthews score 40+ vs Scotland?",
  13: "Will the New Zealand vs Ireland match be decided in the last over?",
  14: "Will Australia vs Netherlands be a 50+ run victory?",
  15: "Will Pakistan vs Bangladesh go to the last over?",
  16: "Will England win by more than 30 runs vs Scotland?",
  17: "Will West Indies vs Sri Lanka produce 280+ combined runs?",
  18: "Will the SA vs India match have 3+ catches on the boundary?",
  19: "Will New Zealand vs Scotland produce a century partnership?",
  20: "Will Sri Lanka vs Ireland go down to the last 2 overs?",
  21: "Will Australia vs Pakistan be the match of the group stage?",
  22: "Will Nat Sciver-Brunt score 40+ vs West Indies?",
  23: "Will India vs Bangladesh have a run-out dismissal?",
  24: "Will South Africa vs Netherlands be a 60+ run win?",
  25: "Will Chamari Athapaththu be the top scorer in SL vs Scotland?",
  26: "Will Pakistan vs Netherlands go to a Super Over?",
  27: "Will West Indies vs Ireland have a top-5 finish for Deandra Dottin?",
  28: "Will England vs New Zealand be decided by 10 runs or fewer?",
  29: "Will South Africa vs Bangladesh be a boundary-fest (25+ fours total)?",
  30: "Will the Australia vs India Lord's clash go to the final over?",
  31: "Will the semi-final go down to the wire (decided in last 3 overs)?",
  32: "Will the second semi-final produce a top score of 50+?",
  33: "Will the final be won by the team batting first?",
};

// ── Captains (for reference / display) ───────────────────
export const WT20_CAPTAINS = {
  AUS: "Sophie Molineux",
  BAN: "Nigar Sultana Joty",
  IND: "Harmanpreet Kaur",
  NED: "Babette de Leede",
  PAK: "Fatima Sana",
  SA:  "Laura Wolvaardt",
  ENG: "Nat Sciver-Brunt",
  IRE: "Gaby Lewis",
  NZ:  "Melie Kerr",
  SCO: "Kathryn Bryce",
  SL:  "Chamari Athapaththu",
  WI:  "Hayley Matthews",
};

// ── Season Prop Bets (set once during onboarding) ─────────
export const WT20_PROPS = [
  { id: "q0", label: "Golden Bat — who will score the most runs in the tournament?", type: "player" },
  { id: "q1", label: "Golden Ball — who will take the most wickets in the tournament?", type: "player" },
  { id: "q2", label: "Which team will post the highest total in any single match?", type: "team" },
  { id: "q3", label: "Will there be at least one Super Over in the tournament?", type: "yesno" },
  { id: "q4", label: "Who will be named Player of the Tournament?", type: "player" },
];

// ── Tournament Config ──────────────────────────────────────
export const WT20WC_2026 = {
  id:           "wt20wc2026",
  name:         "ICC Women's T20 World Cup 2026",
  shortName:    "WT20WC '26",
  season:       "2026",
  dbPrefix:     "wt20wc26_",
  status:       "active",
  sport:        "cricket",
  icon:         "🏆",
  logo:         "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/ICC_Women%27s_T20_World_Cup_logo.svg/200px-ICC_Women%27s_T20_World_Cup_logo.svg.png",
  teams:        Object.keys(WT20_TF),
  TC:           WT20_TC,
  TF:           WT20_TF,
  LOGOS:        WT20_FLAGS,
  EMOJI:        WT20_EMOJI,
  SQ:           WT20_SQ,
  captains:     WT20_CAPTAINS,
  matches:      WT20_MATCHES,
  bonusQuestions: WT20_BONUS,
  propQuestions:  WT20_PROPS,
  allPlayers:   WT20_ALL_PLAYERS,
  groups:       WT20_GROUPS,
  venues: {
    "Edgbaston, Birmingham":    { city: "Birmingham",  capacity: 25000 },
    "Old Trafford, Manchester": { city: "Manchester",  capacity: 26000 },
    "Headingley, Leeds":        { city: "Leeds",       capacity: 18350 },
    "Rose Bowl, Southampton":   { city: "Southampton", capacity: 25000 },
    "County Ground, Bristol":   { city: "Bristol",     capacity: 17500 },
    "Lord's, London":           { city: "London",      capacity: 31100 },
    "The Oval, London":         { city: "London",      capacity: 27500 },
  },
  // Key tournament facts
  defending:    "New Zealand",
  prizePool:    "$8.76 million",
  winner:       null, // to be set when tournament ends
};
