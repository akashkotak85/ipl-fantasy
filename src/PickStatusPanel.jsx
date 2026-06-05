// PickStatusPanel.jsx
// Admin "Pick Status" tab. Extracted from App.jsx.
//
// BUG FIX #3: the table header and body columns were misaligned (Pts/Bonus
// swapped, reset column had no header, colSpan was off by one). The column
// order is now a single source of truth: Player, Toss, Win, POTM, Band,
// Bonus, [Pts if result], Action.

import * as React from "react";
import { useState, useEffect } from "react";
import { SCORE_BANDS, PTS } from "./cricketData.js";
import { ek, getP, isNR, motmMatch, isMatchLocked, isTBD } from "./cricketScoring.js";
import { Av, TLogo } from "./cricketUI.jsx";

export default function PickStatusPanel({
  ms,
  users,
  allPicks,
  doubleMatch,
  lockedMatches,
  adminEmail,
  scoreBandAnswers,
  bonusAnswers,
  allBonusPicks,
  TEAMS,
  TC,
  SQ,
  DB,
}) {
  const playableMs = ms
    .filter((m) => !isTBD(m) && TEAMS.includes(m.home) && TEAMS.includes(m.away))
    .sort((a, b) => Number(a.id) - Number(b.id));
  const [psMatch, setPsMatch] = useState(null);
  // Auto-select first match once matches load (handles async reloadShared timing)
  useEffect(() => {
    if (psMatch === null && playableMs.length > 0) {
      setPsMatch(playableMs[0].id);
    }
  }, [playableMs.length]); // eslint-disable-line
  const approvedUsers = Object.values(users)
    .filter((u) => u?.email && u.approved !== false)
    .sort((a, b) => a.name.localeCompare(b.name));
  const selM = playableMs.find((m) => Number(m.id) === Number(psMatch)) || null;
  const hc2 = TC[selM?.home] || { bg: "#333" };
  const ac2 = TC[selM?.away] || { bg: "#555" };

  const ae = Object.entries(allPicks);
  const tot = approvedUsers.length;
  const picked = selM
    ? ae.filter(
        ([emk]) =>
          approvedUsers.some((u) => ek(u.email) === emk) &&
          getP(allPicks[emk] || {}, selM.id) != null
      ).length
    : 0;
  const notPicked = tot - picked;
  const tossHome = selM ? ae.filter(([emk]) => getP(allPicks[emk] || {}, selM.id)?.toss === selM.home).length : 0;
  const tossAway = selM ? ae.filter(([emk]) => getP(allPicks[emk] || {}, selM.id)?.toss === selM.away).length : 0;
  const winHome = selM ? ae.filter(([emk]) => getP(allPicks[emk] || {}, selM.id)?.win === selM.home).length : 0;
  const winAway = selM ? ae.filter(([emk]) => getP(allPicks[emk] || {}, selM.id)?.win === selM.away).length : 0;

  const potmMap = {};
  if (selM)
    ae.forEach(([emk]) => {
      const p = getP(allPicks[emk] || {}, selM.id);
      if (p?.motm) potmMap[p.motm] = (potmMap[p.motm] || 0) + 1;
    });
  const topPotm = Object.entries(potmMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  async function resetPick(emk, name) {
    if (!confirm("Reset pick for " + name + "?")) return;
    await DB.set("ap/" + emk + "/" + String(selM.id), null);
    await DB.set("bq/" + emk + "/" + String(selM.id), null);
    window.location.reload();
  }

  return (
    <div>
      {/* Match selector */}
      <div className="ac" style={{ marginBottom: 12 }}>
        <p className="st" style={{ marginBottom: 8 }}>SELECT MATCH</p>
        <select className="sel" value={psMatch ?? ""} onChange={(e) => setPsMatch(Number(e.target.value))}>
          {playableMs.map((m) => (
            <option key={m.id} value={m.id}>
              {m.mn}: {m.home} vs {m.away} ({m.date}){m.result ? " ✓" : ""}
            </option>
          ))}
        </select>
      </div>

      {selM && (
        <>
          {/* Summary cards */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[
              ["✅", "Picked", picked],
              ["⏳", "No Pick", notPicked],
              ["👥", "Total", tot],
            ].map(([ic, lb2, val]) => (
              <div key={lb2} style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
                <p style={{ fontSize: 16, margin: 0 }}>{ic}</p>
                <p className="C" style={{ color: "#1D428A", fontSize: 18, fontWeight: 800, margin: "2px 0 0" }}>{val}</p>
                <p style={{ color: "#64748b", fontSize: 9, margin: 0, textTransform: "uppercase", letterSpacing: 0.3 }}>{lb2}</p>
              </div>
            ))}
          </div>

          {/* Distribution bars */}
          {picked > 0 && (
            <div className="ac" style={{ marginBottom: 12 }}>
              <p className="st" style={{ marginBottom: 8 }}>PICK DISTRIBUTION</p>
              {[
                ["Toss", tossHome, tossAway],
                ["Winner", winHome, winAway],
              ].map(([lbl, cA, cB]) => {
                const t2 = cA + cB || 1,
                  pA = Math.round((cA / t2) * 100);
                return (
                  <div key={lbl} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3 }}>{lbl}</span>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{cA + cB} picks</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 56 }}>
                        <TLogo t={selM.home} sz={16} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: hc2.bg }}>{selM.home}</span>
                      </div>
                      <div style={{ flex: 1, height: 10, borderRadius: 5, overflow: "hidden", background: "#e2e8f0", display: "flex" }}>
                        <div style={{ width: pA + "%", background: hc2.bg, transition: "width .6s" }} />
                        <div style={{ flex: 1, background: ac2.bg }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 56, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: ac2.bg }}>{selM.away}</span>
                        <TLogo t={selM.away} sz={16} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2540" }}>{pA}% <span style={{ fontSize: 10, color: "#64748b", fontWeight: 400 }}>({cA})</span></span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1a2540" }}><span style={{ fontSize: 10, color: "#64748b", fontWeight: 400 }}>({cB})</span> {100 - pA}%</span>
                    </div>
                  </div>
                );
              })}
              {topPotm.length > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3, margin: "4px 0 8px" }}>Top POTM Picks</p>
                  {topPotm.map(([name, cnt]) => {
                    const pct = Math.round((cnt / (picked || 1)) * 100);
                    const team = TEAMS.find((t) => (SQ[t] || []).includes(name));
                    const tc2 = TC[team] || { bg: "#94a3b8" };
                    return (
                      <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: tc2.bg, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "#1a2540", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                        <div style={{ width: 70, height: 6, borderRadius: 3, background: "#e2e8f0", overflow: "hidden", flexShrink: 0 }}>
                          <div style={{ width: pct + "%", height: "100%", background: tc2.bg }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", minWidth: 40, textAlign: "right", flexShrink: 0 }}>{cnt} <span style={{ fontWeight: 400, color: "#94a3b8" }}>({pct}%)</span></span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Per-user pick table — FIXED column alignment */}
          <div className="ac">
            <p className="st" style={{ marginBottom: 10 }}>USER PICKS — {selM.mn}: {selM.home} vs {selM.away}</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "24%" }} />{/* Player */}
                  <col style={{ width: "11%" }} />{/* Toss */}
                  <col style={{ width: "11%" }} />{/* Win */}
                  <col style={{ width: "16%" }} />{/* POTM */}
                  <col style={{ width: "10%" }} />{/* Band */}
                  <col style={{ width: "9%" }} />{/* Bonus */}
                  {selM.result && <col style={{ width: "11%" }} />}{/* Pts */}
                  <col style={{ width: "8%" }} />{/* Action */}
                </colgroup>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    {[
                      ["Player", "left"],
                      ["Toss", "center"],
                      ["Win", "center"],
                      ["POTM", "center"],
                      ["🏏", "center"],
                      ["❓", "center"],
                      ...(selM.result ? [["Pts", "center"]] : []),
                      ["", "center"],
                    ].map(([h, al], i) => (
                      <th key={i} style={{ textAlign: al, padding: "6px 4px", color: "#64748b", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedUsers.map((u) => {
                    const emk = ek(u.email);
                    const p = getP(allPicks[emk] || {}, selM.id);
                    const isDouble = doubleMatch != null && Number(doubleMatch) === Number(selM.id);
                    const mult = isDouble ? 2 : 1;
                    let rowPts = 0,
                      tossOk = false,
                      winOk = false,
                      motmOk = false;
                    const sbAns = scoreBandAnswers ? scoreBandAnswers[String(selM.id)] : undefined;
                    const sbOk = sbAns && p?.sb && p.sb === sbAns;
                    const bqAns = bonusAnswers?.[String(selM.id)];
                    const userBQ = (allBonusPicks?.[emk] || {})[String(selM.id)];
                    const bqOk = bqAns != null && userBQ != null && userBQ === bqAns;
                    if (p && selM.result) {
                      const tA = !isNR(selM.result.toss),
                        wA = !isNR(selM.result.win),
                        mA = !isNR(selM.result.motm);
                      tossOk = tA && p.toss === selM.result.toss;
                      winOk = wA && p.win === selM.result.win;
                      motmOk = mA && motmMatch(p.motm, selM.result.motm);
                      let base = 0;
                      if (tossOk) base += PTS.toss;
                      if (winOk) base += PTS.win;
                      if (motmOk) base += PTS.motm;
                      const avail = [tA, wA, mA].filter(Boolean).length;
                      const correct = [tossOk, winOk, motmOk].filter(Boolean).length;
                      if (avail > 0 && correct === avail) base += PTS.streak;
                      if (sbOk) base += PTS.scoreBand;
                      if (bqOk) base += PTS.bonus;
                      rowPts = base * mult;
                    }
                    const rowBg = p ? (selM.result ? (rowPts > 0 ? "#f0fdf4" : "#fff7f7") : "#FFFBEB") : "#fafafa";

                    if (!p) {
                      return (
                        <tr key={u.email} style={{ borderBottom: "1px solid #f1f5f9", background: rowBg }}>
                          <td style={{ padding: "8px 8px", overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <Av name={u.name} sz={22} />
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#1a2540", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                                {u.email === adminEmail && <span style={{ fontSize: 9, color: "#1D428A", fontWeight: 700 }}>You</span>}
                              </div>
                            </div>
                          </td>
                          <td colSpan={selM.result ? 7 : 6} style={{ textAlign: "center", padding: "8px 4px", color: "#94a3b8", fontSize: 11, fontStyle: "italic" }}>no pick</td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={u.email} style={{ borderBottom: "1px solid #f1f5f9", background: rowBg }}>
                        {/* Player */}
                        <td style={{ padding: "8px 8px", overflow: "hidden" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Av name={u.name} sz={22} />
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 11, fontWeight: 600, color: "#1a2540", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                              {u.email === adminEmail && <span style={{ fontSize: 9, color: "#1D428A", fontWeight: 700 }}>You</span>}
                            </div>
                          </div>
                        </td>
                        {/* Toss */}
                        <td style={{ textAlign: "center", padding: "6px 2px" }}>
                          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 5, color: selM.result ? (tossOk ? "#15803d" : "#dc2626") : TC[p.toss]?.bg || "#1a2540", background: selM.result ? (tossOk ? "#dcfce7" : "#fee2e2") : "#f1f5f9" }}>{p.toss}</span>
                        </td>
                        {/* Win */}
                        <td style={{ textAlign: "center", padding: "6px 2px" }}>
                          <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 5, color: selM.result ? (winOk ? "#15803d" : "#dc2626") : TC[p.win]?.bg || "#1a2540", background: selM.result ? (winOk ? "#dcfce7" : "#fee2e2") : "#f1f5f9" }}>{p.win}</span>
                        </td>
                        {/* POTM */}
                        <td style={{ textAlign: "center", padding: "6px 2px" }}>
                          <span style={{ display: "block", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: selM.result ? (motmOk ? "#15803d" : "#dc2626") : "#475569", fontWeight: selM.result ? 700 : 400 }}>
                            {p.motm?.split(" ").slice(-1)[0] || "—"}
                          </span>
                        </td>
                        {/* Band */}
                        <td style={{ textAlign: "center", padding: "6px 2px" }}>
                          <span style={{ display: "block", fontSize: 10, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: sbAns ? (sbOk ? "#15803d" : "#dc2626") : "#94a3b8" }}>
                            {p.sb ? (SCORE_BANDS.find((b) => b.id === p.sb)?.short || p.sb) : "—"}
                          </span>
                        </td>
                        {/* Bonus */}
                        <td style={{ textAlign: "center", padding: "6px 2px" }}>
                          {userBQ != null ? (
                            <span style={{ fontSize: 10, fontWeight: 700, color: bqAns != null ? (bqOk ? "#15803d" : "#dc2626") : "#1a2540" }}>
                              {userBQ ? "Yes" : "No"}
                              {bqAns != null && <span style={{ fontSize: 9 }}>{bqOk ? " ✓" : " ✗"}</span>}
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, color: "#94a3b8" }}>—</span>
                          )}
                        </td>
                        {/* Pts (only when result exists) */}
                        {selM.result && (
                          <td style={{ textAlign: "center", padding: "6px 2px" }}>
                            <span className="C" style={{ fontSize: 13, fontWeight: 800, color: rowPts > 0 ? "#15803d" : "#94a3b8" }}>+{rowPts}</span>
                          </td>
                        )}
                        {/* Action */}
                        <td style={{ textAlign: "center", padding: "6px 2px" }}>
                          <button onClick={() => resetPick(emk, u.name)} style={{ padding: "3px 7px", borderRadius: 6, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", cursor: "pointer", fontSize: 10, fontWeight: 700 }}>🗑</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Who hasn't picked yet warning (pre-result, pre-lock only) */}
            {(() => {
              const noPick = approvedUsers.filter((u) => !getP(allPicks[ek(u.email)] || {}, selM.id));
              const stillOpen = !selM.result && !isMatchLocked(selM, lockedMatches);
              if (noPick.length === 0 || !stillOpen) return null;
              return (
                <div style={{ marginTop: 10, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#991b1b", margin: "0 0 4px", textTransform: "uppercase" }}>Yet to predict ({noPick.length})</p>
                  <p style={{ fontSize: 11, color: "#dc2626", margin: 0, lineHeight: 1.6 }}>{noPick.map((u) => u.name).join(", ")}</p>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
