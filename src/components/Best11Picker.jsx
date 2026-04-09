// src/components/Best11Picker.jsx
// Best XI squad picker — per match, per user
// Props:
//   matchNum   : number
//   team1      : "RCB"
//   team2      : "CSK"
//   locked     : bool
//   currentUser: { uid, displayName }
//   onSave     : async fn({ squad, captain, vc })

import { useState, useMemo, useEffect } from "react";
import { PLAYERS, getMatchPlayers } from "../data/players";
import { getB11Pick } from "../utils/b11Firebase";

// ── Role constraints (Dream11-style) ─────────────────────────────────────────
const CONSTRAINTS = {
  WK:   { min: 1, max: 4, label: "WK" },
  BAT:  { min: 3, max: 6, label: "BAT" },
  AR:   { min: 1, max: 4, label: "AR" },
  BOWL: { min: 3, max: 6, label: "BOWL" },
};
const SQUAD_SIZE = 11;
const MAX_PER_TEAM = 7;

export default function Best11Picker({ matchNum, team1, team2, locked, currentUser, onSave }) {
  const [squad,    setSquad]    = useState([]);   // array of playerIds (max 11)
  const [captain,  setCaptain]  = useState(null);
  const [vc,       setVc]       = useState(null);
  const [filter,   setFilter]   = useState("ALL"); // ALL | WK | BAT | AR | BOWL | team1 | team2
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [existing, setExisting] = useState(null);
  const [tab,      setTab]      = useState("pick"); // "pick" | "squad"

  // Load existing pick on mount
  useEffect(() => {
    if (!currentUser?.uid || !matchNum) return;
    getB11Pick(matchNum, currentUser.uid).then((pick) => {
      if (pick) {
        setExisting(pick);
        setSquad(pick.squad);
        setCaptain(pick.captain);
        setVc(pick.vc);
        setSaved(true);
        setTab("squad");
      }
    });
  }, [matchNum, currentUser?.uid]);

  // All players for this match
  const allPlayers = useMemo(() => getMatchPlayers(team1, team2), [team1, team2]);

  // Filtered player list
  const filtered = useMemo(() => {
    return allPlayers.filter((p) => {
      if (filter === "ALL")   return true;
      if (filter === team1)   return p.team === team1;
      if (filter === team2)   return p.team === team2;
      return p.role === filter;
    });
  }, [allPlayers, filter, team1, team2]);

  // Role counts in current squad
  const roleCounts = useMemo(() => {
    const counts = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };
    for (const id of squad) {
      const role = PLAYERS[id]?.role;
      if (role) counts[role]++;
    }
    return counts;
  }, [squad]);

  // Team counts in current squad
  const teamCounts = useMemo(() => {
    const counts = { [team1]: 0, [team2]: 0 };
    for (const id of squad) {
      const t = PLAYERS[id]?.team;
      if (t) counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
  }, [squad, team1, team2]);

  // Can a player be added?
  const canAdd = (pid) => {
    if (squad.includes(pid)) return false;
    if (squad.length >= SQUAD_SIZE) return false;
    const p = PLAYERS[pid];
    if (!p) return false;
    // Team cap
    if ((teamCounts[p.team] || 0) >= MAX_PER_TEAM) return false;
    // Role cap
    const roleMax = CONSTRAINTS[p.role]?.max ?? 6;
    if (roleCounts[p.role] >= roleMax) return false;
    return true;
  };

  // Validation errors
  const errors = useMemo(() => {
    const errs = [];
    if (squad.length < SQUAD_SIZE) {
      errs.push(`Select ${SQUAD_SIZE - squad.length} more player${squad.length === 10 ? "" : "s"}`);
    }
    for (const [role, { min, label }] of Object.entries(CONSTRAINTS)) {
      if (roleCounts[role] < min) {
        errs.push(`Need at least ${min} ${label}`);
      }
    }
    if (!captain) errs.push("Choose a Captain");
    if (!vc)      errs.push("Choose a Vice Captain");
    return errs;
  }, [squad, roleCounts, captain, vc]);

  const isValid = errors.length === 0;

  // Toggle player in/out of squad
  const togglePlayer = (pid) => {
    if (locked) return;
    if (squad.includes(pid)) {
      setSquad((s) => s.filter((id) => id !== pid));
      if (captain === pid) setCaptain(null);
      if (vc === pid)      setVc(null);
    } else {
      if (canAdd(pid)) setSquad((s) => [...s, pid]);
    }
  };

  // Set C / VC
  const setRole = (pid, role) => {
    if (!squad.includes(pid)) return;
    if (role === "C") {
      setCaptain(pid);
      if (vc === pid) setVc(null);
    } else {
      setVc(pid);
      if (captain === pid) setCaptain(null);
    }
  };

  // Save
  const handleSave = async () => {
    if (!isValid || saving || locked) return;
    setSaving(true);
    try {
      await onSave({ squad, captain, vc });
      setSaved(true);
      setTab("squad");
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Render helpers ──────────────────────────────────────────────────────────

  const roleColor = { WK: "#f59e0b", BAT: "#3b82f6", AR: "#8b5cf6", BOWL: "#10b981" };
  const teamColor = (t) => t === team1 ? "#e11d48" : "#0ea5e9";

  const PlayerCard = ({ pid }) => {
    const p = PLAYERS[pid];
    if (!p) return null;
    const inSquad   = squad.includes(pid);
    const isCap     = captain === pid;
    const isVC      = vc === pid;
    const addable   = canAdd(pid);

    return (
      <div
        onClick={() => togglePlayer(pid)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10, marginBottom: 6, cursor: locked ? "default" : "pointer",
          background: inSquad ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${inSquad ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
          opacity: (!inSquad && !addable) ? 0.4 : 1,
          transition: "all 0.15s",
        }}
      >
        {/* Role badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
          background: roleColor[p.role], color: "#fff", minWidth: 34, textAlign: "center",
        }}>{p.role}</span>

        {/* Name + team */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{p.name}</div>
          <div style={{ fontSize: 11, color: teamColor(p.team), fontWeight: 500 }}>{p.team}</div>
        </div>

        {/* Credit */}
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.credit}cr</div>

        {/* C / VC buttons (only if in squad) */}
        {inSquad && !locked && (
          <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setRole(pid, "C")}
              style={{
                fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, border: "none",
                background: isCap ? "#f59e0b" : "rgba(255,255,255,0.1)",
                color: isCap ? "#000" : "#94a3b8", cursor: "pointer",
              }}
            >C</button>
            <button
              onClick={() => setRole(pid, "VC")}
              style={{
                fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 5, border: "none",
                background: isVC ? "#a78bfa" : "rgba(255,255,255,0.1)",
                color: isVC ? "#000" : "#94a3b8", cursor: "pointer",
              }}
            >VC</button>
          </div>
        )}

        {/* Lock indicator */}
        {inSquad && locked && (
          <div style={{ display: "flex", gap: 4 }}>
            {isCap && <span style={{ fontSize: 11, background: "#f59e0b", color: "#000", padding: "2px 7px", borderRadius: 5, fontWeight: 700 }}>C</span>}
            {isVC  && <span style={{ fontSize: 11, background: "#a78bfa", color: "#000", padding: "2px 7px", borderRadius: 5, fontWeight: 700 }}>VC</span>}
          </div>
        )}

        {/* Checkmark */}
        {inSquad && <span style={{ color: "#6366f1", fontSize: 16 }}>✓</span>}
      </div>
    );
  };

  // ── Role counter bar ────────────────────────────────────────────────────────
  const RoleBar = () => (
    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
      {Object.entries(CONSTRAINTS).map(([role, { min, max, label }]) => {
        const count = roleCounts[role];
        const ok = count >= min;
        return (
          <div key={role} style={{
            padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${ok ? "#10b981" : "#ef4444"}`,
            color: ok ? "#10b981" : "#ef4444",
          }}>
            {label}: {count}/{max} <span style={{ opacity: 0.6 }}>(min {min})</span>
          </div>
        );
      })}
      <div style={{
        padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
        background: "rgba(99,102,241,0.15)", border: "1px solid #6366f1", color: "#a5b4fc",
      }}>
        {squad.length}/{SQUAD_SIZE}
      </div>
    </div>
  );

  // ── Filter tabs ─────────────────────────────────────────────────────────────
  const FilterBar = () => {
    const filters = ["ALL", team1, team2, "WK", "BAT", "AR", "BOWL"];
    return (
      <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600,
            background: filter === f ? "#6366f1" : "rgba(255,255,255,0.07)",
            color: filter === f ? "#fff" : "#94a3b8", cursor: "pointer", whiteSpace: "nowrap",
          }}>{f}</button>
        ))}
      </div>
    );
  };

  // ── Squad summary view ──────────────────────────────────────────────────────
  const SquadView = () => {
    const grouped = { WK: [], BAT: [], AR: [], BOWL: [] };
    for (const pid of squad) {
      const role = PLAYERS[pid]?.role;
      if (role) grouped[role].push(pid);
    }
    return (
      <div>
        {["WK","BAT","AR","BOWL"].map((role) => (
          grouped[role].length > 0 && (
            <div key={role} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: roleColor[role], marginBottom: 6, letterSpacing: 1 }}>
                {role} ({grouped[role].length})
              </div>
              {grouped[role].map((pid) => <PlayerCard key={pid} pid={pid} />)}
            </div>
          )
        ))}
        {!locked && (
          <button
            onClick={() => setTab("pick")}
            style={{
              width: "100%", padding: "10px", borderRadius: 10, border: "1px dashed #6366f1",
              background: "transparent", color: "#6366f1", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginTop: 6,
            }}
          >
            ✏️ Edit Squad
          </button>
        )}
      </div>
    );
  };

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "#0f172a", color: "#f1f5f9",
      borderRadius: 14, padding: 16, maxWidth: 480, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            {team1} <span style={{ color: "#475569" }}>vs</span> {team2}
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Match {matchNum} · Best XI</div>
        </div>
        {locked ? (
          <span style={{ fontSize: 11, background: "#ef4444", color: "#fff", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>
            🔒 LOCKED
          </span>
        ) : (
          <span style={{ fontSize: 11, background: "#10b981", color: "#fff", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>
            ✅ OPEN
          </span>
        )}
      </div>

      {/* Tabs */}
      {squad.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["pick","squad"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600,
              background: tab === t ? "#6366f1" : "rgba(255,255,255,0.07)",
              color: tab === t ? "#fff" : "#94a3b8", cursor: "pointer",
              textTransform: "capitalize",
            }}>
              {t === "pick" ? "🔍 Pick Players" : `📋 My Squad (${squad.length})`}
            </button>
          ))}
        </div>
      )}

      {tab === "pick" ? (
        <>
          <RoleBar />
          <FilterBar />

          {/* Player list */}
          <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", color: "#475569", padding: 24, fontSize: 13 }}>
                No players found
              </div>
            )}
            {filtered.map((p) => <PlayerCard key={p.id} pid={p.id} />)}
          </div>

          {/* Errors + Save */}
          <div style={{ marginTop: 14 }}>
            {errors.length > 0 && squad.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                {errors.map((e, i) => (
                  <div key={i} style={{ fontSize: 11, color: "#f87171", marginBottom: 3 }}>⚠ {e}</div>
                ))}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={!isValid || saving || locked}
              style={{
                width: "100%", padding: "13px", borderRadius: 10, border: "none",
                background: isValid && !locked ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.07)",
                color: isValid && !locked ? "#fff" : "#475569",
                fontSize: 14, fontWeight: 700, cursor: isValid && !locked ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {saving ? "Saving…" : saved ? "✅ Update Squad" : "✅ Lock In Squad"}
            </button>
          </div>
        </>
      ) : (
        <SquadView />
      )}
    </div>
  );
}
