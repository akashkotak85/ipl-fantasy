// cricketScoring.js
// Pure, framework-free helpers: email/key encoding, validation, match-time
// logic, and all scoring. No React, no Firebase imports here — this module
// is safe to unit-test in isolation and is shared by App.jsx, PickStatusPanel,
// and (later) any other cricket tournament screen.

import { PTS, SCORE_BANDS, PROP_QUESTIONS } from "./cricketData.js";

/* ---- constants ---- */
export const NR = "NO_RESULT";
export const CHAT_MAX = 400;
export const CHAT_CAP = 500;

/* ---- email / key encoding ---- */
export const encodeEmail = (e) =>
  (e || "").trim().toLowerCase().replace(/\./g, "_dot_").replace(/@/g, "_at_");
export const ek = (e) => encodeEmail(e);
export const normalizeEmail = (e) => (e || "").trim().toLowerCase();
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const decodeKey = (k) => {
  let d = k;
  for (let i = 0; i < 8; i++) {
    const n = d.replace(/_at_/g, "@").replace(/_dot_/g, ".");
    if (n === d) break;
    d = n;
  }
  return d;
};
export const canonicalKey = (k) => ek(decodeKey(k));

export function normalizeKeyMap(raw) {
  if (!raw) return {};
  const out = {};
  Object.keys(raw).forEach((k) => {
    out[canonicalKey(k)] = raw[k];
  });
  return out;
}

export function deepEncodeKeys(v) {
  if (!v || typeof v !== "object" || Array.isArray(v)) return v;
  const r = {};
  Object.keys(v).forEach((k) => {
    const isEmailKey = k.includes("@") || k.includes("_at_");
    r[isEmailKey ? ek(k) : k] = deepEncodeKeys(v[k]);
  });
  return r;
}

/*
  normalizeAP — recovers Firebase-coerced integer/array keys back to string
  match-id keys. Never silently drops a pick; keeps any pick that has at least
  one meaningful field. (See the original inline comment for the full history.)
*/
export function normalizeAP(raw) {
  if (!raw) return {};
  const out = {};
  Object.keys(raw).forEach((k) => {
    const ck = canonicalKey(k);
    const userPicks = raw[k];
    if (!userPicks || typeof userPicks !== "object") {
      out[ck] = {};
      return;
    }
    const normalized = {};
    const entries = Array.isArray(userPicks)
      ? userPicks
          .map((pick, idx) => [String(idx), pick])
          .filter(([, pick]) => pick && typeof pick === "object")
      : Object.entries(userPicks);
    entries.forEach(([mid, pick]) => {
      if (!pick || typeof pick !== "object" || Array.isArray(pick)) return;
      const smid = String(mid);
      if (pick.toss || pick.win || pick.motm || pick.sb) {
        normalized[smid] = {
          toss: pick.toss || "",
          win: pick.win || "",
          motm: pick.motm || "",
          sb: pick.sb || "",
        };
      }
    });
    out[ck] = normalized;
  });
  return out;
}

/* ---- validation / misc ---- */
export function validateEmail(e) {
  if (!e?.trim()) return "Email is required";
  if (!EMAIL_RE.test(e.trim())) return "Enter a valid email";
  return "";
}
export function validatePassword(p, mode = "login") {
  if (!p) return "Password is required";
  if (mode === "register") {
    if (p.length < 8) return "Min 8 characters";
    if (!/[A-Z]/.test(p)) return "Add an uppercase letter";
    if (!/[0-9]/.test(p)) return "Add a number";
    if (!/[^A-Za-z0-9]/.test(p)) return "Add a special character";
  }
  return "";
}
export function validateName(n) {
  if (!n || n.trim().length < 2) return "Name must be at least 2 characters";
  return "";
}
export function capChat(arr) {
  return arr.length > CHAT_CAP ? arr.slice(arr.length - CHAT_CAP) : arr;
}
export async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const isNR = (v) => !v || v === NR;
export const showVal = (v, fallback = "—") => (isNR(v) ? "🚫 No Result" : v || fallback);

/*
  getP — fetches a pick by id, tolerating String/Number key drift. A pick with
  no toss/win/motm is treated as absent (prevents ghost empty picks).
*/
export const getP = (picks, id) => {
  if (!picks || typeof picks !== "object") return null;
  const found = picks[String(id)] ?? picks[Number(id)] ?? null;
  if (!found) return null;
  if (!found.toss && !found.win && !found.motm) return null;
  return found;
};

export const pickKey = (id) => String(id);

export function getTeamForm(team, matches, n = 5) {
  return matches
    .filter((m) => m.result && (m.home === team || m.away === team))
    .slice(-n)
    .map((m) => {
      if (isNR(m.result.win)) return "NR";
      if (m.result.win === team) return "W";
      return "L";
    });
}

/* ---- match-time helpers ---- */
export function parseMatchDate(date, time) {
  try {
    const t = (time || "00:00").trim();
    const p = t.length === 4 ? "0" + t : t;
    const d = new Date(date + "T" + p + ":00+05:30");
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}
export const cutoff = (m) => {
  const d = parseMatchDate(m.date, m.time);
  return d ? new Date(d - 35 * 60 * 1000) : new Date(0);
};
export const isMatchLocked = (m, lm = {}) => {
  if (m.result) return true;
  const st = lm[m.id] ?? lm[String(m.id)];
  if (st === "unlocked") return false;
  if (st === "locked") return true;
  return new Date() >= cutoff(m);
};
export const isToday = (m) =>
  m.date === new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
export const isTBD = (m) =>
  (m.home || "").startsWith("TBD") || (m.away || "").startsWith("TBD");
export const motmMatch = (a, b) => {
  if (!a || !b || isNR(a) || isNR(b)) return false;
  const n = (s) => s.trim().toLowerCase();
  const na = n(a),
    nb = n(b);
  return (
    na === nb ||
    na.endsWith(" " + nb) ||
    nb.endsWith(" " + na) ||
    na.includes(nb) ||
    nb.includes(na)
  );
};

export function resolvePlayoffSlots(base, br) {
  if (!br) return base;
  return base.map((m) => {
    let { home, away } = { ...m };
    if (m.mn === "Q1" && br.q1?.length === 2) [home, away] = [br.q1[0], br.q1[1]];
    if (m.mn === "EL1" && br.el?.length === 2) [home, away] = [br.el[0], br.el[1]];
    if (m.mn === "Q2" && br.q2?.length === 2) [home, away] = [br.q2[0], br.q2[1]];
    if (m.mn === "Final" && br.final?.length === 2) [home, away] = [br.final[0], br.final[1]];
    return { ...m, home, away };
  });
}

export function applyRmEntry(base, r) {
  if (!r) return base;
  if (r.result && typeof r.result === "object") {
    return { ...base, ...r, result: r.result, _partial: null };
  }
  const partialResult = {};
  if (r.toss != null) partialResult.toss = r.toss;
  if (r.win != null) partialResult.win = r.win;
  if (r.motm != null) partialResult.motm = r.motm;
  const hasPartial = Object.keys(partialResult).length > 0;
  if (r.status === "completed" && hasPartial) {
    return { ...base, ...r, result: partialResult, _partial: null };
  }
  return { ...base, ...r, result: null, _partial: hasPartial ? partialResult : null };
}

/* ---- core scoring (toss / win / motm / streak) ---- */
export function calcScore(uPicks, ms, dbl = null) {
  let pts = 0,
    ok = 0,
    tot = 0,
    ms2 = {};
  ms.forEach((m) => {
    if (!m.result) return;
    const p = getP(uPicks, m.id);
    if (!p) return;
    const mult = dbl != null && Number(dbl) === Number(m.id) ? 2 : 1;
    tot++;
    let base = 0,
      h = 0;
    const tA = !isNR(m.result.toss),
      wA = !isNR(m.result.win),
      mA = !isNR(m.result.motm);
    if (tA && p.toss === m.result.toss) {
      base += PTS.toss;
      h++;
    }
    if (wA && p.win === m.result.win) {
      base += PTS.win;
      h++;
    }
    if (mA && motmMatch(p.motm, m.result.motm)) {
      base += PTS.motm;
      h++;
    }
    if (tA && wA && mA && h === 3) base += PTS.streak;
    const mp = base * mult;
    if (h > 0) ok++;
    pts += mp;
    ms2[m.id] = { pts: mp, h, perf: tA && wA && mA && h === 3 };
  });
  const played = ms.filter((m) => m.result && getP(uPicks, m.id));
  const last = played[played.length - 1];
  return {
    pts,
    acc: tot ? Math.round((ok / tot) * 100) : 0,
    ms2,
    hot: !!(last && ms2[last.id]?.perf),
  };
}

export function calcBadges(uPicks, ms, allP) {
  const b = [];
  const { ms2 } = calcScore(uPicks, ms);
  const done = ms.filter((m) => m.result);
  const perf = done.filter((m) => ms2[m.id]?.perf).length;
  if (perf >= 1) b.push({ id: "p1", ic: "🎯", lb: "Perfect Match" });
  if (perf >= 3) b.push({ id: "p3", ic: "🎩", lb: "Hat-Trick Hero" });
  let ud = 0;
  done.forEach((m) => {
    const p = getP(uPicks, m.id);
    if (!p || isNR(m.result.win) || p.win !== m.result.win) return;
    const ae = Object.values(allP);
    const t2 = ae.filter((u) => getP(u, m.id)).length || 1;
    if (ae.filter((u) => getP(u, m.id)?.win === m.result.win).length / t2 < 0.5) ud++;
  });
  if (ud >= 1) b.push({ id: "ud", ic: "🐺", lb: "Underdog King" });
  if (done.filter((m) => ms2[m.id]?.h >= 2).length >= 3)
    b.push({ id: "con", ic: "📈", lb: "Consistent" });
  if (Object.keys(uPicks).length >= 10) b.push({ id: "act", ic: "⚡", lb: "Active Predictor" });
  return b;
}

/* ---------------------------------------------------------------------------
   BUG FIX #1 — multiplier-aware bonus / score-band / prop scoring.
   The old App.jsx reducers for bonus & score band did NOT apply the
   double-header 2× multiplier, so the leaderboard disagreed with the
   per-match screens and with the Rules text. These helpers are the single
   source of truth and DO apply the multiplier. Use them everywhere.
   --------------------------------------------------------------------------- */
export function calcBonusPts(userBonusPicks, bonusAnswers, ms, dbl = null) {
  return ms
    .filter((m) => m.result)
    .reduce((s, m) => {
      const ans = bonusAnswers[String(m.id)] ?? bonusAnswers[Number(m.id)];
      if (ans == null) return s;
      const my = userBonusPicks[String(m.id)];
      if (my == null) return s;
      const mult = dbl != null && Number(dbl) === Number(m.id) ? 2 : 1;
      return s + (my === ans ? PTS.bonus * mult : 0);
    }, 0);
}

export function calcScoreBandPts(uPicks, scoreBandAnswers, ms, dbl = null) {
  return ms
    .filter((m) => m.result)
    .reduce((s, m) => {
      const ans = scoreBandAnswers[String(m.id)] ?? scoreBandAnswers[Number(m.id)];
      if (!ans) return s;
      const p = getP(uPicks, m.id);
      if (!p?.sb) return s;
      const mult = dbl != null && Number(dbl) === Number(m.id) ? 2 : 1;
      return s + (p.sb === ans ? PTS.scoreBand * mult : 0);
    }, 0);
}

// Season-long props are NOT per-match, so no multiplier (intentional).
export function calcPropPts(userProps, propAnswers) {
  // Iterate over the answers that actually exist (q0, q1, …) rather than a fixed
  // count, so tournaments with a different number of prop questions score correctly.
  if (!userProps || !propAnswers) return 0;
  return Object.keys(propAnswers).reduce((s, k) => {
    const ans = propAnswers[k];
    const my = userProps[k];
    if (!ans || my == null || my === "") return s;
    return s + (String(my) === String(ans) ? PTS.prop : 0);
  }, 0);
}

// Convenience used by SCORE_BANDS lookups in the UI.
export const bandById = (id) => SCORE_BANDS.find((b) => b.id === id) || null;
