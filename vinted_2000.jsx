import { useState } from "react";

const MONTHS = ["Juin", "Juillet", "Août", "Sept.", "Oct.", "Nov."];
const MONTHLY_GOALS = [150, 250, 300, 350, 450, 500];
const CUMUL = [150, 400, 700, 1050, 1500, 2000];

const NICHES = [
  { icon: "👟", name: "Sneakers / Nike, Adidas, Jordan", marge: "15–50€", tips: "Surveille SNKRS, Foot Locker drops" },
  { icon: "🧥", name: "Vêtements vintage / Y2K", marge: "10–40€", tips: "Cherche aux friperies, vide-greniers" },
  { icon: "🎮", name: "Jeux vidéo retro / consoles", marge: "10–60€", tips: "LeBonCoin, vide-greniers, GameStop" },
  { icon: "👜", name: "Sacs & accessoires de marque", marge: "20–100€", tips: "Zara, H&M soldes → revendu neuf" },
  { icon: "🧸", name: "Peluches / jouets vintage", marge: "5–30€", tips: "Trouves en brocantes, tres demandés" },
];

const TIPS = [
  { phase: "Sourcing", icon: "🔍", content: "Vide-greniers tôt le matin, LeBonCoin, friperies, Emmaus, soldes marques" },
  { phase: "Annonce", icon: "📸", content: "Photos lumineuses sur fond blanc, 5+ photos, description précise avec tailles/état" },
  { phase: "Prix", content: "Cherche l'article vendu récemment sur Vinted → prix -10% pour vendre vite", icon: "💶" },
  { phase: "Boost", icon: "🚀", content: "Utilise les 'Bumps' Vinted (gratuits) + partage tes annonces en story" },
  { phase: "Confiance", icon: "⭐", content: "Réponds vite aux messages, soigne tes colis, accumule les avis 5 étoiles" },
];

const TRACKER_KEY = "vinted_tracker_v1";

function loadData() {
  try {
    const raw = localStorage.getItem(TRACKER_KEY);
    return raw ? JSON.parse(raw) : { ventes: [], budget: 0 };
  } catch { return { ventes: [], budget: 0 }; }
}

function saveData(data) {
  try { localStorage.setItem(TRACKER_KEY, JSON.stringify(data)); } catch {}
}

export default function VintedPlan() {
  const [tab, setTab] = useState("plan");
  const [data, setData] = useState(loadData);
  const [form, setForm] = useState({ article: "", achat: "", vente: "", mois: 0 });
  const [budgetInput, setBudgetInput] = useState("");

  const totalGains = data.ventes.reduce((s, v) => s + (parseFloat(v.vente) - parseFloat(v.achat)), 0);
  const progress = Math.min((totalGains / 2000) * 100, 100);

  function addVente() {
    if (!form.article || !form.achat || !form.vente) return;
    const updated = { ...data, ventes: [...data.ventes, { ...form, id: Date.now() }] };
    setData(updated);
    saveData(updated);
    setForm({ article: "", achat: "", vente: "", mois: 0 });
  }

  function removeVente(id) {
    const updated = { ...data, ventes: data.ventes.filter(v => v.id !== id) };
    setData(updated);
    saveData(updated);
  }

  function setBudget() {
    const b = parseFloat(budgetInput);
    if (!isNaN(b)) {
      const updated = { ...data, budget: b };
      setData(updated);
      saveData(updated);
      setBudgetInput("");
    }
  }

  const gainsByMonth = MONTHS.map((_, i) =>
    data.ventes.filter(v => parseInt(v.mois) === i).reduce((s, v) => s + (parseFloat(v.vente) - parseFloat(v.achat)), 0)
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      fontFamily: "'Syne', sans-serif",
      color: "#f5f0e8",
      padding: "0 0 60px 0"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #09f 0%, #00c97a 100%)",
        padding: "36px 24px 28px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", opacity: 0.8, marginBottom: 6 }}>Objectif Vinted</div>
          <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>2 000 €</div>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>Juin → Novembre 2025</div>

          {/* Progress bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{totalGains.toFixed(0)}€ gagnés</span>
              <span style={{ opacity: 0.8 }}>{progress.toFixed(0)}%</span>
            </div>
            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 999, height: 10 }}>
              <div style={{
                height: 10, borderRadius: 999,
                background: "#fff",
                width: `${progress}%`,
                transition: "width 0.6s cubic-bezier(.4,0,.2,1)"
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, background: "#161616", borderBottom: "1px solid #222", overflowX: "auto" }}>
        {[["plan", "📅 Programme"], ["niches", "🎯 Niches"], ["tips", "💡 Tips"], ["tracker", "📊 Tracker"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "14px 8px", background: "none", border: "none",
            color: tab === key ? "#09f" : "#888",
            borderBottom: tab === key ? "2px solid #09f" : "2px solid transparent",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: "pointer", transition: "color 0.2s", whiteSpace: "nowrap"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 520, margin: "0 auto" }}>

        {/* PROGRAMME */}
        {tab === "plan" && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Ton plan mois par mois</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MONTHS.map((m, i) => (
                <div key={m} style={{
                  background: "#161616",
                  border: "1px solid #222",
                  borderRadius: 14,
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}>
                  <div style={{
                    minWidth: 48, height: 48, borderRadius: 12,
                    background: "linear-gradient(135deg, #09f22, #00c97a22)",
                    border: "1px solid #00c97a44",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 13, color: "#00c97a"
                  }}>{m}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#f5f0e8" }}>
                      +{MONTHLY_GOALS[i]}€ ce mois
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      Total cumulé visé : <span style={{ color: "#09f", fontFamily: "'Space Mono'" }}>{CUMUL[i]}€</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                      ≈ {Math.ceil(MONTHLY_GOALS[i] / 20)} ventes à ~20€ marge moy.
                    </div>
                  </div>
                  <div style={{
                    background: gainsByMonth[i] >= MONTHLY_GOALS[i] ? "#00c97a22" : "#ffffff08",
                    border: `1px solid ${gainsByMonth[i] >= MONTHLY_GOALS[i] ? "#00c97a" : "#333"}`,
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 13, fontFamily: "'Space Mono'", fontWeight: 700,
                    color: gainsByMonth[i] >= MONTHLY_GOALS[i] ? "#00c97a" : "#666"
                  }}>
                    {gainsByMonth[i] > 0 ? `+${gainsByMonth[i].toFixed(0)}€` : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 20, background: "#09f11", border: "1px solid #09f44",
              borderRadius: 14, padding: 16
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#09f", marginBottom: 8 }}>💰 Budget de départ</div>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: 10 }}>
                Rentre ton budget de départ pour savoir combien investir par achat.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  placeholder="Ex: 100"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  style={{
                    flex: 1, padding: "10px 12px", background: "#0d0d0d",
                    border: "1px solid #333", borderRadius: 10, color: "#f5f0e8",
                    fontFamily: "'Syne'", fontSize: 14, outline: "none"
                  }}
                />
                <button onClick={setBudget} style={{
                  padding: "10px 16px", background: "#09f", border: "none",
                  borderRadius: 10, color: "#000", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Syne'"
                }}>OK</button>
              </div>
              {data.budget > 0 && (
                <div style={{ marginTop: 10, fontSize: 14, color: "#00c97a", fontWeight: 700 }}>
                  Budget : {data.budget}€ → investis max {(data.budget * 0.4).toFixed(0)}€ par achat au début
                </div>
              )}
            </div>
          </div>
        )}

        {/* NICHES */}
        {tab === "niches" && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Meilleures niches Vinted</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Les catégories qui se vendent le mieux</div>
            {NICHES.map((n) => (
              <div key={n.name} style={{
                background: "#161616", border: "1px solid #222", borderRadius: 14,
                padding: 16, marginBottom: 12
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{n.name}</div>
                    <div style={{
                      display: "inline-block", marginTop: 3, background: "#00c97a22",
                      border: "1px solid #00c97a44", borderRadius: 6, padding: "2px 8px",
                      fontSize: 12, color: "#00c97a", fontFamily: "'Space Mono'"
                    }}>marge {n.marge}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#888", borderTop: "1px solid #222", paddingTop: 8 }}>
                  💡 {n.tips}
                </div>
              </div>
            ))}

            <div style={{
              background: "#161616", border: "1px dashed #09f44", borderRadius: 14, padding: 16, marginTop: 4
            }}>
              <div style={{ fontWeight: 700, color: "#09f", marginBottom: 8 }}>🏷️ Règle des 3x</div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
                Achète un article <b style={{ color: "#f5f0e8" }}>max 1/3 du prix</b> auquel tu veux le revendre.
                Ex : article vendu 30€ sur Vinted → tu l'achètes max <b style={{ color: "#09f" }}>10€</b>.
              </div>
            </div>
          </div>
        )}

        {/* TIPS */}
        {tab === "tips" && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Conseils essentiels</div>
            {TIPS.map((t) => (
              <div key={t.phase} style={{
                background: "#161616", border: "1px solid #222", borderRadius: 14,
                padding: 16, marginBottom: 12, display: "flex", gap: 14, alignItems: "flex-start"
              }}>
                <div style={{
                  fontSize: 28, minWidth: 40, height: 40, display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>{t.icon}</div>
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: 2, color: "#09f", marginBottom: 4
                  }}>{t.phase}</div>
                  <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>{t.content}</div>
                </div>
              </div>
            ))}

            <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📱 Apps utiles</div>
              {[
                ["Vinted", "Achat + vente principal"],
                ["LeBonCoin", "Sourcing local pas cher"],
                ["Depop", "Vente mode vintage EN/EU"],
                ["eBay", "Revente internationale"],
                ["Alertes Google", "Prix + drops sneakers"],
              ].map(([app, desc]) => (
                <div key={app} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: "1px solid #222", fontSize: 13
                }}>
                  <span style={{ fontWeight: 700 }}>{app}</span>
                  <span style={{ color: "#666" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRACKER */}
        {tab === "tracker" && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Tracker de ventes</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Note chaque vente pour suivre ta progression</div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                ["Ventes", data.ventes.length],
                ["Gains", `${totalGains.toFixed(0)}€`],
                ["Reste", `${Math.max(0, 2000 - totalGains).toFixed(0)}€`],
              ].map(([label, val]) => (
                <div key={label} style={{
                  background: "#161616", border: "1px solid #222", borderRadius: 12,
                  padding: "12px 8px", textAlign: "center"
                }}>
                  <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 18, color: "#09f" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ background: "#161616", border: "1px solid #333", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>+ Ajouter une vente</div>
              <input
                placeholder="Article (ex: Nike Air Force)"
                value={form.article}
                onChange={e => setForm(f => ({ ...f, article: e.target.value }))}
                style={inputStyle}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0" }}>
                <input
                  type="number"
                  placeholder="Prix achat (€)"
                  value={form.achat}
                  onChange={e => setForm(f => ({ ...f, achat: e.target.value }))}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Prix vente (€)"
                  value={form.vente}
                  onChange={e => setForm(f => ({ ...f, vente: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <select
                value={form.mois}
                onChange={e => setForm(f => ({ ...f, mois: parseInt(e.target.value) }))}
                style={{ ...inputStyle, marginBottom: 8 }}
              >
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <button onClick={addVente} style={{
                width: "100%", padding: "12px", background: "linear-gradient(135deg, #09f, #00c97a)",
                border: "none", borderRadius: 10, color: "#000", fontWeight: 800,
                fontFamily: "'Syne'", fontSize: 15, cursor: "pointer"
              }}>Enregistrer ✓</button>
            </div>

            {/* Liste */}
            {data.ventes.length === 0 ? (
              <div style={{ textAlign: "center", color: "#444", padding: 30 }}>
                Aucune vente enregistrée encore.<br />Commence à tracker dès ta 1ère vente !
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...data.ventes].reverse().map(v => {
                  const marge = parseFloat(v.vente) - parseFloat(v.achat);
                  return (
                    <div key={v.id} style={{
                      background: "#161616", border: "1px solid #222", borderRadius: 12,
                      padding: "12px 14px", display: "flex", alignItems: "center", gap: 10
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{v.article}</div>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                          {MONTHS[v.mois]} · {v.achat}€ → {v.vente}€
                        </div>
                      </div>
                      <div style={{
                        fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 16,
                        color: marge >= 0 ? "#00c97a" : "#ff4d4d"
                      }}>+{marge.toFixed(0)}€</div>
                      <button onClick={() => removeVente(v.id)} style={{
                        background: "none", border: "none", color: "#555",
                        cursor: "pointer", fontSize: 16, padding: 4
                      }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "#0d0d0d",
  border: "1px solid #333", borderRadius: 10, color: "#f5f0e8",
  fontFamily: "'Syne'", fontSize: 14, outline: "none", boxSizing: "border-box", display: "block"
};
