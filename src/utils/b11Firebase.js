// src/utils/b11Firebase.js
// Firebase helpers for Best XI feature
// Uses the same Firebase instance as the main app (ipl2026-fantasy-20c9b)
// All nodes prefixed with ipl26_b11_

const PFX = "ipl26_";

// Reuse the same lazy Firebase initialisation pattern as App.jsx
const firebaseConfig = {
  apiKey: "AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",
  authDomain: "ipl2026-fantasy-20c9b.firebaseapp.com",
  databaseURL: "https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",
  projectId: "ipl2026-fantasy-20c9b",
  storageBucket: "ipl2026-fantasy-20c9b.firebasestorage.app",
  messagingSenderId: "973930153403",
  appId: "1:973930153403:web:872ce26072b07e1adf309e",
};

const firebaseReady = (async () => {
  const [app, db] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"),
  ]);
  const _app = app.getApps().length ? app.getApp() : app.initializeApp(firebaseConfig);
  return { app: _app, db: db.getDatabase(_app), dbMod: db };
})();

async function dbGet(key) {
  try {
    const { db, dbMod } = await firebaseReady;
    const snap = await dbMod.get(dbMod.ref(db, PFX + key));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    console.error("b11 DB.get", key, e);
    return null;
  }
}

async function dbSet(key, value) {
  try {
    const { db, dbMod } = await firebaseReady;
    if (value === null || value === undefined) {
      await dbMod.remove(dbMod.ref(db, PFX + key));
    } else {
      await dbMod.set(dbMod.ref(db, PFX + key), value);
    }
  } catch (e) {
    console.error("b11 DB.set", key, e);
  }
}

// ── Save a user's Best XI pick for a match ────────────────────────────────
// matchNum : number (match id, e.g. 14)
// userId   : encoded email key (myEk from App.jsx)
// { squad, captain, vc }
export async function saveB11Pick(matchNum, userId, { squad, captain, vc }) {
  if (!squad || squad.length !== 11) throw new Error("Squad must have exactly 11 players");
  if (!squad.includes(captain))       throw new Error("Captain must be in squad");
  if (!squad.includes(vc))            throw new Error("VC must be in squad");
  if (captain === vc)                 throw new Error("Captain and VC must be different");

  await dbSet(`b11_picks/${matchNum}/${userId}`, {
    squad,
    captain,
    vc,
    lockedAt: Date.now(),
    total: 0,
  });
}

// ── Get a user's pick for a match ─────────────────────────────────────────
export async function getB11Pick(matchNum, userId) {
  return await dbGet(`b11_picks/${matchNum}/${userId}`);
}

// ── Get processed points results for a match ──────────────────────────────
export async function getB11Results(matchNum) {
  return await dbGet(`b11_results/${matchNum}`);
}

// ── Admin: write processed results for a match ────────────────────────────
export async function writeB11Results(matchNum, playerPoints) {
  await dbSet(`b11_results/${matchNum}`, {
    status: "done",
    processedAt: Date.now(),
    players: playerPoints,
  });
}

// ── Admin: update all user season totals after a match result ─────────────
// allUsersPoints: { userId: { total, displayName } }
export async function updateB11Leaderboard(matchNum, allUsersPoints) {
  for (const [uid, data] of Object.entries(allUsersPoints)) {
    const existing = (await dbGet(`b11_leaderboard/${uid}`)) || {
      totalPts: 0,
      matchesPlayed: 0,
      bestScore: 0,
      bestMatch: null,
    };
    await dbSet(`b11_leaderboard/${uid}`, {
      displayName: data.displayName,
      totalPts: (existing.totalPts || 0) + data.total,
      matchesPlayed: (existing.matchesPlayed || 0) + 1,
      bestScore: Math.max(existing.bestScore || 0, data.total),
      bestMatch:
        data.total > (existing.bestScore || 0) ? matchNum : existing.bestMatch,
    });
  }
}

// ── Get Best XI leaderboard ───────────────────────────────────────────────
export async function getB11Leaderboard() {
  return (await dbGet("b11_leaderboard")) || {};
}

// ── Get all picks for a match (admin use) ────────────────────────────────
export async function getAllB11Picks(matchNum) {
  return (await dbGet(`b11_picks/${matchNum}`)) || {};
}
