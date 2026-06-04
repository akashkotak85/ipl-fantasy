// cricketData.js
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

// >>> PASTE 1: copy your full `const SQ = { RCB:[...], ... };` here, but
//     rename it to IPL2026_SQ.  e.g.  const IPL2026_SQ = { ... };
const IPL2026_SQ = {
  // RCB: [...], SRH: [...], ... (paste from App.jsx)
};
// <<< END PASTE 1

// >>> PASTE 2: copy your full `const BASE_MATCHES = [ ... ];` here, renamed.
const IPL2026_MATCHES = [
  // { id:1, mn:"M1", home:"RCB", away:"SRH", ... }, ... (paste from App.jsx)
];
// <<< END PASTE 2

// >>> PASTE 3: copy your full `const BONUS_QUESTIONS = { 1:"...", ... };`
//     here, renamed to IPL2026_BONUS.
const IPL2026_BONUS = {
  // 1: "Will the opening partnership...", ... (paste from App.jsx)
};
// <<< END PASTE 3

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
  status: "live",
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
  // T20_WORLDCUP_2026,
];

export const getTournament = (id) => CRICKET_TOURNAMENTS.find((t) => t.id === id);
export const getLiveTournaments = () => CRICKET_TOURNAMENTS.filter((t) => t.status === "live");
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

// >>> PASTE 4: copy your full `const TRASH_TALK = [ ... ];` here and export it.
export const TRASH_TALK = [
  // (paste your 8 trash-talk template functions from App.jsx)
];
// <<< END PASTE 4
