// firebase.js
// Single source of truth for Firebase access.
// The DB is now created via a factory bound to a key-prefix, so a second
// tournament (e.g. "ipl27_") can get its own isolated DB without touching
// any of the scoring or UI code. The default export `DB` keeps the existing
// "ipl26_" prefix so nothing in App.jsx has to change today.

import { deepEncodeKeys, normalizeAP } from "./cricketScoring.js";

import { firebaseConfig } from "./firebaseConfig.js";
export { firebaseConfig };

// Memoised module loader — initialises the app exactly once.
let _readyCache = null;
export function firebaseReady() {
  if (_readyCache) return _readyCache;
  _readyCache = (async () => {
    const [app, db] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"),
    ]);
    const _app = app.getApps().length ? app.getApp() : app.initializeApp(firebaseConfig);
    return { app: _app, db: db.getDatabase(_app), dbMod: db };
  })();
  return _readyCache;
}

// Factory: returns a DB object bound to a given prefix.
export function createDB(prefix) {
  const DB = {
    prefix,
    get: async (k) => {
      try {
        const { db, dbMod } = await firebaseReady();
        const snap = await dbMod.get(dbMod.ref(db, prefix + k));
        return snap.exists() ? snap.val() : null;
      } catch (e) {
        console.error("DB.get", k, e);
        return null;
      }
    },
    set: async (k, v) => {
      try {
        const { db, dbMod } = await firebaseReady();
        const sv =
          k === "ap" && typeof v === "object" && v !== null && !Array.isArray(v)
            ? deepEncodeKeys(v)
            : v;
        if (sv === null || sv === undefined) await dbMod.remove(dbMod.ref(db, prefix + k));
        else await dbMod.set(dbMod.ref(db, prefix + k), sv);
      } catch (e) {
        console.error("DB.set", k, e);
      }
    },
    // Atomic single-pick write — avoids read-modify-write clobbering on
    // double-header days.
    setUserPick: async (userKey, matchId, pick) => {
      try {
        const { db, dbMod } = await firebaseReady();
        const path = `${prefix}ap/${userKey}/${String(matchId)}`;
        await dbMod.set(dbMod.ref(db, path), pick);
        return true;
      } catch (e) {
        console.error("DB.setUserPick", e);
        return false;
      }
    },
    // Real-time listener on a node. Calls cb(value) on every change.
    // Returns an unsubscribe function. Safe to call before firebase is ready.
    subscribe: (k, cb) => {
      let off = null,
        cancelled = false;
      firebaseReady()
        .then(({ db, dbMod }) => {
          if (cancelled) return;
          const r = dbMod.ref(db, prefix + k);
          const handler = (snap) => cb(snap.exists() ? snap.val() : null);
          dbMod.onValue(r, handler);
          off = () => dbMod.off(r, "value", handler);
        })
        .catch((e) => console.error("DB.subscribe", k, e));
      return () => {
        cancelled = true;
        if (off) off();
      };
    },
    // Full re-normalisation of the ap subtree. Idempotent.
    repairAllPicks: async () => {
      try {
        const raw = await DB.get("ap");
        if (!raw) return true;
        const fixed = normalizeAP(raw);
        await DB.set("ap", fixed);
        return true;
      } catch (e) {
        console.error("DB.repairAllPicks", e);
        return false;
      }
    },
  };
  return DB;
}

// Default DB for the current (IPL 2026) tournament — back-compat with App.jsx.
export const PFX = "ipl26_";
export const DB = createDB(PFX);
