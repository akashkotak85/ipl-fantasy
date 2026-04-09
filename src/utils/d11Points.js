// src/utils/d11Points.js
// Dream11-style points calculator for IPL 2026 Best XI feature
// Input: raw scorecard data from cricapi.com
// Output: per-player points breakdown + total

// ─── Points System ────────────────────────────────────────────────────────────
const PTS = {
  // Batting
  RUN:           1,
  FOUR_BONUS:    1,
  SIX_BONUS:     2,
  HALF_CENTURY:  8,   // 50–99 runs
  CENTURY:       16,  // 100+ runs
  DUCK:         -2,   // dismissed for 0
  // SR bonus/penalty (min 10 balls faced)
  SR_ABOVE_170:  6,
  SR_150_170:    4,
  SR_130_150:    2,
  SR_60_70:     -2,
  SR_50_60:     -4,
  SR_BELOW_50:  -6,

  // Bowling
  WICKET:        25,
  LBW_BOWLED:    8,   // bonus per LBW or bowled dismissal
  THREE_WICKETS: 4,   // bonus for 3-wicket haul
  FOUR_WICKETS:  8,   // bonus for 4-wicket haul (cumulative with 3W)
  FIVE_WICKETS:  16,  // bonus for 5+ wicket haul (cumulative with 4W)
  MAIDEN:        4,
  // Economy bonus/penalty (min 2 overs)
  ECO_BELOW_5:   6,
  ECO_5_6:       4,
  ECO_6_7:       2,
  ECO_10_11:    -2,
  ECO_11_12:    -4,
  ECO_ABOVE_12: -6,

  // Fielding
  CATCH:         8,
  THREE_CATCHES: 4,   // bonus for 3+ catches in match
  STUMPING:      12,
  RUNOUT_DIRECT: 12,
  RUNOUT_THROW:  6,   // indirect run-out (thrower gets this)

  // Participation
  PLAYING:       4,
};

// ─── Batting Points ───────────────────────────────────────────────────────────
export function calcBattingPts(batting) {
  if (!batting) return { pts: 0, breakdown: {} };

  const r   = batting.r   ?? 0;
  const b   = batting.b   ?? 0;
  const fours = batting["4s"] ?? 0;
  const sixes = batting["6s"] ?? 0;
  const sr  = batting.sr  ?? 0;
  const dismissal = (batting.dismissal ?? "").toLowerCase();
  const isOut = dismissal !== "" && dismissal !== "not out" && dismissal !== "did not bat";
  const isDuck = isOut && r === 0;

  let pts = 0;
  const bd = {};

  // Base run points
  bd.runs = r * PTS.RUN;
  pts += bd.runs;

  // Boundary bonuses
  bd.fours = fours * PTS.FOUR_BONUS;
  bd.sixes = sixes * PTS.SIX_BONUS;
  pts += bd.fours + bd.sixes;

  // Milestone bonuses
  if (r >= 100) {
    bd.milestone = PTS.CENTURY;
  } else if (r >= 50) {
    bd.milestone = PTS.HALF_CENTURY;
  } else {
    bd.milestone = 0;
  }
  pts += bd.milestone;

  // Duck penalty
  bd.duck = isDuck ? PTS.DUCK : 0;
  pts += bd.duck;

  // Strike rate bonus/penalty (min 10 balls)
  bd.srBonus = 0;
  if (b >= 10) {
    if      (sr >= 170) bd.srBonus = PTS.SR_ABOVE_170;
    else if (sr >= 150) bd.srBonus = PTS.SR_150_170;
    else if (sr >= 130) bd.srBonus = PTS.SR_130_150;
    else if (sr < 50)   bd.srBonus = PTS.SR_BELOW_50;
    else if (sr < 60)   bd.srBonus = PTS.SR_50_60;
    else if (sr < 70)   bd.srBonus = PTS.SR_60_70;
    pts += bd.srBonus;
  }

  return { pts, breakdown: bd };
}

// ─── Bowling Points ───────────────────────────────────────────────────────────
// lbwBowledCount: how many of this bowler's wickets were LBW or bowled
// (derived from batting scorecard dismissal field — see parseLbwBowledBonus)
export function calcBowlingPts(bowling, lbwBowledCount = 0) {
  if (!bowling) return { pts: 0, breakdown: {} };

  const w   = bowling.w   ?? 0;
  const eco = bowling.eco ?? 0;
  const m   = bowling.m   ?? 0;
  const overs = parseFloat(bowling.o ?? 0);

  let pts = 0;
  const bd = {};

  // Wicket points
  bd.wickets = w * PTS.WICKET;
  pts += bd.wickets;

  // LBW / bowled bonus
  bd.lbwBowled = lbwBowledCount * PTS.LBW_BOWLED;
  pts += bd.lbwBowled;

  // Wicket haul bonuses
  bd.haulBonus = 0;
  if      (w >= 5) bd.haulBonus = PTS.THREE_WICKETS + PTS.FOUR_WICKETS + PTS.FIVE_WICKETS;
  else if (w >= 4) bd.haulBonus = PTS.THREE_WICKETS + PTS.FOUR_WICKETS;
  else if (w >= 3) bd.haulBonus = PTS.THREE_WICKETS;
  pts += bd.haulBonus;

  // Maiden overs
  bd.maidens = m * PTS.MAIDEN;
  pts += bd.maidens;

  // Economy bonus/penalty (min 2 complete overs)
  bd.ecoBonus = 0;
  if (overs >= 2) {
    if      (eco < 5)  bd.ecoBonus = PTS.ECO_BELOW_5;
    else if (eco < 6)  bd.ecoBonus = PTS.ECO_5_6;
    else if (eco < 7)  bd.ecoBonus = PTS.ECO_6_7;
    else if (eco > 12) bd.ecoBonus = PTS.ECO_ABOVE_12;
    else if (eco > 11) bd.ecoBonus = PTS.ECO_11_12;
    else if (eco > 10) bd.ecoBonus = PTS.ECO_10_11;
    pts += bd.ecoBonus;
  }

  return { pts, breakdown: bd };
}

// ─── Fielding Points ──────────────────────────────────────────────────────────
export function calcFieldingPts(fielding) {
  if (!fielding) return { pts: 0, breakdown: {} };

  const catches   = fielding.catch    ?? 0;
  const stumpings = fielding.stumped  ?? 0;
  const runouts   = fielding.runout   ?? 0; // direct
  const throws    = fielding.throw    ?? 0; // indirect (if API provides)

  let pts = 0;
  const bd = {};

  bd.catches   = catches   * PTS.CATCH;
  bd.stumpings = stumpings * PTS.STUMPING;
  bd.runouts   = runouts   * PTS.RUNOUT_DIRECT;
  bd.throws    = throws    * PTS.RUNOUT_THROW;
  bd.catchBonus = catches >= 3 ? PTS.THREE_CATCHES : 0;

  pts += bd.catches + bd.stumpings + bd.runouts + bd.throws + bd.catchBonus;

  return { pts, breakdown: bd };
}

// ─── LBW / Bowled Cross-Reference ────────────────────────────────────────────
// Pass in the full batting scorecard array, returns { bowlerName: count }
export function parseLbwBowledBonus(battingRows) {
  const counts = {};
  for (const batter of battingRows) {
    const d = (batter.dismissal ?? "").toLowerCase();
    if (d.startsWith("lbw b ") || d.startsWith("b ")) {
      // Extract bowler name after "b " or "lbw b "
      const bowler = d.replace(/^lbw b /, "").replace(/^b /, "").trim();
      counts[bowler] = (counts[bowler] ?? 0) + 1;
    }
  }
  return counts;
}

// ─── Master Calculator ────────────────────────────────────────────────────────
// scorecardData: raw API response from cricapi match_scorecard
// playerDb: PLAYERS object from players.js
// Returns: { [playerId]: { name, team, role, total, batting, bowling, fielding, playing } }
export function calculateMatchPoints(scorecardData, playerDb) {
  const result = {};

  // Build name→id map for fast lookup (lowercase, trimmed)
  const nameToId = Object.entries(playerDb).reduce((acc, [id, p]) => {
    acc[p.name.toLowerCase().trim()] = id;
    return acc;
  }, {});

  const resolveId = (name) => nameToId[name?.toLowerCase()?.trim()] ?? null;

  // Collect all batting rows from both innings
  const allBatting = [];
  const innings = scorecardData?.scorecard ?? [];

  for (const inn of innings) {
    const batting = inn.batting ?? [];
    const bowling = inn.bowling ?? [];

    // Build LBW/bowled bonus map for this innings
    const lbwMap = parseLbwBowledBonus(batting);

    // Process batting
    for (const row of batting) {
      allBatting.push(row);
      const id = resolveId(row.batsman?.name ?? row.name);
      if (!id) continue;
      if (!result[id]) result[id] = _init(id, playerDb[id]);
      const { pts, breakdown } = calcBattingPts(row);
      result[id].batting.pts       += pts;
      result[id].batting.breakdown  = { ...result[id].batting.breakdown, ...breakdown };
      result[id].played = true;
    }

    // Process bowling
    for (const row of bowling) {
      const id = resolveId(row.bowler?.name ?? row.name);
      if (!id) continue;
      if (!result[id]) result[id] = _init(id, playerDb[id]);
      const bowlerName = (row.bowler?.name ?? row.name ?? "").toLowerCase().trim();
      const lbwCount = lbwMap[bowlerName] ?? 0;
      const { pts, breakdown } = calcBowlingPts(row, lbwCount);
      result[id].bowling.pts       += pts;
      result[id].bowling.breakdown  = { ...result[id].bowling.breakdown, ...breakdown };
      result[id].played = true;
    }

    // Process fielding (catches/stumpings per innings)
    const fieldingMap = _extractFielding(batting);
    for (const [name, fielding] of Object.entries(fieldingMap)) {
      const id = resolveId(name);
      if (!id) continue;
      if (!result[id]) result[id] = _init(id, playerDb[id]);
      const { pts, breakdown } = calcFieldingPts(fielding);
      result[id].fielding.pts       += pts;
      result[id].fielding.breakdown  = { ...result[id].fielding.breakdown, ...breakdown };
      result[id].played = true;
    }
  }

  // Add playing XI bonus + compute totals
  for (const id of Object.keys(result)) {
    if (result[id].played) {
      result[id].playing = PTS.PLAYING;
    }
    result[id].total =
      result[id].playing +
      result[id].batting.pts +
      result[id].bowling.pts +
      result[id].fielding.pts;
  }

  return result;
}

// ─── Captain / Vice-Captain multiplier ───────────────────────────────────────
export function applyMultipliers(pointsMap, captainId, vcId) {
  const out = { ...pointsMap };
  if (captainId && out[captainId]) {
    out[captainId] = { ...out[captainId], total: out[captainId].total * 2 };
  }
  if (vcId && out[vcId]) {
    out[vcId] = { ...out[vcId], total: out[vcId].total * 1.5 };
  }
  return out;
}

// ─── Squad total ──────────────────────────────────────────────────────────────
export function calcSquadTotal(pointsMap, squadIds, captainId, vcId) {
  const withMult = applyMultipliers(pointsMap, captainId, vcId);
  return squadIds.reduce((sum, id) => sum + (withMult[id]?.total ?? 0), 0);
}

// ─── Private Helpers ──────────────────────────────────────────────────────────
function _init(id, player) {
  return {
    id,
    name:    player?.name ?? id,
    team:    player?.team ?? "",
    role:    player?.role ?? "",
    played:  false,
    playing: 0,
    batting:  { pts: 0, breakdown: {} },
    bowling:  { pts: 0, breakdown: {} },
    fielding: { pts: 0, breakdown: {} },
    total:    0,
  };
}

// Extract fielding contributions from batting dismissal strings
// Returns { fielderName: { catch, stumped, runout } }
function _extractFielding(battingRows) {
  const map = {};
  const add = (name, key) => {
    if (!name) return;
    name = name.toLowerCase().trim();
    if (!map[name]) map[name] = { catch: 0, stumped: 0, runout: 0 };
    map[name][key]++;
  };

  for (const row of battingRows) {
    const d = (row.dismissal ?? "").toLowerCase().trim();
    if (!d || d === "not out" || d === "did not bat") continue;

    if (d.startsWith("c ") && d.includes(" b ")) {
      // "c FielderName b BowlerName"
      const fielder = d.replace(/^c /, "").split(" b ")[0].trim();
      if (fielder !== "&") add(fielder, "catch"); // "c & b" = caught-and-bowled (no fielder)
    } else if (d.startsWith("c&b ") || d === "c & b") {
      // caught and bowled — no fielder credit
    } else if (d.startsWith("st ")) {
      // "st KeeperName b BowlerName"
      const keeper = d.replace(/^st /, "").split(" b ")[0].trim();
      add(keeper, "stumped");
    } else if (d.startsWith("run out")) {
      // "run out (FielderName)" or "run out"
      const match = d.match(/\(([^)]+)\)/);
      if (match) add(match[1].trim(), "runout");
    }
  }
  return map;
}
