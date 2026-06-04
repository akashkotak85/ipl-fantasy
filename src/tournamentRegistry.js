// tournamentRegistry.js
// Single source of truth for every tournament across all sports.
// Add a new tournament here and it automatically appears in AdminHub,
// CricketHub, and the future FootballHub — no other file changes needed.
//
// status: "upcoming" | "active" | "finished"
//   - "upcoming"  → visible in hub, picks not yet open
//   - "active"    → playable, shown front and centre
//   - "finished"  → read-only history, leaderboard frozen
//
// NOTE: status is the DEFAULT shown before Firebase is checked.
// AdminHub can override it by writing `{dbPrefix}tourneystatus` to Firebase.
// That Firebase value always takes precedence over the value here.

import { createDB } from "./firebase.js";

export const TOURNAMENT_REGISTRY = [
  {
    id: "ipl2026",
    name: "IPL 2026",
    shortName: "IPL '26",
    sport: "cricket",
    icon: "🏏",
    dbPrefix: "ipl26_",
    color: "#1D428A",
    accentColor: "#FFD700",
    startDate: "2026-03-22",
    endDate: "2026-06-01",
    status: "active",          // overridden by Firebase `ipl26_tourneystatus`
    logo: "https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",
  },
  {
    id: "fifa2026",
    name: "FIFA World Cup 2026",
    shortName: "FIFA '26",
    sport: "football",
    icon: "⚽",
    dbPrefix: "fifa26_",
    color: "#004B87",
    accentColor: "#C5A028",
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    status: "active",          // overridden by Firebase `fifa26_tourneystatus`
    logo: null,
  },
  // ── Add future tournaments here ──────────────────────────────
  // {
  //   id: "ipl2027",
  //   name: "IPL 2027",
  //   shortName: "IPL '27",
  //   sport: "cricket",
  //   icon: "🏏",
  //   dbPrefix: "ipl27_",
  //   color: "#1D428A",
  //   accentColor: "#FFD700",
  //   startDate: "2027-03-20",
  //   endDate: "2027-06-01",
  //   status: "upcoming",
  //   logo: "https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",
  // },
];

// ── Convenience getters ──────────────────────────────────────────────────────
export const getAllTournaments  = ()  => TOURNAMENT_REGISTRY;
export const getTournamentById  = (id) => TOURNAMENT_REGISTRY.find(t => t.id === id);
export const getTournamentsBySport = (sport) =>
  TOURNAMENT_REGISTRY.filter(t => t.sport === sport);

// Returns a live DB handle for any tournament by id.
// Useful when AdminHub needs to talk to a specific tournament's data.
export function getDBForTournament(id) {
  const t = getTournamentById(id);
  return t ? createDB(t.dbPrefix) : null;
}
